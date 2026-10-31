// Inhalte: Phasen, Module, Lernkarten, Impulse.
// Bewusst ohne interne Informationen – das Repo ist öffentlich.
// Persönlicher Kontext bleibt lokal auf dem iPhone (Einstellungen → Mein Kontext).

export const ROLE = "Leiter Instandhaltung im Netz Hagen (DB InfraGO)";
export const GOALS = "das Netz in ruhigere Fahrwasser bringen und gemeinsam mit dem Team unser WHY/Purpose herausarbeiten – neben den laufenden operativen Brandherden";

// Phasen relativ zum Stellenantritt (Tag 1 = Antrittstag)
export const PHASES = [
  {
    id: "p0", nr: 0, name: "Vorbereitung", from: -Infinity, to: 0,
    fokus: "Lernen, bevor du handelst: Übergabe, Lernplan, erste Hypothesen, Antrittsbotschaft.",
    leitfrage: "Was muss ich verstanden haben, bevor ich am ersten Tag etwas sage?",
    impulse: [
      { title: "Lernplan statt Aktionsplan", text: "Schreib auf, was du bis zum Start über Technik (Anlagen, Störungsbild), Kultur (wie wird hier gearbeitet?) und Politik (wer hat Einfluss?) wissen willst – und von wem du es erfährst. Ein Lernplan schützt dich davor, mit alten Rezepten zu starten." },
      { title: "Übergabe aktiv führen", text: "Gute Übergaben klären nicht nur offene Vorgänge, sondern auch: Welche Zusagen gibt es? Welche Konflikte schwelen? Wer braucht besondere Aufmerksamkeit? Bereite fünf Fragen an deinen Vorgänger vor." },
      { title: "Deine Antrittsbotschaft", text: "Was willst du in deiner ersten Runde sagen? Bewährt: wer du bist, wofür du stehst, was du als Erstes tust (zuhören, kennenlernen) – und was du ausdrücklich nicht tust (nicht alles auf einmal umkrempeln). Kurz, ehrlich, ohne Versprechen, die du nicht halten kannst." },
      { title: "Hypothesen statt Urteile", text: "Formuliere drei Hypothesen, warum das Netz unruhig ist. Schreib sie als Fragen auf („Liegt es an …?“). Hypothesen kann man prüfen und verwerfen – Urteile verfestigen sich." },
      { title: "Abschied gestalten", text: "Dein Wechsel ist auch für dein bisheriges Team ein Übergang. Wie verabschiedest du dich so, dass Projekte gut weiterlaufen und Beziehungen bleiben? Du wirst die Projektseite als Schnittstelle weiter brauchen." },
    ],
  },
  {
    id: "p1", nr: 1, name: "Ankommen & Stabilisieren", from: 1, to: 60,
    fokus: "Zuhören, Lagebild schaffen, Brandherde ordnen, Führungskreis kennenlernen, sichtbar entlasten.",
    leitfrage: "Was bringt am schnellsten spürbar Ruhe – ohne dass ich alles selbst löse?",
    impulse: [
      { title: "Zuhör-Tour", text: "Plane in den ersten Wochen feste Termine vor Ort: Entstörung, Instandhaltungstrupps, Nachtschicht, Werkstatt. Frag: „Was hält dich von guter Arbeit ab?“ Notiere wörtlich, bewerte nicht." },
      { title: "Lagebild auf einer Seite", text: "Ein gemeinsames Lagebild (Top-Brandherde, Verantwortliche, nächster Schritt, Termin) beruhigt, weil es Ordnung zeigt. Aktualisiert wöchentlich, für alle sichtbar." },
      { title: "Die erste Krise ist eine Kulturbotschaft", text: "Irgendwann in den ersten Wochen geht etwas schief. Überlege jetzt, wie du reagieren willst: erst stabilisieren, dann danken für die Meldung, dann Ursache – nicht Schuld – klären." },
      { title: "Ein sichtbarer Quick Win", text: "Suche ein Ärgernis, das viele spüren und das sich mit wenig Aufwand beheben lässt. Ein kleiner, sichtbarer Erfolg schafft Vertrauen für die großen Themen." },
      { title: "Was bleiben soll", text: "Frag nicht nur, was sich ändern muss, sondern auch: „Was läuft hier gut und darf auf keinen Fall verloren gehen?“ Wer das Bestehende würdigt, bekommt mehr Bereitschaft für Neues." },
    ],
  },
  {
    id: "p2", nr: 2, name: "Richtung & WHY", from: 61, to: 150,
    fokus: "Diagnose zurückspielen, WHY gemeinsam erarbeiten, Strategie-Kern und wenige Ziele festlegen, Führungsleitsätze.",
    leitfrage: "Wozu gibt es uns – und was ist die eine Herausforderung, an der wir jetzt arbeiten?",
    impulse: [
      { title: "Das habe ich gehört", text: "Spiel deine Erkenntnisse aus den ersten Wochen ans Team zurück: „Das habe ich gehört, das sehe ich, das schlage ich vor.“ Wer sich wiedererkennt, trägt die nächsten Schritte eher mit." },
      { title: "WHY-Werkstatt starten", text: "Stelle eine kleine Gruppe aus allen Ebenen zusammen. Sammelt Geschichten, in denen Menschen stolz auf ihre Arbeit im Netz waren. Aus wiederkehrenden Motiven entsteht der Entwurf des WHY." },
      { title: "Ein bis zwei Ziele, nicht zehn", text: "Lege mit dem Führungskreis höchstens zwei wirklich wichtige Ziele fest – im Format „von X auf Y bis Z“. Alles andere ist Tagesgeschäft und wird auch so behandelt." },
      { title: "Führungsleitsätze als Verhalten", text: "Erarbeitet 3–5 Leitsätze, die beobachtbares Verhalten beschreiben („Wir sprechen Probleme an, bevor sie eskalieren“). Prüffrage: Könnte ein Außenstehender erkennen, ob wir es tun?" },
      { title: "Strategie auf einer Seite", text: "Diagnose, Leitlinie, drei bis vier kohärente Maßnahmen, Not-to-do-Liste – auf eine Seite. Wenn es nicht passt, ist es noch nicht klar genug." },
    ],
  },
  {
    id: "p3", nr: 3, name: "Verankern", from: 151, to: Infinity,
    fokus: "Rituale und Umsetzungstakt halten, Kultur vorleben, nachsteuern, Führungskräfte entwickeln.",
    leitfrage: "Was passiert weiter, wenn ich zwei Wochen nicht da bin?",
    impulse: [
      { title: "Rituale auf den Prüfstand", text: "Welche Besprechungen, Berichte und Routinen zahlen auf Ruhe und Richtung ein – und welche sind nur Gewohnheit? Streiche eine, schärfe eine." },
      { title: "Kultur-Puls", text: "Drei Fragen, anonym, alle acht Wochen: „Kann ich hier Probleme offen ansprechen?“, „Weiß ich, wozu meine Arbeit beiträgt?“, „Hat sich in den letzten Wochen etwas spürbar verbessert?“ Der Trend zählt, nicht der Wert." },
      { title: "Andere zu Führenden machen", text: "Verankert ist eine Kultur, wenn deine Führungskräfte sie weitertragen. Wer im Führungskreis könnte das WHY besser erzählen als du? Gib ihm die Bühne." },
      { title: "Ein Jahr – Rückschau", text: "Vergleiche deine ersten Hypothesen mit dem, was du heute weißt. Was hast du richtig gelesen, was falsch? Was würdest du einem Nachfolger raten?" },
      { title: "Erfolge erzählen", text: "Geschichten verankern Kultur stärker als Kennzahlen. Erzähle in Runden regelmäßig, wo das gewünschte Verhalten einen Unterschied gemacht hat – konkret, mit Ort und Situation." },
    ],
  },
];

export const WEEKLY_REVIEW = [
  "Was hat diese Woche Ruhe gebracht – und was Unruhe?",
  "Wo habe ich Kultur geprägt, bewusst oder unbewusst?",
  "Was habe ich gelernt – über das Netz, das Team oder mich?",
  "Was ist mein Fokus für nächste Woche?",
];

