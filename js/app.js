import {
  ROLE, GOALS, PHASES, WEEKLY_REVIEW, MODULES, moduleById, IMPULSES, impulseById, CARDS, TYPE_LABEL, DEEPEN, PROJECT_PROMPT,
} from "./content.js";

// ---------- Speicher (nur lokal auf diesem Gerät) ----------
const KEY = "fk-state-v1";
const DEFAULT_START = "2027-01-01";

function defaultState() {
  return {
    v: 1,
    roleStart: DEFAULT_START,
    speed: 1.5,
    context: "",
    workMail: "",       // dienstliche Adresse für Copilot-Mails
    daily: null,        // { date, ids: [] }
    seen: {},           // impulsId -> Datum zuletzt gezeigt
    down: {},           // impulsId -> true (nicht relevant)
    starred: {},        // impulsId -> Zeitstempel
    journal: [],        // { id, ts, kind: notiz|why|reflexion|merker|copilot, text, ref }
    experiments: [],    // { id, title, plan, ref, start, due, status: aktiv|fertig|verworfen, review }
    inbox: [],          // { id, url, title, note, mod, status: neu|verarbeitet|archiv, added, src }
    posts: [],          // aufbereitete eigene Posts (Ergebnis aus dem Claude-Projekt)
    read: {},           // gelesene Post-/Recherche-IDs -> Zeitstempel
    cards: {},          // cardId -> { box, due }
    newCards: null,     // { date, n }
    listen: {},         // episodeId -> { pos, dur, done, ts }
    current: null,      // episodeId im Player
  };
}
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...defaultState(), ...JSON.parse(raw) };
  } catch (e) { /* privater Modus o. ä. */ }
  return defaultState();
}
let state = load();
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { toast("Speichern nicht möglich"); }
}

const ui = { tab: "heute", lern: "module", inbox: "neu", feed: "alle", pod: "alle", journal: "experimente" };
let podData = null; // geladene data/podcasts.json
let rxData = null;  // geladene data/impulse.json (tägliche Recherche)

