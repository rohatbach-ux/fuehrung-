# fuehrung-

**Führungskompass**: eine Web-App (PWA) für das iPhone, die den Start als Leiter Instandhaltung im Netz Hagen begleitet. Ziele: das Netz in ruhigere Fahrwasser bringen und mit dem Team das WHY herausarbeiten – neben den operativen Brandherden.

## Was die App macht

| Bereich | Inhalt |
|---|---|
| **Heute** | Phase (0 Vorbereitung → 1 Ankommen & Stabilisieren → 2 Richtung & WHY → 3 Verankern), Leitfrage, drei Impulse pro Tag (Wissen, Frage, Ausprobieren), „Mehr Impulse“ auf Abruf, laufende Experimente, fällige Lernkarten, neue Podcast-Folgen, Wochenrückblick (Fr–So). |
| **Lernen** | 12 Module mit Kerngedanke, Bezug zur IH, Modellen, Praxisvorschlägen, Reflexionsfragen und Quellen. Lernkarten mit Wiederholung in wachsenden Abständen. Gemerkte Impulse. |
| **Inbox** | Gespeicherte Instagram-Posts und Links. Je Beitrag: Kernaussage in einem Satz, Modul-Zuordnung, daraus Experiment oder Copilot-Anfrage. |
| **Hören** | Podcasts mit Standard-Tempo 1,5×, Position wird gemerkt, 📍 Merker mit Zeitstempel und Notiz, Sprung zur Stelle aus dem Journal. |
| **Journal** | Experimente mit Auswertung, Notizen, WHY-Bausteine, Podcast-Merker, Wochenrückblicke. |

Jeder Impuls, Beitrag, Merker und Eintrag hat dieselben Aktionen: ☆ Merken · ✍️ Notiz · 🧪 Testen (Experiment) · 📤 Copilot · 👎 Weniger.

**📤 Copilot:** Die App baut eine fertige Anfrage (Rolle, Ziele, Phase, Impuls, deine Gedanken, gewählte Vertiefungsart) und gibt sie über das iOS-Teilen-Menü weiter oder kopiert sie. Die Vertiefung im konkreten DB-Kontext passiert damit in Copilot, innerhalb der Unternehmensrichtlinien.

## Datenschutz

- Das Repo ist **öffentlich**. Es enthält deshalb nur allgemeine Inhalte, keine Interna, Namen oder Organigramme.
- Alles Persönliche (Notizen, Experimente, Inbox, „Mein Kontext“) liegt nur im `localStorage` des iPhones. Es gibt keinen Server.
- Sicherung: ⚙️ → *Sicherung exportieren* (z. B. nach iCloud Drive).

## Einrichtung

1. **GitHub Pages:** *Settings → Pages → Source: Deploy from a branch*, Branch `main`, Ordner `/ (root)`. Die App liegt dann unter `https://rohatbach-ux.github.io/fuehrung-/`.
2. **Auf dem iPhone:** URL in Safari öffnen → *Teilen* → *Zum Home-Bildschirm*.
3. **Podcasts:** Der Workflow *Podcasts aktualisieren* (`.github/workflows/podcasts.yml`) läuft täglich und bei Änderungen an `feeds/`. Unter *Actions* lässt er sich auch von Hand starten (*Run workflow*). Er schreibt `data/podcasts.json`.

### Instagram-Posts in die App bringen

Instagram gibt gespeicherte Posts an keine fremde App heraus. Es gibt zwei Wege:

- **Einzeln:** Im Post *Teilen → Link kopieren*, in der App *Inbox → 📋* tippen.
- **Gesammelt:** Instagram → *Kontenübersicht → Deine Informationen herunterladen* → nur *Gespeicherte Inhalte*, Format **JSON**. ZIP in der Dateien-App entpacken, dann *Inbox → Sammelimport → Datei wählen* → `saved_posts.json`. Doppelte Beiträge werden übersprungen.

Hinweis: Die Home-Bildschirm-App und Safari haben auf dem iPhone getrennte Speicher. Links deshalb immer in der Home-Bildschirm-App einfügen.

### Podcasts ändern oder ergänzen

In `feeds/sources.json` eintragen. Fehlt `feed`, sucht das Skript die Feed-Adresse im Apple-Podcast-Verzeichnis (`search`) und nimmt den ersten Treffer, auf den `match` passt. Welche Kandidaten es gefunden hat, steht im Log des Workflows. Wird nichts gefunden, zeigt die App unter *Hören* einen Hinweis. Dann die Feed-Adresse direkt als `"feed": "https://…"` eintragen.

Abspielbar sind nur Podcasts mit öffentlichem RSS-Feed. Exklusive Inhalte von Amazon Music, Spotify oder Bezahl-Abos gehören nicht dazu.

## Technik

Statische Dateien ohne Build-Schritt: `index.html`, `css/styles.css`, `js/app.js` (UI, Speicher, Player), `js/content.js` (Phasen, Module, Impulse, Lernkarten, Copilot-Vorlagen), `sw.js` (Offline-Cache, bei Updates `VERSION` erhöhen), `scripts/fetch-feeds.mjs` (Feed-Abruf, Node 20, ohne Abhängigkeiten).

Inhalte erweitern: in `js/content.js` einem Modul weitere `modelle`, `praxis`, `fragen` oder `karten` hinzufügen. Daraus entstehen automatisch neue Impulse.
