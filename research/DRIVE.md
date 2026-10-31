# Tägliche Bibliotheks-Impulse aus Google Drive

Diese Datei steuert die geplante Aufgabe „Führungskompass Bibliothek“. Sie läuft täglich in der Claude-Code-Sitzung, die Zugriff auf Rohats Google Drive hat, und stellt **2 Impulse** aus seinem Ordner in `data/impulse.json`. Die App zeigt sie im Tab *Entdecken* als „📁 Bibliothek“.

## Quelle

Google-Drive-Ordner „Führung DB“ (ID `1WhbUTR8qVYNXGpeRFzjAv8_8lJCS564t`) **inklusive aller Unterordner**. Rohat lädt dort nach und nach weitere Inhalte hoch.

## Ablauf

1. Repository aktualisieren: `git checkout main && git pull --rebase origin main` (Pfad `/home/user/fuehrung-`; falls er fehlt, mit `add_repo` anhängen und klonen).
2. Ordner rekursiv auflisten (`search_files` mit `parentId = '…'` für den Hauptordner und jeden Unterordner, nur Metadaten).
3. Für jede Datei das Kürzel bilden: SHA-1 der Datei-ID, erste 12 Hex-Zeichen. Dateien, deren Kürzel in `data/drive-processed.json` steht, überspringen.
4. **Ausschließen** (als `uebersprungen` vermerken, **ohne Titel**, Inhalt nicht lesen):
   - dienstliche DB-Unterlagen: Organigramme, Stellenbeschreibungen, Unterlagen aus DB-Führungsprogrammen (z. B. „Strategische Weichenstellung“, „Führungskräfteentwicklung“), „Lean Exzellenz“, Rollenmodelle, alles mit DB-internen Namen, Kürzeln (z. B. „V.IW-…“) oder Personaldaten. Im Zweifel ausschließen.
   - Audio- und Videodateien (nicht auswertbar).
   - Dateien, die beim Lesen erkennbar dienstlich oder vertraulich sind – dann sofort abbrechen, nichts daraus verwenden.
5. **Auswahl:** zuerst Neuzugänge (jüngstes `createdTime`), sonst die Datei, die am besten zur aktuellen Phase passt (siehe `research/ANLEITUNG.md`, Abschnitt Phase). Insgesamt **2 Impulse pro Tag**. Ein sehr umfangreiches Buch darf an mehreren Tagen je einen Impuls zu einem anderen Kapitel liefern; dann `status: "impuls"` mit mehreren Einträgen in `impulse` und dem Feld `"offen": true`, bis es ausgeschöpft ist.
6. **Lesen** mit `read_file_content`. Große Dateien: Inhaltsverzeichnis und die relevanten Kapitel auswerten.
7. **Impuls schreiben** – gleiches Format und gleiche Gestaltungsregeln wie in `research/ANLEITUNG.md`, zusätzlich:
   - `"herkunft": "drive"`, ID-Schema `drive-JJJJMMTT-n`.
   - `"quelle": { "name": "Autor – Titel (Verlag, Jahr)", "url": "" }` – **niemals** einen Drive-Link eintragen, das Repo ist öffentlich.
   - In eigenen Worten zusammenfassen, keine längeren wörtlichen Passagen (Urheberrecht). Kurze, markierte Zitate sind in Ordnung.
   - Kritisch einordnen: Was ist Erfahrungswissen, was belegt? Was passt nicht zur DB (z. B. Compliance, Mitbestimmung)? Gehört als eigener Stichpunkt „**Einordnung:**“ in `bezug_ih`.
   - Nichts über die DB oder das Netz Hagen behaupten, was nicht öffentlich belegt ist.
8. `data/drive-processed.json` ergänzen: `{ "h": "<Kürzel>", "titel": "<Dateiname>", "datum": "JJJJ-MM-TT", "status": "impuls", "impulse": ["drive-…"] }`.
9. Prüfen: `node scripts/validate-impulse.mjs` muss „OK“ melden.
10. Veröffentlichen auf `main` (Freigabe von Rohat liegt vor): nur `data/impulse.json` und `data/drive-processed.json` committen, Nachricht „Bibliothek: 2 Impulse (JJJJ-MM-TT)“, dann `git pull --rebase origin main` und `git push origin main`.
11. Sind alle Dateien verarbeitet, nichts erfinden – kurz melden, dass die Bibliothek ausgeschöpft ist, bis Rohat Neues hochlädt.