// ---------- Helfer ----------
const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const nl2br = (s) => esc(s).replace(/\n/g, "<br>");
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parseIso = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const today = () => iso(new Date());
const fmtD = (s) => parseIso(s).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
const fmtShort = (ts) => new Date(ts).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
const daysBetween = (a, b) => Math.round((parseIso(b) - parseIso(a)) / 864e5);
function fmtTime(sec) {
  sec = Math.max(0, Math.floor(sec || 0));
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}
function fmtDur(sec) {
  if (!sec) return "";
  const m = Math.round(sec / 60);
  return m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`;
}

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 2400);
}

// ---------- Phase ----------
function roleDay() { return daysBetween(state.roleStart, today()) + 1; } // 1 = Antrittstag
function currentPhase() {
  const d = roleDay();
  return PHASES.find((p) => d >= p.from && d <= p.to) || PHASES[0];
}
function phaseLine() {
  const p = currentPhase();
  const d = roleDay();
  return d < 1
    ? `Phase ${p.nr} · ${p.name} – noch ${1 - d} ${1 - d === 1 ? "Tag" : "Tage"} bis zum Start am ${fmtD(state.roleStart)}`
    : `Tag ${d} · Phase ${p.nr} · ${p.name}`;
}

// ---------- Impuls-Auswahl ----------
function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed) { // mulberry32
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function weightOf(imp, phase) {
  let w;
  if (imp.phase) w = imp.phase === phase.id ? 5 : 0.2;
  else w = moduleById(imp.mod).w[phase.nr];
  if (state.down[imp.id]) w *= 0.1;
  const last = state.seen[imp.id];
  if (!last) w *= 1.6;
  else {
    const ago = daysBetween(last, today());
    if (ago < 21) w *= 0.03;
    else if (ago < 60) w *= 0.5;
  }
  return w;
}
function pickWeighted(pool, n, rand, phase) {
  const picked = [];
  const items = pool.map((imp) => ({ imp, w: weightOf(imp, phase) })).filter((x) => x.w > 0);
  while (picked.length < n && items.length) {
    const total = items.reduce((s, x) => s + x.w, 0);
    let r = rand() * total, i = 0;
    for (; i < items.length - 1; i++) { r -= items[i].w; if (r <= 0) break; }
    const [x] = items.splice(i, 1);
    // Abwechslung: nicht zweimal dasselbe Modul hintereinander
    if (picked.length && x.imp.mod && picked.some((p) => p.mod === x.imp.mod) && items.length > 3) continue;
    picked.push(x.imp);
  }
  return picked;
}
function drawSet(rand, exclude) {
  const phase = currentPhase();
  const pool = IMPULSES.filter((x) => !exclude.has(x.id));
  const slots = [
    pool.filter((x) => x.type === "wissen" || x.type === "phase"),
    pool.filter((x) => x.type === "frage"),
    pool.filter((x) => x.type === "praxis"),
  ];
  const out = [];
  for (const s of slots) {
    const [p] = pickWeighted(s.filter((x) => !out.some((o) => o.id === x.id || (o.mod && o.mod === x.mod))), 1, rand, phase);
    if (p) out.push(p);
  }
  return out;
}
function dailyImpulses() {
  const d = today();
  if (!state.daily || state.daily.date !== d) {
    const set = drawSet(rng(hashSeed(d)), new Set());
    state.daily = { date: d, ids: set.map((x) => x.id) };
    set.forEach((x) => (state.seen[x.id] = d));
    save();
  }
  return state.daily.ids.map(impulseById).filter(Boolean);
}
function moreImpulses() {
  const set = drawSet(Math.random, new Set(state.daily.ids));
  set.forEach((x) => { state.daily.ids.push(x.id); state.seen[x.id] = today(); });
  save(); render();
  toast(`${set.length} weitere Impulse`);
}

// ---------- Referenzen (Impuls, Inbox, Episode, Eintrag, Phase) ----------
function findEpisode(id) {
  if (!podData) return null;
  for (const p of podData.podcasts) {
    const e = p.episodes.find((x) => x.id === id);
    if (e) return { ...e, pod: p };
  }
  return null;
}
function refInfo(ref) {
  if (!ref) return null;
  if (ref.t === "imp") {
    const x = impulseById(ref.id);
    if (!x) return null;
    const m = x.mod && moduleById(x.mod);
    const ph = x.phase && PHASES.find((p) => p.id === x.phase);
    return {
      label: x.type === "wissen" || x.type === "phase" ? x.title : `${m ? m.title : ""}: ${x.title}`,
      text: x.text,
      source: x.quelle || (m ? `Modul „${m.title}“` : ph ? `Phase „${ph.name}“` : ""),
      short: x.type === "wissen" || x.type === "phase" ? x.title : x.text,
    };
  }
  if (ref.t === "inbox") {
    const x = state.inbox.find((i) => i.id === ref.id);
    if (!x) return null;
    return { label: inboxLabel(x), text: x.note || "(noch keine Kernaussage notiert)", source: `gespeicherter Beitrag ${x.url}`, short: inboxLabel(x) };
  }
  if (ref.t === "ep") {
    const e = findEpisode(ref.id);
    const label = e ? `${e.pod.name} – ${e.title}` : (ref.label || "Podcast-Folge");
    return { label, text: ref.time != null ? `Stelle bei ${fmtTime(ref.time)}` : "", source: "Podcast", short: label };
  }
  if (ref.t === "entry") {
    const j = state.journal.find((x) => x.id === ref.id);
    return j ? { label: KIND[j.kind]?.label || "Notiz", text: j.text, source: "mein Journal", short: j.text.slice(0, 60) } : null;
  }
  if (ref.t === "post" || ref.t === "rx") {
    const x = feedItem(ref.t, ref.id);
    if (!x) return null;
    return {
      label: x.titel,
      text: `${x.kernaussage}${x.deutsch ? ` Inhalt: ${x.deutsch.length > 500 ? x.deutsch.slice(0, 497) + "…" : x.deutsch}` : ""}`,
      source: ref.t === "post" ? `Instagram-Post${x.autor ? ` von ${x.autor}` : ""}` : `${x.quelle?.name || "Recherche"}${x.quelle?.url ? `, ${x.quelle.url}` : ""}`,
      short: x.titel,
    };
  }
  if (ref.t === "phase") {
    const p = PHASES.find((x) => x.id === ref.id) || currentPhase();
    return { label: `Leitfrage der Phase „${p.name}“`, text: p.leitfrage, source: "Phasenfokus", short: p.leitfrage };
  }
  return null;
}
const refAttrs = (ref) => `data-rt="${esc(ref.t)}" data-rid="${esc(ref.id || "")}"${ref.time != null ? ` data-time="${Math.floor(ref.time)}"` : ""}`;
const readRef = (el) => ({ t: el.dataset.rt, id: el.dataset.rid, ...(el.dataset.time ? { time: +el.dataset.time } : {}) });
const sameRef = (a, b) => a && b && a.t === b.t && a.id === b.id;
const notesFor = (ref) => state.journal.filter((j) => sameRef(j.ref, ref) && (j.kind === "notiz" || j.kind === "why"));

// ---------- Rendering ----------
const TITLES = { heute: "Heute", lernen: "Lernen", inbox: "Entdecken", hoeren: "Hören", journal: "Journal" };

function render() {
  $("#view-title").textContent = TITLES[ui.tab];
  document.querySelectorAll(".tabbar button").forEach((b) => b.setAttribute("aria-current", b.dataset.tab === ui.tab ? "page" : "false"));
  const v = $("#view");
  v.innerHTML = { heute: renderHeute, lernen: renderLernen, inbox: renderInbox, hoeren: renderHoeren, journal: renderJournal }[ui.tab]();
  renderPlayer();
}

function impulseCard(imp) {
  const ref = { t: "imp", id: imp.id };
  const m = imp.mod && moduleById(imp.mod);
  const ph = imp.phase && PHASES.find((p) => p.id === imp.phase);
  const notes = notesFor(ref);
  const starred = !!state.starred[imp.id];
  const down = !!state.down[imp.id];
  return `
    <article class="card imp ${down ? "dim" : ""}">
      <div class="tags">
        <span class="tag t-${imp.type}">${TYPE_LABEL[imp.type]}</span>
        ${m ? `<button class="tag link" data-act="open-module" data-id="${m.id}">${m.icon} ${esc(m.title)}</button>` : ""}
        ${ph ? `<span class="tag">Phase ${ph.nr} · ${esc(ph.name)}</span>` : ""}
      </div>
      ${imp.type === "wissen" || imp.type === "phase" ? `<h3>${esc(imp.title)}</h3>` : ""}
      <p class="${imp.type === "frage" ? "question" : ""}">${esc(imp.text)}</p>
      ${imp.quelle ? `<p class="src">${esc(imp.quelle)}</p>` : ""}
      ${notes.map((n) => `<div class="mynote">✍️ ${nl2br(n.text)}</div>`).join("")}
      ${actionRow(ref, { starId: imp.id, starred, downId: imp.id, down })}
    </article>`;
}
function actionRow(ref, opt = {}) {
  return `
    <div class="acts">
      ${opt.starId ? `<button data-act="star" data-id="${opt.starId}" aria-pressed="${opt.starred}" title="Merken">${opt.starred ? "★" : "☆"}<span>Merken</span></button>` : ""}
      <button data-act="note-new" ${refAttrs(ref)} title="Notiz">✍️<span>Notiz</span></button>
      <button data-act="exp-new" ${refAttrs(ref)} title="Ausprobieren">🧪<span>Testen</span></button>
      <button data-act="copilot" ${refAttrs(ref)} title="Mit Copilot vertiefen">📤<span>Copilot</span></button>
      ${opt.downId ? `<button data-act="down" data-id="${opt.downId}" aria-pressed="${opt.down}" title="Passt gerade nicht">👎<span>Weniger</span></button>` : ""}
    </div>`;
}

// ----- Heute -----
function renderHeute() {
  const ph = currentPhase();
  const imps = dailyImpulses();
  const due = dueCards();
  const active = state.experiments.filter((e) => e.status === "aktiv");
  const open = state.inbox.filter((i) => i.status === "neu");
  const wd = new Date().getDay(); // 0 So, 5 Fr, 6 Sa
  const weekStart = iso(addDays(new Date(), -((wd + 6) % 7)));
  const reviewed = state.journal.some((j) => j.kind === "reflexion" && iso(new Date(j.ts)) >= weekStart);
  const fresh = freshEpisodes();

  return `
    <div class="banner">
      <div class="b-line">${esc(phaseLine())}</div>
      <div>${esc(ph.fokus)}</div>
      <button class="leit" data-act="note-new" ${refAttrs({ t: "phase", id: ph.id })}>❓ ${esc(ph.leitfrage)}</button>
    </div>

    ${[5, 6, 0].includes(wd) && !reviewed ? `
      <div class="card accent">
        <b>📓 Wochenrückblick</b>
        <p class="hint">Vier Fragen, fünf Minuten. Daraus entsteht dein Lernprotokoll.</p>
        <button class="btn primary block" data-act="weekly">Jetzt reflektieren</button>
      </div>` : ""}

    <div class="section-title">Impulse für heute</div>
    ${imps.map(impulseCard).join("")}
    <button class="btn block" data-act="more-imp">↻ Mehr Impulse</button>

    ${active.length ? `<div class="section-title">Laufende Experimente</div>${active.map(expCard).join("")}` : ""}

    <div class="section-title">Dranbleiben</div>
    <div class="card list-group">
      <button class="row" data-act="practice"><span>🃏 Lernkarten</span><b>${due.length ? `${due.length} fällig` : "alles wiederholt"}</b></button>
      <button class="row" data-act="tab" data-tab="inbox"><span>✨ Entdecken: neue Posts & Recherche</span><b>${feedItems().filter((x) => !isRead(x)).length}</b></button>
      ${open.length ? `<button class="row" data-act="inbox-next"><span>🔗 Gespeicherte Links</span><b>${open.length}</b></button>` : ""}
      <button class="row" data-act="tab" data-tab="lernen"><span>📚 Module</span><b>${MODULES.length}</b></button>
    </div>

    ${(() => { const nu = feedItems().filter((x) => !isRead(x)).slice(0, 3); return nu.length ? `<div class="section-title">Neu entdeckt</div>${nu.map(feedCard).join("")}` : ""; })()}

    ${fresh.length ? `<div class="section-title">Neu im Ohr</div><div class="card list-group">${fresh.map(epRow).join("")}</div>` : ""}
  `;
}

// ----- Lernen -----
function renderLernen() {
  const due = dueCards();
  const chips = `
    <div class="chips">
      ${[["module", "Module"], ["gemerkt", `Gemerkt (${Object.keys(state.starred).length})`], ["karten", "Lernkarten"]]
        .map(([k, l]) => `<button data-act="lern-sub" data-k="${k}" aria-pressed="${ui.lern === k}">${l}</button>`).join("")}
    </div>`;
  if (ui.lern === "gemerkt") {
    const list = Object.entries(state.starred).sort((a, b) => b[1] - a[1]).map(([id]) => impulseById(id)).filter(Boolean);
    return chips + (list.length ? list.map(impulseCard).join("") : `<div class="empty">Noch nichts gemerkt. Tippe bei einem Impuls auf ☆.</div>`);
  }
  if (ui.lern === "karten") {
    const sure = allCards().filter((c) => (state.cards[c.id]?.box || 0) >= 4).length;
    const seen = allCards().filter((c) => state.cards[c.id]).length;
    return chips + `
      <div class="card">
        <div class="stats">
          <div class="stat"><b>${due.length}</b><span>heute fällig</span></div>
          <div class="stat"><b>${seen}/${allCards().length}</b><span>begonnen</span></div>
          <div class="stat"><b>${sure}</b><span>sicher</span></div>
        </div>
        <p><button class="btn primary block" data-act="practice" ${due.length ? "" : "disabled"}>Fällige Karten üben</button></p>
        <button class="btn block" data-act="practice" data-mix="1">Zehn zufällige Karten</button>
        <p class="hint">Wiederholung in wachsenden Abständen (1, 2, 4, 8, 16, 32 Tage). Pro Tag kommen bis zu fünf neue Karten dazu.</p>
      </div>
      ${MODULES.map((m) => {
        const cs = allCards().filter((c) => c.mod === m.id);
        const ok = cs.filter((c) => (state.cards[c.id]?.box || 0) >= 4).length;
        return `<button class="card mod-row" data-act="practice" data-mod="${m.id}"><span class="mi">${m.icon}</span><span class="mb"><b>${esc(m.title)}</b><small>${ok}/${cs.length} sicher</small></span><span class="chev">›</span></button>`;
      }).join("")}`;
  }
  const ph = currentPhase();
  const sorted = [...MODULES].sort((a, b) => b.w[ph.nr] - a.w[ph.nr]);
  return chips + `
    <p class="hint">Sortiert nach Bedeutung für deine aktuelle Phase „${esc(ph.name)}“.</p>
    ${sorted.map((m) => {
      const cs = allCards().filter((c) => c.mod === m.id);
      const ok = cs.filter((c) => (state.cards[c.id]?.box || 0) >= 4).length;
      const hot = m.w[ph.nr] >= 2.5;
      return `
        <button class="card mod-row" data-act="open-module" data-id="${m.id}">
          <span class="mi">${m.icon}</span>
          <span class="mb"><b>${esc(m.title)}</b><small>${esc(m.kurz)}</small>
            <small class="meta">${hot ? '<span class="tag t-phase">jetzt wichtig</span> ' : ""}${ok}/${cs.length} Karten sicher</small></span>
          <span class="chev">›</span>
        </button>`;
    }).join("")}`;
}

function openModule(id) {
  const m = moduleById(id);
  const imps = IMPULSES.filter((x) => x.mod === id);
  const block = (type) => imps.filter((x) => x.type === type);
  showSheet(`${m.icon} ${m.title}`, () => `
    <p class="lead">${esc(m.kern)}</p>
    <div class="banner small"><b>Bezug zur IH Hagen</b><br>${esc(m.hagen)}</div>
    <div class="section-title">Modelle & Wissen</div>
    ${block("wissen").map((x) => `
      <details class="card model">
        <summary><b>${esc(x.title)}</b> ${state.starred[x.id] ? "★" : ""}</summary>
        <p>${esc(x.text)}</p>
        <p class="src">${esc(x.quelle)}</p>
        ${notesFor({ t: "imp", id: x.id }).map((n) => `<div class="mynote">✍️ ${nl2br(n.text)}</div>`).join("")}
        ${actionRow({ t: "imp", id: x.id }, { starId: x.id, starred: !!state.starred[x.id] })}
      </details>`).join("")}
    <div class="section-title">Für deinen Alltag</div>
    ${block("praxis").map((x) => `
      <div class="card">
        <p>${esc(x.text)}</p>
        ${actionRow({ t: "imp", id: x.id }, { starId: x.id, starred: !!state.starred[x.id] })}
      </div>`).join("")}
    <div class="section-title">Fragen zum Nachdenken</div>
    ${block("frage").map((x) => `
      <div class="card">
        <p class="question">${esc(x.text)}</p>
        ${notesFor({ t: "imp", id: x.id }).map((n) => `<div class="mynote">✍️ ${nl2br(n.text)}</div>`).join("")}
        ${actionRow({ t: "imp", id: x.id }, { starId: x.id, starred: !!state.starred[x.id] })}
      </div>`).join("")}
    <p><button class="btn primary block" data-act="practice" data-mod="${m.id}">🃏 Lernkarten dieses Moduls üben</button></p>
    <div class="section-title">Zum Weiterlesen</div>
    <ul class="refs">${m.quellen.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>
  `);
}

// ----- Lernkarten -----
const INTERVALS = [0, 1, 2, 4, 8, 16, 32];
function dueCards() {
  const d = today();
  const scheduled = allCards().filter((c) => state.cards[c.id] && state.cards[c.id].due <= d);
  const usedNew = state.newCards?.date === d ? state.newCards.n : 0;
  const fresh = allCards().filter((c) => !state.cards[c.id]).slice(0, Math.max(0, 5 - usedNew));
  return [...scheduled, ...fresh];
}
function practice({ mod, mix } = {}) {
  let deck;
  if (mod) deck = allCards().filter((c) => c.mod === mod);
  else if (mix) deck = [...allCards()].sort(() => Math.random() - 0.5).slice(0, 10);
  else deck = dueCards();
  if (!deck.length) { toast("Heute ist nichts fällig 👍"); return; }
  const session = { deck: [...deck], i: 0, shown: false, ok: 0 };
  const view = () => {
    if (session.i >= session.deck.length) {
      return `<div class="empty"><div style="font-size:40px">🎉</div><p><b>${session.ok} von ${session.deck.length}</b> gewusst.</p>
        <button class="btn primary block" data-act="sheet-close">Fertig</button></div>`;
    }
    const c = session.deck[session.i];
    const m = moduleById(c.mod) || { icon: "✨", title: "" };
    return `
      <p class="hint">${session.i + 1} / ${session.deck.length} · ${m.icon} ${esc(c.src || m.title)}</p>
      <div class="card flash"><p class="q">${esc(c.q)}</p>
        ${session.shown ? `<hr><p class="a">${esc(c.a)}</p>` : ""}</div>
      ${session.shown
        ? `<div class="btn-row"><button class="btn" data-act="card-rate" data-ok="0">Noch nicht</button><button class="btn primary" data-act="card-rate" data-ok="1">Wusste ich</button></div>`
        : `<button class="btn primary block" data-act="card-show">Antwort zeigen</button>`}`;
  };
  practice.session = session;
  showSheet("Lernkarten", view);
}
function rateCard(ok) {
  const s = practice.session;
  const c = s.deck[s.i];
  const d = today();
  const prev = state.cards[c.id];
  if (!prev) {
    state.newCards = { date: d, n: (state.newCards?.date === d ? state.newCards.n : 0) + 1 };
  }
  const box = ok ? Math.min(6, (prev?.box || 0) + 1) : 1;
  state.cards[c.id] = { box, due: iso(addDays(new Date(), ok ? INTERVALS[box] : 1)) };
  if (ok) s.ok++;
  s.i++; s.shown = false;
  save(); refreshSheet();
}

// ----- Inbox -----
function normUrl(u) {
  try {
    const x = new URL(u.trim());
    if (!/^https?:$/.test(x.protocol)) return null;
    if (x.hostname.endsWith("instagram.com")) { x.hostname = "www.instagram.com"; x.search = ""; x.hash = ""; }
    return x.toString();
  } catch (e) { return null; }
}
const isInsta = (u) => /instagram\.com/.test(u);
function inboxLabel(x) {
  if (x.title) return x.title.startsWith("@") || !isInsta(x.url) ? x.title : `@${x.title}`;
  if (isInsta(x.url)) return /\/reel\//.test(x.url) ? "Instagram-Reel" : "Instagram-Post";
  try { return new URL(x.url).hostname.replace(/^www\./, ""); } catch (e) { return x.url; }
}
function addToInbox(items) {
  let n = 0;
  const have = new Set(state.inbox.map((i) => i.url));
  for (const it of items) {
    const url = normUrl(it.url);
    if (!url || have.has(url)) continue;
    have.add(url);
    state.inbox.unshift({ id: uid(), url, title: it.title || "", note: it.note || "", mod: "", status: "neu", added: it.ts || Date.now(), src: isInsta(url) ? "instagram" : "link" });
    n++;
  }
  save();
  return n;
}
function extractUrls(text) {
  return [...new Set((text.replace(/\\\//g, "/").match(/https?:\/\/[^\s"'<>\\)\]]+/g) || []))];
}
function parseInstagramExport(text) {
  const found = [];
  try {
    const data = JSON.parse(text);
    const walk = (node, title) => {
      if (Array.isArray(node)) { node.forEach((n) => walk(n, title)); return; }
      if (node && typeof node === "object") {
        const t = typeof node.title === "string" && node.title ? node.title : title;
        if (typeof node.href === "string" && isInsta(node.href)) {
          found.push({ url: node.href, title: t, ts: node.timestamp ? node.timestamp * 1000 : undefined });
        }
        for (const k in node) if (k !== "href") walk(node[k], t);
      } else if (typeof node === "string" && /instagram\.com\/(p|reel|tv)\//.test(node)) {
        found.push({ url: node, title });
      }
    };
    walk(data, "");
  } catch (e) { /* kein JSON → HTML oder Text */ }
  if (!found.length) extractUrls(text).forEach((url) => found.push({ url }));
  return found.filter((f) => !isInsta(f.url) || /instagram\.com\/(p|reel|tv)\//.test(f.url));
}

function renderLinks() {
  const counts = { neu: 0, verarbeitet: 0, archiv: 0 };
  state.inbox.forEach((i) => counts[i.status]++);
  const list = state.inbox.filter((i) => i.status === ui.inbox);
  return `
    <div class="card">
      <div class="add-row">
        <input type="url" id="in-url" placeholder="Link einfügen (Instagram, Artikel …)" inputmode="url" autocomplete="off">
        <button class="btn" data-act="inbox-paste" title="Aus Zwischenablage">📋</button>
        <button class="btn primary" data-act="inbox-add">+</button>
      </div>
      <p class="hint">Links sind dein Merkzettel. Verarbeitet werden Posts über Screenshots (oben „📸 Post verarbeiten“). Viele Links auf einmal: <button class="btn ghost small" data-act="inbox-import">Sammelimport / Instagram-Export</button></p>
    </div>
    <div class="chips sub">
      ${[["neu", "Neu"], ["verarbeitet", "Verarbeitet"], ["archiv", "Archiv"]]
        .map(([k, l]) => `<button data-act="inbox-filter" data-k="${k}" aria-pressed="${ui.inbox === k}">${l} (${counts[k]})</button>`).join("")}
    </div>
    ${list.length ? list.map(inboxCard).join("") : `<div class="empty">${ui.inbox === "neu" ? "Keine neuen Beiträge. Speichere relevante Instagram-Posts per Link oder importiere deinen Export." : "Hier ist noch nichts."}</div>`}
  `;
}
function inboxCard(x) {
  const m = x.mod && moduleById(x.mod);
  return `
    <button class="card inbox-item" data-act="inbox-open" data-id="${x.id}">
      <span class="src-ico">${x.src === "instagram" ? "📸" : "🔗"}</span>
      <span class="mb"><b>${esc(inboxLabel(x))}</b>
        <small>${x.note ? esc(x.note) : "Kernaussage fehlt – tippen zum Ergänzen"}</small>
        <small class="meta">${fmtShort(x.added)}${m ? ` · ${m.icon} ${esc(m.title)}` : ""}</small></span>
      <span class="chev">›</span>
    </button>`;
}
function openInboxItem(id) {
  const x = state.inbox.find((i) => i.id === id);
  if (!x) return;
  showSheet(inboxLabel(x), () => `
    <p><a class="btn block" href="${esc(x.url)}" target="_blank" rel="noopener">${x.src === "instagram" ? "📸 In Instagram öffnen" : "🔗 Link öffnen"}</a></p>
    <p class="hint">Kernaussage in einem Satz – was nimmst du mit?</p>
    <textarea id="ib-note" placeholder="z. B. „Probleme werden kleiner, wenn man sie früh benennt.“">${esc(x.note)}</textarea>
    <p class="hint">Passt zu Modul</p>
    <select id="ib-mod"><option value="">– ohne –</option>${MODULES.map((m) => `<option value="${m.id}" ${x.mod === m.id ? "selected" : ""}>${m.icon} ${esc(m.title)}</option>`).join("")}</select>
    <p><button class="btn primary block" data-act="inbox-save" data-id="${x.id}">Speichern</button></p>
    <p><button class="btn block" data-act="post-new" data-link="${x.id}">📸 Screenshots dieses Posts verarbeiten</button></p>
    ${actionRow({ t: "inbox", id: x.id })}
    <div class="btn-row" style="margin-top:14px">
      <button class="btn small" data-act="inbox-archive" data-id="${x.id}">${x.status === "archiv" ? "↩︎ Zurückholen" : "🗄 Archivieren"}</button>
      <button class="btn small danger" data-act="inbox-remove" data-id="${x.id}">Entfernen</button>
    </div>
    <p class="hint">Gespeichert am ${fmtShort(x.added)} · ${esc(x.url)}</p>
  `);
}
function saveInboxItem(id, silent) {
  const x = state.inbox.find((i) => i.id === id);
  const sheet = $("#sheet");
  const note = $("#ib-note", sheet)?.value.trim();
  if (note == null) return;
  x.note = note;
  x.mod = $("#ib-mod", sheet).value;
  if (x.status === "neu" && x.note) x.status = "verarbeitet";
  save();
  if (!silent) { closeSheet(); render(); toast("Gespeichert"); }
}
function openImport() {
  showSheet("Sammelimport", () => `
    <p class="hint">Mehrere Links einfügen (eine Zeile pro Link oder beliebiger Text – Links werden erkannt):</p>
    <textarea id="imp-text" rows="5" placeholder="https://www.instagram.com/p/…"></textarea>
    <p><button class="btn primary block" data-act="import-text">Links übernehmen</button></p>
    <div class="section-title">Instagram-Export</div>
    <ol class="steps">
      <li>Instagram → Profil → ☰ → <i>Kontenübersicht</i> → <i>Deine Informationen und Berechtigungen</i> → <i>Deine Informationen herunterladen</i>.</li>
      <li>Nur <i>Gespeicherte Inhalte</i> auswählen, Format <b>JSON</b>, Zeitraum nach Bedarf.</li>
      <li>Wenn die Datei da ist (kann dauern): ZIP in der Dateien-App antippen → entpackt sich.</li>
      <li>Hier die Datei <b>saved_posts.json</b> wählen. Bereits vorhandene Beiträge werden übersprungen.</li>
    </ol>
    <label class="btn block">📂 Datei wählen<input type="file" id="imp-file" accept=".json,.html,.txt,application/json,text/html,text/plain" hidden></label>
    <p class="hint">Instagram gibt keinen Zugriff auf Bilder und Texte der Posts frei. Die App speichert deshalb Link und Konto – die Kernaussage notierst du selbst. Genau das festigt das Gelernte.</p>
  `);
  $("#imp-file").addEventListener("change", async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const n = addToInbox(parseInstagramExport(await f.text()));
    closeSheet(); ui.tab = "inbox"; ui.feed = "links"; ui.inbox = "neu"; render();
    toast(n ? `${n} Beiträge importiert` : "Keine neuen Beiträge gefunden");
  });
}

// ----- Entdecken: eigene Posts (Screenshots) + tägliche Recherche -----
const idb = {
  _db: null,
  open() {
    if (this._db) return Promise.resolve(this._db);
    return new Promise((res, rej) => {
      const r = indexedDB.open("fk-bilder", 1);
      r.onupgradeneeded = () => r.result.createObjectStore("img");
      r.onsuccess = () => { this._db = r.result; res(r.result); };
      r.onerror = () => rej(r.error);
    });
  },
  async run(mode, fn) {
    const db = await this.open();
    return new Promise((res, rej) => {
      const tx = db.transaction("img", mode);
      const req = fn(tx.objectStore("img"));
      tx.oncomplete = () => res(req?.result);
      tx.onerror = () => rej(tx.error);
    });
  },
  put(k, v) { return this.run("readwrite", (s) => s.put(v, k)); },
  get(k) { return this.run("readonly", (s) => s.get(k)); },
  del(k) { return this.run("readwrite", (s) => s.delete(k)); },
};
async function shrinkImage(file) {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1200 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    return await new Promise((r) => c.toBlob(r, "image/jpeg", 0.82));
  } catch (e) { return file; }
}

async function loadResearch(force) {
  try {
    const res = await fetch(`data/impulse.json${force ? `?t=${Date.now()}` : ""}`, { cache: force ? "no-store" : "default" });
    if (!res.ok) throw new Error(res.status);
    rxData = await res.json();
  } catch (e) { rxData = rxData || { updated: null, items: [] }; }
  if (["inbox", "heute", "lernen"].includes(ui.tab)) render();
}
function feedItem(t, id) {
  return t === "post" ? state.posts.find((p) => p.id === id) : (rxData?.items || []).find((x) => x.id === id);
}
function feedItems() {
  const posts = state.posts.map((p) => ({ ...p, t: "post", sort: p.added }));
  const rx = (rxData?.items || []).map((x) => ({ ...x, t: "rx", sort: x.date ? parseIso(x.date.slice(0, 10)).getTime() + 12 * 36e5 : 0 }));
  return [...posts, ...rx].sort((a, b) => b.sort - a.sort);
}
const isRead = (x) => !!state.read[`${x.t}:${x.id}`];
function feedCards() {
  const out = [];
  for (const p of state.posts) (p.karten || []).forEach((k, i) => out.push({ id: `post-${p.id}-k${i}`, mod: p.modul, q: k.frage, a: k.antwort, src: `Mein Post: ${p.titel}` }));
  for (const x of rxData?.items || []) (x.karten || []).forEach((k, i) => out.push({ id: `rx-${x.id}-k${i}`, mod: x.modul, q: k.frage, a: k.antwort, src: `Recherche: ${x.titel}` }));
  return out.filter((c) => c.q && c.a);
}
function allCards() { return [...CARDS, ...feedCards()]; }

function feedCard(x) {
  const m = moduleById(x.modul);
  return `
    <button class="card feed-item ${isRead(x) ? "" : "unread"}" data-act="story" data-t="${x.t}" data-id="${esc(x.id)}">
      <div class="tags">
        <span class="tag ${x.t === "post" ? "t-praxis" : "t-wissen"}">${x.t === "post" ? "📸 Mein Post" : "🔎 Recherche"}</span>
        ${m ? `<span class="tag">${m.icon} ${esc(m.title)}</span>` : ""}
        <span class="tag">${x.t === "post" ? fmtShort(x.added) : x.date ? fmtShort(parseIso(x.date.slice(0, 10))) : ""}</span>
        ${isRead(x) ? "" : '<span class="dot" aria-label="neu"></span>'}
      </div>
      <h3>${esc(x.titel)}</h3>
      <p>${esc(x.kernaussage)}</p>
      <small class="src">${x.t === "post" ? esc(x.autor || "Instagram") : esc(x.quelle?.name || "")}</small>
    </button>`;
}

function renderInbox() {
  if (!rxData) loadResearch();
  const items = feedItems();
  const unread = items.filter((x) => !isRead(x)).length;
  const links = state.inbox.filter((i) => i.status === "neu").length;
  const filters = [["alle", "Alle"], ["neu", `Neu (${unread})`], ["posts", "Meine Posts"], ["recherche", "Recherche"], ["links", `Links (${links})`]];
  const head = `
    <div class="btn-row">
      <button class="btn primary" data-act="post-new">📸 Post verarbeiten</button>
      <button class="btn" data-act="project-help">⚙️ Claude-Projekt</button>
    </div>
    <div class="chips">${filters.map(([k, l]) => `<button data-act="feed-filter" data-k="${k}" aria-pressed="${ui.feed === k}">${l}</button>`).join("")}</div>`;
  if (ui.feed === "links") return head + renderLinks();
  let list = items;
  if (ui.feed === "neu") list = items.filter((x) => !isRead(x));
  if (ui.feed === "posts") list = items.filter((x) => x.t === "post");
  if (ui.feed === "recherche") list = items.filter((x) => x.t === "rx");
  const empty = ui.feed === "posts"
    ? "Noch keine Posts verarbeitet. Tippe auf „📸 Post verarbeiten“."
    : ui.feed === "recherche" ? "Die tägliche Recherche liefert jeden Morgen drei neue Impulse." : "Hier ist noch nichts.";
  return head + (list.length ? list.map(feedCard).join("") : `<div class="empty">${empty}</div>`) +
    (rxData?.updated ? `<p class="hint">Recherche zuletzt aktualisiert: ${new Date(rxData.updated).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" })} <button class="btn ghost small" data-act="rx-reload">↻</button></p>` : "");
}

function openProjectHelp() {
  showSheet("Claude-Projekt einrichten", () => `
    <p>Einmalig in der <b>Claude-App</b>:</p>
    <ol class="steps">
      <li>Seitenmenü → <b>Projekte</b> → <b>+ Neues Projekt</b>, Name: <i>Führungskompass-Posts</i>.</li>
      <li>Im Projekt auf <b>Anweisungen</b> (Projektanweisungen) tippen.</li>
      <li>Hier unten <b>„Anweisung kopieren“</b> tippen und dort einfügen → Speichern.</li>
    </ol>
    <p><button class="btn primary block" data-act="copy-prompt">📋 Anweisung kopieren</button></p>
    <details class="card model"><summary><b>Anweisung ansehen</b></summary><pre class="pre">${esc(PROJECT_PROMPT)}</pre></details>
    <div class="section-title">Danach für jeden Post</div>
    <ol class="steps">
      <li>In Instagram von jeder Seite des Posts einen <b>Screenshot</b> machen (Seitentaste + Lauter).</li>
      <li>Claude-App → Projekt <i>Führungskompass-Posts</i> → neuer Chat → <b>Bilder anhängen</b> → senden. Du musst nichts schreiben.</li>
      <li>Unter der Antwort auf <b>Kopieren</b> tippen.</li>
      <li>Hier: <b>📸 Post verarbeiten</b> → <b>📋 Ergebnis einfügen</b> → <b>Speichern</b>.</li>
    </ol>
    <p class="hint">Läuft über dein Claude-Abo, ohne Zusatzkosten. Die Screenshots kannst du optional auch hier anhängen – sie bleiben nur auf diesem iPhone.</p>
  `);
}

function parsePostResult(text) {
  const a = text.indexOf("{"), b = text.lastIndexOf("}");
  if (a < 0 || b <= a) throw new Error("Kein Ergebnisblock gefunden");
  let raw = text.slice(a, b + 1);
  let data;
  try { data = JSON.parse(raw); }
  catch (e) {
    raw = raw.replace(/[“”]/g, '"').replace(/,\s*([}\]])/g, "$1");
    data = JSON.parse(raw);
  }
  const str = (v) => (typeof v === "string" ? v.trim() : "");
  const mod = str(data.modul).toLowerCase();
  const m = MODULES.find((x) => x.id === mod) || MODULES.find((x) => x.title.toLowerCase() === mod);
  const out = {
    titel: str(data.titel) || "Instagram-Post",
    autor: str(data.autor),
    sprache: str(data.sprache),
    original: str(data.original),
    deutsch: str(data.deutsch),
    kernaussage: str(data.kernaussage),
    modul: m ? m.id : "",
    bezug_ih: str(data.bezug_ih),
    frage: str(data.frage),
    experiment: str(data.experiment),
    karten: (Array.isArray(data.karten) ? data.karten : []).map((k) => ({ frage: str(k.frage), antwort: str(k.antwort) })).filter((k) => k.frage && k.antwort).slice(0, 3),
  };
  if (!out.kernaussage && !out.deutsch) throw new Error("Ergebnis ohne Inhalt");
  return out;
}

