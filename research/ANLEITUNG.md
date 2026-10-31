# Tägliche Recherche für den Führungskompass

Diese Datei steuert die geplante Aufgabe „Führungskompass Recherche“. Sie läuft jeden Morgen und stellt **3 neue Impulse** in `data/impulse.json`. Die App zeigt sie im Tab *Entdecken*.

## Leser

Rohat Bach übernimmt zum 01.01.2027 die Leitung der Instandhaltung im Netz Hagen (DB InfraGO). Seine Ziele: das Netz in ruhigere Fahrwasser bringen und gemeinsam mit dem Team das WHY/Purpose herausarbeiten – neben operativen Brandherden. Er will Führungswissen festigen, Neues lernen und konkrete Vorschläge für seinen Alltag.

## Ablauf

1. `data/impulse.json` lesen. Bereits vorhandene Quellen-URLs und Themen der letzten 30 Tage nicht wiederholen.
2. **Phase bestimmen** (Tag 1 = 01.01.2027): vor dem Start = Vorbereitung; Tag 1–60 = Ankommen & Stabilisieren; 61–150 = Richtung & WHY; danach Verankern.
3. **3 Module wählen.** Vorrang haben Module, die in den letzten 14 Tagen am seltensten vorkamen und in der aktuellen Phase wichtig sind. Mindestens einer der 3 Impulse gehört zu `stabil`, `why`, `kultur` oder `strategie`. Modul-IDs:
   `uebergang` Übergang & erste 100 Tage · `stabil` Ruhigere Fahrwasser · `why` WHY & Purpose · `strategie` Strategie mit Kern · `umsetzung` Umsetzen neben dem Tagesgeschäft · `kultur` Führungskultur prägen · `sicherheit` Psychologische Sicherheit & Sicherheitskultur · `fk` Führen von Führungskräften · `gespraeche` Gespräche, Feedback, Wirkung · `selbst` Selbstführung im Rollenwechsel · `change` Veränderung & Beteiligung · `schnittstellen` Schnittstellen & Stakeholder
4. **Recherchieren** mit der Websuche (deutsch und englisch). Bevorzugte Quellen: Harvard Business Review, MIT Sloan Management Review, Harvard Business manager, managerSeminare, Gallup, McKinsey Insights, Center for Creative Leadership, Personalwirtschaft, Haufe, Fraunhofer, BAuA, wissenschaftliche Studien, Fachbücher bekannter Autoren. Gern auch Beispiele aus Instandhaltung, Bahn, Luftfahrt, Energieversorgung, Hochzuverlässigkeitsorganisationen.
   - Keine Inhalte erfinden: Aussagen, Zahlen und Zitate nur übernehmen, wenn die Suchergebnisse (oder eine abrufbare Seite) sie belegen. Im Zweifel allgemeiner formulieren.
   - **Neues bevorzugen:** Die App enthält bereits feste Module zu Watkins (First 90 Days), Bridges, Snowden (Cynefin), Heifetz, Sinek, Pink, Rumelt, Klein (Pre-Mortem), 4DX, Hoshin Kanri, Bungay, Schein, Schulz von Thun, Edmondson, Just Culture, Weick & Sutcliffe, Lencioni, Appelo, Hersey/Blanchard, Tuckman, Kim Scott, Goldsmith, Covey, Loehr/Schwartz, Kotter, ADKAR, Lewin. Diese nur aufgreifen, wenn es eine neue Studie, ein neues Praxisbeispiel oder eine echte Gegenposition gibt. Lieber aktuelle Forschung, Praxisberichte und Perspektiven, die dort noch fehlen.
   - Keine KI-Spam-Seiten, keine reinen Werbeseiten, keine Social-Media-Posts.
   - Nichts über die DB, InfraGO oder das Netz Hagen behaupten, was nicht öffentlich belegt ist.
5. **Je Impuls einen Eintrag schreiben** (Deutsch, in eigenen Worten, keine längeren wörtlichen Zitate):

```json
{
  "id": "JJJJMMTT-1",
  "date": "JJJJ-MM-TT",
  "titel": "max. 60 Zeichen",
  "quelle": { "name": "Medium – Autor", "url": "https://…" },
  "sprache": "en oder de",
  "kernaussage": "ein Satz",
  "deutsch": "120–220 Wörter: Worum geht es, was ist die Idee, worauf stützt sie sich?",
  "modul": "Modul-ID",
  "bezug_ih": "2–3 Sätze: Was heißt das konkret für den Leiter Instandhaltung im Netz Hagen in seiner aktuellen Phase?",
  "frage": "eine Reflexionsfrage",
  "experiment": "ein konkreter Vorschlag für die nächsten zwei Wochen",
  "karten": [{ "frage": "…", "antwort": "…" }]
}
```

   1–3 Lernkarten je Impuls. Die neuen Einträge kommen **vorne** in `items`; `updated` auf die aktuelle Zeit (ISO) setzen. Höchstens 120 Einträge behalten (die ältesten fallen weg).
6. **Prüfen:** `node scripts/validate-impulse.mjs` muss „OK“ melden.
7. **Veröffentlichen** auf `main` (Freigabe von Rohat liegt vor):
   `git add data/impulse.json && git commit -m "Recherche: 3 Impulse (JJJJ-MM-TT)"`, dann `git pull --rebase origin main` und `git push origin main`. Bei Netzwerkfehlern bis zu 4-mal mit Pause wiederholen.

Commit-Nachricht endet mit den Attributions-Zeilen, die die Sitzung vorgibt. Keine anderen Dateien ändern.
