# Tägliche Bibliotheks-Impulse aus Google Drive

Diese Datei steuert die geplante Aufgabe „Führungskompass Bibliothek“. Sie läuft täglich in der Claude-Code-Sitzung mit Zugriff auf Rohats Google Drive und stellt **2 Impulse** in `data/impulse.json`. Die App zeigt sie im Tab *Entdecken* als „📁 Bibliothek“, mit „📖 Teil x/y“.

## Leitidee: gründlich statt schnell

Rohat will **nicht** möglichst viel Material im Schnelldurchlauf, sondern jedes Dokument **wirklich verarbeiten**: so spezifisch wie nötig, ohne wertvollen Inhalt auszulassen. Deshalb wird jedes Buch in eine **Reihe** von Lerneinheiten zerlegt und Teil für Teil veröffentlicht.

## Quelle

Google-Drive-Ordner „Führung DB“ (ID `1WhbUTR8qVYNXGpeRFzjAv8_8lJCS564t`) **inklusive aller Unterordner**. Rohat lädt nur Dateien hoch, die für diesen Gebrauch vorgesehen sind – auch die DB-Unterlagen im Ordner sind ausdrücklich freigegeben.

## Ablauf je Lauf

1. Repository aktualisieren: `git checkout main && git pull --rebase origin main` (Pfad `/home/user/fuehrung-`; falls er fehlt, mit `add_repo` anhängen und klonen).
2. `data/drive-processed.json` lesen. Gibt es ein Buch mit `status: "in_arbeit"`, **damit weitermachen** (nächste offene Teile in Planreihenfolge).
3. Nur wenn kein Buch in Arbeit ist: **neues Buch wählen.**
   - Ordner rekursiv auflisten (`search_files` mit `parentId = '…'`, nur Metadaten). Kürzel je Datei: SHA-1 der Datei-ID, erste 12 Hex-Zeichen. Dateien, deren Kürzel im Register steht, sind erledigt.
   - Vorrang: Neuzugänge (jüngstes `createdTime`), sonst das Dokument, das am besten zur aktuellen Phase passt (Phasen siehe `research/ANLEITUNG.md`).
   - Audio- und Videodateien als `uebersprungen` vermerken (ohne Titel, `"grund": "audio"`).
   - Trägt ein Dokument selbst eine Kennzeichnung wie „vertraulich“, „streng vertraulich“ oder „nur für den Dienstgebrauch“: nicht verarbeiten, als `uebersprungen` (ohne Titel) vermerken und es Rohat in der Zusammenfassung melden.
4. **Lesekonzept für ein neues Buch erstellen** (bevor der erste Teil geschrieben wird):
   - Das ganze Dokument lesen (`read_file_content`; große Dateien in Abschnitten auswerten). Inhaltsverzeichnis, alle Kapitel, Tabellen, Checklisten, Beispiele und Übungen erfassen.
   - In **Lerneinheiten** gliedern: je Einheit ein in sich geschlossenes, konkretes Thema (meist ein Kapitel oder Unterkapitel; lange Kapitel teilen, sehr kurze zusammenfassen). Richtwert: so viele Teile, wie das Buch an Substanz hat – bei kurzen E-Books oft 4–8, bei Fachbüchern mehr.
   - **Nichts Wertvolles weglassen:** Modelle, Listen, Werkzeuge, Fragenkataloge, Beispiele und Übungen gehören in eine Einheit. Weglassen nur Werbung, Autorenvita, leere Formulare und reine Wiederholungen.
   - Bei Büchern mit 5 oder mehr Teilen: als letzten Teil eine **Synthese** (Kernideen der Reihe, Transfer in den Führungsalltag in der IH, offene Fragen).
   - Plan ins Register schreiben (Schema unten), `status: "in_arbeit"`.
5. **2 Teile schreiben** (aus dem laufenden Buch; ist es nach dem ersten Teil abgeschlossen, darf der zweite Teil der Auftakt des nächsten Buchs sein).
6. **Format** wie in `research/ANLEITUNG.md` (Felder und Gestaltungsregeln), zusätzlich:
   - `"herkunft": "drive"`, ID-Schema `drive-JJJJMMTT-n`.
   - `"reihe": { "buch": "Kurztitel des Buchs", "teil": n, "von": Gesamtzahl }`.
   - `"quelle": { "name": "Autor – Titel (Verlag, Jahr), Kapitel …", "url": "" }` – **niemals** einen Drive-Link eintragen, das Repo ist öffentlich.
   - **Spezifisch statt allgemein:** die konkreten Inhalte des Kapitels wiedergeben (Modelle, Schritte, Listen, Beispiele, Zahlen), vollständig für diese Einheit. Tabellen und Listen des Buchs als Tabelle/Liste übernehmen, in eigenen Worten.
   - **Anschluss halten:** Ab Teil 2 im ersten Abschnitt in einem Satz an den vorigen Teil anknüpfen; keine Wiederholung bereits behandelter Inhalte.
   - Urheberrecht: zusammenfassen und strukturieren, keine längeren wörtlichen Passagen; kurze, markierte Zitate sind in Ordnung.
   - Kritisch einordnen (`bezug_ih`, Stichpunkt „**Einordnung:**“): Was ist Erfahrungswissen, was belegt? Was passt nicht zur DB (z. B. Compliance, Mitbestimmung)?
   - Lernkarten 1–3 je Teil, nur zu Inhalten dieses Teils.
7. **Register aktualisieren:** `impuls` des Plan-Teils setzen; sind alle Teile veröffentlicht, `status: "fertig"` und `"abgeschlossen": "JJJJ-MM-TT"`.
8. **Prüfen:** `node scripts/validate-impulse.mjs` muss „OK“ melden.
9. **Veröffentlichen** auf `main` (Freigabe von Rohat liegt vor): nur `data/impulse.json` und `data/drive-processed.json` committen, Nachricht „Bibliothek: <Kurztitel> Teil x–y (JJJJ-MM-TT)“, dann `git pull --rebase origin main` und `git push origin main`.
10. Ist die Bibliothek ausgeschöpft: nichts erfinden, kurz melden.

## Register-Schema (`data/drive-processed.json`)

```json
{
  "h": "12 Hex-Zeichen",
  "titel": "Dateiname",
  "buch": "Autor – Titel (Verlag, Jahr)",
  "status": "in_arbeit",
  "begonnen": "JJJJ-MM-TT",
  "plan": [
    { "teil": 1, "thema": "…", "kapitel": "1–3", "impuls": "drive-JJJJMMTT-1" },
    { "teil": 2, "thema": "…", "kapitel": "4", "impuls": null }
  ]
}
```

Die Plan-Themen sollen so konkret sein, dass man daran sieht, welche Inhalte des Buchs wohin gehören.
