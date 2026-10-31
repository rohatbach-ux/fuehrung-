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
  if (!x.quelle || !x.quelle.name) w("Quelle ohne Namen");
  else if (!lib && !/^https:\/\//.test(x.quelle.url || "")) w("Quelle ohne https-Link");
  else if (lib && x.quelle.url && /drive\.google|docs\.google/.test(x.quelle.url)) w("Drive-Link gehört nicht ins öffentliche Repo");
  if (!Array.isArray(x.karten) || x.karten.length < 1 || x.karten.length > 3 || x.karten.some((k) => !k.frage || !k.antwort)) w("Lernkarten: 1–3 mit frage/antwort");
  if ((x.titel || "").length > 70) w("Titel zu lang");
  if (ids.has(x.id)) w("doppelte id"); ids.add(x.id);
  if (x.quelle?.url && urls.has(x.quelle.url)) w("doppelte Quelle"); urls.add(x.quelle?.url);
}
if ((d.items || []).length > 200) err.push("mehr als 200 Einträge");
try {
  const dp = JSON.parse(await readFile("data/drive-processed.json", "utf8"));
  if (!Array.isArray(dp.dateien)) err.push("drive-processed: dateien fehlt");
  for (const f of dp.dateien || []) {
    if (!/^[0-9a-f]{12}$/.test(f.h || "")) err.push(`drive-processed: ungültiger Hash ${f.h}`);
    if (!["impuls", "uebersprungen"].includes(f.status)) err.push(`drive-processed: Status ${f.status}`);
    if (f.status === "uebersprungen" && f.titel) err.push("drive-processed: übersprungene Dateien ohne Titel speichern");
  }
} catch (e) { if (e.code !== "ENOENT") err.push("drive-processed.json nicht lesbar"); }
if (err.length) { console.error("FEHLER:\n" + err.join("\n")); process.exit(1); }
console.log(`OK – ${d.items.length} Einträge`);
