# Wöchentliche Buch-Zusammenfassungen

Diese Datei steuert die geplante Aufgabe „Führungskompass Zusammenfassungen“. Sie läuft **einmal pro Woche** (Sonntag früh) in der Claude-Code-Sitzung mit Zugriff auf Rohats Google Drive. Ergebnis: Einträge in `data/zusammenfassungen.json`, in der App unter *Entdecken → Zusammenfassungen*.

## Ziel

Rohat will sich das vollständige Lesen eines Buchs sparen können. Je Titel entsteht **eine Zusammenfassung auf Expertenniveau in drei Lesetiefen** (von Rohat am 02.11.2026 freigegeben):

| Tiefe | Feld | Umfang | Inhalt |
|---|---|---|---|
| **1 · Kern** | `kernthese`, `kern` | ~150 Wörter | These in einem Satz, 3–5 Kernaussagen, Urteil „Lohnt das Original?“ mit konkreten Kapiteln |
| **2 · Kapitelübersicht** | `text` | 500–1.000 Wörter | je Kapitel bzw. Buchteil: Behauptung → Beleg → Folgerung; stärkstes und schwächstes Argument mit Rezensionsbezug |
| **3 · Werkzeugkasten** | `werkzeuge` | 150–900 Wörter, in der App eingeklappt | die Modelle, Listen, Fragenkataloge und Unterscheidungen des Buchs vollständig; zentrale Studien mit ihrem Stand |

Dazu **5–8 Lernkarten** (`karten`, laufen automatisch in Rohats Wiederholung) und **Querbezüge** zu anderen Büchern der Bibliothek (`bezuege`).

Rahmen:
- Tiefe 1 und 2 zusammen höchstens **1–2 DIN-A4-Seiten**; Tiefe 3 kommt eingeklappt dazu.
- **Nur die Literatur** – kein Bezug zur IH, zum Netz Hagen oder zu Rohats Rolle; den liefern die Buchreihen.
- Unter Einbezug **öffentlich zugänglicher Zusammenfassungen und Interpretationen** (Rezensionen, Fachbesprechungen, Interviews mit den Autoren).
- Tiefe 1 und 2 werden in der App auch **vorgelesen** – deshalb ganze Sätze, keine Tabellen in `text`, Abkürzungen ausschreiben.

## Welche Titel

1. Ordner „Führung DB“ (ID `1WhbUTR8qVYNXGpeRFzjAv8_8lJCS564t`) inklusive aller Unterordner rekursiv auflisten.
2. Als **Literatur** gelten Bücher, E-Books und buchartige Leitfäden. Keine Stellenbeschreibungen, Organigramme, Folienvorlagen oder Audio.
3. Erledigt ist ein Titel, wenn sein Kürzel (SHA-1 der Datei-ID, 12 Hex-Zeichen) als `drive_h` in `data/zusammenfassungen.json` steht.
4. **Je Lauf:** alle Neuzugänge seit dem letzten Lauf, dazu **bis zu 5 Titel aus dem Bestand** – Vorrang haben Bücher mit laufender oder abgeschlossener Buchreihe (`data/drive-processed.json`), dann die übrigen.
5. Neuzugänge ohne Rückfrage verarbeiten. Nur Dateien mit `"grund": "quelle"` im Register `data/drive-processed.json` (eindeutige Raubkopie-Kennung oder größengleiche Kopie) **nicht öffnen**. Für solche Titel darf eine Zusammenfassung **nur aus öffentlichen Quellen** entstehen (`"basis": "oeffentlich"`), wenn diese für Expertenniveau reichen – sonst auslassen.

## Arbeitsweise

1. Das Buch vollständig lesen: PDF mit `download_file_content` laden, mit `pdftotext` lokal auslesen und die lokale Kopie danach löschen. **Grenze des Drive-Zugriffs:** PDFs über etwa 5 MB lassen sich nicht herunterladen, und `read_file_content` liefert bei langen Büchern nur rund das erste Viertel. Dann den gelieferten Teil vollständig auswerten, die übrigen Kapitel aus Inhaltsverzeichnis und öffentlichen Quellen erschließen und das in der ersten Quelle vermerken („Kapitel x–y im Volltext ausgewertet, übrige aus …“). Liefert die Datei gar keinen Text (Bild-PDF), `"basis": "oeffentlich"` setzen und es in `kern.original` sagen.
2. Mit der Websuche **öffentliche Zusammenfassungen und Interpretationen** suchen: Rezensionen großer Zeitungen und Fachzeitschriften, wissenschaftliche Besprechungen, Interviews und Vorträge der Autoren. Keine Raubkopie-Seiten, keine bezahlten Zusammenfassungsdienste abschreiben.
3. Zusammenfassen **in eigenen Worten**. Kurze, markierte Zitate sind erlaubt; keine längeren wörtlichen Passagen.
4. Nichts erfinden. Was weder im Buch noch in den Quellen steht, nicht behaupten.

