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
  if (!x.quelle || !/^https:\/\//.test(x.quelle.url || "") || !x.quelle.name) w("Quelle unvollständig");
  if (!Array.isArray(x.karten) || x.karten.length < 1 || x.karten.length > 3 || x.karten.some((k) => !k.frage || !k.antwort)) w("Lernkarten: 1–3 mit frage/antwort");
  if ((x.titel || "").length > 70) w("Titel zu lang");
  if (ids.has(x.id)) w("doppelte id"); ids.add(x.id);
  if (x.quelle?.url && urls.has(x.quelle.url)) w("doppelte Quelle"); urls.add(x.quelle?.url);
}
if ((d.items || []).length > 120) err.push("mehr als 120 Einträge");
if (err.length) { console.error("FEHLER:\n" + err.join("\n")); process.exit(1); }
console.log(`OK – ${d.items.length} Einträge`);
