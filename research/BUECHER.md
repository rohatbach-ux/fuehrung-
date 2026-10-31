# Buchreihen aus öffentlichen Quellen

Diese Datei ergänzt `research/ANLEITUNG.md`. Von den **3 täglichen Web-Impulsen ist einer ein Buch-Teil** aus der Leseliste `data/buecher.json`; die anderen zwei bleiben freie Recherche.

## Grundsatz (Weg 1)

Rohat hat diese Bücher nicht als Datei vorliegen. Die Reihen entstehen **ausschließlich aus öffentlich zugänglichen Quellen**: Artikel, Essays und Interviews der Autoren, Vorträge und Podcast-Auftritte, Verlags- und Autorenseiten, seriöse Rezensionen und Fachartikel, frei verfügbare wissenschaftliche Arbeiten der Autoren.
- **Keine** Raubkopie-Seiten (z. B. LibGen, PDF Drive, Anna’s Archive, Z-Library) und keine illegal hochgeladenen Volltexte – auch nicht zum „nur Nachlesen“.
- Jeder Teil nennt eine konkrete, öffentlich erreichbare Quelle (`quelle.url`, https).
- In `deutsch` am Anfang des ersten Abschnitts kurz kenntlich machen, dass der Teil auf öffentlichen Quellen zum Buch beruht, nicht auf dem Buchtext selbst.
- Nichts erfinden: Was die Quellen nicht hergeben, nicht behaupten. Lieber eine Reihe mit 3 soliden Teilen als 5 dünne.

## Ablauf (als Teil des täglichen Recherche-Laufs)

1. `data/buecher.json` lesen. Bis zu **2 Bücher** sind gleichzeitig `in_arbeit`; täglich kommt **ein Teil** aus dem Buch, dessen letzter Teil am längsten zurückliegt (`zuletzt`).
2. Ist weniger als 2 Bücher in Arbeit, das nächste Buch mit `status: "offen"` (Listenreihenfolge) beginnen:
   - Zuerst recherchieren, was öffentlich zu den Kernideen des Buchs verfügbar ist.
   - Daraus einen **Plan mit 3–5 Teilen** schreiben (je Teil eine Kernidee, ein Modell oder ein Kapitelthema; bei 4 und mehr Teilen der letzte als **Transfer auf die IH** im Netz Hagen).
   - Plan in `data/buecher.json` eintragen, `status: "in_arbeit"`, `begonnen`.
3. Den Teil schreiben: Format und Gestaltung wie in `research/ANLEITUNG.md`, zusätzlich
   - `"herkunft": "buch"`, ID-Schema `buch-JJJJMMTT-n`,
   - `"reihe": { "buch": "<titel aus der Leseliste>", "teil": n, "von": Gesamtzahl }`,
   - `"quelle": { "name": "Medium – Autor/Titel des Beitrags (Bezug: Buchtitel)", "url": "https://…" }`,
   - Modul: das Modul der Leseliste oder ein besser passendes,
   - ab Teil 2 kurz an den vorigen Teil anknüpfen, nichts wiederholen,
   - kritisch einordnen („**Einordnung:**“ in `bezug_ih`): Was ist gut belegt, was umstritten?
4. Register aktualisieren: `impuls` des Plan-Teils, `zuletzt`; sind alle Teile veröffentlicht, `status: "fertig"`, `abgeschlossen`.
5. Prüfen mit `node scripts/validate-impulse.mjs`, dann gemeinsam mit den anderen Impulsen des Tages committen und pushen.

## Schema eines Buchs in `data/buecher.json`

```json
{
  "id": "intelligence-trap", "titel": "The Intelligence Trap", "autoren": "David Robson", "jahr": 2019,
  "modul": "urteil", "status": "in_arbeit", "begonnen": "JJJJ-MM-TT", "zuletzt": "JJJJ-MM-TT",
  "plan": [ { "teil": 1, "thema": "…", "impuls": "buch-JJJJMMTT-1" }, { "teil": 2, "thema": "…", "impuls": null } ]
}
```
