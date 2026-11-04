# fuehrung-

**Führungskompass**: eine Web-App (PWA) für das iPhone, die den Start als Leiter Instandhaltung im Netz Hagen begleitet. Ziele: das Netz in ruhigere Fahrwasser bringen und mit dem Team das WHY herausarbeiten – neben den operativen Brandherden.

## Was die App macht

| Bereich | Inhalt |
|---|---|
| **Heute** | Phase (0 Vorbereitung → 1 Ankommen & Stabilisieren → 2 Richtung & WHY → 3 Verankern), Leitfrage, drei Impulse pro Tag (Wissen, Frage, Ausprobieren), „Mehr Impulse“ auf Abruf, laufende Experimente, fällige Lernkarten, neue Podcast-Folgen, Wochenrückblick (Fr–So). |
| **Lernen** | 12 Module mit Kerngedanke, Bezug zur IH, Modellen, Praxisvorschlägen, Reflexionsfragen und Quellen. Lernkarten mit Wiederholung in wachsenden Abständen. Gemerkte Impulse. |
| **Entdecken** | Feed zum Wischen: deine aufbereiteten Instagram-Posts (aus Screenshots, übersetzt) und täglich 3 recherchierte Impulse. Je Eintrag: Kernaussage, deutscher Text, Bezug zur IH, Frage, Experiment, Lernkarten. Dazu der Merkzettel für Links. |
| **Hören** | Podcasts mit Standard-Tempo 1,5×, Position wird gemerkt, 📍 Merker mit Zeitstempel und Notiz, Sprung zur Stelle aus dem Journal. |
| **Journal** | Experimente mit Auswertung, Notizen, WHY-Bausteine, Podcast-Merker, Wochenrückblicke. |

Jeder Impuls, Beitrag, Merker und Eintrag hat dieselben Aktionen: ☆ Merken · ✍️ Notiz · 🧪 Testen (Experiment) · 📤 Copilot · 👎 Weniger.

**📤 Copilot:** Hauptweg ist „📧 An Diensthandy mailen“ an die in ⚙️ hinterlegte dienstliche Adresse (nur lokal gespeichert). Die App baut eine fertige Anfrage (Rolle, Ziele, Phase, Impuls, deine Gedanken, gewählte Vertiefungsart) und gibt sie über das iOS-Teilen-Menü weiter oder kopiert sie. Die Vertiefung im konkreten DB-Kontext passiert damit in Copilot, innerhalb der Unternehmensrichtlinien.

## Festigen und Copilot

- **🃏 Eigene Lernkarten:** Im Journal macht 🃏 aus einer Notiz eine Lernkarte (Vorder-/Rückseite, Modul). Sie läuft mit den übrigen Karten in der Wiederholung; verwalten unter *Lernen → Lernkarten*.
- **📦 Wochenpaket:** Im Journal (oder nach dem Wochenrückblick) bündelt die App alle Einträge der letzten 7 Tage – Rückblick, Notizen, WHY-Bausteine, Merker, Experimente, Gelesenes, Gemerktes, neue Karten – zu einer Mail ans Diensthandy.
- **🗺️ Agenda „ANTRITT HAGEN“:** Sonntags, dienstags, donnerstags und freitags ab 17 Uhr erinnert *Heute* an das Agenda-Update (auch im Journal). Es schickt den Gesamtstand – Experimente, WHY-Bausteine, neue Einträge, Lernstand, Buchreihen und Zusammenfassungen – mit Direktlinks in die App an die Dienstadresse. Copilot schreibt daraus die A4-Agenda „ANTRITT HAGEN“ fort und liefert Nachträge für die Seiten „HYPOTHESENBUCH HAGEN“ und „ZIELBILD HAGEN“ (Vorlagen und Regeln in der Notizbuch-Anweisung).
- **Direktlinks:** `…/fuehrung-/#zf=<id>` (Zusammenfassung), `#rx=<id>` (Beitrag oder Buchteil), `#modul=<id>`, `#tab=<heute|lernen|inbox|hoeren|journal>` öffnen die Stelle direkt – auch am Rechner im Browser. Persönliche Notizen bleiben auf dem iPhone.
- **Copilot-Notizbuch:** Einzelanfragen und Wochenpakete werden im Copilot-Notizbuch „Rohat Führung Notizbuch“ eingefügt. Die feste Anweisung dafür steht unter ⚙️ → *Copilot-Notizbuch* (Text in `js/content.js`, `COPILOT_NOTEBOOK_PROMPT`).

## Datenschutz

- Das Repo ist **öffentlich**. Es enthält deshalb nur allgemeine Inhalte, keine Interna, Namen oder Organigramme.
- Alles Persönliche (Notizen, Experimente, Inbox, „Mein Kontext“) liegt nur im `localStorage` des iPhones. Es gibt keinen Server.
- Sicherung: ⚙️ → *Sicherung exportieren* (z. B. nach iCloud Drive).

## Einrichtung

1. **GitHub Pages:** *Settings → Pages → Source: Deploy from a branch*, Branch `main`, Ordner `/ (root)`. Die App liegt dann unter `https://rohatbach-ux.github.io/fuehrung-/`.
2. **Auf dem iPhone:** URL in Safari öffnen → *Teilen* → *Zum Home-Bildschirm*.
3. **Podcasts:** Der Workflow *Podcasts aktualisieren* (`.github/workflows/podcasts.yml`) läuft täglich und bei Änderungen an `feeds/`. Unter *Actions* lässt er sich auch von Hand starten (*Run workflow*). Er schreibt `data/podcasts.json`.

### Instagram-Posts verarbeiten (über dein Claude-Abo, ohne Zusatzkosten)