// Gewichtung der Module je Phase [p0, p1, p2, p3]
export const MODULES = [
  {
    id: "uebergang", icon: "🧭", title: "Übergang & erste 100 Tage", w: [3, 3, 1, 0.5],
    kurz: "Die Situation richtig lesen, bevor du handelst.",
    kern: "Die ersten Monate entscheiden, welches Bild sich Team und Umfeld von dir machen – und dieses Bild ist zäh. Neue Führungskräfte scheitern selten an fehlender Kompetenz, sondern daran, dass sie die Situation falsch lesen oder zu früh mit Rezepten handeln, die woanders funktioniert haben. Ziel ist, möglichst bald mehr Wert zu stiften, als du an Aufmerksamkeit bindest.",
    hagen: "Das Netz Hagen dürfte eine Mischsituation sein: operativ eher Turnaround (Brandherde stabilisieren), kulturell eher Neuausrichtung (Bewusstsein und Richtung schaffen). Beides verlangt unterschiedliches Tempo – schnell und entschieden bei den Bränden, geduldig und beteiligend bei Strategie und Kultur.",
    modelle: [
      { name: "STARS-Modell", text: "Watkins unterscheidet fünf Ausgangslagen: Start-up, Turnaround, beschleunigtes Wachstum, Neuausrichtung (Realignment) und Erfolg sichern. Im Turnaround zählt schnelles, entschiedenes Handeln; bei der Neuausrichtung muss erst Problembewusstsein entstehen. Die meisten Bereiche sind ein Mix – kläre für jeden Teil, welche Lage vorliegt.", quelle: "Watkins – The First 90 Days" },
      { name: "Lernplan", text: "Vor dem Handeln steht ein strukturierter Lernplan: Was muss ich über Technik, Kultur und Politik wissen? Wichtige Quellen sind Mitarbeitende an der Basis, Führungskräfte, Schnittstellenpartner, interne Kunden und der Vorgänger. Gute Fragen sind wertvoller als schnelle Antworten.", quelle: "Watkins – The First 90 Days" },
      { name: "Übergang nach Bridges", text: "Veränderung ist das äußere Ereignis, Übergang der innere Prozess: Ende (Loslassen), neutrale Zone (Unsicherheit), Neubeginn. Auch dein Team erlebt einen Übergang – es verliert den bisherigen Chef und Gewohntes. Würdige das Bisherige, bevor du Neues forderst.", quelle: "Bridges – Managing Transitions" },
      { name: "Quick Wins", text: "Frühe Erfolge schaffen Glaubwürdigkeit, aber nur unter Bedingungen: Sie lösen ein Problem, das die Betroffenen selbst spüren, sind sichtbar, kosten wenig und zeigen das Verhalten, für das du künftig stehen willst. Ein Quick Win nach alter Logik zementiert alte Muster.", quelle: "Watkins – The First 90 Days" },
    ],
    praxis: [
      "Schreib vor dem Start drei Hypothesen auf, warum das Netz unruhig ist. Prüfe sie in den ersten Wochen gezielt – und streiche mindestens eine.",
      "Führe in den ersten 30 Tagen Antrittsgespräche mit allen direkten Führungskräften – mit denselben fünf Fragen, damit du vergleichen kannst.",
      "Geh in den ersten vier Wochen mindestens einmal pro Woche raus: Entstörung, Instandhaltungstrupp, Nachtschicht. Zuhören, nicht bewerten.",
      "Kläre mit deiner Führungskraft schriftlich: Erwartungen, Erfolgskriterien nach 100 Tagen, Spielraum und Rhythmus für Abstimmungen.",
    ],
    fragen: [
      "Welche Gewohnheit aus dem Projektmanagement könnte mir in der Linie im Weg stehen?",
      "Was muss ich verstanden haben, bevor ich zum ersten Mal etwas Grundsätzliches ändere?",
      "Wer im Netz hat informellen Einfluss – unabhängig vom Organigramm?",
    ],
    karten: [
      { q: "Welche fünf Ausgangslagen unterscheidet das STARS-Modell?", a: "Start-up, Turnaround, beschleunigtes Wachstum, Neuausrichtung (Realignment), Erfolg sichern." },
      { q: "Was ist der „Break-even-Punkt“ einer neuen Führungskraft (Watkins)?", a: "Der Zeitpunkt, ab dem sie mehr Wert für die Organisation schafft, als sie bis dahin an Ressourcen und Aufmerksamkeit verbraucht hat." },
      { q: "Welche drei Phasen hat ein Übergang nach Bridges?", a: "Ende/Loslassen – neutrale Zone – Neubeginn." },
      { q: "Woran erkennst du einen guten Quick Win?", a: "Er löst ein selbst empfundenes Problem, ist sichtbar, kostet wenig und zeigt das Verhalten, für das du stehen willst." },
      { q: "Turnaround vs. Neuausrichtung – was ist der Unterschied im Vorgehen?", a: "Turnaround: Problem ist allen klar, schnelles entschiedenes Handeln. Neuausrichtung: Problem wird (noch) nicht gesehen, erst Bewusstsein schaffen." },
    ],
    quellen: ["Michael D. Watkins – The First 90 Days (2003, erw. 2013)", "William Bridges – Managing Transitions (1991)"],
  },
  {
    id: "stabil", icon: "⚓", title: "Ruhigere Fahrwasser", w: [1.5, 3, 2, 1],
    kurz: "Brandherde ordnen, statt jeden selbst zu löschen.",
    kern: "In unruhigen Lagen ist die Versuchung groß, jeden Brand selbst zu löschen. Das beruhigt kurzfristig und hält das System dauerhaft im Alarmzustand. Ruhe entsteht, wenn Lage, Prioritäten und Zuständigkeiten für alle klar sind und die Organisation lernt, wiederkehrende Störungen an der Ursache abzustellen.",
    hagen: "Für den Start in Hagen ist ein gemeinsames Lagebild oft der erste Quick Win: Es zeigt Ordnung, ohne dass du alles selbst löst. Entscheidend ist, früh zu klären, was zu dir eskaliert wird – und was ausdrücklich nicht.",
    modelle: [
      { name: "Cynefin", text: "Snowden unterscheidet klare, komplizierte, komplexe und chaotische Lagen. Klar: wahrnehmen – einordnen – reagieren. Kompliziert: wahrnehmen – analysieren – reagieren (Experten). Komplex: ausprobieren – wahrnehmen – reagieren (Experimente). Chaotisch: handeln – wahrnehmen – reagieren (erst stabilisieren). Typischer Fehler: chaotische Lagen mit Analyserunden behandeln oder komplexe mit Durchgriff.", quelle: "Snowden & Boone – HBR 2007" },
      { name: "Technisch vs. adaptiv", text: "Technische Herausforderungen lassen sich mit vorhandenem Wissen lösen – durch Experten oder Anweisung. Adaptive verlangen, dass Menschen Haltung und Gewohnheiten ändern. Viele Brandherde haben beide Anteile, z. B. ein fehlendes Ersatzteil (technisch) und eine späte Meldekultur (adaptiv). Wer adaptive Probleme technisch behandelt, löst sie nie.", quelle: "Heifetz – Leadership Without Easy Answers" },
      { name: "Balkon und Tanzfläche", text: "Führung braucht den Wechsel zwischen Mittendrin (Tanzfläche) und Draufschauen (Balkon). Wer nur tanzt, sieht keine Muster; wer nur auf dem Balkon steht, verliert den Kontakt. Plane Balkonzeit bewusst ein – gerade wenn es brennt.", quelle: "Heifetz & Linsky – Leadership on the Line" },
      { name: "Pareto & Wiederholer", text: "Meist verursachen wenige Ursachen den Großteil der Belastung. Wiederkehrende Störungen nach Ursache bündeln statt jede einzeln zu jagen – so wird aus Feuerwehr Vorbeugung.", quelle: "Pareto-Prinzip / Lean" },
      { name: "Regelkommunikation (Shopfloor)", text: "Ein kurzer, fester Lagetakt mit wenigen Kennzahlen, offenen Punkten und klaren Eskalationsregeln macht Probleme früh sichtbar – dort, wo sie entstehen, und nicht erst beim Leiter. Stehend, 15 Minuten, immer gleiche Struktur.", quelle: "Lean Management" },
    ],
    praxis: [
      "Erstelle mit deinem Führungskreis eine Brandherd-Liste: höchstens 7 Punkte, je Punkt Wirkung, Verantwortliche/r, nächster Schritt, Termin. Ein Blatt, wöchentlich aktualisiert.",
      "Ordne jeden Brandherd einer Cynefin-Lage zu. Wo braucht es Durchgriff, wo Experten, wo Experimente?",
      "Blocke täglich 15 Minuten Balkonzeit: Was wiederholt sich? Was hat sich seit gestern verändert?",
      "Lege fest und kommuniziere, was zu dir eskaliert wird – und was ausdrücklich nicht.",
      "Suche den einen Wiederholer, dessen Ursache sich mit vertretbarem Aufwand abstellen lässt, und mach ihn zum sichtbaren Erfolg.",
    ],
    fragen: [
      "Welche Brände lösche ich selbst, die eigentlich jemand anderes löschen könnte – und was hindert ihn daran?",
      "Woran würde mein Team merken, dass das Netz ruhiger geworden ist? Was wäre messbar?",
      "Welcher Brandherd ist in Wahrheit ein Symptom?",
    ],
    karten: [
      { q: "Wie reagiert man in einer chaotischen Lage nach Cynefin?", a: "Handeln – wahrnehmen – reagieren: zuerst stabilisieren, dann in eine komplexe oder komplizierte Lage überführen." },
      { q: "Wie reagiert man in einer komplexen Lage nach Cynefin?", a: "Ausprobieren – wahrnehmen – reagieren: sichere Experimente, Muster erkennen, verstärken oder dämpfen." },
      { q: "Unterschied technische vs. adaptive Herausforderung?", a: "Technisch: mit vorhandenem Wissen lösbar (Experte, Anweisung). Adaptiv: verlangt Lernen und Verhaltensänderung der Betroffenen." },
      { q: "Was bedeutet „auf den Balkon gehen“?", a: "Aus dem Geschehen heraustreten, um Muster, Dynamiken und das eigene Verhalten zu erkennen – und dann wieder einsteigen." },
      { q: "Wozu dient ein fester Lagetakt (Shopfloor)?", a: "Probleme früh und dort sichtbar machen, wo sie entstehen; klare Zuständigkeiten und Eskalationsregeln; weniger Ad-hoc-Feuerwehr." },
    ],
    quellen: ["David J. Snowden & Mary E. Boone – A Leader's Framework for Decision Making (HBR 2007)", "Ronald A. Heifetz – Leadership Without Easy Answers (1994)", "Ronald A. Heifetz & Marty Linsky – Leadership on the Line (2002)"],
  },
  {
    id: "why", icon: "💡", title: "WHY & Purpose", w: [1, 1.5, 3, 2],
    kurz: "Wozu es euch gibt – gemeinsam gefunden, nicht verkündet.",
    kern: "Ein Purpose beantwortet, wozu es euch gibt – jenseits von Kennzahlen. In der Instandhaltung liegt er selten in großen Worten, sondern in konkreten Momenten: der Zug, der nach einer nächtlichen Entstörung pünktlich fährt; die Strecke, auf der Menschen sicher unterwegs sind. Ein WHY wirkt nur, wenn die Leute es als ihres erkennen. Deshalb wird es gemeinsam entdeckt, nicht verkündet.",
    hagen: "Das WHY des Netzes sollte an den gemeinwohlorientierten Auftrag der DB InfraGO anschließen und zugleich lokal greifbar sein. Achtung Timing: Solange die Brandherde lodern, wirkt ein Purpose-Workshop schnell wie Folklore. Entweder erst spürbar entlasten und dann das WHY erarbeiten – oder das WHY bewusst aus der Bewältigung der Brandherde heraus entwickeln („Wofür tun wir uns das eigentlich an?“).",
    modelle: [
      { name: "Golden Circle", text: "Why – How – What. Organisationen kommunizieren meist von außen nach innen: was sie tun, dann wie. Inspirierend wirkt die Reihenfolge von innen nach außen: Warum es uns gibt, wie wir arbeiten, was wir tun. Das WHY ist kein Ergebnis (z. B. Pünktlichkeit), sondern der Beitrag, für den das Ergebnis steht.", quelle: "Sinek – Start with Why" },
      { name: "WHY aus Geschichten", text: "Ein Team-WHY wird nicht erfunden, sondern entdeckt: Menschen erzählen Geschichten, in denen sie stolz auf ihre Arbeit waren. Wiederkehrende Motive werden zu einem Satz verdichtet: „Wir … , damit …“. Danach zurückspielen und nachschärfen, bis die Leute sagen: „Ja, das sind wir.“", quelle: "Sinek, Mead & Docker – Find Your Why" },
      { name: "Purpose, Vision, Werte", text: "Purpose = wozu (bleibt über Jahre). Vision = wohin (Zielbild mit Zeithorizont). Werte bzw. Leitsätze = wie wir miteinander arbeiten. Wer die drei vermischt, produziert Leitbild-Lyrik, die niemand erinnert.", quelle: "Strategielehre" },
      { name: "Sinn als Antrieb", text: "Neben Autonomie und Meisterschaft ist Sinn eine zentrale Quelle intrinsischer Motivation. Gerade bei Arbeit, die vor allem auffällt, wenn etwas schiefgeht, braucht es sichtbare Verbindungen zwischen der eigenen Tätigkeit und ihrem Nutzen.", quelle: "Pink – Drive" },
    ],
    praxis: [
      "Sammle ab sofort Stolz-Geschichten. Frag in Gesprächen: „Wann warst du zuletzt richtig stolz auf deine Arbeit hier?“ Halte sie im Journal als WHY-Baustein fest.",
      "Formuliere einen ersten eigenen WHY-Entwurf nach dem Muster „Wir …, damit …“ – als Hypothese, nicht zum Verkünden.",
      "Mach den Nachtschicht-Test: Würde jemand aus der Entstörung um 3 Uhr nachts an der Strecke den Satz unterschreiben?",
      "Plane den WHY-Prozess beteiligend: kleine Gruppe aus allen Ebenen, Geschichten sammeln, Motive verdichten, Entwurf zurückspielen, nachschärfen.",
      "Erzähle in der nächsten Runde eine konkrete Geschichte, in der die Arbeit des Teams für Fahrgäste oder Kollegen einen Unterschied gemacht hat.",
    ],
    fragen: [
      "Wofür würde man das Netz vermissen, wenn es uns nicht gäbe?",
      "Welche Geschichte erzählt man sich im Netz heute über „die da oben“ – und was müsste passieren, damit sie sich ändert?",
      "Was ist mein persönliches WHY als Führungskraft – und wie hängt es mit dem des Teams zusammen?",
    ],
    karten: [
      { q: "In welcher Reihenfolge kommuniziert der Golden Circle?", a: "Von innen nach außen: Why (wozu) – How (wie) – What (was)." },
      { q: "Purpose, Vision, Werte – kurz unterschieden?", a: "Purpose = wozu es uns gibt (dauerhaft). Vision = wohin wir wollen (Zielbild, Zeithorizont). Werte/Leitsätze = wie wir zusammenarbeiten." },
      { q: "Wie entsteht ein Team-WHY nach „Find Your Why“?", a: "Aus Geschichten: Stolz-Momente sammeln, wiederkehrende Motive erkennen, zu einem Satz „Wir …, damit …“ verdichten, zurückspielen, nachschärfen." },
      { q: "Welche drei Quellen intrinsischer Motivation nennt Pink?", a: "Autonomie, Meisterschaft, Sinn (Purpose)." },
      { q: "Warum ist Pünktlichkeit kein WHY?", a: "Sie ist ein Ergebnis bzw. eine Kennzahl. Das WHY ist der Beitrag dahinter – z. B. dass Menschen sich auf die Bahn verlassen können." },
    ],
    quellen: ["Simon Sinek – Start with Why (2009)", "Simon Sinek, David Mead, Peter Docker – Find Your Why (2017)", "Daniel H. Pink – Drive (2009)"],
  },
  {
    id: "strategie", icon: "🗺️", title: "Strategie mit Kern", w: [1, 1.5, 3, 1.5],
    kurz: "Diagnose, Leitlinie, kohärente Maßnahmen – und bewusstes Weglassen.",
    kern: "Gute Strategie ist kein Zielkatalog, sondern eine Antwort auf die wichtigste Herausforderung. Schlechte Strategie erkennt man an Floskeln, an Zielen ohne Weg und daran, dass sie keine schwierige Entscheidung enthält. Strategie heißt immer auch: bewusst entscheiden, was ihr nicht tut.",
    hagen: "Für Hagen: Die Diagnose ehrlich führen – was macht das Netz wirklich unruhig? Kapazität, Anlagenzustand, Planung, Zusammenarbeit, Führung? Dann wenige Leitlinien. Die Netz-Strategie muss an die Vorgaben von Regionalbereich und InfraGO andocken; dein größter Spielraum liegt oft im Wie und im Weglassen.",
    modelle: [
      { name: "Strategie-Kern", text: "Rumelt: Jede gute Strategie hat drei Elemente. 1) Diagnose – was ist eigentlich los, was ist die zentrale Herausforderung? 2) Leitlinie – wie wollen wir grundsätzlich damit umgehen? 3) Kohärente Maßnahmen – aufeinander abgestimmte Schritte, die die Leitlinie umsetzen und sich gegenseitig verstärken.", quelle: "Rumelt – Good Strategy/Bad Strategy" },
      { name: "Merkmale schlechter Strategie", text: "Rumelt nennt vier: Floskeln statt Inhalt, Ausweichen vor der eigentlichen Herausforderung, Ziele mit Strategie verwechseln, unrealistische oder beliebige Zwischenziele. Prüffrage: Was würde jemand Kluges anders machen, wenn er unsere Strategie liest?", quelle: "Rumelt – Good Strategy/Bad Strategy" },
      { name: "Not-to-do-Liste", text: "Fokus entsteht durch Weglassen. Für jede neue Priorität wird eine bestehende Aktivität beendet, zurückgestellt oder bewusst auf Minimalniveau gefahren. Eine Strategie ohne Not-to-do-Liste ist eine Wunschliste.", quelle: "Strategielehre" },
      { name: "Pre-Mortem", text: "Stell dir vor, es ist ein Jahr später und die Strategie ist gescheitert. Jeder schreibt still auf, warum. Diese Technik nach Gary Klein bringt Risiken auf den Tisch, die in normalen Runden niemand ausspricht.", quelle: "Klein – HBR 2007" },
      { name: "Strategiehaus", text: "Dach: Purpose/Vision. Säulen: drei bis vier Stoßrichtungen. Fundament: Werte, Führung, Basiskennzahlen. Hilft, Strategie auf eine Seite zu bringen – aber Inhalt vor Form: Ein schönes Haus ohne Diagnose ist Dekoration.", quelle: "Strategiepraxis" },
    ],
    praxis: [
      "Schreib die Diagnose in fünf Sätzen. Wenn es mehr braucht, ist sie noch nicht scharf.",
      "Prüfe jede geplante Maßnahme: Zahlt sie auf die Leitlinie ein? Wenn nicht – streichen oder parken.",
      "Erarbeite mit deinem Führungskreis eine Not-to-do-Liste mit drei Punkten.",
      "Mach mit dem Führungskreis ein Pre-Mortem: „Es ist Ende 2027, unsere Strategie ist gescheitert. Warum?“",
    ],
    fragen: [
      "Was ist die eine Herausforderung, die – wenn gelöst – die meisten anderen entschärft?",
      "Welche Entscheidung in meiner Strategie tut jemandem weh? Wenn keine: Ist es wirklich eine Strategie?",
      "Wo liegt mein Spielraum innerhalb der Vorgaben – und wo bilde ich ihn mir nur ein?",
    ],
    karten: [
      { q: "Welche drei Elemente hat der Strategie-Kern nach Rumelt?", a: "Diagnose, Leitlinie (guiding policy), kohärente Maßnahmen." },
      { q: "Nenne zwei Merkmale schlechter Strategie nach Rumelt.", a: "Floskeln; Ausweichen vor der Herausforderung; Ziele mit Strategie verwechseln; unrealistische Zwischenziele." },
      { q: "Wie läuft ein Pre-Mortem ab?", a: "Annehmen, das Vorhaben sei gescheitert; jeder notiert still Gründe; sammeln, gewichten, Gegenmaßnahmen ableiten." },
      { q: "Wozu dient eine Not-to-do-Liste?", a: "Fokus durch bewusstes Weglassen – Kapazität für das Wichtige freimachen." },
    ],
    quellen: ["Richard P. Rumelt – Good Strategy/Bad Strategy (2011)", "Gary Klein – Performing a Project Premortem (HBR 2007)"],
  },
  {
    id: "umsetzung", icon: "🎯", title: "Umsetzen neben dem Tagesgeschäft", w: [0.5, 1.5, 2.5, 3],
    kurz: "Wenige Ziele, Frühindikatoren, sichtbarer Spielstand, fester Takt.",
    kern: "Das Tagesgeschäft – in 4DX „Wirbelsturm“ genannt – frisst jede Strategie, wenn ihr kein fester Platz eingeräumt wird. Wirksam ist: sehr wenige Ziele, Fokus auf beeinflussbare Frühindikatoren, ein sichtbarer Spielstand und ein kurzer, unverrückbarer Umsetzungstakt.",
    hagen: "Die Brandherde verschwinden nicht, während du Strategie umsetzt. Reserviere bewusst einen festen Anteil der Führungszeit für das wichtigste Ziel – 4DX spricht von rund 20 %, der Rest gehört dem Wirbelsturm. Das macht die Doppelaufgabe planbar statt zermürbend.",
    modelle: [
      { name: "4 Disziplinen der Umsetzung", text: "1) Fokus auf ein bis zwei äußerst wichtige Ziele (WIG). 2) An Frühindikatoren arbeiten, nicht nur an Spätindikatoren. 3) Einen sichtbaren, einfachen Spielstand führen. 4) Rhythmus der Verantwortlichkeit: wöchentliche Kurzrunde mit Rückblick auf Zusagen und neuen Zusagen.", quelle: "McChesney, Covey & Huling – 4DX" },
      { name: "Früh- vs. Spätindikatoren", text: "Spätindikatoren (z. B. Störungsminuten, Verspätungen) zeigen das Ergebnis, lassen sich aber nicht direkt steuern. Frühindikatoren (z. B. pro Woche abgearbeitete Inspektionsmängel, durchgeführte Vorbeugemaßnahmen) sind beeinflussbar und sagen das Ergebnis voraus.", quelle: "McChesney, Covey & Huling – 4DX" },
      { name: "Catchball (Hoshin Kanri)", text: "Ziele werden nicht nur heruntergereicht, sondern zwischen den Ebenen hin- und hergespielt, bis Ziel und Weg zusammenpassen. Wer an der Planung beteiligt ist, übernimmt Verantwortung für die Umsetzung.", quelle: "Hoshin Kanri" },
      { name: "Führen mit Auftrag", text: "Absicht und Zweck klar machen, Wege offenlassen. Bungay zeigt am Beispiel der preußischen Auftragstaktik: So schrumpfen die Lücken zwischen Plan, Handeln und Ergebnis, weil die Menschen vor Ort sinnvoll entscheiden können, wenn sich die Lage ändert.", quelle: "Bungay – The Art of Action" },
    ],
    praxis: [
      "Formuliere dein wichtigstes Ziel im Format „von X auf Y bis Z“.",
      "Finde zwei Frühindikatoren, die das Team wöchentlich selbst beeinflussen kann.",
      "Führe eine wöchentliche 20-Minuten-Runde nur für das wichtigste Ziel ein: Zusagen der Vorwoche, Spielstand, neue Zusagen. Kein Tagesgeschäft.",
      "Formuliere den nächsten Auftrag an eine Führungskraft als Absicht: Was soll erreicht werden und wozu – nicht wie.",
    ],
    fragen: [
      "Wie viel meiner Woche gehört dem Wirbelsturm – und wie viel der Zukunft?",
      "Welche Kennzahl schauen wir regelmäßig an, obwohl wir sie nicht beeinflussen können?",
      "Wo erkläre ich das Wie, obwohl ich das Wozu erklären sollte?",
    ],
    karten: [
      { q: "Welche vier Disziplinen beschreibt 4DX?", a: "1) Fokus auf das wichtigste Ziel, 2) Frühindikatoren, 3) sichtbarer Spielstand, 4) Rhythmus der Verantwortlichkeit." },
      { q: "Was ist ein Frühindikator?", a: "Eine beeinflussbare Größe, die das Ergebnis vorhersagt – im Gegensatz zum Spätindikator, der das Ergebnis nur misst." },
      { q: "Was ist „Catchball“?", a: "Das Hin- und Herspielen von Zielen zwischen Ebenen, bis Ziel und Weg zusammenpassen (Hoshin Kanri)." },
      { q: "Kernidee des Führens mit Auftrag?", a: "Absicht und Zweck vorgeben, den Weg offenlassen – damit vor Ort sinnvoll entschieden werden kann." },
      { q: "Wie heißt das Tagesgeschäft in 4DX?", a: "Der Wirbelsturm (whirlwind)." },
    ],
    quellen: ["Chris McChesney, Sean Covey, Jim Huling – The 4 Disciplines of Execution (2012)", "Stephen Bungay – The Art of Action (2011)"],
  },
  {
    id: "kultur", icon: "🌱", title: "Führungskultur prägen", w: [1, 2, 2.5, 3],
    kurz: "Kultur entsteht durch das, worauf du achtest und wie du reagierst.",
    kern: "Kultur ist das, was Menschen tun, wenn keiner hinschaut. Sie wird vor allem vom Verhalten der Führung geprägt, nicht von Leitbildern. Am stärksten wirkt, worauf Führungskräfte achten, wie sie in Krisen reagieren und was sie belohnen.",
    hagen: "Deine Reaktionen auf die ersten Störungen, Fehler und schlechten Nachrichten werden zur Botschaft – schneller als jede Rede. Wenn du vorher überlegst, wie du reagieren willst, wird die Krise zur Kulturchance.",
    modelle: [
      { name: "Drei Ebenen der Kultur", text: "Schein unterscheidet Artefakte (sichtbar: Rituale, Räume, Sprache), propagierte Werte (was man sagt) und Grundannahmen (unausgesprochene Selbstverständlichkeiten, z. B. „Wer Fehler meldet, hat Ärger“). Nachhaltige Veränderung muss an den Grundannahmen ansetzen.", quelle: "Schein – Organizational Culture and Leadership" },
      { name: "Primäre Prägemechanismen", text: "Nach Schein prägen Führungskräfte Kultur vor allem durch: worauf sie achten, was sie messen und kontrollieren; wie sie auf kritische Ereignisse und Krisen reagieren; wie sie Ressourcen verteilen; was sie bewusst vorleben und lehren; wofür sie Anerkennung und Status vergeben; wen sie auswählen, befördern und von wem sie sich trennen.", quelle: "Schein – Organizational Culture and Leadership" },
      { name: "Leitsätze als Verhalten", text: "Gute Führungsleitsätze beschreiben beobachtbares Verhalten („Wir sprechen Probleme an, bevor sie eskalieren“) statt Werte-Substantive („Offenheit“). Prüffrage: Könnte ein Außenstehender erkennen, ob wir es tun?", quelle: "Führungspraxis" },
      { name: "Werte- und Entwicklungsquadrat", text: "Jeder Wert braucht einen Schwesterwert, sonst kippt er in die Übertreibung: Verlässlichkeit ohne Flexibilität wird Starrheit, Flexibilität ohne Verlässlichkeit wird Beliebigkeit. Hilfreich, um Kulturziele ausgewogen zu formulieren.", quelle: "Schulz von Thun – Miteinander reden 2" },
    ],
    praxis: [
      "Beobachte eine Woche lang, welche Fragen du in Besprechungen am häufigsten stellst. Das ist, worauf du Aufmerksamkeit lenkst.",
      "Leg dir einen Satz für schlechte Nachrichten zurecht, z. B. „Danke, dass du es früh sagst. Was brauchst du?“ – und nutze ihn konsequent.",
      "Formuliere mit dem Führungskreis drei bis fünf Führungsleitsätze als beobachtbares Verhalten.",
      "Würdige einmal pro Woche öffentlich ein Verhalten, das zur gewünschten Kultur passt – konkret und zeitnah.",
    ],
    fragen: [
      "Welche ungeschriebene Regel im Netz würde ein Neuer zuerst lernen?",
      "Was belohne ich unbewusst, das ich eigentlich nicht will – etwa Heldentum statt Vorbeugung?",
      "Woran würde man in einem Jahr erkennen, dass sich die Kultur verändert hat?",
    ],
    karten: [
      { q: "Welche drei Ebenen der Kultur unterscheidet Schein?", a: "Artefakte, propagierte Werte, Grundannahmen." },
      { q: "Nenne drei primäre Prägemechanismen nach Schein.", a: "Worauf Führung achtet/misst; Reaktion auf Krisen; Ressourcenverteilung; Vorleben/Lehren; Vergabe von Anerkennung; Auswahl, Beförderung, Trennung." },
      { q: "Was macht einen guten Führungsleitsatz aus?", a: "Er beschreibt beobachtbares Verhalten, nicht nur einen Wert." },
      { q: "Was zeigt das Werte- und Entwicklungsquadrat?", a: "Jeder Wert braucht einen positiven Gegenwert, sonst entartet er (z. B. Verlässlichkeit ↔ Flexibilität; Übertreibung: Starrheit bzw. Beliebigkeit)." },
    ],
    quellen: ["Edgar H. Schein – Organizational Culture and Leadership (1985, 5. Aufl. 2017)", "Friedemann Schulz von Thun – Miteinander reden 2 (1989)"],
  },
  {
    id: "sicherheit", icon: "🛡️", title: "Psychologische Sicherheit & Sicherheitskultur", w: [1, 2, 2, 2.5],
    kurz: "Nur wer ohne Angst meldet, macht Probleme früh sichtbar.",
    kern: "In der Instandhaltung hängt Sicherheit davon ab, dass Menschen Mängel, Beinahe-Ereignisse und eigene Fehler melden. Das tun sie nur, wenn sie keine Bloßstellung fürchten. Psychologische Sicherheit ist kein Kuschelkurs: Sie ermöglicht hohe Standards, weil Probleme früh auf den Tisch kommen.",
    hagen: "Wenn das Netz unruhig ist, steigt der Druck – und damit die Versuchung, Probleme zu verschweigen oder schönzurechnen. Deine Reaktion auf die erste gemeldete Panne setzt den Standard für alle weiteren.",
    modelle: [
      { name: "Psychologische Sicherheit", text: "Edmondson: die geteilte Überzeugung, dass man im Team zwischenmenschliche Risiken eingehen kann – Fragen stellen, Fehler zugeben, widersprechen –, ohne Nachteile zu befürchten. Zusammen mit hohen Standards entsteht die Lernzone; ohne Standards nur die Komfortzone; Standards ohne Sicherheit erzeugen die Angstzone.", quelle: "Edmondson – The Fearless Organization" },
      { name: "Drei Führungsschritte", text: "1) Bühne bereiten: Arbeit als Lernaufgabe rahmen, Unsicherheit offen benennen. 2) Zur Beteiligung einladen: echte Fragen stellen, eigene Fehlbarkeit zeigen. 3) Produktiv reagieren: Wertschätzung für Meldungen, Fehler entstigmatisieren, bei klaren Regelverstößen aber konsequent sein.", quelle: "Edmondson – The Fearless Organization" },
      { name: "Just Culture", text: "Faire Fehlerkultur unterscheidet drei Fälle: menschlicher Fehler (unterstützen, System verbessern), riskantes Verhalten (coachen, Anreize prüfen) und rücksichtsloses Verhalten (sanktionieren). Fairness ist die Voraussetzung dafür, dass gemeldet wird.", quelle: "Reason; Marx" },
      { name: "Hochzuverlässige Organisationen", text: "Weick und Sutcliffe beschreiben fünf Prinzipien: Aufmerksamkeit für (kleine) Fehler, Abneigung gegen vorschnelle Vereinfachung, Sensibilität für den laufenden Betrieb, Streben nach Resilienz, Respekt vor Fachwissen – Entscheidungen wandern dorthin, wo die Expertise sitzt.", quelle: "Weick & Sutcliffe – Managing the Unexpected" },
      { name: "Arten des Scheiterns", text: "Edmondson unterscheidet einfache Fehler (vermeidbar, Checklisten helfen), komplexe Fehler (viele Faktoren greifen ineinander) und intelligente Fehler (in neuem Terrain, klein, lehrreich). Nur die letzten sind erwünscht – aber alle sollen gemeldet werden.", quelle: "Edmondson – Right Kind of Wrong" },
    ],
    praxis: [
      "Beende eine Woche lang jede Besprechung mit: „Was sehen wir noch nicht, das wir sehen sollten?“",
      "Bedanke dich bei der nächsten schlechten Nachricht ausdrücklich, bevor du nach Ursachen fragst.",
      "Prüfe den letzten Vorfall mit der Just-Culture-Brille: Fehler, riskantes oder rücksichtsloses Verhalten? Passte eure Reaktion dazu?",
      "Frage bei der nächsten Entscheidung zuerst die Person mit der meisten Praxisnähe – und sprich selbst zuletzt.",
    ],
    fragen: [
      "Was würde mein Team mir nicht sagen – und warum nicht?",
      "Wann habe ich zuletzt vor dem Team einen eigenen Fehler zugegeben?",
      "Werden Beinahe-Ereignisse bei uns als Glück abgehakt oder als Lernchance genutzt?",
    ],
    karten: [
      { q: "Definition psychologische Sicherheit (Edmondson)?", a: "Geteilte Überzeugung, dass man im Team zwischenmenschliche Risiken eingehen kann (fragen, Fehler zugeben, widersprechen), ohne Nachteile zu befürchten." },
      { q: "Was entsteht bei hohen Standards ohne psychologische Sicherheit?", a: "Die Angstzone – Probleme werden verschwiegen." },
      { q: "Welche drei Verhaltensarten unterscheidet Just Culture?", a: "Menschlicher Fehler, riskantes Verhalten, rücksichtsloses Verhalten." },
      { q: "Nenne die fünf Prinzipien hochzuverlässiger Organisationen.", a: "Aufmerksamkeit für Fehler, Abneigung gegen Vereinfachung, Sensibilität für den Betrieb, Streben nach Resilienz, Respekt vor Fachwissen." },
      { q: "Welche drei Arten des Scheiterns unterscheidet Edmondson?", a: "Einfache, komplexe und intelligente Fehler." },
    ],
    quellen: ["Amy C. Edmondson – The Fearless Organization (2018; dt. Die angstfreie Organisation)", "Amy C. Edmondson – Right Kind of Wrong (2023)", "Karl E. Weick & Kathleen M. Sutcliffe – Managing the Unexpected (2001, 3. Aufl. 2015)", "James Reason – Managing the Risks of Organizational Accidents (1997)"],
  },
  {
    id: "fk", icon: "🤝", title: "Führen von Führungskräften", w: [1.5, 2.5, 2, 2],
    kurz: "Ein Führungskreis, der Team ist – mit klaren Entscheidungsrechten.",
    kern: "Als Leiter IH führst du vor allem Führungskräfte – deine Wirkung entsteht über sie. Zwei Fragen stehen im Zentrum: Seid ihr als Führungskreis ein Team oder eine Runde von Bereichsvertretern? Und: Wer entscheidet was?",
    hagen: "Mit deinem Antritt beginnt der Führungskreis wieder ein Stück von vorn. Nutze das: Kläre Rollen, Erwartungen und Entscheidungsrechte früh und gemeinsam – bevor sich unter Druck die alten Muster wieder einschleifen.",
    modelle: [
      { name: "First Team", text: "Lencioni: Die erste Loyalität einer Führungskraft gehört dem Führungskreis, dem sie angehört – nicht dem eigenen Bereich. Sonst wird der Führungskreis zur Verhandlungsrunde, in der jeder seine Interessen verteidigt.", quelle: "Lencioni – The Advantage" },
      { name: "Fünf Dysfunktionen", text: "Fehlendes Vertrauen → Angst vor Konflikten → fehlende Verbindlichkeit → Scheu vor gegenseitiger Verantwortung → fehlende Ergebnisorientierung. Jede Stufe baut auf der vorigen auf; die Arbeit beginnt beim Vertrauen.", quelle: "Lencioni – The Five Dysfunctions of a Team" },
      { name: "Sieben Delegationsstufen", text: "Appelo: 1 Anweisen, 2 Verkaufen, 3 Konsultieren, 4 Einigen, 5 Beraten, 6 Erkundigen, 7 Delegieren. Pro Entscheidungsfeld wird geklärt, welche Stufe gilt – das schafft Klarheit und verhindert, dass alles beim Chef landet.", quelle: "Appelo – Management 3.0" },
      { name: "Situatives Führen", text: "Hersey und Blanchard: Der Führungsstil richtet sich nach Kompetenz und Engagement der Person für die konkrete Aufgabe – von anleiten über überzeugen und unterstützen bis delegieren. Dieselbe Person braucht bei verschiedenen Aufgaben unterschiedliche Führung.", quelle: "Hersey & Blanchard" },
      { name: "Teamphasen", text: "Tuckman: Forming, Storming, Norming, Performing. Ein neuer Chef wirft das Team teilweise zurück. Storming ist kein Zeichen des Scheiterns, sondern ein notwendiger Schritt – wenn er offen stattfindet.", quelle: "Tuckman (1965)" },
    ],
    praxis: [
      "Spielt im Führungskreis Delegation Poker für fünf typische Entscheidungen, z. B. Personaleinsatz am Wochenende, Fremdvergabe, Eskalation nach oben.",
      "Frag jede Führungskraft im Einzelgespräch: „Wobei kann ich dich am meisten unterstützen – und wobei störe ich?“",
      "Etabliere einen festen Rhythmus: Einzelgespräche alle zwei Wochen, Führungskreis wöchentlich, mit klarer Trennung von Lage und Entwicklung.",
      "Achte in der nächsten Runde darauf: Wird Konflikt offen ausgetragen oder hinterher auf dem Flur?",
    ],
    fragen: [
      "Ist mein Führungskreis ein Team oder eine Arbeitsgruppe?",
      "Bei welcher Führungskraft greife ich zu oft ein – und was sagt das über mein Vertrauen?",
      "Welche Entscheidungen behalte ich, obwohl andere sie besser treffen könnten?",
    ],
    karten: [
      { q: "Was meint Lencioni mit „First Team“?", a: "Die erste Loyalität einer Führungskraft gilt dem Führungskreis, dem sie angehört, nicht dem eigenen Bereich." },
      { q: "Nenne die fünf Dysfunktionen eines Teams in Reihenfolge.", a: "Fehlendes Vertrauen, Angst vor Konflikten, fehlende Verbindlichkeit, Scheu vor Verantwortung, fehlende Ergebnisorientierung." },
      { q: "Welche sieben Delegationsstufen kennt Management 3.0?", a: "Anweisen, Verkaufen, Konsultieren, Einigen, Beraten, Erkundigen, Delegieren." },
      { q: "Vier Teamphasen nach Tuckman?", a: "Forming, Storming, Norming, Performing." },
    ],
    quellen: ["Patrick Lencioni – The Five Dysfunctions of a Team (2002)", "Patrick Lencioni – The Advantage (2012)", "Jurgen Appelo – Management 3.0 (2011)", "Paul Hersey & Ken Blanchard – Situational Leadership"],
  },
  {
    id: "gespraeche", icon: "💬", title: "Gespräche, Feedback, Wirkung", w: [1, 2, 2, 2],
    kurz: "Klar und zugewandt – und mehr fragen als erklären.",
    kern: "Führung geschieht zum großen Teil im Gespräch. Klarheit und Zugewandtheit sind kein Widerspruch: Wer konkret und respektvoll anspricht, was er sieht, schafft Orientierung. Fragen öffnet mehr als Erklären – besonders als Neuer.",
    hagen: "In den ersten Wochen wirst du mehr zuhören als sprechen. Später entscheidet die Qualität deiner Gespräche – Feedback, Erwartungsklärung, schwierige Gespräche –, ob Strategie und Kultur im Alltag ankommen.",
    modelle: [
      { name: "Radical Candor", text: "Kim Scott: Persönliche Zuwendung plus direkte Ansprache. Fehlt die Zuwendung, wird es unangenehme Aggression; fehlt die Direktheit, ruinöse Empathie – nett, aber nutzlos. Fehlt beides: manipulative Unaufrichtigkeit.", quelle: "Scott – Radical Candor" },
      { name: "SBI-Feedback", text: "Situation – Verhalten (Behavior) – Wirkung (Impact): „Gestern in der Lagebesprechung (S) hast du die Störung offen angesprochen (B). Dadurch konnten wir sofort umplanen (I).“ Konkret, beobachtbar, ohne Urteil über die Person – für Lob genauso wie für Kritik.", quelle: "Center for Creative Leadership" },
      { name: "Humble Inquiry", text: "Schein: Fragen stellen, deren Antwort man nicht kennt, aus echtem Interesse. Das baut Beziehung auf und bringt Informationen zutage, die sonst nicht nach oben dringen – gerade über Hierarchiegrenzen hinweg.", quelle: "Schein – Humble Inquiry" },
      { name: "Vier-Seiten-Modell", text: "Schulz von Thun: Jede Nachricht hat Sachinhalt, Selbstkundgabe, Beziehungshinweis und Appell – und wird mit „vier Ohren“ gehört. Viele Konflikte entstehen, weil auf dem Beziehungsohr gehört wird, was auf der Sachebene gemeint war.", quelle: "Schulz von Thun – Miteinander reden 1" },
      { name: "Wirkung & Präsenz", text: "Wirkung entsteht aus einer klaren Kernbotschaft, bewussten Pausen, Körpersprache und vor allem aus der Übereinstimmung von Wort und Tat. Vertiefung: Podcast „Souverän!“ von Oliver Walter.", quelle: "Rhetorik" },
    ],
    praxis: [
      "Gib diese Woche einer Person SBI-Feedback zu etwas Positivem – genauso präzise wie bei Kritik.",
      "Stelle im nächsten Gespräch drei echte Fragen, bevor du deine Meinung sagst.",
      "Bereite ein schwieriges Gespräch mit drei Sätzen vor: Was ich beobachte – was das bewirkt – was ich mir wünsche.",
      "Bitte um Feedback: „Was sollte ich mehr tun, was weniger?“ – und bedanke dich, ohne dich zu rechtfertigen.",
    ],
    fragen: [
      "Welches Gespräch schiebe ich gerade vor mir her?",
      "Wo bin ich in ruinöser Empathie – nett, aber nicht klar?",
      "Wie hoch ist mein Redeanteil in meinen Besprechungen?",
    ],
    karten: [
      { q: "Welche zwei Achsen hat Radical Candor?", a: "Persönliche Zuwendung (care personally) und direkte Ansprache (challenge directly)." },
      { q: "Wofür steht SBI?", a: "Situation – Behavior (Verhalten) – Impact (Wirkung)." },
      { q: "Was ist „ruinöse Empathie“?", a: "Zuwendung ohne Direktheit: nett sein und dabei Wichtiges nicht ansprechen." },
      { q: "Die vier Seiten einer Nachricht?", a: "Sachinhalt, Selbstkundgabe, Beziehung, Appell." },
    ],
    quellen: ["Kim Scott – Radical Candor (2017)", "Edgar H. Schein – Humble Inquiry (2013)", "Friedemann Schulz von Thun – Miteinander reden 1 (1981)"],
  },
  {
    id: "selbst", icon: "🔋", title: "Selbstführung im Rollenwechsel", w: [3, 2.5, 1.5, 1.5],
    kurz: "Vom Projektleiter zum Linienchef: Was dich hierher gebracht hat, bringt dich nicht weiter.",
    kern: "Der Wechsel vom Projektmanagement in die Linienleitung verändert, wofür du gebraucht wirst. Im Projekt zählen Termine, Lösungen und Abschluss; in der Linie zählen Dauerbetrieb, Menschen und Kultur – ohne Enddatum. Was dich bisher erfolgreich gemacht hat, kann jetzt im Weg stehen.",
    hagen: "Gerade neben den Brandherden ist dein Kalender die ehrlichste Strategie. Wenn Strategie und Kultur keinen festen Platz darin haben, verlieren sie gegen das Dringende – jeden Tag.",
    modelle: [
      { name: "What Got You Here …", text: "Goldsmith: Erfolgreiche Führungskräfte scheitern oft an Gewohnheiten, die sie für Stärken halten – etwa immer noch etwas hinzufügen wollen, zu schnell urteilen, selbst die Lösung liefern, nicht danken. Die Frage ist: Welche Gewohnheit muss ich jetzt ablegen?", quelle: "Goldsmith – What Got You Here Won't Get You There" },
      { name: "Einflusskreis", text: "Covey: Lenke Energie in den Kreis dessen, was du beeinflussen kannst, statt in den größeren Kreis der Sorgen. Proaktive Führungskräfte vergrößern so mit der Zeit ihren Einfluss.", quelle: "Covey – Die 7 Wege zur Effektivität" },
      { name: "Eisenhower-Prinzip", text: "Dringend vs. wichtig. Brandherde sind dringend; Strategie, Kultur und Personalentwicklung sind wichtig, aber selten dringend – und verlieren ohne bewusste Planung immer.", quelle: "Zeitmanagement" },
      { name: "Leader Standard Work", text: "Feste Führungsroutinen mit Kalenderblöcken: Vor-Ort-Zeit, Einzelgespräche, Lagetakt, Reflexion. Die Routine schützt das Wichtige vor dem Dringenden und macht Führung für das Team berechenbar.", quelle: "Mann – Creating a Lean Culture" },
      { name: "Energie managen", text: "Loehr und Schwartz: Leistung hängt nicht nur von Zeit ab, sondern von körperlicher, emotionaler, mentaler und sinnbezogener Energie. Erholung ist Teil der Leistung – wie im Lauftraining.", quelle: "Loehr & Schwartz – The Power of Full Engagement" },
    ],
    praxis: [
      "Schreib eine „Nicht-mehr-Liste“: drei Dinge, die du als Projektleiter selbst gemacht hast und ab Januar bewusst abgibst.",
      "Blocke ab Januar wöchentlich feste Zeiten: zweimal vor Ort, einmal 90 Minuten Strategie, freitags 30 Minuten Reflexion.",
      "Sortiere deine Aufgaben einen Tag lang nach Eisenhower. Wie viel liegt in „wichtig, nicht dringend“?",
      "Bitte eine Vertrauensperson, dir in den ersten 100 Tagen zu spiegeln, wenn du in alte Muster fällst.",
    ],
    fragen: [
      "Welche meiner Stärken könnte in der neuen Rolle zur Schwäche werden?",
      "Was gibt mir Energie – und plane ich es bewusst ein?",
      "Was soll mein Team in einem Jahr über meinen Führungsstil sagen?",
    ],
    karten: [
      { q: "Kernthese von „What Got You Here Won't Get You There“?", a: "Gewohnheiten, die früher zum Erfolg beigetragen haben, können auf der nächsten Stufe zum Hindernis werden." },
      { q: "Was ist Leader Standard Work?", a: "Feste, geplante Führungsroutinen (vor Ort, 1:1, Lagetakt, Reflexion), die das Wichtige vor dem Dringenden schützen." },
      { q: "Welche vier Energiedimensionen nennen Loehr & Schwartz?", a: "Körperlich, emotional, mental, sinnbezogen (spirituell)." },
      { q: "Was unterscheidet Linie von Projekt aus Führungssicht?", a: "Projekt: Ziel, Termin, Abschluss. Linie: Dauerbetrieb, Menschen, Kultur – ohne Enddatum." },
    ],
    quellen: ["Marshall Goldsmith – What Got You Here Won't Get You There (2007)", "Stephen R. Covey – The 7 Habits of Highly Effective People (1989)", "David Mann – Creating a Lean Culture (2005)", "Jim Loehr & Tony Schwartz – The Power of Full Engagement (2003)"],
  },
  {
    id: "change", icon: "🔄", title: "Veränderung & Beteiligung", w: [0.5, 1, 2.5, 2.5],
    kurz: "Aus Betroffenen Beteiligte machen – auch die Mitbestimmung.",
    kern: "Menschen wehren sich selten gegen Veränderung an sich, sondern gegen Verlust: von Sicherheit, Status, Gewohntem. Beteiligung macht aus Betroffenen Mitgestalter. Frühe, offene Einbindung der Mitbestimmung ist dabei keine Formalie, sondern Erfolgsbedingung.",
    hagen: "Wenn du Strategie und Kultur verändern willst, brauchst du eine Koalition: formelle Führungskräfte, informelle Meinungsführer und den Betriebsrat. Wer früh beteiligt ist, verteidigt die Veränderung später mit.",
    modelle: [
      { name: "Acht Stufen nach Kotter", text: "Dringlichkeit erzeugen, Führungskoalition bilden, Vision und Strategie entwickeln, Vision kommunizieren, Hindernisse beseitigen, kurzfristige Erfolge sichtbar machen, Erfolge konsolidieren, Veränderung in der Kultur verankern.", quelle: "Kotter – Leading Change" },
      { name: "ADKAR", text: "Veränderung gelingt Person für Person: Awareness (Bewusstsein), Desire (Wollen), Knowledge (Wissen), Ability (Können), Reinforcement (Verstärkung). Wer feststeckt, steckt an der schwächsten Stufe fest – dort ansetzen.", quelle: "Hiatt – ADKAR" },
      { name: "Widerstand als Information", text: "Widerstand zeigt, was Menschen wichtig ist oder was übersehen wurde. Statt zu überzeugen, hilft fragen: „Was müsste passieren, damit das für dich funktioniert?“", quelle: "Change-Praxis" },
      { name: "Mitbestimmung früh einbinden", text: "Der Betriebsrat hat bei Planung von Arbeitsabläufen, Arbeitszeitfragen und Betriebsänderungen Informations- bzw. Mitbestimmungsrechte (Betriebsverfassungsgesetz). Frühe, offene Einbindung spart Zeit und schafft Legitimation. Details immer mit dem Personalbereich klären.", quelle: "BetrVG" },
      { name: "Auftauen – Verändern – Einfrieren", text: "Lewin: Erst Bereitschaft schaffen (das Alte infrage stellen), dann verändern, dann das Neue stabilisieren. Viele Veränderungen scheitern, weil die dritte Phase fehlt.", quelle: "Lewin (1947)" },
    ],
    praxis: [
      "Benenne für dein erstes Vorhaben fünf bis sieben Personen für die Führungskoalition – auch informelle Meinungsführer.",
      "Lade den Betriebsrat früh zu einem offenen Austausch ein: Was nimmst du wahr, was planst du, was ist ihm wichtig?",
      "Frag bei Widerstand nach dem dahinterliegenden Anliegen, bevor du argumentierst.",
      "Mach den ersten kleinen Erfolg sichtbar – mit den Namen derer, die ihn ermöglicht haben.",
    ],
    fragen: [
      "Was verlieren Menschen durch meine geplanten Veränderungen – und habe ich das anerkannt?",
      "Wer sind die informellen Meinungsführer, und kennen sie meine Absicht?",
      "Warum sollte jemand im Netz jetzt etwas ändern wollen?",
    ],
    karten: [
      { q: "Nenne die ersten drei Stufen nach Kotter.", a: "Dringlichkeit erzeugen, Führungskoalition bilden, Vision und Strategie entwickeln." },
      { q: "Wofür steht ADKAR?", a: "Awareness, Desire, Knowledge, Ability, Reinforcement." },
      { q: "Lewins drei Phasen?", a: "Auftauen (unfreeze), Verändern (change), Einfrieren/Stabilisieren (refreeze)." },
      { q: "Wogegen wehren sich Menschen bei Veränderung meist?", a: "Gegen Verlust – von Sicherheit, Status, Kompetenzgefühl, Gewohntem." },
    ],
    quellen: ["John P. Kotter – Leading Change (1996)", "Jeffrey M. Hiatt – ADKAR (2006)", "Kurt Lewin – Frontiers in Group Dynamics (1947)"],
  },
  {
    id: "schnittstellen", icon: "🔗", title: "Schnittstellen & Stakeholder", w: [2, 2.5, 1.5, 1.5],
    kurz: "Viele Brandherde entstehen zwischen den Bereichen.",
    kern: "Instandhaltung wirkt im Geflecht: Betrieb, Bauprojekte, Fahrplan- und Baubetriebsplanung, Regionalbereich, Fremdfirmen, Kommunen. Viele Brandherde entstehen an Schnittstellen. Beziehungen, die vor der Krise aufgebaut sind, tragen in der Krise.",
    hagen: "Dein Hintergrund im Projektmanagement Oberbau ist hier ein Vorteil: Du kennst die Projektseite. Eine gute Beziehung zu den Projekten, die im Netz bauen, kann Störungen und Konflikte um Sperrpausen spürbar entschärfen.",
    modelle: [
      { name: "Stakeholder-Landkarte", text: "Einfluss × Interesse, ergänzt um die Haltung (Unterstützer, neutral, kritisch). Hilft, Beziehungsarbeit bewusst zu verteilen, statt nur auf den zu reagieren, der am lautesten ist.", quelle: "Stakeholder-Management" },
      { name: "Beziehungskonto", text: "Covey: Vertrauen entsteht durch viele kleine Einzahlungen – Zusagen halten, früh informieren, zuhören, danken. In Krisen wird abgehoben. Wer vorher nichts eingezahlt hat, steht schnell im Minus.", quelle: "Covey – Die 7 Wege zur Effektivität" },
      { name: "RACI an Schnittstellen", text: "Wer ist verantwortlich (Responsible), wer entscheidet (Accountable), wer wird konsultiert (Consulted), wer informiert (Informed)? Unklarheit an Schnittstellen erzeugt Doppelarbeit, Lücken – und Brandherde.", quelle: "Projektmanagement" },
      { name: "Managing up", text: "Halte deine Führungskraft proaktiv informiert, bringe Lösungsvorschläge statt nur Probleme, kläre Prioritäten bei Zielkonflikten früh und kenne ihre Ziele und Zwänge.", quelle: "Gabarro & Kotter – HBR 1980" },
    ],
    praxis: [
      "Erstelle eine Stakeholder-Landkarte mit den zehn wichtigsten Schnittstellen und plane in den ersten 60 Tagen ein Kennenlerngespräch mit jeder.",
      "Kläre für die konfliktreichste Schnittstelle eine einfache RACI für die drei häufigsten Abstimmungsfälle.",
      "Vereinbare mit deiner Führungskraft einen festen Rhythmus und ein Format für Lage-Updates.",
      "Mach pro Woche eine bewusste Einzahlung ins Beziehungskonto einer wichtigen Schnittstelle.",
    ],
    fragen: [
      "An welcher Schnittstelle entstehen die meisten Brandherde – und wer ist dort mein Gegenüber?",
      "Welche Stakeholder kennen mich noch nicht, sollten es aber vor der ersten Krise?",
      "Was erwartet meine Führungskraft wirklich von mir – und habe ich es schriftlich?",
    ],
    karten: [
      { q: "Wofür steht RACI?", a: "Responsible (macht), Accountable (entscheidet/verantwortet), Consulted (wird gefragt), Informed (wird informiert)." },
      { q: "Was ist das Beziehungskonto nach Covey?", a: "Bild für Vertrauen: kleine Einzahlungen (Zusagen halten, informieren) schaffen Guthaben, das in Krisen trägt." },
      { q: "Zwei Achsen der Stakeholder-Landkarte?", a: "Einfluss und Interesse (ergänzt um Haltung)." },
      { q: "Kern von „Managing up“?", a: "Führungskraft proaktiv informieren, Lösungen mitbringen, Prioritäten früh klären, ihre Ziele kennen." },
    ],
    quellen: ["Stephen R. Covey – The 7 Habits of Highly Effective People (1989)", "John J. Gabarro & John P. Kotter – Managing Your Boss (HBR 1980)"],
  },
  {
    id: "urteil", icon: "🧠", title: "Klar denken & entscheiden", w: [2, 2.5, 2, 1.5],
    kurz: "Urteilskraft in komplexen Lagen: Denkfallen erkennen, Kennzahlen richtig lesen.",
    kern: "In unruhigen Lagen entscheidet die Qualität des Denkens mehr als die Menge der Informationen. Kluge, erfahrene Menschen sind vor Denkfehlern nicht geschützt – oft sind sie sogar besser darin, ihre Irrtümer zu begründen. Urteilskraft lässt sich trainieren: durch das Prüfen von Annahmen, das Denken in Wahrscheinlichkeiten, den kritischen Blick auf Kennzahlen und eine Kultur, in der Widerspruch erwünscht ist.",
    hagen: "Wer ein Netz mit Brandherden übernimmt, steht unter Druck, schnell zu deuten und zu handeln. Gerade dann drohen typische Fehler: Symptome statt Ursachen bekämpfen, Nebenwirkungen übersehen, Kennzahlen mit der Wirklichkeit verwechseln. Ein paar feste Denkroutinen im Führungskreis wirken hier wie eine Sicherung.",
    modelle: [
      { name: "Fehler im Umgang mit Komplexität", text: "Der Psychologe Dietrich Dörner ließ Menschen komplexe Systeme in Simulationen steuern. Typische Fehler: Ziele werden nicht geklärt, Nebenwirkungen und Zeitverzögerungen übersehen, Probleme einzeln statt im Zusammenhang behandelt, und unter Druck wird übersteuert oder in Aktionismus verfallen. Erfolgreiche Steuerer fragen mehr, prüfen Annahmen und beobachten die Wirkung ihrer Eingriffe.", quelle: "Dörner – Die Logik des Mißlingens" },
      { name: "Goodharts Gesetz", text: "Wird eine Kennzahl zum Ziel, hört sie auf, eine gute Kennzahl zu sein. Menschen optimieren die Zahl statt der Sache – durch Umdeuten, Verschieben oder Weglassen. Jerry Muller beschreibt, wie übertriebene Messung („Metric Fixation“) Urteilskraft verdrängt. Kennzahlen bleiben nützlich, wenn sie Gespräche anstoßen statt Urteile ersetzen.", quelle: "Muller – The Tyranny of Metrics" },
      { name: "Halo-Effekt", text: "Ein Gesamteindruck färbt das Urteil über Einzelmerkmale: Läuft es gut, wirken Führung, Strategie und Kultur im Nachhinein brillant; läuft es schlecht, wirken dieselben Dinge mangelhaft. Phil Rosenzweig zeigt, wie dieser Effekt viele Erfolgsstudien der Managementliteratur verzerrt. Gegenmittel: Entscheidungen nach Qualität des Vorgehens beurteilen, nicht nur nach dem Ergebnis.", quelle: "Rosenzweig – The Halo Effect" },
      { name: "In Wahrscheinlichkeiten denken", text: "Philip Tetlocks Forschung zeigt: Gute Prognostiker denken in Wahrscheinlichkeiten statt in Gewissheiten, beginnen mit Basisraten („Wie oft passiert so etwas üblicherweise?“), aktualisieren ihr Urteil in kleinen Schritten und messen ihre Treffsicherheit. Breit interessierte „Füchse“ schneiden dabei besser ab als „Igel“ mit einer großen Theorie.", quelle: "Tetlock & Gardner – Superforecasting" },
      { name: "Die Illusion des Wissens", text: "Menschen glauben, Dinge besser zu verstehen, als sie es tun – bis sie erklären sollen, wie etwas genau funktioniert. Steven Sloman und Philip Fernbach zeigen: Wissen liegt großenteils in der Gemeinschaft, nicht im einzelnen Kopf. Für Führung heißt das: Expertise im Team aktiv abrufen und um Erklärungen bitten statt um Meinungen.", quelle: "Sloman & Fernbach – The Knowledge Illusion" },
    ],
    praxis: [
      "Stelle vor der nächsten wichtigen Entscheidung drei Fragen: Was ist das eigentliche Ziel? Welche Nebenwirkungen sind möglich? Woran würden wir merken, dass wir falsch liegen?",
      "Schau dir eine Kennzahl an, die im Netz besonders beachtet wird, und frag: Wie könnte man sie verbessern, ohne dass sich in der Sache etwas verbessert?",
      "Bitte in einer Besprechung jemanden, eine Annahme Schritt für Schritt zu erklären statt nur zu bewerten – und beobachte, was dabei ans Licht kommt.",
      "Formuliere eine Erwartung für die nächsten Wochen als Wahrscheinlichkeit (z. B. „70 %, dass …“) und prüfe sie später nach.",
    ],
    fragen: [
      "Welche meiner Überzeugungen über das Netz habe ich noch nie ernsthaft geprüft?",
      "Wo verwechseln wir eine gute Zahl mit einer guten Lage?",
      "Wer in meinem Umfeld widerspricht mir – und höre ich wirklich hin?",
    ],
    karten: [
      { q: "Nenne drei typische Fehler im Umgang mit komplexen Systemen nach Dörner.", a: "Ziele nicht klären, Nebenwirkungen und Zeitverzögerungen übersehen, unter Druck übersteuern bzw. in Aktionismus verfallen." },
      { q: "Was besagt Goodharts Gesetz?", a: "Wird eine Kennzahl zum Ziel, hört sie auf, eine gute Kennzahl zu sein." },
      { q: "Was ist der Halo-Effekt im Management?", a: "Der Gesamteindruck (z. B. Erfolg) färbt das Urteil über Einzelmerkmale wie Strategie, Führung oder Kultur." },
      { q: "Was zeichnet gute Prognostiker nach Tetlock aus?", a: "Denken in Wahrscheinlichkeiten, Start bei Basisraten, schrittweises Aktualisieren, Messen der eigenen Treffsicherheit." },
    ],
    quellen: ["Dietrich Dörner – Die Logik des Mißlingens (1989)", "Jerry Z. Muller – The Tyranny of Metrics (2018)", "Phil Rosenzweig – The Halo Effect (2007)", "Philip E. Tetlock & Dan Gardner – Superforecasting (2015)", "Steven Sloman & Philip Fernbach – The Knowledge Illusion (2017)"],
  },
];