let pendingImages = [];
function openNewPost(linkId) {
  pendingImages = [];
  const link = linkId && state.inbox.find((i) => i.id === linkId);
  showSheet("📸 Post verarbeiten", () => `
    ${link ? `<div class="banner small">Zu: ${esc(inboxLabel(link))}</div>` : ""}
    <p class="hint">Antwort aus dem Claude-Projekt <i>Führungskompass-Posts</i> hier einfügen:</p>
    <button class="btn primary block" data-act="post-paste">📋 Ergebnis einfügen</button>
    <textarea id="pn-text" rows="5" placeholder="… oder lange tippen → Einsetzen"></textarea>
    <p class="hint">Screenshots anhängen (optional, bleiben nur auf diesem iPhone)</p>
    <label class="btn block">🖼 Bilder wählen<input type="file" id="pn-img" accept="image/*" multiple hidden></label>
    <div id="pn-thumbs" class="thumbs"></div>
    <p><button class="btn primary block" data-act="post-save" data-link="${esc(linkId || "")}">Speichern & ansehen</button></p>
    <p class="hint">Noch kein Projekt eingerichtet? <button class="btn ghost small" data-act="project-help">So geht's</button></p>
  `);
  $("#pn-img").addEventListener("change", async (e) => {
    const files = [...e.target.files];
    for (const f of files) pendingImages.push(await shrinkImage(f));
    $("#pn-thumbs").innerHTML = pendingImages.map((b) => `<img src="${URL.createObjectURL(b)}" alt="">`).join("");
  });
}
async function savePost(linkId) {
  const text = $("#pn-text").value;
  let data;
  try { data = parsePostResult(text); }
  catch (e) { toast("Ergebnis nicht lesbar – bitte die ganze Antwort kopieren"); return; }
  const id = uid();
  const link = linkId && state.inbox.find((i) => i.id === linkId);
  const post = { id, added: Date.now(), url: link?.url || "", images: pendingImages.length, ...data };
  if (pendingImages.length) {
    try { await idb.put(id, pendingImages); } catch (e) { post.images = 0; toast("Bilder konnten nicht gespeichert werden"); }
  }
  state.posts.unshift(post);
  if (link) { link.status = "verarbeitet"; link.note = link.note || data.kernaussage; link.mod = link.mod || data.modul; }
  pendingImages = [];
  save(); closeSheet(); ui.tab = "inbox"; ui.feed = "alle"; render();
  toast(`Gespeichert${data.karten.length ? ` · ${data.karten.length} Lernkarte${data.karten.length > 1 ? "n" : ""} dazu` : ""}`);
  openStory("post", id);
}

