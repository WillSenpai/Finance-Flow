import { createDynamicLessonDefinition } from "./defaultLessonDefinition";
import type { LessonDefinition, StructuredNodeContent } from "./types";

type LessonBlueprint = {
  id: string;
  title: string;
<<<<<<< HEAD
  chapterFocus: string;
=======
  topicFocus: string;
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
  coreIdea: string;
  whyItMatters: string;
  practicalRule: string;
  commonMistake: string;
  caseStudy: string;
  defensiveLens: string;
  enterprisingLens: string;
  checklist: string[];
  decisionScenario: string;
  decisionOptions: string[];
  quizQuestion: string;
  quizOptions: string[];
  actionPlan: string[];
  extraNodes?: StructuredNodeContent[];
};

const lessons: LessonBlueprint[] = [
<<<<<<< HEAD
  {
    id: "1",
    title: "Cos'è la Finanza?",
    chapterFocus: "La base di tutto",
    coreIdea: "La finanza è la scienza che studia come allocare risorse scarse nel tempo, gestendo il trade-off tra rischio e rendimento.",
    whyItMatters: "La finanza è ovunque: nelle decisioni quotidiane, nelle scelte aziendali e nella gestione del patrimonio. Capirla significa prendere decisioni più consapevoli e ridurre l'incertezza.",
    practicalRule: "Prima di prendere una decisione finanziaria, chiediti: quali sono le alternative? Qual è il trade-off tra rischio e rendimento?",
    commonMistake: "Confondere un titolo che sale con un investimento migliore, senza verificare utili, cassa o prezzo pagato.",
    caseStudy: "Durante una fase euforica molti comprano societa senza utili solo perche crescono in Borsa. Quando il sentiment cambia, il prezzo collassa e la tesi non esiste.",
    defensiveLens: "Il profilo difensivo evita asset con tesi non dimostrabile e privilegia strumenti semplici e diversificati.",
    enterprisingLens: "Il profilo intraprendente puo operare su inefficienze, ma solo con processo scritto e metriche di controllo.",
    checklist: ["Tesi verificabile", "Valutazione ragionevole", "Rischio downside", "Orizzonte coerente"],
    decisionScenario: "Un titolo fa +35% in 6 settimane ma non trovi miglioramenti nei fondamentali. Cosa fai?",
    decisionOptions: [
      "Resto fuori finche non ho tesi e prezzo coerenti",
=======
  // Lesson 8: Cos'è un investimento (vs speculazione)
  {
    id: "8",
    title: "Cos'è un investimento (vs speculazione)",
    topicFocus: "Differenza tra investimento e speculazione",
    coreIdea: "💡 Investire significa comprare valore economico con una tesi verificabile. Speculare significa scommettere su un movimento di prezzo.",
    whyItMatters: "⚠️ La differenza determina il rischio che assumi: volatilità temporanea o perdita permanente di capitale.",
    practicalRule: "📝 Prima di acquistare scrivi in 2 righe: perché questo asset genera valore e quando la tesi diventa falsa.",
    commonMistake: "🚫 Confondere un titolo che sale con un buon investimento, senza verificare utili, cassa o prezzo pagato.",
    caseStudy: "📊 Durante fasi euforiche molti comprano società senza utili solo perché salgono. Quando il sentiment cambia, il prezzo crolla.",
    defensiveLens: "🛡️ Il profilo difensivo evita asset con tesi non dimostrabile e privilegia strumenti semplici.",
    enterprisingLens: "🎯 Il profilo intraprendente può operare su inefficienze, ma solo con processo scritto.",
    checklist: ["Tesi verificabile", "Valutazione ragionevole", "Rischio downside", "Orizzonte coerente"],
    decisionScenario: "Un titolo fa +35% in 6 settimane ma non trovi miglioramenti nei fondamentali. Cosa fai?",
    decisionOptions: [
      "Resto fuori finché non ho tesi e prezzo coerenti",
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
      "Compro una quota per non perdere il treno",
      "Entro e incremento se continua a salire",
    ],
    quizQuestion: "Quale frase descrive meglio un investimento intelligente?",
    quizOptions: [
      "Acquisto con margine di sicurezza e tesi verificabile",
<<<<<<< HEAD
      "Acquisto perche il prezzo sta salendo",
      "Acquisto perche ne parlano tutti",
=======
      "Acquisto perché il prezzo sta salendo",
      "Acquisto perché ne parlano tutti",
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
    ],
    actionPlan: [
      "Definisci 3 criteri minimi pre-acquisto",
      "Rifiuta ogni idea che non supera i 3 criteri",
      "Rivedi i criteri ogni 30 giorni",
    ],
  },
<<<<<<< HEAD
  {
    id: "9",
    title: "Investimento vs Speculazione",
    chapterFocus: "Capitolo 1: Investment versus Speculation",
    coreIdea: "Investire significa comprare una quota di valore economico con una tesi verificabile; speculare significa scommettere su un movimento di prezzo.",
    whyItMatters: "La differenza determina il tipo di rischio che stai assumendo: volatilita temporanea contro perdita permanente di capitale.",
    practicalRule: "Prima di acquistare scrivi in 2 righe: perche questo asset genera valore e in quali condizioni la tesi diventa falsa.",
    commonMistake: "Confondere un titolo che sale con un investimento migliore, senza verificare utili, cassa o prezzo pagato.",
    caseStudy: "Durante una fase euforica molti comprano societa senza utili solo perche crescono in Borsa. Quando il sentiment cambia, il prezzo collassa e la tesi non esiste.",
    defensiveLens: "Il profilo difensivo evita asset con tesi non dimostrabile e privilegia strumenti semplici e diversificati.",
    enterprisingLens: "Il profilo intraprendente puo operare su inefficienze, ma solo con processo scritto e metriche di controllo.",
    checklist: ["Tesi verificabile", "Valutazione ragionevole", "Rischio downside", "Orizzonte coerente"],
    decisionScenario: "Un titolo fa +35% in 6 settimane ma non trovi miglioramenti nei fondamentali. Cosa fai?",
    decisionOptions: [
      "Resto fuori finche non ho tesi e prezzo coerenti",
      "Compro una quota per non perdere il treno",
      "Entro e incremento se continua a salire",
    ],
    quizQuestion: "Quale frase descrive meglio un investimento intelligente?",
    quizOptions: [
      "Acquisto con margine di sicurezza e tesi verificabile",
      "Acquisto perche il prezzo sta salendo",
      "Acquisto perche ne parlano tutti",
    ],
    actionPlan: [
      "Definisci 3 criteri minimi pre-acquisto",
      "Rifiuta ogni idea che non supera i 3 criteri",
      "Rivedi i criteri ogni 30 giorni",
    ],
  },
  {
    id: "10",
    title: "Risultati Attesi e Obiettivi Realistici",
    chapterFocus: "Capitoli 1-3: aspettative e contesto di mercato",
    coreIdea: "L'obiettivo non e battere sempre il mercato, ma ottenere risultati adeguati al rischio e sostenibili nel tempo.",
    whyItMatters: "Aspettative irrealistiche portano overtrading, rincorsa ai rendimenti e scelte incoerenti con i tuoi obiettivi reali.",
    practicalRule: "Per ogni obiettivo finanziario fissa: orizzonte, rendimento atteso prudente, perdita massima tollerata.",
    commonMistake: "Usare performance recenti come previsione certa del futuro e cambiare strategia ogni trimestre.",
    caseStudy: "Un investitore punta al 20% annuo per comprare casa in 4 anni. Aumenta rischio, subisce drawdown e perde capitale proprio quando serve liquidita.",
    defensiveLens: "Rendimento adeguato, volatilita contenuta, priorita alla probabilita di centrare l'obiettivo.",
    enterprisingLens: "Extra-rendimento possibile solo su quota satellite separata dal capitale destinato a obiettivi certi.",
    checklist: ["Obiettivo con data", "Rendimento prudente", "Perdita tollerata", "Regola di revisione"],
    decisionScenario: "Obiettivo casa tra 4 anni. Hai due alternative: portafoglio aggressivo o bilanciato disciplinato. Cosa scegli?",
    decisionOptions: [
      "Bilanciato disciplinato, con probabilita piu alta di centrare la data",
=======

  // Lesson 12: Orizzonte temporale e obiettivi
  {
    id: "12",
    title: "Orizzonte temporale e obiettivi",
    topicFocus: "Aspettative e contesto di mercato",
    coreIdea: "🎯 L'obiettivo non è battere sempre il mercato. È ottenere risultati adeguati al rischio e sostenibili nel tempo.",
    whyItMatters: "⚠️ Aspettative irrealistiche portano overtrading e scelte incoerenti con i tuoi obiettivi reali.",
    practicalRule: "📝 Per ogni obiettivo fissa: orizzonte, rendimento prudente, perdita massima tollerata.",
    commonMistake: "🚫 Usare performance recenti come previsione certa e cambiare strategia ogni trimestre.",
    caseStudy: "📊 Un investitore punta al 20% annuo per comprare casa in 4 anni. Aumenta il rischio, subisce drawdown, perde capitale.",
    defensiveLens: "🛡️ Rendimento adeguato, volatilità contenuta, priorità a centrare l'obiettivo.",
    enterprisingLens: "🎯 Extra-rendimento solo su quota satellite separata dal capitale per obiettivi certi.",
    checklist: ["Obiettivo con data", "Rendimento prudente", "Perdita tollerata", "Regola di revisione"],
    decisionScenario: "Obiettivo casa tra 4 anni. Hai due alternative: portafoglio aggressivo o bilanciato disciplinato. Cosa scegli?",
    decisionOptions: [
      "Bilanciato disciplinato, con probabilità più alta di centrare la data",
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
      "Aggressivo, per massimizzare il rendimento atteso",
      "Cambio approccio ogni mese seguendo il mercato",
    ],
    quizQuestion: "Come si definisce un obiettivo di investimento ben impostato?",
    quizOptions: [
      "Con orizzonte, rischio massimo e piano coerente",
<<<<<<< HEAD
      "Con il rendimento piu alto possibile",
=======
      "Con il rendimento più alto possibile",
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
      "Confrontando solo i rendimenti passati",
    ],
    actionPlan: [
      "Scrivi un obiettivo reale con data precisa",
      "Assegna soglia di perdita accettabile",
      "Aggiorna il piano solo a scadenze prefissate",
    ],
  },
<<<<<<< HEAD
  {
    id: "11",
    title: "Inflazione e Potere d'Acquisto",
    chapterFocus: "Capitolo 2: The Investor and Inflation",
    coreIdea: "Il capitale nominale puo crescere mentre il potere d'acquisto reale diminuisce.",
    whyItMatters: "Se non misuri rendimento reale netto, puoi credere di migliorare mentre stai solo inseguendo i prezzi.",
    practicalRule: "Monitora ogni trimestre: rendimento nominale - inflazione - costi = rendimento reale netto.",
    commonMistake: "Tenere troppa liquidita non remunerata pensando che sia sempre la scelta piu sicura.",
    caseStudy: "Portafoglio +4%, inflazione +3%, costi 1%: risultato reale circa 0%. Nessuna crescita del potere d'acquisto.",
    defensiveLens: "Protezione graduale del potere d'acquisto con strumenti semplici e costi contenuti.",
    enterprisingLens: "Possibile ricerca di premi reali superiori, ma solo con controllo rigoroso di rischio e costi.",
    checklist: ["Inflazione media", "Costo totale", "Rendimento reale", "Correzione allocazione"],
    decisionScenario: "Saldo in crescita ma inflazione alta. Qual e il segnale corretto da guardare?",
=======

  // Lesson 13: Profilo investitore: difensivo vs intraprendente
  {
    id: "13",
    title: "Profilo investitore: difensivo vs intraprendente",
    topicFocus: "Profili e strategie di investimento",
    coreIdea: "💡 Non esiste un profilo migliore in assoluto. Il difensivo vince con semplicità, l'intraprendente con metodo rigoroso.",
    whyItMatters: "⚠️ Scegliere il profilo sbagliato porta a errori costosi: difensivo che fa trading o intraprendente senza processo.",
    practicalRule: "📝 Valuta onestamente tempo, competenze e disciplina. Nel dubbio, parti difensivo e rivaluta tra 12 mesi.",
    commonMistake: "🚫 Sopravvalutare le proprie capacità e sottovalutare il tempo per una gestione attiva efficace.",
    caseStudy: "📊 Investitore con poco tempo passa da ETF a stock picking: aumentano errori e costi, non i risultati.",
    defensiveLens: "🛡️ Core diversificato, poche regole chiare, decisioni solo su calendario. Processo robusto in ogni scenario.",
    enterprisingLens: "🎯 Quota satellite con metriche. Prima definisci universo titoli, criteri di ingresso/uscita e limiti.",
    checklist: ["Tempo disponibile", "Competenze attuali", "Disciplina sotto stress", "Obiettivi principali"],
    decisionScenario: "Hai solo 30 minuti al mese per investire. Quale assetto è più coerente?",
    decisionOptions: [
      "Portafoglio semplice e automatizzato",
      "Selezione frequente di singoli titoli",
      "Cambio strategia in base alle notizie",
    ],
    quizQuestion: "Qual è il vero vantaggio del profilo difensivo?",
    quizOptions: [
      "Ridurre errori grossi e restare nel piano",
      "Massimizzare guadagni in ogni trimestre",
      "Prevedere i minimi e massimi di mercato",
    ],
    actionPlan: [
      "Valuta onestamente il tuo tempo settimanale",
      "Scegli un profilo e definisci le regole base",
      "Imposta una review tra 6-12 mesi per rivalutare",
    ],
  },

  // Lesson 15: Analisi fondamentale base
  {
    id: "15",
    title: "Analisi fondamentale base",
    topicFocus: "Analisi fondamentale per l'investitore",
    coreIdea: "💡 Pochi indicatori ben letti bastano per evitare molte trappole. Non serve complessità.",
    whyItMatters: "⚠️ La narrativa può essere seducente. Cassa, margini e debito raccontano la sostenibilità reale.",
    practicalRule: "📝 Valuta insieme utili normalizzati, leva finanziaria e generazione di cassa.",
    commonMistake: "🚫 Guardare solo la crescita dei ricavi ignorando la qualità degli utili.",
    caseStudy: "📊 Società con ricavi in crescita ma cassa debole e debito in aumento: valutazione fragile.",
    defensiveLens: "🛡️ Preferenza per bilanci solidi e utili meno ciclici.",
    enterprisingLens: "🎯 Possibile operare su disallineamenti, ma con maggiore onere analitico.",
    checklist: ["Debito sostenibile", "Cassa operativa", "Margini", "Qualità utili"],
    decisionScenario: "Titolo con utili crescenti ma debito in accelerazione. Qual è la priorità?",
    decisionOptions: [
      "Verificare sostenibilità finanziaria prima di investire",
      "Comprare perché il trend utili è positivo",
      "Ignorare bilancio e seguire prezzo",
    ],
    quizQuestion: "Quale triade è più utile per una prima analisi?",
    quizOptions: [
      "Cassa, debito, qualità utili",
      "Like social, news e momentum",
      "Solo variazione prezzo settimanale",
    ],
    actionPlan: [
      "Scegli una società e valuta i 3 indicatori chiave",
      "Scrivi una conclusione in 5 righe",
      "Confronta con una società simile",
    ],
  },

  // Lesson 29: Inflazione e potere d'acquisto
  {
    id: "29",
    title: "Inflazione e potere d'acquisto",
    topicFocus: "Investitore e inflazione",
    coreIdea: "💡 Il capitale nominale può crescere mentre il potere d'acquisto reale diminuisce.",
    whyItMatters: "⚠️ Se non misuri il rendimento reale netto, puoi credere di migliorare inseguendo i prezzi.",
    practicalRule: "📝 Monitora: rendimento nominale - inflazione - costi = rendimento reale netto.",
    commonMistake: "🚫 Tenere troppa liquidità non remunerata pensando sia sempre la scelta più sicura.",
    caseStudy: "📊 Portafoglio +4%, inflazione +3%, costi 1%: risultato reale circa 0%. Nessuna crescita reale.",
    defensiveLens: "🛡️ Protezione del potere d'acquisto con strumenti semplici e costi contenuti.",
    enterprisingLens: "🎯 Ricerca di premi reali superiori, ma con controllo rigoroso di rischio e costi.",
    checklist: ["Inflazione media", "Costo totale", "Rendimento reale", "Correzione allocazione"],
    decisionScenario: "Saldo in crescita ma inflazione alta. Qual è il segnale corretto da guardare?",
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
    decisionOptions: [
      "Rendimento reale netto del portafoglio",
      "Solo valore assoluto del conto",
      "Numero di operazioni concluse",
    ],
    quizQuestion: "Quale metrica evita l'illusione monetaria?",
    quizOptions: [
      "Rendimento reale netto",
      "Rendimento nominale lordo",
      "Performance dell'ultimo mese",
    ],
    actionPlan: [
      "Calcola il tuo rendimento reale ultimo trimestre",
<<<<<<< HEAD
      "Identifica il costo piu impattante da ridurre",
      "Pianifica una revisione allocazione anti-inflazione",
    ],
  },
  {
    id: "12",
    title: "Asset Allocation e Ribilanciamento",
    chapterFocus: "Capitoli 4 e 8: policy di portafoglio e fluttuazioni",
    coreIdea: "L'allocazione guida il rischio complessivo molto piu del singolo titolo scelto.",
    whyItMatters: "Senza ribilanciamento, il portafoglio deriva verso rischi non intenzionali dopo fasi estreme di mercato.",
    practicalRule: "Definisci pesi target e soglie di deviazione; ribilancia quando la soglia e superata.",
    commonMistake: "Lasciare correre l'asset vincente senza valutare che il rischio totale e aumentato.",
    caseStudy: "Target 60/40 diventa 72/28 dopo rally. Il rischio effettivo non e piu quello deciso inizialmente.",
    defensiveLens: "Ribilanciamento periodico semplice, senza market timing.",
    enterprisingLens: "Possibili aggiustamenti tattici solo dentro limiti predefiniti.",
    checklist: ["Pesi target", "Soglia deviazione", "Frequenza controllo", "Regola esecuzione"],
    decisionScenario: "Portafoglio fuori target da mesi. Qual e la mossa disciplinata?",
    decisionOptions: [
      "Ribilanciare gradualmente verso i target",
      "Non toccare nulla finche il trend continua",
      "Aumentare ancora la parte gia salita",
    ],
    quizQuestion: "Perche il ribilanciamento e centrale nel metodo Graham?",
    quizOptions: [
      "Perche riallinea rischio e processo",
      "Perche massimizza sempre il rendimento",
      "Perche elimina le perdite",
=======
      "Identifica il costo più impattante da ridurre",
      "Pianifica una revisione allocazione anti-inflazione",
    ],
  },

  // Lesson 35: Asset allocation e ribilanciamento
  {
    id: "35",
    title: "Asset allocation e ribilanciamento",
    topicFocus: "Policy di portafoglio e fluttuazioni",
    coreIdea: "💡 L'allocazione guida il rischio complessivo molto più del singolo titolo scelto.",
    whyItMatters: "⚠️ Senza ribilanciamento, il portafoglio deriva verso rischi non intenzionali.",
    practicalRule: "📝 Definisci pesi target e soglie di deviazione. Ribilancia quando la soglia è superata.",
    commonMistake: "🚫 Lasciare correre l'asset vincente senza valutare che il rischio totale è aumentato.",
    caseStudy: "📊 Target 60/40 diventa 72/28 dopo rally. Il rischio non è più quello deciso inizialmente.",
    defensiveLens: "🛡️ Ribilanciamento periodico semplice, senza market timing.",
    enterprisingLens: "🎯 Aggiustamenti tattici possibili solo dentro limiti predefiniti.",
    checklist: ["Pesi target", "Soglia deviazione", "Frequenza controllo", "Regola esecuzione"],
    decisionScenario: "Portafoglio fuori target da mesi. Qual è la mossa disciplinata?",
    decisionOptions: [
      "Ribilanciare gradualmente verso i target",
      "Non toccare nulla finché il trend continua",
      "Aumentare ancora la parte già salita",
    ],
    quizQuestion: "Perché il ribilanciamento è importante?",
    quizOptions: [
      "Perché riallinea rischio e processo",
      "Perché massimizza sempre il rendimento",
      "Perché elimina le perdite",
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
    ],
    actionPlan: [
      "Scrivi i target del tuo portafoglio",
      "Definisci la soglia di deviazione",
      "Imposta un controllo mensile o trimestrale",
    ],
  },
<<<<<<< HEAD
  {
    id: "13",
    title: "Profilo Defensive Investor",
    chapterFocus: "Capitoli 4, 5 e 14",
    coreIdea: "Il difensivo vince con semplicità, costanza, costi bassi e controllo emotivo.",
    whyItMatters: "La maggioranza degli investitori non ha tempo o vantaggio informativo per strategie complesse.",
    practicalRule: "Core diversificato, regole poche e chiare, decisioni solo su calendario.",
    commonMistake: "Cercare scorciatoie performative e trasformare un piano difensivo in trading impulsivo.",
    caseStudy: "Investitore con poco tempo passa da ETF globali a stock picking frequente: aumentano errori e costi, non la qualita del risultato.",
    defensiveLens: "Processo ripetibile e robusto in qualunque scenario.",
    enterprisingLens: "Eventuale quota attiva limitata e separata dal core.",
    checklist: ["Core semplice", "Costi bassi", "Regole calendario", "Diversificazione ampia"],
    decisionScenario: "Hai solo 30 minuti al mese per investire. Quale assetto e piu coerente?",
    decisionOptions: [
      "Portafoglio semplice e automatizzato",
      "Selezione frequente di singoli titoli",
      "Cambio strategia in base alle notizie",
    ],
    quizQuestion: "Qual e il vero vantaggio del profilo difensivo?",
    quizOptions: [
      "Ridurre errori grossi e restare nel piano",
      "Massimizzare guadagni in ogni trimestre",
      "Prevedere i minimi e massimi di mercato",
    ],
    actionPlan: [
      "Riduci una complessita inutile del tuo portafoglio",
      "Automatizza un versamento periodico",
      "Definisci una review fissa al mese",
    ],
  },
  {
    id: "14",
    title: "Profilo Enterprising Investor",
    chapterFocus: "Capitoli 6, 7 e 15",
    coreIdea: "Essere intraprendente non significa rischiare di piu: significa lavorare con metodo piu rigoroso.",
    whyItMatters: "Senza processo misurabile, l'approccio attivo degrada in speculazione.",
    practicalRule: "Prima del capitale attivo definisci universo titoli, criteri ingresso/uscita e limiti di esposizione.",
    commonMistake: "Chiamare investimento attivo decisioni estemporanee non documentate.",
    caseStudy: "Una strategia attiva senza benchmark e senza log decisionale sembra buona finche il mercato sale; poi non sai distinguere abilita da fortuna.",
    defensiveLens: "Capitale core intoccabile e separato.",
    enterprisingLens: "Quota satellite con metriche e accountability.",
    checklist: ["Quota satellite", "Regole scritto", "Benchmark", "Review performance"],
    decisionScenario: "Vuoi fare gestione attiva. Quale e il primo passo corretto?",
    decisionOptions: [
      "Definire policy operativa prima di qualsiasi trade",
      "Aprire subito posizioni e poi capire le regole",
      "Aumentare size dopo ogni trade vincente",
    ],
    quizQuestion: "Quando l'approccio intraprendente e legittimo?",
    quizOptions: [
      "Quando processo e metriche sono testabili",
      "Quando il mercato e molto volatile",
      "Quando vuoi recuperare una perdita recente",
    ],
    actionPlan: [
      "Definisci dimensione massima quota attiva",
      "Scrivi 3 regole di ingresso e uscita",
      "Imposta review mensile vs benchmark",
    ],
  },
  {
    id: "15",
    title: "Mr. Market e Volatilita",
    chapterFocus: "Capitolo 8",
    coreIdea: "Mr. Market offre prezzi ogni giorno; non impone decisioni ogni giorno.",
    whyItMatters: "Saper tollerare volatilita riduce vendite emotive nei momenti peggiori.",
    practicalRule: "Quando il mercato accelera o crolla, confronta prezzo e tesi prima di agire.",
    commonMistake: "Interpretare ogni movimento come un segnale operativo obbligatorio.",
    caseStudy: "Durante un -12% dell'indice, chi segue il piano ribilancia; chi segue la paura liquida nel punto di stress massimo.",
    defensiveLens: "Volatilita come costo temporaneo per rendimento di lungo termine.",
    enterprisingLens: "Volatilita come possibile fonte di opportunita selettive, non di frenesia.",
=======

  // Lesson 37: Value investing
  {
    id: "37",
    title: "Value investing",
    topicFocus: "Principi fondamentali del value investing",
    coreIdea: "💡 Il value investing consiste nell'acquistare attività a un prezzo inferiore al loro valore intrinseco.",
    whyItMatters: "⚠️ Comprare valore con sconto offre protezione e potenziale quando il mercato riconosce il vero valore.",
    practicalRule: "📝 Calcola un valore intrinseco prudente prima di guardare il prezzo. Compra solo con margine.",
    commonMistake: "🚫 Confondere prezzo basso con buon affare. Un'azienda scadente a prezzo basso resta scadente.",
    caseStudy: "📊 Acquisto di Coca-Cola nel 1988: il mercato sottovalutava la forza del brand e dei cash flow ricorrenti.",
    defensiveLens: "🛡️ Focus su aziende stabili, utili prevedibili e valutazioni moderate vs multipli storici.",
    enterprisingLens: "🎯 Ricerca di situazioni speciali: spin-off, ristrutturazioni, small cap con catalyst.",
    checklist: ["Valore intrinseco stimato", "Margine di sicurezza", "Qualità del business", "Catalyst per valore"],
    decisionScenario: "Un'azienda solida scambia a 12x gli utili, sotto la media storica di 18x. Come procedi?",
    decisionOptions: [
      "Analizzo perché è sottovalutata e valuto se la tesi è solida",
      "Compro subito perché è a sconto",
      "Aspetto che scenda ancora per massimizzare il rendimento",
    ],
    quizQuestion: "Qual è il principio chiave del value investing?",
    quizOptions: [
      "Comprare valore intrinseco con sconto e margine di sicurezza",
      "Comprare i titoli più popolari del momento",
      "Seguire il trend di prezzo",
    ],
    actionPlan: [
      "Studia come calcolare il valore intrinseco base",
      "Identifica 3 aziende e stima un range di valore",
      "Definisci il margine di sicurezza minimo che richiedi",
    ],
  },

  // Lesson 38: Margin of safety
  {
    id: "38",
    title: "Margin of safety",
    topicFocus: "Margine di sicurezza come concetto centrale",
    coreIdea: "💡 Il margine di sicurezza è la distanza protettiva tra valore prudente e prezzo pagato.",
    whyItMatters: "⚠️ Riduce l'impatto di errori di stima, eventi imprevisti e volatilità.",
    practicalRule: "📝 Stima valore prudente, definisci prezzo massimo, acquista solo se il gap è sufficiente.",
    commonMistake: "🚫 Abbassare il margine per partecipare a un'opportunità percepita come urgente.",
    caseStudy: "📊 Valore prudente 100, prezzo 70: 30% di margine non garantisce successo ma migliora rischio/rendimento.",
    defensiveLens: "🛡️ Pretendere margine più ampio e business comprensibili.",
    enterprisingLens: "🎯 Margine variabile per qualità della tesi, ma mai azzerato.",
    checklist: ["Valore prudente", "Prezzo massimo", "Rischi tesi", "Dimensionamento posizione"],
    decisionScenario: "Prezzo attraente ma tesi qualitativa debole. Cosa prevale?",
    decisionOptions: [
      "Qualità tesi prima del prezzo",
      "Prezzo basso basta per comprare",
      "Aumento size per sfruttare il presunto sconto",
    ],
    quizQuestion: "Che cosa NON è il margine di sicurezza?",
    quizOptions: [
      "Una garanzia di rendimento",
      "Una protezione contro errori di valutazione",
      "Un filtro prima dell'acquisto",
    ],
    actionPlan: [
      "Definisci prezzo massimo per la prossima idea",
      "Annota i rischi che possono invalidare la tesi",
      "Decidi in anticipo il size della posizione",
    ],
  },

  // Lesson 39: Mr. Market e psicologia
  {
    id: "39",
    title: "Mr. Market e psicologia",
    topicFocus: "Investitore e fluttuazioni di mercato",
    coreIdea: "💡 Mr. Market offre prezzi ogni giorno, ma non impone decisioni ogni giorno.",
    whyItMatters: "⚠️ Saper tollerare volatilità riduce vendite emotive nei momenti peggiori.",
    practicalRule: "📝 Quando il mercato accelera o crolla, confronta prezzo e tesi prima di agire.",
    commonMistake: "🚫 Interpretare ogni movimento come un segnale operativo obbligatorio.",
    caseStudy: "📊 Durante un -12% dell'indice, chi segue il piano ribilancia. Chi segue la paura liquida nel punto peggiore.",
    defensiveLens: "🛡️ Volatilità come costo temporaneo per rendimento di lungo termine.",
    enterprisingLens: "🎯 Volatilità come fonte di opportunità selettive, non di frenesia.",
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
    checklist: ["Tesi invariata?", "Prezzo vs valore", "Rischio totale", "Regola piano"],
    decisionScenario: "Indice in forte calo ma fondamentali medi stabili. Cosa fai?",
    decisionOptions: [
      "Resto nel processo e valuto ribilanciamento",
      "Vendo tutto per ridurre ansia",
<<<<<<< HEAD
      "Compro a caso tutto cio che scende",
    ],
    quizQuestion: "Qual e il modo corretto di usare Mr. Market?",
=======
      "Compro a caso tutto ciò che scende",
    ],
    quizQuestion: "Qual è il modo corretto di usare Mr. Market?",
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
    quizOptions: [
      "Come fornitore di prezzi, non come consulente",
      "Come indicatore infallibile di timing",
      "Come motivo per cambiare piano continuamente",
    ],
    actionPlan: [
      "Scrivi la tua regola anti-panico",
      "Definisci quando NON agire",
      "Imposta trigger oggettivi per ribilanciare",
    ],
  },
<<<<<<< HEAD
  {
    id: "16",
    title: "Fondi e Index Investing",
    chapterFocus: "Capitolo 9",
    coreIdea: "Per molti investitori, fondi indicizzati a basso costo sono il modo piu efficiente per stare nel mercato.",
    whyItMatters: "I costi certi erodono rendimento in modo potente nel lungo periodo.",
    practicalRule: "Confronta sempre costo totale, ampiezza indice, tracking e ruolo nel portafoglio.",
    commonMistake: "Scegliere strumenti costosi per marketing, non per valore aggiunto reale.",
    caseStudy: "Fondo 1,8% vs 0,2% su stessa esposizione: differenza cumulata enorme dopo 10-15 anni.",
    defensiveLens: "Core indicizzato semplice e stabile.",
    enterprisingLens: "Eventuale gestione attiva solo su quota separata e giustificata.",
    checklist: ["Costo totale", "Indice replicato", "Tracking", "Coerenza con obiettivo"],
    decisionScenario: "Due fondi simili per esposizione, costi molto diversi. Cosa pesa di piu?",
    decisionOptions: [
      "Costo e trasparenza a parita di esposizione",
      "Ultima performance mensile",
      "Brand del gestore",
    ],
    quizQuestion: "Qual e il criterio dominante per il core di lungo periodo?",
    quizOptions: [
      "Efficienza netta: costi bassi e diversificazione",
      "Storytelling commerciale",
      "Frequenza di ribilanciamento del gestore",
    ],
    actionPlan: [
      "Raccogli costo totale dei tuoi strumenti",
      "Verifica se ogni strumento ha un ruolo preciso",
      "Sostituisci una posizione inefficiente",
    ],
  },
  {
    id: "17",
    title: "Analisi di Bilancio per Investitori",
    chapterFocus: "Capitoli 11 e 12",
    coreIdea: "Pochi indicatori ben letti bastano per evitare molte trappole.",
    whyItMatters: "La narrativa puo essere seducente; cassa, margini e debito raccontano la sostenibilita reale.",
    practicalRule: "Valuta insieme utili normalizzati, leva finanziaria e generazione di cassa.",
    commonMistake: "Guardare solo crescita ricavi ignorando qualita degli utili.",
    caseStudy: "Societa con ricavi in forte crescita ma flussi di cassa deboli e debito in aumento: rischio di valutazione fragile.",
    defensiveLens: "Preferenza per bilanci solidi e utili meno ciclici.",
    enterprisingLens: "Possibile operare su disallineamenti, ma con maggiore onere analitico.",
    checklist: ["Debito sostenibile", "Cassa operativa", "Margini", "Qualita utili"],
    decisionScenario: "Titolo con utili crescenti ma debito in accelerazione. Qual e la priorita?",
    decisionOptions: [
      "Verificare sostenibilita finanziaria prima di investire",
      "Comprare perche il trend utili e positivo",
      "Ignorare bilancio e seguire prezzo",
    ],
    quizQuestion: "Quale triade e piu utile per una prima analisi?",
    quizOptions: [
      "Cassa, debito, qualita utili",
      "Like social, news e momentum",
      "Solo variazione prezzo settimanale",
    ],
    actionPlan: [
      "Scegli una societa e valuta i 3 indicatori chiave",
      "Scrivi una conclusione in 5 righe",
      "Confronta con una societa simile",
    ],
  },
  {
    id: "18",
    title: "Selezione Titoli: Difensivo vs Intraprendente",
    chapterFocus: "Capitoli 14, 15 e 18",
    coreIdea: "I criteri di selezione dipendono dal ruolo del capitale, non dall'umore del mercato.",
    whyItMatters: "Mescolare logiche difensive e speculative nello stesso capitale crea caos operativo.",
    practicalRule: "Separa core e satellite con filtri diversi e limiti espliciti.",
    commonMistake: "Applicare filtri aggressivi alla parte di capitale che dovrebbe proteggere stabilita.",
    caseStudy: "Portafoglio 80/20: quando il satellite cresce troppo, va ridimensionato per non alterare il profilo di rischio totale.",
    defensiveLens: "Qualita, valutazione ragionevole, stabilita utili.",
    enterprisingLens: "Inefficienze selettive, ma con size contenuta e regole stringenti.",
    checklist: ["Ruolo posizione", "Filtro appropriato", "Size massima", "Regola uscita"],
    decisionScenario: "Una posizione satellite raddoppia e diventa dominante. Qual e la scelta disciplinata?",
    decisionOptions: [
      "Ridurre e riportare al peso target",
      "Lasciare correre senza limiti",
      "Aumentare ancora esposizione",
    ],
    quizQuestion: "Qual e la regola chiave nella selezione titoli multi-profilo?",
    quizOptions: [
      "Coerenza tra criterio e funzione della quota di capitale",
      "Usare sempre il filtro piu aggressivo",
      "Cambiare profilo in base ai titoli popolari",
    ],
    actionPlan: [
      "Classifica ogni posizione come core o satellite",
      "Definisci filtro minimo per ciascun gruppo",
      "Verifica se i pesi sono coerenti con il tuo profilo",
    ],
  },
  {
    id: "19",
    title: "Errori Tipici dell'Investitore",
    chapterFocus: "Capitoli 17 e 18",
    coreIdea: "Gli errori ricorrenti non si eliminano con previsioni migliori, ma con un processo migliore.",
    whyItMatters: "Un buon processo riduce errori ripetuti e protegge il capitale nei momenti di stress.",
    practicalRule: "Tieni un diario decisionale con tesi, rischio, trigger di revisione e risultato finale.",
    commonMistake: "Valutare una decisione solo dall'esito di breve periodo, non dalla qualita del processo.",
    caseStudy: "Vendita in panico e ricompro piu in alto: senza post-mortem, lo stesso pattern si ripete al prossimo shock.",
    defensiveLens: "Routine e checklist per evitare errori grossi.",
    enterprisingLens: "Revisioni piu frequenti e metriche di performance risk-adjusted.",
    checklist: ["Tesi scritta", "Trigger revisione", "Errore emerso", "Correzione operativa"],
    decisionScenario: "Hai deviato dal piano sotto pressione emotiva. Qual e la mossa utile?",
=======

  // Lesson 40: Errori comuni dell'investitore
  {
    id: "40",
    title: "Errori comuni dell'investitore",
    topicFocus: "Casi di studio e confronto tra aziende",
    coreIdea: "💡 Gli errori ricorrenti non si eliminano con previsioni migliori, ma con un processo migliore.",
    whyItMatters: "⚠️ Un buon processo riduce errori ripetuti e protegge il capitale nei momenti di stress.",
    practicalRule: "📝 Tieni un diario decisionale: tesi, rischio, trigger di revisione, risultato finale.",
    commonMistake: "🚫 Valutare una decisione solo dall'esito di breve periodo, non dalla qualità del processo.",
    caseStudy: "📊 Vendita in panico e riacquisto più in alto: senza post-mortem lo stesso pattern si ripete.",
    defensiveLens: "🛡️ Routine e checklist per evitare errori grossi.",
    enterprisingLens: "🎯 Revisioni più frequenti e metriche di performance risk-adjusted.",
    checklist: ["Tesi scritta", "Trigger revisione", "Errore emerso", "Correzione operativa"],
    decisionScenario: "Hai deviato dal piano sotto pressione emotiva. Qual è la mossa utile?",
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
    decisionOptions: [
      "Fare post-mortem e aggiornare una regola",
      "Ignorare l'episodio e andare avanti",
      "Cambiare completamente strategia",
    ],
    quizQuestion: "Quale pratica riduce meglio errori comportamentali ripetuti?",
    quizOptions: [
      "Diario decisionale + revisione periodica",
      "Aumentare numero di trade",
      "Seguire opinioni del momento",
    ],
    actionPlan: [
      "Compila il primo post-mortem su un errore recente",
      "Estrai una regola nuova e misurabile",
      "Applica la regola per i prossimi 30 giorni",
    ],
  },
<<<<<<< HEAD
  {
    id: "20",
    title: "Margin of Safety",
    chapterFocus: "Capitolo 20",
    coreIdea: "Il margine di sicurezza e la distanza protettiva tra valore prudente e prezzo pagato.",
    whyItMatters: "Riduce l'impatto di errori di stima, eventi imprevisti e volatilita.",
    practicalRule: "Stima valore prudente, definisci prezzo massimo d'ingresso, acquista solo se il gap e sufficiente.",
    commonMistake: "Abbassare il margine pur di partecipare a un'opportunita percepita come urgente.",
    caseStudy: "Valore prudente 100, prezzo 70: il 30% di margine non garantisce successo ma migliora il profilo rischio/rendimento.",
    defensiveLens: "Pretendere margine piu ampio e business comprensibili.",
    enterprisingLens: "Margine variabile per qualità della tesi, ma mai azzerato.",
    checklist: ["Valore prudente", "Prezzo massimo", "Rischi tesi", "Dimensionamento posizione"],
    decisionScenario: "Prezzo attraente ma tesi qualitativa debole. Cosa prevale?",
    decisionOptions: [
      "Qualita tesi prima del prezzo",
      "Prezzo basso basta per comprare",
      "Aumento size per sfruttare il presunto sconto",
    ],
    quizQuestion: "Che cosa NON e il margine di sicurezza?",
    quizOptions: [
      "Una garanzia di rendimento",
      "Una protezione contro errori di valutazione",
      "Un filtro prima dell'acquisto",
    ],
    actionPlan: [
      "Definisci prezzo massimo per la prossima idea",
      "Annota i rischi che possono invalidare la tesi",
      "Decidi in anticipo il size della posizione",
    ],
  },
=======
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
];

function introNodes(lesson: LessonBlueprint): StructuredNodeContent[] {
  return [
    {
      nodeKey: "map",
      semanticType: "map",
      goal: "Orientarti nella lezione e capire il percorso",
      estimatedMinutes: 1,
      checkpointPrompt: "Sai spiegare in una frase cosa imparerai in questa lezione?",
      criteria: ["foundational", "integration"],
      blocks: [
        {
          kind: "focus",
<<<<<<< HEAD
          title: "Mappa della lezione",
          content: `${lesson.chapterFocus}. In questa lezione farai un percorso completo: principio, casi, checklist decisionale, test e piano operativo finale.`,
        },
        {
          kind: "explain",
          title: "Perche conta",
=======
          title: "🗺️ Mappa della lezione",
          content: `📍 ${lesson.topicFocus}. Percorso completo: principio, casi, checklist e piano operativo.`,
        },
        {
          kind: "explain",
          title: "⭐ Perché conta",
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
          content: lesson.whyItMatters,
        },
        {
          kind: "question",
<<<<<<< HEAD
          title: "Checkpoint",
          content:
            "Prima di proseguire: riesci a dire in parole semplici quale decisione concreta questa lezione ti aiuta a prendere meglio?",
=======
          title: "🧠 Verifichiamo: perché serve un metodo?",
          content: "Qual è il vantaggio principale di avere un processo definito per le decisioni finanziarie?",
          pollAreas: [
            {
              id: `map-check-${lesson.id}`,
              prompt: "Qual è il vantaggio principale?",
              options: [
                "Elimina l'influenza delle emozioni sulle decisioni",
                "Garantisce rendimenti più alti",
                "Permette di prevedere il mercato",
              ],
              correctIndex: 0,
              correctExplanation: "Esatto! Un processo definito **elimina l'emotività**.\n\nQuando hai regole chiare, non devi decidere sul momento sotto pressione. Applichi il processo e le emozioni non possono sabotarti.",
              wrongExplanation: "Nessun metodo può garantire rendimenti o prevedere il mercato.\n\n**Il vero vantaggio di un processo è eliminare l'emotività:**\n• Paura e euforia non influenzano le decisioni\n• Applichi regole definite in anticipo\n• Riduci errori impulsivi\n\nQuesto vale per ogni decisione finanziaria.",
              allowText: false,
            },
          ],
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
        },
      ],
    },
    {
      nodeKey: "concept_core",
      semanticType: "concept",
<<<<<<< HEAD
      goal: "Capire il principio chiave senza ambiguita",
      estimatedMinutes: 2,
      criteria: ["foundational", "learning"],
      blocks: [
        { kind: "focus", title: "Idea centrale", content: lesson.coreIdea },
        {
          kind: "explain",
          title: "Traduzione pratica",
          content: `Regola operativa: ${lesson.practicalRule}`,
        },
        {
          kind: "question",
          title: "Errore da evitare",
=======
      goal: "Capire il principio chiave senza ambiguità",
      estimatedMinutes: 2,
      criteria: ["foundational", "learning"],
      blocks: [
        { kind: "focus", title: "💡 Idea centrale", content: lesson.coreIdea },
        {
          kind: "explain",
          title: "📌 Traduzione pratica",
          content: lesson.practicalRule,
        },
        {
          kind: "question",
          title: "🧠 Verifica comprensione",
          content: "Hai capito il principio chiave?",
          pollAreas: [
            {
              id: `concept-verify-${lesson.id}`,
              prompt: "Quale affermazione è corretta?",
              options: [
                "Ho capito e posso applicarlo subito",
                "Ho bisogno di un esempio concreto",
                "Vorrei approfondire prima di procedere",
              ],
              allowText: true,
            },
          ],
        },
        {
          kind: "focus",
          title: "🚫 Errore da evitare",
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
          content: lesson.commonMistake,
        },
      ],
    },
  ];
}

function buildChecklistContent(items: string[]): string {
  if (!items.length) {
    return "Nessun punto checklist configurato.";
  }
  return items.map((item, index) => `${index + 1}) ${item}`).join(", ");
}

function buildActionPlanContent(items: string[]): string {
  if (!items.length) {
    return "Definisci almeno un'azione concreta da avviare oggi.";
  }
  return items.map((item, index) => `${index + 1}) ${item}`).join("\n");
}

function buildNodes(lesson: LessonBlueprint): StructuredNodeContent[] {
  const base: StructuredNodeContent[] = [
    ...introNodes(lesson),
    {
      nodeKey: "deep_dive",
      semanticType: "deep_dive",
<<<<<<< HEAD
      goal: "Entrare nei meccanismi con maggiore profondita",
=======
      goal: "Entrare nei meccanismi con maggiore profondità",
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
      estimatedMinutes: 2,
      checkpointPrompt: "Riesci a collegare il concetto a una decisione reale del tuo portafoglio?",
      criteria: ["integration", "application"],
      blocks: [
        {
          kind: "focus",
<<<<<<< HEAD
          title: "Meccanismo",
          content: `${lesson.coreIdea} ${lesson.whyItMatters}`,
        },
        {
          kind: "explain",
          title: "Cosa osservare",
          content: `Quando prendi una decisione, verifica questi punti: ${buildChecklistContent(lesson.checklist)}.`,
        },
        {
          kind: "exercise",
          title: "Micro-esercizio",
          content: "Prendi un investimento reale o simulato e valuta se passa almeno 3 punti della checklist.",
=======
          title: "🔍 Meccanismo",
          content: lesson.coreIdea,
        },
        {
          kind: "explain",
          title: "📋 Cosa osservare",
          content: `✅ Verifica questi punti: ${buildChecklistContent(lesson.checklist)}.`,
        },
        {
          kind: "question",
          title: "🧠 Quiz rapido",
          content: "Quale punto della checklist è più importante per te?",
          pollAreas: [
            {
              id: `deep-dive-quiz-${lesson.id}`,
              prompt: "Seleziona il punto prioritario",
              options: lesson.checklist,
              allowText: true,
            },
          ],
        },
        {
          kind: "question",
          title: "🧠 Verifica: applicazione checklist",
          content: "Pensa a un investimento reale o simulato.\n\nDevi verificare se passa i punti della checklist.",
          pollAreas: [
            {
              id: `deep-dive-verify-${lesson.id}`,
              prompt: "Quanti punti della checklist deve passare un investimento per essere considerato?",
              options: [
                "Almeno 3 punti su 4",
                "Solo 1 punto è sufficiente",
                "Non serve verificare la checklist",
              ],
              allowText: false,
            },
          ],
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
        },
      ],
    },
    {
      nodeKey: "historical_case",
      semanticType: "worked_example",
      goal: "Imparare da un caso realistico",
      estimatedMinutes: 2,
      criteria: ["learning", "caring"],
      blocks: [
<<<<<<< HEAD
        { kind: "focus", title: "Caso", content: lesson.caseStudy },
        {
          kind: "explain",
          title: "Lezione dal caso",
          content: "Osserva come una scelta apparentemente logica diventa fragile se manca metodo. Il caso serve a riconoscere segnali prima dell'errore.",
        },
        {
          kind: "question",
          title: "Domanda guida",
          content: "Quale passaggio del caso avresti gestito diversamente seguendo una regola scritta?",
=======
        { kind: "focus", title: "📊 Caso di studio", content: lesson.caseStudy },
        {
          kind: "explain",
          title: "📖 Lezione dal caso",
          content: "🎯 Una scelta apparentemente logica diventa fragile senza metodo. Il caso serve a riconoscere i segnali prima dell'errore.",
        },
        {
          kind: "question",
          title: "🧠 Riflessione",
          content: "Cosa avresti fatto diversamente?",
          pollAreas: [
            {
              id: `case-reflect-${lesson.id}`,
              prompt: "Come avresti gestito la situazione?",
              options: [
                "Avrei seguito una regola scritta",
                "Avrei aspettato più dati",
                "Avrei ridotto l'esposizione",
              ],
              allowText: true,
            },
          ],
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
        },
      ],
    },
    {
      nodeKey: "profile_lens",
      semanticType: "profile_lens",
      goal: "Distinguere applicazione difensiva e intraprendente",
      estimatedMinutes: 2,
      checkpointPrompt: "Sai quale lente usare in base al tuo profilo?",
      criteria: ["integration", "human"],
      blocks: [
<<<<<<< HEAD
        { kind: "focus", title: "Lente difensiva", content: lesson.defensiveLens },
        { kind: "explain", title: "Lente intraprendente", content: lesson.enterprisingLens },
        {
          kind: "exercise",
          title: "Scelta profilo",
          content: "Scrivi una frase: oggi questa decisione appartiene al mio core difensivo oppure alla quota satellite? Perche?",
=======
        { kind: "focus", title: "🛡️ Lente difensiva", content: lesson.defensiveLens },
        { kind: "explain", title: "🎯 Lente intraprendente", content: lesson.enterprisingLens },
        {
          kind: "question",
          title: "🧠 Il tuo profilo",
          content: "Quale approccio si adatta meglio alla tua situazione?",
          pollAreas: [
            {
              id: `profile-choice-${lesson.id}`,
              prompt: "Seleziona il tuo approccio",
              options: [
                "Difensivo: semplicità e protezione",
                "Intraprendente: analisi e opportunità",
                "Ibrido: core difensivo + satellite attivo",
              ],
              allowText: true,
            },
          ],
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
        },
      ],
    },
    {
      nodeKey: "operational_checklist",
      semanticType: "checklist",
      goal: "Passare dalla teoria a una procedura concreta",
      estimatedMinutes: 2,
      checkpointPrompt: "Hai una checklist che puoi riusare senza ripensare tutto ogni volta?",
      criteria: ["application", "learning"],
      blocks: [
        {
          kind: "focus",
<<<<<<< HEAD
          title: "Checklist",
=======
          title: "✅ Checklist operativa",
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
          content: `Prima di agire controlla: ${buildChecklistContent(lesson.checklist)}.`,
        },
        {
          kind: "explain",
<<<<<<< HEAD
          title: "Uso corretto",
          content: "La checklist non predice il mercato: riduce errori evitabili e mantiene coerenza nelle decisioni sotto stress.",
        },
        {
          kind: "exercise",
          title: "Applicazione",
          content: "Applica la checklist a una decisione che devi prendere questa settimana e annota il punto piu difficile.",
=======
          title: "📌 Uso corretto",
          content: "⚠️ La checklist non predice il mercato. Riduce errori evitabili e mantiene coerenza sotto stress.",
        },
        {
          kind: "question",
          title: "🧠 Test checklist",
          content: "Quale punto è più difficile da verificare per te?",
          pollAreas: [
            {
              id: `checklist-test-${lesson.id}`,
              prompt: "Seleziona il punto più impegnativo",
              options: lesson.checklist,
              allowText: true,
            },
          ],
        },
        {
          kind: "question",
          title: "🧠 Verifica: applicazione pratica",
          content: "Pensa a una decisione di investimento che devi prendere questa settimana.",
          pollAreas: [
            {
              id: `checklist-apply-${lesson.id}`,
              prompt: "Quale punto della checklist è più difficile da verificare?",
              options: lesson.checklist.slice(0, 3),
              allowText: true,
            },
          ],
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
        },
      ],
    },
    {
      nodeKey: "decision_lab",
      semanticType: "decision_lab",
      goal: "Allenare scelta e motivazione su scenario reale",
      estimatedMinutes: 2,
      checkpointPrompt: "Sai difendere la tua decisione con un criterio e non con un'emozione?",
      criteria: ["application", "integration"],
      blocks: [
<<<<<<< HEAD
        { kind: "focus", title: "Scenario", content: lesson.decisionScenario },
        {
          kind: "question",
          title: "Scegli",
          content: "Seleziona l'opzione piu coerente con il metodo della lezione e spiega il perche in una riga.",
          pollAreas: [
            {
              id: `decision-${lesson.id}`,
              prompt: "Qual e la scelta corretta?",
=======
        { kind: "focus", title: "🎬 Scenario", content: lesson.decisionScenario },
        {
          kind: "question",
          title: "🤔 La tua scelta",
          content: "Seleziona l'opzione più coerente con il metodo.",
          pollAreas: [
            {
              id: `decision-${lesson.id}`,
              prompt: "Qual è la scelta corretta?",
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
              options: lesson.decisionOptions,
              allowText: true,
            },
          ],
        },
<<<<<<< HEAD
=======
        {
          kind: "explain",
          title: "💡 Perché conta",
          content: "🎯 La risposta giusta è sempre quella che segue un processo definito in anticipo, non l'emozione del momento.",
        },
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
      ],
    },
    {
      nodeKey: "quiz",
      semanticType: "quiz",
      goal: "Verificare comprensione prima di chiudere",
      estimatedMinutes: 2,
      checkpointPrompt: "Hai consolidato il principio chiave senza incertezze?",
      criteria: ["foundational", "integration"],
      blocks: [
<<<<<<< HEAD
        { kind: "focus", title: "Quiz", content: lesson.quizQuestion },
        {
          kind: "question",
          title: "Domanda",
          content: "Scegli la risposta migliore e motiva in breve.",
=======
        { kind: "focus", title: "🧠 Quiz finale", content: "Verifichiamo la tua comprensione del principio chiave." },
        {
          kind: "question",
          title: "❓ Domanda principale",
          content: lesson.quizQuestion,
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
          pollAreas: [
            {
              id: `quiz-${lesson.id}`,
              prompt: lesson.quizQuestion,
              options: lesson.quizOptions,
              allowText: true,
            },
          ],
        },
<<<<<<< HEAD
=======
        {
          kind: "question",
          title: "🧠 Quiz bonus",
          content: "Quale errore è più probabile dopo questa lezione?",
          pollAreas: [
            {
              id: `quiz-bonus-${lesson.id}`,
              prompt: "Seleziona l'errore da evitare",
              options: [
                "Applicare subito senza riflettere",
                "Non applicare affatto per paura",
                "Applicare solo quando conviene",
              ],
              allowText: true,
            },
          ],
        },
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
      ],
    },
    {
      nodeKey: "action_plan",
      semanticType: "action_plan",
      goal: "Chiudere con un piano operativo da 7 giorni",
      estimatedMinutes: 1,
      checkpointPrompt: "Hai definito una singola azione concreta da iniziare oggi?",
      criteria: ["human", "caring"],
      blocks: [
        {
          kind: "focus",
<<<<<<< HEAD
          title: "Piano 7 giorni",
          content: buildActionPlanContent(lesson.actionPlan),
        },
        {
          kind: "exercise",
          title: "Commitment",
          content: "Scrivi data, ora e trigger della prima azione. La qualità della decisione dipende dall'esecuzione, non dall'intenzione.",
        },
      ],
      suggestedPrompts: [
        "Aiutami a rendere questo piano piu realistico",
        "Quale ostacolo potrei incontrare nei prossimi 7 giorni?",
        "Come controllo se sto davvero applicando la lezione?",
=======
          title: "📅 Piano 7 giorni",
          content: buildActionPlanContent(lesson.actionPlan),
        },
        {
          kind: "question",
          title: "🎯 Priorità",
          content: "Quale azione inizi oggi?",
          pollAreas: [
            {
              id: `action-priority-${lesson.id}`,
              prompt: "Seleziona la tua prima azione",
              options: lesson.actionPlan,
              allowText: true,
            },
          ],
        },
        {
          kind: "question",
          title: "🧠 Verifica finale: il tuo commitment",
          content: "Per rendere concreto il piano hai bisogno di definire elementi specifici.",
          pollAreas: [
            {
              id: `action-commit-${lesson.id}`,
              prompt: "Quali elementi rendono un commitment efficace?",
              options: [
                "Data + ora + trigger specifico dell'azione",
                "Solo buone intenzioni generiche",
                "Aspettare il momento giusto senza pianificare",
              ],
              allowText: false,
            },
          ],
        },
      ],
      suggestedPrompts: [
        "Aiutami a rendere questo piano più realistico",
        "Quale ostacolo potrei incontrare?",
        "Come controllo se sto applicando la lezione?",
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
      ],
      options: [
        "Definisco una sola azione immediata",
        "Metto la regola in calendario",
        "Rivedo il piano tra 7 giorni",
      ],
    },
  ];

  if (lesson.extraNodes?.length) {
    base.push(...lesson.extraNodes);
  }

  return base;
}

export const intelligentInvestorLessonDefinitions: Record<string, LessonDefinition> = Object.fromEntries(
  lessons.map((lesson) => [lesson.id, createDynamicLessonDefinition(lesson.id, buildNodes(lesson))]),
);