export const moduleById = (id) => MODULES.find((m) => m.id === id);

// Alle Impulse als flache Liste
export const IMPULSES = (() => {
  const out = [];
  for (const m of MODULES) {
    m.modelle.forEach((x, i) => out.push({ id: `${m.id}-m${i}`, mod: m.id, type: "wissen", title: x.name, text: x.text, quelle: x.quelle }));
    m.fragen.forEach((x, i) => out.push({ id: `${m.id}-f${i}`, mod: m.id, type: "frage", title: "Reflexionsfrage", text: x }));
    m.praxis.forEach((x, i) => out.push({ id: `${m.id}-p${i}`, mod: m.id, type: "praxis", title: "Zum Ausprobieren", text: x }));
  }
  for (const ph of PHASES) {
    ph.impulse.forEach((x, i) => out.push({ id: `${ph.id}-i${i}`, phase: ph.id, type: "phase", title: x.title, text: x.text }));
  }
  return out;
})();
export const impulseById = (id) => IMPULSES.find((x) => x.id === id);

export const CARDS = MODULES.flatMap((m) => m.karten.map((k, i) => ({ id: `${m.id}-k${i}`, mod: m.id, ...k })));

export const TYPE_LABEL = { wissen: "Wissen", frage: "Frage", praxis: "Ausprobieren", phase: "Phase" };