async function openStory(t, id) {
  const x = feedItem(t, id);
  if (!x) return;
  state.read[`${t}:${id}`] = Date.now(); save();
  const ref = { t, id };
  const m = moduleById(x.modul);
  let imgs = [];
  if (t === "post" && x.images) { try { imgs = (await idb.get(id)) || []; } catch (e) { imgs = []; } }
  const urls = imgs.map((b) => URL.createObjectURL(b));
  const slides = [
    `<div class="slide cover">
       <div class="tags"><span class="tag ${t === "post" ? "t-praxis" : "t-wissen"}">${t === "post" ? "📸 Mein Post" : "🔎 Recherche"}</span>${m ? `<span class="tag">${m.icon} ${esc(m.title)}</span>` : ""}</div>
       <h2>${esc(x.titel)}</h2>
       <p class="big">${esc(x.kernaussage)}</p>
       <p class="src">${t === "post" ? esc(x.autor || "") : esc(x.quelle?.name || "")}${x.sprache && x.sprache !== "de" ? ` · übersetzt aus „${esc(x.sprache)}“` : ""}</p>
       <p class="hint">Wischen →</p>
     </div>`,
    ...urls.map((u, i) => `<div class="slide"><div class="slide-h">Original ${urls.length > 1 ? `${i + 1}/${urls.length}` : ""}</div><img class="shot" src="${u}" alt="Screenshot"></div>`),
    x.deutsch ? `<div class="slide"><div class="slide-h">${t === "post" ? "Auf Deutsch" : "Worum es geht"}</div><div class="slide-text">${nl2br(x.deutsch)}</div>
      ${x.original && x.sprache && x.sprache !== "de" ? `<details class="orig"><summary>Originaltext</summary><p>${nl2br(x.original)}</p></details>` : ""}</div>` : "",
    x.bezug_ih ? `<div class="slide"><div class="slide-h">Bezug zur IH Hagen</div><p class="big">${esc(x.bezug_ih)}</p></div>` : "",
    x.frage ? `<div class="slide"><div class="slide-h">Frage an dich</div><p class="big question">${esc(x.frage)}</p>
      <button class="btn block" data-act="note-new" ${refAttrs(ref)}>✍️ Gedanken notieren</button></div>` : "",
    x.experiment ? `<div class="slide"><div class="slide-h">Zum Ausprobieren</div><p class="big">${esc(x.experiment)}</p>
      <button class="btn primary block" data-act="exp-new" ${refAttrs(ref)} data-suggest="1">🧪 Als Experiment starten</button></div>` : "",
    `<div class="slide"><div class="slide-h">Festigen</div>
      ${(x.karten || []).length ? `<p>${x.karten.length} Lernkarte${x.karten.length > 1 ? "n" : ""} ${x.karten.length > 1 ? "sind" : "ist"} in deinem Stapel:</p>
        <ul class="refs">${x.karten.map((k) => `<li>${esc(k.frage)}</li>`).join("")}</ul>` : ""}
      ${notesFor(ref).map((n) => `<div class="mynote">✍️ ${nl2br(n.text)}</div>`).join("")}
      ${actionRow(ref)}
      ${t === "rx" && x.quelle?.url ? `<p><a class="btn block" href="${esc(x.quelle.url)}" target="_blank" rel="noopener">Quelle öffnen: ${esc(x.quelle.name || "")}</a></p>` : ""}
      ${t === "post" && x.url ? `<p><a class="btn block" href="${esc(x.url)}" target="_blank" rel="noopener">📸 In Instagram öffnen</a></p>` : ""}
      ${t === "post" ? `<p><button class="btn small danger" data-act="post-del" data-id="${esc(id)}">Post entfernen</button></p>` : ""}
    </div>`,
  ].filter(Boolean);
  showSheet(t === "post" ? "📸 Mein Post" : "🔎 Recherche", () => `
    <div class="slides" id="slides">${slides.join("")}</div>
    <div class="dots" id="dots">${slides.map((_, i) => `<i class="${i ? "" : "on"}"></i>`).join("")}</div>
  `);
  const el = $("#slides");
  el.addEventListener("scroll", () => {
    const i = Math.round(el.scrollLeft / el.clientWidth);
    document.querySelectorAll("#dots i").forEach((d, j) => d.classList.toggle("on", i === j));
  }, { passive: true });
  if (ui.tab === "inbox" || ui.tab === "heute") render();
}
async function deletePost(id) {
  if (!confirm("Post wirklich entfernen? Notizen bleiben im Journal.")) return;
  state.posts = state.posts.filter((p) => p.id !== id);
  try { await idb.del(id); } catch (e) { /* egal */ }
  save(); closeSheet(); render(); toast("Entfernt");
}

