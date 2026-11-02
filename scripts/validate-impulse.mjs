// Prüft data/impulse.json auf das Format, das die App erwartet.
import { readFile } from "node:fs/promises";
const MODS = ["uebergang", "stabil", "why", "strategie", "umsetzung", "kultur", "sicherheit", "fk", "gespraeche", "selbst", "change", "schnittstellen", "urteil"];
const d = JSON.parse(await readFile("data/impulse.json", "utf8"));
const err = [];
if (!Array.isArray(d.items)) err.push("items fehlt");
const ids = new Set(), urls = new Set();
for (const [i, x] of (d.items || []).entries()) {
  const w = (m) => err.push(`#${i} ${x.id || "?"}: ${m}`);
  for (const f of ["id", "date", "titel", "kernaussage", "deutsch", "modul", "bezug_ih", "frage", "experiment"]) if (typeof x[f] !== "string" || !x[f].trim()) w(`Feld ${f} fehlt`);
  if (!MODS.includes(x.modul)) w(`unbekanntes Modul ${x.modul}`);
  if (!/^\d{4}-\d{2}-\d{2}/.test(x.date || "")) w("Datum ungültig");
  const lib = x.herkunft === "drive";
  if (x.herkunft && !["drive", "buch"].includes(x.herkunft)) w("unbekannte herkunft");
  if (x.herkunft === "buch" && !x.reihe) w("Buch-Teil ohne reihe");
  if (x.herkunft === "buch" && /libgen|library\.lol|pdfdrive|annas-archive|z-lib|zlibrary/i.test(x.quelle?.url || "")) w("unzulässige Quelle (Raubkopie-Seite)");
  if (x.reihe && (!x.reihe.buch || !(x.reihe.teil >= 1) || !(x.reihe.von >= x.reihe.teil))) w("reihe unvollständig (buch, teil, von)");
  if (!x.quelle || !x.quelle.name) w("Quelle ohne Namen");
  else if (!lib && !/^https:\/\//.test(x.quelle.url || "")) w("Quelle ohne https-Link");
  else if (lib && x.quelle.url && /drive\.google|docs\.google/.test(x.quelle.url)) w("Drive-Link gehört nicht ins öffentliche Repo");
  if (!Array.isArray(x.karten) || x.karten.length < 1 || x.karten.length > 3 || x.karten.some((k) => !k.frage || !k.antwort)) w("Lernkarten: 1–3 mit frage/antwort");
  if ((x.titel || "").length > 70) w("Titel zu lang");
  if (ids.has(x.id)) w("doppelte id"); ids.add(x.id);
  if (x.quelle?.url && urls.has(x.quelle.url)) w("doppelte Quelle"); urls.add(x.quelle?.url);
}
const perDay = {};
for (const x of d.items || []) {
  if (!["drive", "buch"].includes(x.herkunft) || !x.reihe) continue;
  const k = `${x.date}|${x.reihe.buch}`;
  if (perDay[k]) err.push(`${x.id}: zweiter Teil von „${x.reihe.buch}“ am ${x.date} – pro Buch höchstens ein Teil pro Tag`);
  perDay[k] = true;
}
try {
  const bl = JSON.parse(await readFile("data/buecher.json", "utf8"));
  const ids = new Set((d.items || []).map((x) => x.id));
  let active = 0;
  for (const b of bl.buecher || []) {
    const w = (m) => err.push(`buecher ${b.id}: ${m}`);
    if (!b.id || !b.titel || !b.autoren || !MODS.includes(b.modul)) w("id/titel/autoren/modul unvollständig");
    if (!["offen", "in_arbeit", "fertig"].includes(b.status)) w(`Status ${b.status}`);
    if (b.status === "in_arbeit") active++;
    if (b.status !== "offen" && (!Array.isArray(b.plan) || b.plan.length < 3 || b.plan.length > 6)) w("Plan mit 3–6 Teilen fehlt");
    (b.plan || []).forEach((s, i) => {
      if (s.teil !== i + 1 || !s.thema) w(`Plan-Teil ${i + 1} unvollständig`);
      if (s.impuls && !ids.has(s.impuls)) w(`Impuls ${s.impuls} fehlt in impulse.json`);
    });
    if (b.status === "fertig" && (b.plan || []).some((s) => !s.impuls)) w("fertig, aber Teile offen");
  }
  if (active > 2) err.push(`buecher: ${active} Bücher in Arbeit – höchstens 2`);
} catch (e) { if (e.code !== "ENOENT") err.push("buecher.json nicht lesbar: " + e.message); }
try {
  const zf = JSON.parse(await readFile("data/zusammenfassungen.json", "utf8"));
  const zids = new Set();
  for (const z of zf.items || []) {
    const w = (m) => err.push(`zusammenfassung ${z.id || "?"}: ${m}`);
    for (const f of ["id", "date", "titel", "autoren", "kernthese", "text"]) if (!z[f] || !String(z[f]).trim()) w(`Feld ${f} fehlt`);
    if (z.modul && !MODS.includes(z.modul)) w(`unbekanntes Modul ${z.modul}`);
    const wc = (t) => String(t || "").split(/\s+/).filter(Boolean).length;
    const words = wc(z.text);
    if (words < 500 || words > 1000) w(`Tiefe 2 (text): ${words} Wörter – erlaubt 500–1000`);
    if (/^\s*\|/m.test(z.text || "")) w("Tiefe 2 (text) ohne Tabellen – wird vorgelesen");
    const k = z.kern || {};
    if (!Array.isArray(k.aussagen) || k.aussagen.length < 3 || k.aussagen.length > 5 || k.aussagen.some((a) => !String(a).trim())) w("Tiefe 1: kern.aussagen mit 3–5 Sätzen fehlt");
    if (!String(k.original || "").trim()) w("Tiefe 1: kern.original fehlt");
    const kw = wc(z.kernthese) + wc((k.aussagen || []).join(" ")) + wc(k.original);
    if (kw > 220) w(`Tiefe 1: ${kw} Wörter – höchstens 220`);
    if (words + kw > 1150) w(`Tiefe 1+2: ${words + kw} Wörter – höchstens 1150 (2 DIN-A4-Seiten)`);
    const tw = wc(z.werkzeuge);
    if (tw < 150 || tw > 900) w(`Tiefe 3 (werkzeuge): ${tw} Wörter – erlaubt 150–900`);
    if (!Array.isArray(z.karten) || z.karten.length < 5 || z.karten.length > 8) w("5–8 Lernkarten fehlen");
    for (const c of z.karten || []) if (!c.frage || !c.antwort) w("Lernkarte ohne frage/antwort");
    for (const b of z.bezuege || []) {
      if (!b.titel || !b.text || !["stuetzt", "widerspricht", "ergaenzt"].includes(b.art)) w("Querbezug unvollständig (titel, art stuetzt|widerspricht|ergaenzt, text)");
      if (b.id && !(zf.items || []).some((y) => y.id === b.id)) w(`Querbezug auf unbekannte id ${b.id}`);
      if (b.id === z.id) w("Querbezug auf sich selbst");
    }
    if (!Array.isArray(z.quellen) || !z.quellen.length) w("Quellen fehlen");
    for (const q of z.quellen || []) {
      if (!q.name) w("Quelle ohne Namen");
      if (q.url && !/^https:\/\//.test(q.url)) w("Quelle ohne https");
      if (/drive\.google|docs\.google|libgen|library\.lol|pdfdrive|annas-archive|z-lib|zlibrary/i.test(q.url || "")) w("unzulässige Quelle");
    }
    if (zids.has(z.id)) w("doppelte id"); zids.add(z.id);
  }
} catch (e) { if (e.code !== "ENOENT") err.push("zusammenfassungen.json nicht lesbar: " + e.message); }
if ((d.items || []).length > 200) err.push("mehr als 200 Einträge");
try {
  const dp = JSON.parse(await readFile("data/drive-processed.json", "utf8"));
  const ids = new Set((d.items || []).map((x) => x.id));
  if (!Array.isArray(dp.dateien)) err.push("drive-processed: dateien fehlt");
  let activeBooks = 0;
  for (const f of dp.dateien || []) {
    const w = (m) => err.push(`drive-processed ${f.h}: ${m}`);
    if (!/^[0-9a-f]{12}$/.test(f.h || "")) w("ungültiger Hash");
    if (!["in_arbeit", "fertig", "uebersprungen"].includes(f.status)) w(`Status ${f.status}`);
    if (f.status === "uebersprungen") { if (f.titel) w("übersprungene Dateien ohne Titel speichern"); continue; }
    if (!f.buch || !Array.isArray(f.plan) || !f.plan.length) { w("buch/plan fehlt"); continue; }
    f.plan.forEach((s, i) => {
      if (s.teil !== i + 1 || !s.thema) w(`Plan-Teil ${i + 1} unvollständig`);
      if (s.impuls && !ids.has(s.impuls)) w(`Impuls ${s.impuls} fehlt in impulse.json`);
    });
    const done = f.plan.every((s) => s.impuls);
    if (f.status === "in_arbeit") activeBooks++;
    if (f.status === "fertig" && !done) w("als fertig markiert, aber Teile offen");
    if (f.status === "in_arbeit" && done) w("alle Teile erledigt – Status auf fertig setzen");
  }
  if (activeBooks > 3) err.push(`drive-processed: ${activeBooks} Bücher in Arbeit – höchstens 3`);
} catch (e) { if (e.code !== "ENOENT") err.push("drive-processed.json nicht lesbar: " + e.message); }
if (err.length) { console.error("FEHLER:\n" + err.join("\n")); process.exit(1); }
console.log(`OK – ${d.items.length} Einträge`);
