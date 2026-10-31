// Prüft data/impulse.json auf das Format, das die App erwartet.
import { readFile } from "node:fs/promises";
const MODS = ["uebergang", "stabil", "why", "strategie", "umsetzung", "kultur", "sicherheit", "fk", "gespraeche", "selbst", "change", "schnittstellen"];
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
  if (x.herkunft && !lib) w("unbekannte herkunft");
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
  if (x.herkunft !== "drive" || !x.reihe) continue;
  const k = `${x.date}|${x.reihe.buch}`;
  if (perDay[k]) err.push(`${x.id}: zweiter Teil von „${x.reihe.buch}“ am ${x.date} – pro Buch höchstens ein Teil pro Tag`);
  perDay[k] = true;
}
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