// ----- Experimente -----
function expCard(e) {
  const left = daysBetween(today(), e.due);
  const src = refInfo(e.ref);
  return `
    <div class="card exp ${e.status}">
      <div class="tags"><span class="tag t-praxis">🧪 Experiment</span>
        <span class="tag">${e.status === "aktiv" ? (left > 0 ? `noch ${left} ${left === 1 ? "Tag" : "Tage"}` : "auswerten") : e.status === "fertig" ? "abgeschlossen" : "verworfen"}</span></div>
      <h3>${esc(e.title)}</h3>
      ${e.plan ? `<p>${nl2br(e.plan)}</p>` : ""}
      ${src ? `<p class="src">aus: ${esc(src.short)}</p>` : ""}
      ${e.review ? `<div class="mynote"><b>Ergebnis:</b> ${nl2br(e.review.passiert)}<br><b>Gelernt:</b> ${nl2br(e.review.gelernt)}<br><b>Entscheidung:</b> ${esc(e.review.weiter)}</div>` : ""}
      <div class="acts">
        ${e.status === "aktiv" ? `<button data-act="exp-review" data-id="${e.id}">✅<span>Auswerten</span></button>` : ""}
        <button data-act="copilot" ${refAttrs({ t: "exp", id: e.id })}>📤<span>Copilot</span></button>
        <button data-act="exp-del" data-id="${e.id}">🗑<span>Entfernen</span></button>
      </div>
    </div>`;
}
function openNewExperiment(ref) {
  const info = refInfo(ref);
  const suggestion = info
    ? (ref.t === "imp" && impulseById(ref.id)?.type === "praxis" ? info.text
      : (ref.t === "post" || ref.t === "rx") ? (feedItem(ref.t, ref.id)?.experiment || "") : "")
    : "";
  showSheet("Experiment anlegen", () => `
    ${info ? `<div class="banner small">${esc(info.label)}<br><span class="hint">${esc(info.text)}</span></div>` : ""}
    <p class="hint">Was probierst du konkret aus?</p>
    <textarea id="ex-title" rows="3" placeholder="z. B. In jeder Lagebesprechung zuerst die Praktiker fragen">${esc(suggestion)}</textarea>
    <p class="hint">Woran merkst du, ob es wirkt? (optional)</p>
    <textarea id="ex-plan" rows="2" placeholder="z. B. Mehr Meldungen von unten, kürzere Diskussionen"></textarea>
    <p class="hint">Dauer</p>
    <div class="seg" id="ex-dur">${[7, 14, 28].map((d) => `<button data-d="${d}" aria-selected="${d === 14}">${d / 7} ${d === 7 ? "Woche" : "Wochen"}</button>`).join("")}</div>
    <p><button class="btn primary block" data-act="exp-save">Experiment starten</button></p>
  `);
  const seg = $("#ex-dur");
  seg.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    seg.querySelectorAll("button").forEach((x) => x.setAttribute("aria-selected", x === b));
  });
  openNewExperiment.ref = ref;
}
function saveExperiment() {
  const sheet = $("#sheet");
  const title = $("#ex-title", sheet).value.trim();
  if (!title) { toast("Bitte beschreiben, was du ausprobierst"); return; }
  const days = +$("#ex-dur [aria-selected='true']", sheet).dataset.d;
  state.experiments.unshift({ id: uid(), title, plan: $("#ex-plan", sheet).value.trim(), ref: openNewExperiment.ref, start: today(), due: iso(addDays(new Date(), days)), status: "aktiv", review: null });
  save(); closeSheet(); render();
  toast("Experiment läuft – Auswertung in Heute");
}
function openReview(id) {
  const e = state.experiments.find((x) => x.id === id);
  showSheet("Experiment auswerten", () => `
    <div class="banner small"><b>${esc(e.title)}</b></div>
    <p class="hint">Was ist passiert?</p><textarea id="rv-a"></textarea>
    <p class="hint">Was habe ich gelernt – über das Team, das Netz, mich?</p><textarea id="rv-b"></textarea>
    <p class="hint">Wie geht es weiter?</p>
    <div class="seg" id="rv-c">${["beibehalten", "anpassen", "verwerfen"].map((k, i) => `<button data-k="${k}" aria-selected="${i === 0}">${k}</button>`).join("")}</div>
    <p><button class="btn primary block" data-act="review-save" data-id="${e.id}">Abschließen</button></p>
  `);
  const seg = $("#rv-c");
  seg.addEventListener("click", (ev) => {
    const b = ev.target.closest("button"); if (!b) return;
    seg.querySelectorAll("button").forEach((x) => x.setAttribute("aria-selected", x === b));
  });
}
function saveReview(id) {
  const e = state.experiments.find((x) => x.id === id);
  const sheet = $("#sheet");
  const weiter = $("#rv-c [aria-selected='true']", sheet).dataset.k;
  e.review = { passiert: $("#rv-a", sheet).value.trim(), gelernt: $("#rv-b", sheet).value.trim(), weiter };
  e.status = weiter === "verwerfen" ? "verworfen" : "fertig";
  save(); closeSheet();
  if (weiter === "anpassen") { openNewExperiment(e.ref); $("#ex-title").value = e.title; toast("Passe das Experiment an"); }
  else { render(); toast(weiter === "beibehalten" ? "Wird zur Routine 💪" : "Abgeschlossen"); }
}

// ----- Notizen / Journal -----
const KIND = {
  notiz: { label: "Notiz", icon: "✍️" },
  why: { label: "WHY-Baustein", icon: "💡" },
  reflexion: { label: "Wochenrückblick", icon: "📓" },
  merker: { label: "Podcast-Merker", icon: "🎧" },
  copilot: { label: "An Copilot gegeben", icon: "📤" },
};
function openNote(ref, entryId) {
  const entry = entryId && state.journal.find((j) => j.id === entryId);
  const info = refInfo(entry ? entry.ref : ref);
  const kind = entry?.kind || (ref?.t === "imp" && impulseById(ref.id)?.mod === "why" ? "why" : "notiz");
  showSheet(entry ? "Eintrag bearbeiten" : "Notiz", () => `
    ${info ? `<div class="banner small">${esc(info.label)}${info.text ? `<br><span class="hint">${esc(info.text)}</span>` : ""}</div>` : ""}
    <textarea id="nt-text" rows="6" placeholder="Deine Gedanken, Beobachtungen, Ideen …">${esc(entry?.text || "")}</textarea>
    <p class="hint">Art</p>
    <div class="seg" id="nt-kind">${["notiz", "why"].concat(entry && !["notiz", "why"].includes(entry.kind) ? [entry.kind] : [])
      .map((k) => `<button data-k="${k}" aria-selected="${k === kind}">${KIND[k].icon} ${KIND[k].label}</button>`).join("")}</div>
    <p><button class="btn primary block" data-act="note-save" data-id="${entry?.id || ""}">Speichern</button></p>
    <p class="hint">Bleibt nur auf diesem Gerät.</p>
  `);
  openNote.ref = entry ? entry.ref : ref;
  const seg = $("#nt-kind");
  seg.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    seg.querySelectorAll("button").forEach((x) => x.setAttribute("aria-selected", x === b));
  });
  setTimeout(() => $("#nt-text")?.focus(), 50);
}
function saveNote(entryId) {
  const sheet = $("#sheet");
  const text = $("#nt-text", sheet).value.trim();
  const kind = $("#nt-kind [aria-selected='true']", sheet).dataset.k;
  if (!text) { toast("Bitte etwas eintragen"); return; }
  if (entryId) Object.assign(state.journal.find((j) => j.id === entryId), { text, kind });
  else state.journal.unshift({ id: uid(), ts: Date.now(), kind, text, ref: openNote.ref || null });
  save(); closeSheet(); render(); toast("Gespeichert");
}
function openWeekly() {
  showSheet("Wochenrückblick", () => `
    ${WEEKLY_REVIEW.map((q, i) => `<p class="hint">${esc(q)}</p><textarea id="wr-${i}" rows="2"></textarea>`).join("")}
    <p><button class="btn primary block" data-act="weekly-save">Speichern</button></p>
  `);
}
function saveWeekly() {
  const sheet = $("#sheet");
  const text = WEEKLY_REVIEW.map((q, i) => {
    const a = $(`#wr-${i}`, sheet).value.trim();
    return a ? `${q}\n→ ${a}` : "";
  }).filter(Boolean).join("\n\n");
  if (!text) { toast("Mindestens eine Frage beantworten"); return; }
  state.journal.unshift({ id: uid(), ts: Date.now(), kind: "reflexion", text, ref: null });
  save(); closeSheet(); render(); toast("Wochenrückblick gespeichert");
}