1. Einmalig: In der App *Entdecken → ⚙️ Claude-Projekt → Anweisung kopieren*. In der Claude-App ein Projekt „Führungskompass-Posts“ anlegen und die Anweisung als Projektanweisung einfügen.
2. Pro Post: Screenshots machen → Claude-App → Projekt → Bilder anhängen → senden → Antwort kopieren.
3. In der App: *📸 Post verarbeiten → 📋 Ergebnis einfügen → Speichern*. Ältere Posts lassen sich in der Story unter *↻ Neues Ergebnis einfügen* aktualisieren.

Aufbereitete Texte sind Markdown (Zitatblock, Überschriften mit Emoji, Fettungen, Listen, Tabellen) und werden von `js/md.js` dargestellt. ⚙️ → *Corporate-Stil* blendet die Emojis aus. Screenshots können optional angehängt werden; sie bleiben nur auf dem iPhone (IndexedDB) und sind nicht in der Sicherung enthalten.

### Tägliche Recherche

Eine geplante Claude-Code-Aufgabe recherchiert jeden Morgen 3 Impulse und schreibt sie nach `data/impulse.json`. Regeln und Format: `research/ANLEITUNG.md`. Prüfung: `node scripts/validate-impulse.mjs`.

### Bibliothek aus Google Drive

Eine geplante Aufgabe in der Claude-Code-Sitzung mit Drive-Zugriff verarbeitet Rohats Drive-Ordner (inkl. Unterordner) **in Buchreihen**: Für jedes Dokument entsteht zuerst ein Lesekonzept aus Lerneinheiten, dann erscheinen täglich 2 Teile aus zwei verschiedenen Büchern (bis zu 3 Bücher im Wechsel, „📖 Teil x/y“), bei längeren Büchern mit Synthese am Ende. Neuzugänge werden ohne Rückfrage verarbeitet; gesperrt bleiben nur Dateien mit eindeutiger Raubkopie-Kennung (und größengleiche Kopien davon) sowie als vertraulich gekennzeichnete Dokumente. Regeln: `research/DRIVE.md`. Register mit Plänen: `data/drive-processed.json` (Dateien nur als Kürzel, keine Drive-Links).

### Buchreihen aus öffentlichen Quellen

Leseliste in `data/buecher.json` (derzeit Dörner, Rosenzweig, Page). Titel, die als gekaufte Datei im Drive liegen, laufen stattdessen als Bibliotheks-Reihe. Einer der 3 täglichen Web-Impulse ist ein Buch-Teil („📚 Buch kompakt“), erstellt nur aus öffentlich zugänglichen Quellen – keine Raubkopien. Regeln: `research/BUECHER.md`.

### Buch-Zusammenfassungen

Je Titel aus dem Drive-Ordner eine Zusammenfassung auf Expertenniveau in `data/zusammenfassungen.json`, in der App unter *Entdecken → Zusammenfassungen* und verlinkt aus der jeweiligen Buchreihe. Aufbau in **drei Lesetiefen**: ⚡ Kern in einer Minute (These, Kernaussagen, „Lohnt das Original?“), 🧭 Kapitel für Kapitel (ersetzt das Lesen, höchstens 2 DIN-A4-Seiten zusammen mit dem Kern), 🧰 Werkzeugkasten (Modelle, Listen, Belege; eingeklappt). Dazu 5–8 Lernkarten je Buch, die in die Wiederholung laufen, Querbezüge zwischen den Büchern und 🔊 Vorlesen mit der iPhone-Stimme im eingestellten Tempo. Nur die Literatur, mit öffentlichen Rezensionen und Interpretationen. Eine wöchentliche Aufgabe (sonntags) erstellt sie für Neuzugänge und arbeitet den Bestand ab. Regeln: `research/ZUSAMMENFASSUNG.md`.

### Links als Merkzettel

Instagram gibt gespeicherte Posts an keine fremde App heraus. Es gibt zwei Wege:

- **Einzeln:** Im Post *Teilen → Link kopieren*, in der App *Inbox → 📋* tippen.
- **Gesammelt:** Instagram → *Kontenübersicht → Deine Informationen herunterladen* → nur *Gespeicherte Inhalte*, Format **JSON**. ZIP in der Dateien-App entpacken, dann *Inbox → Sammelimport → Datei wählen* → `saved_posts.json`. Doppelte Beiträge werden übersprungen.

Hinweis: Die Home-Bildschirm-App und Safari haben auf dem iPhone getrennte Speicher. Links deshalb immer in der Home-Bildschirm-App einfügen.

### Podcasts ändern oder ergänzen

In `feeds/sources.json` eintragen. Fehlt `feed`, sucht das Skript die Feed-Adresse im Apple-Podcast-Verzeichnis (`search`) und nimmt den ersten Treffer, auf den `match` passt. Welche Kandidaten es gefunden hat, steht im Log des Workflows. Wird nichts gefunden, zeigt die App unter *Hören* einen Hinweis. Dann die Feed-Adresse direkt als `"feed": "https://…"` eintragen.

Abspielbar sind nur Podcasts mit öffentlichem RSS-Feed. Exklusive Inhalte von Amazon Music, Spotify oder Bezahl-Abos gehören nicht dazu.

## Technik

Statische Dateien ohne Build-Schritt: `index.html`, `css/styles.css`, `js/app.js` (UI, Speicher, Player), `js/content.js` (Phasen, Module, Impulse, Lernkarten, Copilot-Vorlagen), `sw.js` (Offline-Cache, bei Updates `VERSION` erhöhen), `scripts/fetch-feeds.mjs` (Feed-Abruf, Node 22, ohne Abhängigkeiten).

Inhalte erweitern: in `js/content.js` einem Modul weitere `modelle`, `praxis`, `fragen` oder `karten` hinzufügen. Daraus entstehen automatisch neue Impulse.
