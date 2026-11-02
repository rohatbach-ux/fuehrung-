# Wöchentliche Buch-Zusammenfassungen

Diese Datei steuert die geplante Aufgabe „Führungskompass Zusammenfassungen“. Sie läuft **einmal pro Woche** (Sonntag früh) in der Claude-Code-Sitzung mit Zugriff auf Rohats Google Drive. Ergebnis: Einträge in `data/zusammenfassungen.json`, in der App unter *Entdecken → Zusammenfassungen*.

## Ziel

Rohat will sich das vollständige Lesen eines Buchs sparen können. Je Titel entsteht **eine Zusammenfassung auf Expertenniveau**:
- **höchstens 1–2 DIN-A4-Seiten** – Richtwert 700–1.100 Wörter (die Prüfung erlaubt 450–1.300),
- **nur die Literatur** – kein Bezug zur IH, zum Netz Hagen oder zu Rohats Rolle; den liefern die Buchreihen bereits,
- unter Einbezug **öffentlich zugänglicher Zusammenfassungen und Interpretationen** (Rezensionen, Fachbesprechungen, Interviews mit den Autoren).

## Welche Titel

1. Ordner „Führung DB“ (ID `1WhbUTR8qVYNXGpeRFzjAv8_8lJCS564t`) inklusive aller Unterordner rekursiv auflisten.
2. Als **Literatur** gelten Bücher, E-Books und buchartige Leitfäden. Keine Stellenbeschreibungen, Organigramme, Folienvorlagen oder Audio.
3. Erledigt ist ein Titel, wenn sein Kürzel (SHA-1 der Datei-ID, 12 Hex-Zeichen) als `drive_h` in `data/zusammenfassungen.json` steht.
4. **Je Lauf:** alle Neuzugänge seit dem letzten Lauf, dazu **bis zu 5 Titel aus dem Bestand** – Vorrang haben Bücher mit laufender oder abgeschlossener Buchreihe (`data/drive-processed.json`), dann die übrigen.
5. Dateien mit `"grund": "quelle"` oder `"grund": "herkunft_ungeklaert"` im Register `data/drive-processed.json` **nicht öffnen**. Für solche Titel darf eine Zusammenfassung **nur aus öffentlichen Quellen** entstehen (`"basis": "oeffentlich"`), wenn diese für Expertenniveau reichen – sonst auslassen.

## Arbeitsweise

1. Das Buch vollständig lesen (`read_file_content`; bricht der Text ab, PDF mit `download_file_content` laden, mit `pdftotext` lokal auslesen und die lokale Kopie danach löschen).
2. Mit der Websuche **öffentliche Zusammenfassungen und Interpretationen** suchen: Rezensionen großer Zeitungen und Fachzeitschriften, wissenschaftliche Besprechungen, Interviews und Vorträge der Autoren. Keine Raubkopie-Seiten, keine bezahlten Zusammenfassungsdienste abschreiben.
3. Zusammenfassen **in eigenen Worten**. Kurze, markierte Zitate sind erlaubt; keine längeren wörtlichen Passagen.
4. Nichts erfinden. Was weder im Buch noch in den Quellen steht, nicht behaupten.

## Aufbau des Texts (`text`, Markdown)

Gestaltungsregeln wie in `research/ANLEITUNG.md` (Überschriften mit Emoji, Fettungen, Listen, Tabellen wo sinnvoll, kurze Absätze). Feste Gliederung:

1. `## 🎯 Worum es geht` – Fragestellung, Anlass, Autor und Kontext in wenigen Sätzen
2. `## 🧭 Der Argumentationsgang` – die Teile oder Kapitel in ihrer Logik, knapp
3. `## 🧩 Zentrale Begriffe und Modelle` – die tragenden Konzepte, gern als Tabelle
4. `## 🔬 Belege und Methode` – worauf sich das Buch stützt (Studien, Fallbeispiele, Erfahrung)
5. `## 🗣️ Rezeption und Kritik` – wie das Buch öffentlich besprochen wurde, Stärken und Einwände, mit Quellenbezug
6. `## 📌 Was bleibt` – die drei bis fünf Kernaussagen, die man behalten sollte

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
  "text": "Markdown nach obiger Gliederung",
  "quellen": [{ "name": "Buch: Autor – Titel (Verlag, Jahr)", "url": "" }, { "name": "Rezension …", "url": "https://…" }]
}
```

Neue Einträge vorne einfügen, `updated` setzen. Danach `node scripts/validate-impulse.mjs` (muss „OK“ melden), nur `data/zusammenfassungen.json` committen („Zusammenfassungen: <Titel> (JJJJ-MM-TT)“), `git pull --rebase origin main`, `git push origin main`. Rohat hat das direkte Veröffentlichen auf main freigegeben.

Am Ende kurz melden: welche Titel neu zusammengefasst wurden und wie viele im Bestand noch offen sind.