// Vertiefungsarten für Copilot
export const DEEPEN = [
  { id: "lage", label: "Auf meine Lage übertragen", ask: "Übertrage diesen Impuls auf meine Situation. Nutze dafür die Informationen, die du über meine Organisation und meinen Bereich hast. Nenne drei konkrete Ansatzpunkte und woran ich merke, dass sie wirken." },
  { id: "experiment", label: "Als 2-Wochen-Experiment planen", ask: "Mach daraus ein konkretes Experiment für die nächsten zwei Wochen: Ziel, konkrete Schritte mit Terminen, woran ich Erfolg erkenne, mögliche Stolpersteine." },
  { id: "gegen", label: "Gegenposition einnehmen", ask: "Spiele Advocatus Diaboli: Was spricht in meiner Situation gegen diesen Impuls? Wann wäre er falsch oder schädlich? Was übersehe ich?" },
  { id: "gespraech", label: "Gespräch vorbereiten", ask: "Hilf mir, ein Gespräch oder eine Besprechung zu diesem Thema vorzubereiten: Ziel, Einstieg, fünf gute Fragen, möglicher Widerstand und wie ich damit umgehe." },
  { id: "fk", label: "Für den Führungskreis aufbereiten", ask: "Bereite den Impuls als 15-Minuten-Input für meinen Führungskreis auf: Kernidee, Bezug zu uns, eine kurze Übung, eine Diskussionsfrage." },
  { id: "ziel", label: "Bezug zu Ruhe & WHY", ask: "Wie zahlt dieser Impuls auf meine beiden Ziele ein – das Netz in ruhigere Fahrwasser bringen und unser WHY herausarbeiten? Wo gibt es Zielkonflikte?" },
];