## Aufbau

Gestaltungsregeln wie in `research/ANLEITUNG.md` (Überschriften mit Emoji, Fettungen, kurze Absätze).

**Tiefe 1 – `kernthese` und `kern`**
- `kernthese`: die zentrale These in einem Satz.
- `kern.aussagen`: 3–5 Kernaussagen, je ein Satz, so formuliert, dass man sie behalten und weitersagen kann.
- `kern.original`: 2–3 Sätze – lohnt das Original, für wen, und welche Kapitel konkret (z. B. „Kapitel 4 und 9 lohnen im Original, der Rest ist durch diese Zusammenfassung abgedeckt“).

**Tiefe 2 – `text` (Markdown, vorlesbar, keine Tabellen)**
1. `## 🎯 Worum es geht` – Fragestellung, Autor und Kontext, 2–4 Sätze
2. `## 🧭 Kapitel für Kapitel` – je Kapitel oder Buchteil ein Absatz, beginnend mit **fettem Kapitelnamen**: Was wird behauptet, worauf stützt es sich, was folgt daraus. Kurze Kapitel dürfen zusammengefasst werden; kein tragendes Kapitel auslassen.
3. `## ⚖️ Stärkstes und schwächstes Argument` – je ein Absatz, mit Bezug auf Rezensionen und Kritik (Quelle nennen)
4. `## 🗣️ Rezeption` – 2–4 Sätze, wie das Buch aufgenommen wurde

**Tiefe 3 – `werkzeuge` (Markdown, Tabellen erwünscht)**
- `## 🧰 Modelle und Unterscheidungen` – die tragenden Begriffe als Tabelle (Begriff · Bedeutung · Beispiel aus dem Buch)
- `## ✅ Listen und Fragen` – Checklisten, Regeln, Fragenkataloge des Buchs vollständig, in eigenen Worten
- `## 🔬 Belege und ihr Stand` – zentrale Studien oder Fälle, je mit Stand (bestätigt · umstritten · widerlegt), soweit öffentlich bekannt

**Lernkarten – `karten`**: 5–8 Karten `{ "frage": "…", "antwort": "…" }` zu den wichtigsten Begriffen und Aussagen; Antwort höchstens 2 Sätze.

**Querbezüge – `bezuege`**: 1–4 Einträge zu anderen Büchern der Bibliothek oder der Leseliste, die die These stützen, ihr widersprechen oder sie ergänzen. `{ "id": "zf-… (wenn es die Zusammenfassung schon gibt)", "titel": "Autor – Titel", "art": "stuetzt | widerspricht | ergaenzt", "text": "ein Satz, worin" }`. Nur echte inhaltliche Bezüge, keine bloße Themenverwandtschaft. Beim Anlegen einer neuen Zusammenfassung prüfen, ob ältere Einträge einen Rückbezug bekommen sollten, und ihn dort ergänzen.

## Eintrag in `data/zusammenfassungen.json`

```json
{
  "id": "zf-<kurzname>",
  "date": "JJJJ-MM-TT",
  "titel": "Buchtitel",
  "autoren": "Autor(en)",
  "jahr": 2018,
  "verlag": "Verlag",
  "basis": "buch | oeffentlich",
  "drive_h": "12 Hex-Zeichen oder leer",
  "reihe": "Kurztitel der Buchreihe, falls vorhanden (wie reihe.buch in impulse.json)",
  "modul": "passende Modul-ID (nur zur Einordnung in der App)",
  "kernthese": "die zentrale These in einem Satz",
  "kern": { "aussagen": ["…", "…", "…"], "original": "…" },
  "text": "Tiefe 2, Markdown nach obiger Gliederung",
  "werkzeuge": "Tiefe 3, Markdown",
  "karten": [{ "frage": "…", "antwort": "…" }],
  "bezuege": [{ "id": "zf-…", "titel": "Autor – Titel", "art": "ergaenzt", "text": "…" }],
  "quellen": [{ "name": "Buch: Autor – Titel (Verlag, Jahr)", "url": "" }, { "name": "Rezension …", "url": "https://…" }]
}
```

Neue Einträge vorne einfügen, `updated` setzen. Danach `node scripts/validate-impulse.mjs` (muss „OK“ melden), nur `data/zusammenfassungen.json` committen („Zusammenfassungen: <Titel> (JJJJ-MM-TT)“), `git pull --rebase origin main`, `git push origin main`. Rohat hat das direkte Veröffentlichen auf main freigegeben.

Am Ende kurz melden: welche Titel neu zusammengefasst wurden und wie viele im Bestand noch offen sind.