function renderJournal() {
  const tabs = [["experimente", "Experimente"], ["notizen", "Notizen"], ["why", "WHY-Bausteine"], ["merker", "Podcast-Merker"]];
  const head = `
    <div class="chips">${tabs.map(([k, l]) => `<button data-act="j-filter" data-k="${k}" aria-pressed="${ui.journal === k}">${l}</button>`).join("")}</div>`;
  if (ui.journal === "experimente") {
    const act = state.experiments.filter((e) => e.status === "aktiv");
    const done = state.experiments.filter((e) => e.status !== "aktiv");
    return head + `
      <p class="hint">Experimente entstehen aus Impulsen, Beiträgen oder Podcasts (🧪). Nach Ablauf wertest du aus: beibehalten, anpassen oder verwerfen.</p>
      ${act.length ? act.map(expCard).join("") : `<div class="empty">Kein laufendes Experiment. Wähle einen Impuls und tippe 🧪.</div>`}
      ${done.length ? `<div class="section-title">Abgeschlossen</div>${done.map(expCard).join("")}` : ""}`;
  }
  const kinds = { notizen: ["notiz", "reflexion", "copilot"], why: ["why"], merker: ["merker"] }[ui.journal];
  const list = state.journal.filter((j) => kinds.includes(j.kind));
  return head + `
    <div class="btn-row">
      <button class="btn" data-act="note-new">✍️ Neue Notiz</button>
      ${ui.journal === "notizen" ? `<button class="btn" data-act="weekly">📓 Wochenrückblick</button>` : ""}
    </div>
    ${ui.journal === "why" ? `<p class="hint">Sammle Stolz-Geschichten, Formulierungen und Beobachtungen. Daraus entsteht mit dem Team euer WHY.</p>` : ""}
    ${list.length ? list.map(entryCard).join("") : `<div class="empty">Noch keine Einträge.</div>`}`;
}
function entryCard(j) {
  const info = refInfo(j.ref);
  const isEp = j.ref?.t === "ep";
  return `
    <div class="card entry">
      <div class="tags"><span class="tag">${KIND[j.kind].icon} ${KIND[j.kind].label}</span><span class="tag">${fmtShort(j.ts)}</span></div>
      ${info ? `<p class="src">${esc(info.label)}${isEp && j.ref.time != null ? ` · ${fmtTime(j.ref.time)}` : ""}</p>` : ""}
      <p>${nl2br(j.text)}</p>
      <div class="acts">
        ${isEp ? `<button data-act="merker-play" data-id="${j.id}">▶<span>Ab hier hören</span></button>` : ""}
        ${j.kind !== "copilot" ? `<button data-act="note-edit" data-id="${j.id}">✏️<span>Bearbeiten</span></button>` : ""}
        ${j.kind !== "copilot" ? `<button data-act="copilot" ${refAttrs({ t: "entry", id: j.id })}>📤<span>Copilot</span></button>` : ""}
        ${j.kind !== "copilot" ? `<button data-act="exp-new" ${refAttrs({ t: "entry", id: j.id })}>🧪<span>Ausprobieren</span></button>` : ""}
        <button data-act="note-del" data-id="${j.id}">🗑<span>Entfernen</span></button>
      </div>
    </div>`;
}