// ---------- Aufbereitung von Posts und Recherche ----------
export const RESULT_FIELDS = ["titel", "kernaussage", "deutsch", "modul", "bezug_ih", "frage", "experiment", "karten"];

// Anweisung für das Claude-Projekt „Führungskompass-Posts“ (wird in der App zum Kopieren angeboten)
export const PROJECT_PROMPT = `# Rolle
Du bist zugleich erfahrener Führungscoach und UI/UX-Designer für visuelle Kommunikation. Du bereitest Instagram-Posts so auf, dass ich sie in meiner Lern-App „Führungskompass“ auf dem iPhone schnell erfassen, verstehen und im Führungsalltag anwenden kann.

# Über mich
- Ich übernehme zum 01.01.2027 die Leitung der Instandhaltung im Netz Hagen (DB InfraGO). Vorher war ich Leiter Projektmanagement Oberbau.
- Meine Ziele: ${GOALS}.
- Prüfe anhand des heutigen Datums, ob ich mich noch in der Vorbereitung befinde oder schon im Amt bin, und richte „bezug_ih“ und „experiment“ darauf aus.

# Was du bekommst
Ein oder mehrere Screenshots eines Instagram-Posts (Bild, Karussell oder Reel), oft auf Englisch.
- Lies allen Text auf allen Bildern, auch Text in Grafiken, Folien und Untertiteln. Halte bei Karussells die Reihenfolge der Bilder ein.
- Ignoriere Bedienelemente und Beiwerk: Likes, Kommentare, Buttons, Werbung, Hashtags, „Mehr anzeigen“.
- Ist ein Bild unleserlich oder fehlt Text, markiere die Stelle mit [unleserlich]. Nichts erfinden oder ergänzen, was nicht im Post steht.

# Was du lieferst
Antworte AUSSCHLIESSLICH mit genau einem JSON-Codeblock – kein Text davor oder danach, keine Rückfragen.

\`\`\`json
{
  "titel": "prägnanter deutscher Titel, max. 60 Zeichen, ohne Emoji",
  "autor": "@konto, falls erkennbar, sonst leer",
  "sprache": "Sprachkürzel des Originals, z. B. en oder de",
  "original": "vollständiger Originaltext aller Bilder in Reihenfolge, als Klartext",
  "deutsch": "vollständige deutsche Fassung als gestaltetes Markdown (siehe Gestaltung)",
  "kernaussage": "die Kernaussage in einem klaren Satz, ohne Markdown",
  "modul": "genau eine ID aus der Modulliste",
  "bezug_ih": "Markdown: 2–3 Stichpunkte, die jeweils mit einem **fetten Kernwort** beginnen",
  "frage": "eine Reflexionsfrage an mich, Klartext",
  "experiment": "Markdown: ein **fetter Einleitungssatz**, dann 2–4 nummerierte, konkrete Schritte für die nächsten zwei Wochen",
  "karten": [{ "frage": "Vorderseite der Lernkarte", "antwort": "Rückseite, kurz" }]
}
\`\`\`

# Modulliste
${MODULES.map((m) => `- ${m.id} = ${m.title}`).join("\n")}

# Gestaltung von „deutsch“
Ziel: maximal übersichtlich, grafisch ansprechend, auf dem Handy in Sekunden scannbar.
1. **Einstieg:** ein Zitatblock mit der fett gesetzten Kernbotschaft: \`> **…**\`
2. **Gliederung:** 2–4 Abschnitte mit \`## \`-Überschrift, jeweils mit einem thematisch passenden Emoji davor.
3. **Absätze:** höchstens 2–3 kurze Sätze, keine Schachtelsätze, luftiger Lesefluss.
4. **Fettungen:** gezielt für Schlüsselwörter und Kernaussagen, nicht ganze Sätze.
5. **Listen:** Aufzählungen mit \`- \` statt Textwüsten; Listenpunkte dürfen mit einem Emoji beginnen.
6. **Tabellen:** nur bei Kennzahlen, Vergleichen oder Gegenüberstellungen (\`| Spalte | Spalte |\` mit Trennzeile \`|---|---|\`).
7. **Trenner:** \`---\` zwischen größeren Abschnitten, wo es die Gliederung klarer macht.
8. **Emojis:** sparsam und passend – höchstens eins pro Überschrift oder Listenpunkt, nie mehrere hintereinander.
9. **Vollständigkeit:** alle Inhalte des Posts bleiben erhalten, nur besser strukturiert. Keine eigenen Ergänzungen im Teil „deutsch“ – deine Einordnung gehört in „bezug_ih“.
10. **Erlaubtes Markdown:** nur Überschriften (##, ###), **fett**, *kursiv*, Listen, Zitatblock, Tabelle, ---. Keine Links, Bilder, HTML oder Codeblöcke innerhalb der Werte.

Beispiel für die Form von „deutsch“ (Ausschnitt):

\`\`\`markdown
> **Vertrauen entsteht durch kleine, gehaltene Zusagen.**

## 🤝 Die Idee
Teams vertrauen nicht großen Worten, sondern **verlässlichem Verhalten**.

- ✅ Zusagen klein halten
- 📅 Termine einhalten

---

## 📊 Wirkung
| Verhalten | Folge |
|---|---|
| Zusage gehalten | **Vertrauen wächst** |
\`\`\`

# Inhaltliche Regeln
- **Kritisch bleiben:** Ist eine Aussage verkürzt, zugespitzt, ohne Beleg oder widerspricht sie gängiger Forschung, sag das in „bezug_ih“ in einem eigenen Stichpunkt (**Einordnung:** …).
- **Bezug zur IH:** konkret auf Instandhaltung, Brandherde, Führungskreis, Schnittstellen und mein WHY-Vorhaben beziehen – keine Allgemeinplätze. Keine Behauptungen über interne Verhältnisse bei der DB.
- **Lernkarten:** 1–3 Karten, die das Wesentliche abfragen; Antworten in einem Satz.
- **Sprache:** Deutsch, klar, aktiv, direkt; „du“-Ansprache in „frage“ und „experiment“.

# Format-Sicherheit (vor dem Absenden prüfen)
- Das JSON ist gültig: alle Felder vorhanden, Kommas korrekt, keine Kommentare.
- Zeilenumbrüche innerhalb von Werten als \\n, keine echten Zeilenumbrüche in Strings.
- Keine geraden doppelten Anführungszeichen (") innerhalb von Werten – verwende stattdessen „ “ oder ' '.
- „modul“ ist exakt eine ID aus der Modulliste.
- Antwort enthält nur den einen JSON-Codeblock.`;