// ----- Copilot-Brücke -----
function refInfoAny(ref) {
  if (ref.t === "exp") {
    const e = state.experiments.find((x) => x.id === ref.id);
    if (!e) return null;
    return {
      label: `Mein Experiment: ${e.title}`,
      text: [e.plan && `Erfolgskriterium: ${e.plan}`, e.review && `Ergebnis: ${e.review.passiert}. Gelernt: ${e.review.gelernt}. Entscheidung: ${e.review.weiter}.`].filter(Boolean).join(" "),
      source: "mein Journal",
    };
  }
  return refInfo(ref);
}
function buildPrompt(ref, deepenId, thoughts, withContext) {
  const info = refInfoAny(ref);
  const d = DEEPEN.find((x) => x.id === deepenId) || DEEPEN[0];
  const started = roleDay() >= 1;
  const ph = currentPhase();
  const blocks = [
    [
      `Kontext: ${started ? `Ich bin seit dem ${fmtD(state.roleStart)}` : `Ich werde ab dem ${fmtD(state.roleStart)}`} ${ROLE}. Meine Ziele: ${GOALS}. Aktuell bin ich in der Phase „${ph.name}“ (${ph.fokus})`,
      withContext && state.context.trim() ? `Weiterer Kontext: ${state.context.trim()}` : "",
    ],
    [
      info ? `Impuls${info.source ? ` (${info.source})` : ""}: „${info.label}“${info.text ? ` – ${info.text}` : ""}` : "",
      ref.t === "inbox" ? `Link: ${state.inbox.find((i) => i.id === ref.id)?.url || ""}` : "",
      thoughts ? `Meine Gedanken dazu: ${thoughts}` : "",
    ],
    [
      `Auftrag: ${d.ask}`,
      "Antworte strukturiert und knapp. Stelle mir am Ende eine Rückfrage, die mein Denken schärft.",
    ],
  ];
  return blocks.map((b) => b.filter(Boolean).join("\n")).filter(Boolean).join("\n\n");
}
function openCopilot(ref) {
  const info = refInfoAny(ref);
  const notes = ref.t === "imp" || ref.t === "inbox" ? notesFor(ref).map((n) => n.text).join(" ") : "";
  showSheet("Mit Copilot vertiefen", () => `
    ${info ? `<div class="banner small">${esc(info.label)}</div>` : ""}
    <p class="hint">Wie willst du vertiefen?</p>
    <div class="radio-list">${DEEPEN.map((d, i) => `<label><input type="radio" name="deepen" value="${d.id}" ${i === 0 ? "checked" : ""}> ${esc(d.label)}</label>`).join("")}</div>
    <p class="hint">Deine Gedanken (optional)</p>
    <textarea id="cp-thoughts" rows="3">${esc(notes)}</textarea>
    ${state.context.trim() ? `<label class="check-line"><input type="checkbox" id="cp-ctx" checked> „Mein Kontext“ mitschicken</label>` : ""}
    <p class="hint">Vorschau</p>
    <textarea id="cp-preview" rows="9" readonly></textarea>
    ${state.workMail
      ? `<button class="btn primary block" data-act="cp-mail">📧 An Diensthandy mailen</button>
         <p class="hint">Geht an ${esc(state.workMail)}. Auf dem Diensthandy: Mail öffnen → Text lange drücken → „Alles auswählen“ → Kopieren → in Copilot einfügen.</p>`
      : `<button class="btn primary block" data-act="settings">📧 Dienstliche E-Mail hinterlegen</button>
         <p class="hint">Einmal in den Einstellungen eintragen, dann geht die Anfrage per Mail an dein Diensthandy.</p>`}
    <div class="btn-row">
      <button class="btn" data-act="cp-copy">Kopieren</button>
      <button class="btn" data-act="cp-share">Teilen …</button>
    </div>
    <p class="hint">Die Anfrage enthält nur, was du in der Vorschau siehst.</p>
  `);
  const sheet = $("#sheet");
  const upd = () => {
    $("#cp-preview", sheet).value = buildPrompt(ref, sheet.querySelector("[name=deepen]:checked").value, $("#cp-thoughts", sheet).value.trim(), $("#cp-ctx", sheet)?.checked);
  };
  sheet.querySelectorAll("[name=deepen], #cp-ctx").forEach((x) => x.addEventListener("change", upd));
  $("#cp-thoughts", sheet).addEventListener("input", upd);
  upd();
  openCopilot.ref = ref;
}
async function copilotSend(share) {
  const sheet = $("#sheet");
  const text = $("#cp-preview", sheet).value;
  const label = DEEPEN.find((d) => d.id === sheet.querySelector("[name=deepen]:checked").value).label;
  let ok = false;
  if (share === "mail") {
    const info0 = refInfoAny(openCopilot.ref);
    const subject = `Copilot: ${info0 ? info0.label : label}`.slice(0, 120);
    location.href = `mailto:${encodeURIComponent(state.workMail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    ok = true;
  }
  if (!ok && share && navigator.share) {
    try { await navigator.share({ text }); ok = true; } catch (e) { if (e.name === "AbortError") return; }
  }
  if (!ok) {
    try { await navigator.clipboard.writeText(text); ok = true; toast("Kopiert – in Copilot einfügen"); }
    catch (e) { $("#cp-preview", sheet).select(); toast("Text markiert – bitte kopieren"); return; }
  }
  const info = refInfoAny(openCopilot.ref);
  state.journal.unshift({ id: uid(), ts: Date.now(), kind: "copilot", text: `${label}${info ? `: ${info.label}` : ""}`, ref: openCopilot.ref.t === "exp" ? null : openCopilot.ref });
  save(); closeSheet(); render();
}

// ---------- Podcasts ----------
async function loadPodcasts(force) {
  try {
    const res = await fetch(`data/podcasts.json${force ? `?t=${Date.now()}` : ""}`, { cache: force ? "no-store" : "default" });
    if (!res.ok) throw new Error(res.status);
    podData = await res.json();
  } catch (e) {
    podData = podData || { updated: null, podcasts: [] };
  }
  if (["hoeren", "heute"].includes(ui.tab)) render();
}
const CAT_LABEL = { fuehrung: "Führung", allgemein: "Allgemeinbildung", entdecken: "Entdecken" };
function allEpisodes() {
  if (!podData) return [];
  return podData.podcasts.flatMap((p) => p.episodes.map((e) => ({ ...e, pod: p }))).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}
function freshEpisodes() {
  const eps = allEpisodes();
  const out = [];
  const lead = eps.filter((e) => e.pod.category !== "allgemein" && !state.listen[e.id]?.done);
  const brief = eps.find((e) => e.pod.category === "allgemein" && !state.listen[e.id]?.done);
  if (brief && daysBetween(brief.date.slice(0, 10), today()) <= 1) out.push(brief);
  const cur = state.current && eps.find((e) => e.id === state.current && !state.listen[e.id]?.done);
  if (cur && !out.includes(cur)) out.push(cur);
  for (const e of lead) { if (out.length >= 3) break; if (!out.includes(e)) out.push(e); }
  return out;
}
function epRow(e) {
  const l = state.listen[e.id];
  const pct = l?.dur ? Math.min(100, Math.round((l.pos / l.dur) * 100)) : 0;
  const playing = state.current === e.id && !audio.paused;
  const marks = state.journal.filter((j) => j.kind === "merker" && j.ref?.id === e.id).length;
  return `
    <div class="ep ${l?.done ? "done" : ""}">
      <button class="play" data-act="ep-play" data-id="${esc(e.id)}" aria-label="${playing ? "Pause" : "Abspielen"}">${playing ? "⏸" : "▶"}</button>
      <button class="mb" data-act="ep-open" data-id="${esc(e.id)}">
        <b>${esc(e.title)}</b>
        <small>${esc(e.pod.name)} · ${e.date ? fmtShort(e.date) : ""}${e.duration ? ` · ${fmtDur(e.duration)} (${fmtDur(e.duration / state.speed)} bei ${state.speed}×)` : ""}${l?.done ? " · ✓ gehört" : ""}${marks ? ` · 📍${marks}` : ""}</small>
        ${pct && !l?.done ? `<span class="pbar"><i style="width:${pct}%"></i></span>` : ""}
      </button>
    </div>`;
}
function renderHoeren() {
  if (!podData) { loadPodcasts(); return `<div class="empty">Lade Podcasts …</div>`; }
  const pods = podData.podcasts;
  if (!pods.length) {
    return `<div class="empty">Noch keine Folgen geladen.<br><span class="hint">Die Podcast-Liste wird täglich automatisch über GitHub aktualisiert (siehe README).</span></div>
      <button class="btn block" data-act="pod-reload">↻ Neu laden</button>`;
  }
  const filters = [["alle", "Alle"], ["offen", "Ungehört"], ...pods.map((p) => [p.id, p.short || p.name])];
  let eps = allEpisodes();
  if (ui.pod === "offen") eps = eps.filter((e) => !state.listen[e.id]?.done);
  else if (ui.pod !== "alle") eps = eps.filter((e) => e.pod.id === ui.pod);
  const pod = pods.find((p) => p.id === ui.pod);
  return `
    <div class="chips">${filters.map(([k, l]) => `<button data-act="pod-filter" data-k="${esc(k)}" aria-pressed="${ui.pod === k}">${esc(l)}</button>`).join("")}</div>
    ${pod ? `<div class="card pod-head">${pod.image ? `<img src="${esc(pod.image)}" alt="" loading="lazy">` : ""}<div><b>${esc(pod.name)}</b><br><small>${esc(pod.author || "")} · ${CAT_LABEL[pod.category] || ""}</small></div></div>` : ""}
    <div class="card list-group">${eps.slice(0, 80).map(epRow).join("") || `<div class="empty">Keine Folgen.</div>`}</div>
    <p class="hint">Standard-Tempo ${state.speed}× (änderbar im Player oder in ⚙️). Stand der Liste: ${podData.updated ? new Date(podData.updated).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" }) : "–"}.
      <button class="btn ghost small" data-act="pod-reload">↻ Aktualisieren</button></p>
    ${podData.missing?.length ? `<p class="note">Nicht gefunden: ${podData.missing.map(esc).join(", ")}. Feed-Adresse in <code>feeds/sources.json</code> ergänzen.</p>` : ""}`;
}
function openEpisode(id) {
  const e = findEpisode(id);
  if (!e) return;
  const marks = state.journal.filter((j) => j.kind === "merker" && j.ref?.id === id);
  const l = state.listen[id];
  showSheet(e.pod.name, () => `
    <h3>${esc(e.title)}</h3>
    <p class="hint">${e.date ? fmtShort(e.date) : ""}${e.duration ? ` · ${fmtDur(e.duration)}` : ""}${l?.pos ? ` · bei ${fmtTime(l.pos)}` : ""}</p>
    <p><button class="btn primary block" data-act="ep-play" data-id="${esc(id)}">▶ ${l?.pos && !l.done ? "Weiterhören" : "Abspielen"}</button></p>
    ${e.desc ? `<p>${esc(e.desc)}</p>` : ""}
    ${marks.length ? `<div class="section-title">Deine Merker</div>${marks.map(entryCard).join("")}` : ""}
    <div class="btn-row">
      <button class="btn small" data-act="ep-done" data-id="${esc(id)}">${l?.done ? "Als ungehört markieren" : "✓ Als gehört markieren"}</button>
      ${e.link ? `<a class="btn small" href="${esc(e.link)}" target="_blank" rel="noopener">Webseite</a>` : ""}
    </div>
    ${actionRow({ t: "ep", id })}
  `);
}

// ----- Player -----
const audio = new Audio();
audio.preload = "metadata";
let lastSave = 0;
function playEpisode(id, at) {
  const e = findEpisode(id);
  if (!e) { toast("Folge nicht gefunden"); return; }
  if (state.current === id && audio.src && at != null) {
    audio.currentTime = at; audio.play().catch(() => {}); return;
  }
  if (state.current === id && audio.src && at == null) {
    if (audio.paused) audio.play().catch(() => {}); else audio.pause();
    return;
  }
  state.current = id; save();
  audio.src = e.audio;
  audio.defaultPlaybackRate = state.speed;
  audio.playbackRate = state.speed;
  const l = state.listen[id];
  const start = at != null ? at : l && !l.done && l.pos > 5 ? l.pos - 3 : 0;
  audio.addEventListener("loadedmetadata", () => {
    if (start) audio.currentTime = start;
    audio.playbackRate = state.speed;
  }, { once: true });
  audio.play().then(() => { audio.playbackRate = state.speed; }).catch(() => toast("Wiedergabe nicht möglich"));
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({ title: e.title, artist: e.pod.name, artwork: e.pod.image ? [{ src: e.pod.image, sizes: "512x512" }] : [] });
  }
  renderPlayer();
}
function seekBy(s) { if (audio.src) audio.currentTime = Math.max(0, Math.min((audio.duration || 1e9) - 1, audio.currentTime + s)); }
if ("mediaSession" in navigator) {
  const ms = navigator.mediaSession;
  const h = (a, f) => { try { ms.setActionHandler(a, f); } catch (e) { /* nicht unterstützt */ } };
  h("play", () => audio.play());
  h("pause", () => audio.pause());
  h("seekbackward", () => seekBy(-15));
  h("seekforward", () => seekBy(30));
  h("seekto", (d) => { audio.currentTime = d.seekTime; });
}
function persistPos(force) {
  const id = state.current;
  if (!id || !audio.duration) return;
  const now = Date.now();
  if (!force && now - lastSave < 5000) return;
  lastSave = now;
  const l = (state.listen[id] ||= {});
  l.pos = audio.currentTime; l.dur = audio.duration; l.ts = now;
  if (audio.duration - audio.currentTime < 45) l.done = true;
  save();
}
audio.addEventListener("timeupdate", () => { persistPos(); updatePlayerTime(); });
audio.addEventListener("pause", () => { persistPos(true); renderPlayer(); if (ui.tab === "hoeren") render(); });
audio.addEventListener("play", () => { renderPlayer(); if (ui.tab === "hoeren") render(); });
audio.addEventListener("ratechange", () => { if (audio.playbackRate !== state.speed && !audio.paused) audio.playbackRate = state.speed; });
audio.addEventListener("ended", () => {
  persistPos(true);
  if (state.current) { (state.listen[state.current] ||= {}).done = true; save(); }
  renderPlayer(); render(); toast("Folge zu Ende – 📍 Merker gesetzt?");
});
document.addEventListener("visibilitychange", () => { if (document.hidden) persistPos(true); });

function renderPlayer() {
  const el = $("#player");
  const e = state.current && findEpisode(state.current);
  document.body.classList.toggle("has-player", !!e);
  if (!e) { el.hidden = true; return; }
  el.hidden = false;
  const l = state.listen[state.current] || {};
  const pos = audio.src ? audio.currentTime : l.pos || 0;
  const dur = audio.duration || l.dur || e.duration || 0;
  el.innerHTML = `
    <div class="pl-info" data-act="ep-open" data-id="${esc(e.id)}"><b>${esc(e.title)}</b><small><span id="pl-time">${fmtTime(pos)} / ${fmtTime(dur)}</span> · ${esc(e.pod.short || e.pod.name)}</small></div>
    <div class="pl-ctrl">
      <button data-act="pl-back" aria-label="15 Sekunden zurück">↺15</button>
      <button data-act="pl-toggle" class="big" aria-label="${audio.paused ? "Abspielen" : "Pause"}">${audio.paused ? "▶" : "⏸"}</button>
      <button data-act="pl-fwd" aria-label="30 Sekunden vor">30↻</button>
      <button data-act="pl-speed" aria-label="Tempo">${state.speed}×</button>
      <button data-act="pl-mark" aria-label="Merker setzen">📍</button>
    </div>
    <div class="pl-bar"><i id="pl-bar" style="width:${dur ? (pos / dur) * 100 : 0}%"></i></div>`;
}
function updatePlayerTime() {
  const t = $("#pl-time"), b = $("#pl-bar");
  if (!t) return;
  const e = findEpisode(state.current);
  const dur = audio.duration || e?.duration || 0;
  t.textContent = `${fmtTime(audio.currentTime)} / ${fmtTime(dur)}`;
  if (b && dur) b.style.width = `${(audio.currentTime / dur) * 100}%`;
}
const SPEEDS = [1, 1.25, 1.5, 1.75, 2];
function cycleSpeed() {
  state.speed = SPEEDS[(SPEEDS.indexOf(state.speed) + 1) % SPEEDS.length] || 1.5;
  audio.defaultPlaybackRate = state.speed;
  audio.playbackRate = state.speed;
  save(); renderPlayer();
  toast(`Tempo ${state.speed}×`);
}
function setMarker() {
  const id = state.current;
  const e = findEpisode(id);
  if (!e) return;
  const time = audio.src ? audio.currentTime : state.listen[id]?.pos || 0;
  showSheet("📍 Merker", () => `
    <div class="banner small">${esc(e.title)}<br><span class="hint">bei ${fmtTime(time)}</span></div>
    <p class="hint">Was willst du behalten? (Der Podcast läuft weiter.)</p>
    <textarea id="mk-text" rows="4" placeholder="z. B. Gute Frage für Antrittsgespräche: …"></textarea>
    <p><button class="btn primary block" data-act="mk-save">Speichern</button></p>
  `);
  setMarker.ref = { t: "ep", id, time: Math.floor(time), label: `${e.pod.name} – ${e.title}` };
  setTimeout(() => $("#mk-text")?.focus(), 50);
}
function saveMarker() {
  const text = $("#mk-text").value.trim() || "(Stelle gemerkt)";
  state.journal.unshift({ id: uid(), ts: Date.now(), kind: "merker", text, ref: setMarker.ref });
  save(); closeSheet(); render(); toast("Merker gespeichert – im Journal");
}

// ---------- Einstellungen ----------
function openSettings() {
  showSheet("Einstellungen", () => `
    <p class="hint">Stellenantritt</p>
    <input type="date" id="st-start" value="${esc(state.roleStart)}">
    <p class="hint">Standard-Tempo für Podcasts</p>
    <div class="seg" id="st-speed">${SPEEDS.map((s) => `<button data-s="${s}" aria-selected="${s === state.speed}">${s}×</button>`).join("")}</div>
    <p class="hint">Mein Kontext (bleibt nur auf diesem Gerät, kann an Copilot-Anfragen angehängt werden)</p>
    <textarea id="st-ctx" rows="5" placeholder="z. B. Größe des Bereichs, Zahl der direkten Führungskräfte, aktuelle Schwerpunkte – nur was du auch an Copilot geben würdest.">${esc(state.context)}</textarea>
    <p class="hint">Dienstliche E-Mail für Copilot-Anfragen (📤 → „An Diensthandy mailen“)</p>
    <input type="email" id="st-mail" value="${esc(state.workMail)}" placeholder="vorname.nachname@…" autocomplete="email" inputmode="email">
    <p><button class="btn primary block" data-act="set-save">Speichern</button></p>

    <div class="section-title">Sicherung</div>
    <p class="hint">Alle Daten liegen nur auf diesem Gerät. Exportiere regelmäßig eine Sicherung (z. B. in iCloud Drive).</p>
    <div class="btn-row">
      <button class="btn" data-act="backup-export">⬇︎ Sicherung exportieren</button>
      <label class="btn">⬆︎ Sicherung laden<input type="file" id="bk-file" accept=".json,application/json" hidden></label>
    </div>

    <div class="section-title">Über die App</div>
    <p class="hint">${IMPULSES.length} Impulse in ${MODULES.length} Modulen und ${PHASES.length} Phasen · ${allCards().length} Lernkarten. Inhalte allgemein formuliert, ohne interne Informationen. Vertiefung für den konkreten DB-Kontext über Copilot (📤). Screenshots sind nicht in der Sicherung enthalten.</p>
  `);
  const seg = $("#st-speed");
  seg.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    seg.querySelectorAll("button").forEach((x) => x.setAttribute("aria-selected", x === b));
  });
  $("#bk-file").addEventListener("change", async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      if (!data || data.v !== 1 || !Array.isArray(data.journal)) throw new Error("Format");
      if (!confirm("Sicherung laden? Die aktuellen Daten auf diesem Gerät werden dabei ersetzt.")) return;
      state = { ...defaultState(), ...data };
      save(); closeSheet(); render(); toast("Sicherung geladen");
    } catch (err) { toast("Datei ist keine gültige Sicherung"); }
  });
}
function saveSettings() {
  const sheet = $("#sheet");
  const d = $("#st-start", sheet).value;
  if (d) state.roleStart = d;
  state.speed = +$("#st-speed [aria-selected='true']", sheet).dataset.s;
  audio.defaultPlaybackRate = state.speed;
  if (audio.src) audio.playbackRate = state.speed;
  state.context = $("#st-ctx", sheet).value;
  state.workMail = $("#st-mail", sheet).value.trim();
  state.daily = null;
  save(); closeSheet(); render(); toast("Gespeichert");
}
async function exportBackup() {
  const json = JSON.stringify(state, null, 1);
  const name = `fuehrungskompass-${today()}.json`;
  const file = new File([json], name, { type: "application/json" });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: name }); return; } catch (e) { if (e.name === "AbortError") return; }
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

// ---------- Sheet ----------
let sheetView = null;
function showSheet(title, view) {
  const d = $("#sheet");
  sheetView = { title, view };
  d.innerHTML = `<div class="sheet-head"><h2>${esc(title)}</h2><button class="icon-btn" data-act="sheet-close" aria-label="Schließen">✕</button></div><div class="sheet-body">${view()}</div>`;
  if (!d.open) d.showModal();
  d.scrollTop = 0;
}
function refreshSheet() {
  const d = $("#sheet");
  if (!d.open || !sheetView) return;
  const top = d.scrollTop;
  // offene <details> merken
  const open = [...d.querySelectorAll("details")].map((x) => x.open);
  $(".sheet-body", d).innerHTML = sheetView.view();
  d.querySelectorAll("details").forEach((x, i) => (x.open = !!open[i]));
  d.scrollTop = top;
}
function closeSheet() { const d = $("#sheet"); if (d.open) d.close(); sheetView = null; }

// ---------- Ereignisse ----------
document.addEventListener("click", async (ev) => {
  const sheet = $("#sheet");
  if (ev.target === sheet) { closeSheet(); return; }
  const el = ev.target.closest("[data-act], .tabbar button[data-tab]");
  if (!el) return;
  if (el.dataset.tab && !el.dataset.act) { ui.tab = el.dataset.tab; render(); window.scrollTo(0, 0); return; }
  const id = el.dataset.id;
  const inSheet = sheet.contains(el);
  switch (el.dataset.act) {
    case "tab": closeSheet(); ui.tab = el.dataset.tab; render(); window.scrollTo(0, 0); break;
    case "settings": openSettings(); break;
    case "sheet-close": closeSheet(); render(); break;
    case "more-imp": moreImpulses(); break;
    case "star":
      if (state.starred[id]) delete state.starred[id]; else { state.starred[id] = Date.now(); toast("Gemerkt – unter Lernen → Gemerkt"); }
      save(); inSheet ? refreshSheet() : render(); break;
    case "down":
      if (state.down[id]) delete state.down[id]; else { state.down[id] = true; toast("Verstanden – kommt seltener"); }
      save(); inSheet ? refreshSheet() : render(); break;
    case "note-new": openNote(el.dataset.rt ? readRef(el) : null); break;
    case "note-edit": openNote(null, id); break;
    case "note-save": saveNote(id); break;
    case "note-del":
      if (confirm("Eintrag wirklich entfernen?")) { state.journal = state.journal.filter((j) => j.id !== id); save(); inSheet ? refreshSheet() : render(); }
      break;
    case "exp-new": openNewExperiment(readRef(el)); break;
    case "exp-save": saveExperiment(); break;
    case "exp-review": openReview(id); break;
    case "review-save": saveReview(id); break;
    case "exp-del":
      if (confirm("Experiment wirklich entfernen?")) { state.experiments = state.experiments.filter((e) => e.id !== id); save(); render(); }
      break;
    case "copilot": openCopilot(readRef(el)); break;
    case "cp-mail": copilotSend("mail"); break;
    case "cp-share": copilotSend(true); break;
    case "cp-copy": copilotSend(false); break;
    case "weekly": openWeekly(); break;
    case "weekly-save": saveWeekly(); break;
    case "open-module": openModule(id); break;
    case "lern-sub": ui.lern = el.dataset.k; render(); break;
    case "practice": practice({ mod: el.dataset.mod, mix: el.dataset.mix }); break;
    case "card-show": practice.session.shown = true; refreshSheet(); break;
    case "card-rate": rateCard(el.dataset.ok === "1"); break;
    case "inbox-filter": ui.inbox = el.dataset.k; render(); break;
    case "feed-filter": ui.feed = el.dataset.k; render(); break;
    case "story": openStory(el.dataset.t, id); break;
    case "post-new": openNewPost(el.dataset.link || ""); break;
    case "post-save": savePost(el.dataset.link || ""); break;
    case "post-del": deletePost(id); break;
    case "project-help": openProjectHelp(); break;
    case "rx-reload": rxData = null; await loadResearch(true); toast("Aktualisiert"); break;
    case "copy-prompt":
      try { await navigator.clipboard.writeText(PROJECT_PROMPT); toast("Anweisung kopiert ✓"); }
      catch (e) { toast("Kopieren nicht möglich – Text unter „Anweisung ansehen“ markieren"); }
      break;
    case "post-paste":
      try {
        const t = await navigator.clipboard.readText();
        $("#pn-text").value = t;
        parsePostResult(t);
        toast("Ergebnis erkannt ✓");
      } catch (e) { toast($("#pn-text").value ? "Eingefügt – Format bitte prüfen" : "Bitte lange ins Feld tippen → Einsetzen"); }
      break;
    case "inbox-paste": {
      try {
        const t = await navigator.clipboard.readText();
        const urls = extractUrls(t);
        if (!urls.length) { toast("Kein Link in der Zwischenablage"); break; }
        const n = addToInbox(urls.map((url) => ({ url })));
        render(); toast(n ? "Beitrag gespeichert ✓" : "War schon in der Inbox");
      } catch (e) { toast("Bitte lange ins Feld tippen → Einsetzen"); $("#in-url")?.focus(); }
      break;
    }
    case "inbox-add": {
      const v = $("#in-url").value;
      const urls = extractUrls(v);
      if (!urls.length) { toast("Bitte einen Link eingeben"); break; }
      const n = addToInbox(urls.map((url) => ({ url })));
      render(); toast(n ? "Gespeichert ✓" : "War schon in der Inbox");
      break;
    }
    case "inbox-import": openImport(); break;
    case "import-text": {
      const n = addToInbox(extractUrls($("#imp-text").value).map((url) => ({ url })));
      closeSheet(); ui.tab = "inbox"; ui.feed = "links"; ui.inbox = "neu"; render();
      toast(n ? `${n} Links übernommen` : "Keine neuen Links gefunden");
      break;
    }
    case "inbox-open": openInboxItem(id); break;
    case "inbox-next": {
      const x = [...state.inbox].reverse().find((i) => i.status === "neu");
      if (x) openInboxItem(x.id);
      break;
    }
    case "inbox-save": saveInboxItem(id); break;
    case "inbox-archive": {
      saveInboxItem(id, true);
      const x = state.inbox.find((i) => i.id === id);
      x.status = x.status === "archiv" ? (x.note ? "verarbeitet" : "neu") : "archiv";
      save(); closeSheet(); render(); break;
    }
    case "inbox-remove":
      if (confirm("Beitrag aus der Inbox entfernen?")) { state.inbox = state.inbox.filter((i) => i.id !== id); save(); closeSheet(); render(); }
      break;
    case "pod-filter": ui.pod = el.dataset.k; render(); break;
    case "pod-reload": podData = null; render(); await loadPodcasts(true); toast("Liste aktualisiert"); break;
    case "ep-play": playEpisode(id); if (inSheet) closeSheet(); break;
    case "ep-open": openEpisode(id); break;
    case "ep-done": {
      const l = (state.listen[id] ||= {});
      l.done = !l.done; save(); closeSheet(); render(); break;
    }
    case "merker-play": {
      const j = state.journal.find((x) => x.id === id);
      if (j?.ref) { closeSheet(); playEpisode(j.ref.id, Math.max(0, (j.ref.time || 0) - 10)); }
      break;
    }
    case "pl-toggle": if (audio.src) { audio.paused ? audio.play() : audio.pause(); } else playEpisode(state.current); break;
    case "pl-back": seekBy(-15); break;
    case "pl-fwd": seekBy(30); break;
    case "pl-speed": cycleSpeed(); break;
    case "pl-mark": setMarker(); break;
    case "mk-save": saveMarker(); break;
    case "j-filter": ui.journal = el.dataset.k; render(); break;
    case "set-save": saveSettings(); break;
    case "backup-export": exportBackup(); break;
  }
});
$("#sheet").addEventListener("close", () => { sheetView = null; });
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.id === "in-url") { e.preventDefault(); $("[data-act='inbox-add']").click(); }
});

// ---------- Start ----------
(function handleShareParams() {
  const p = new URLSearchParams(location.search);
  const add = p.get("add") || p.get("url") || p.get("text");
  if (add) {
    const urls = extractUrls(add);
    const n = addToInbox(urls.map((url) => ({ url, title: p.get("title") || "" })));
    ui.tab = "inbox"; ui.feed = "links";
    setTimeout(() => toast(n ? "Beitrag gespeichert ✓" : "War schon in der Inbox"), 300);
    history.replaceState(null, "", location.pathname);
  }
})();
render();
loadPodcasts();
loadResearch();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
