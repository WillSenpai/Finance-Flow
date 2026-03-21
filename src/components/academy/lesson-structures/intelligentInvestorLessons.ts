import { createDynamicLessonDefinition } from "./defaultLessonDefinition";
import type { LessonDefinition, StructuredNodeContent } from "./types";

type LessonBlueprint = {
  id: string;
  title: string;
  chapterFocus: string;
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
  // Lesson 8: Cos'è un investimento (vs speculazione) - Graham Ch.1
  {
    id: "8",
    title: "Cos'è un investimento (vs speculazione)",
    chapterFocus: "Capitolo 1: Investment versus Speculation",
    coreIdea: "Investire significa comprare una quota di valore economico con una tesi verificabile; speculare significa scommettere su un movimento di prezzo.",
    whyItMatters: "La differenza determina il tipo di rischio che stai assumendo: volatilità temporanea contro perdita permanente di capitale.",
    practicalRule: "Prima di acquistare scrivi in 2 righe: perché questo asset genera valore e in quali condizioni la tesi diventa falsa.",
    commonMistake: "Confondere un titolo che sale con un investimento migliore, senza verificare utili, cassa o prezzo pagato.",
    caseStudy: "Durante una fase euforica molti comprano società senza utili solo perché crescono in Borsa. Quando il sentiment cambia, il prezzo collassa e la tesi non esiste.",
    defensiveLens: "Il profilo difensivo evita asset con tesi non dimostrabile e privilegia strumenti semplici e diversificati.",
    enterprisingLens: "Il profilo intraprendente può operare su inefficienze, ma solo con processo scritto e metriche di controllo.",
    checklist: ["Tesi verificabile", "Valutazione ragionevole", "Rischio downside", "Orizzonte coerente"],
    decisionScenario: "Un titolo fa +35% in 6 settimane ma non trovi miglioramenti nei fondamentali. Cosa fai?",
    decisionOptions: [
      "Resto fuori finché non ho tesi e prezzo coerenti",
      "Compro una quota per non perdere il treno",
      "Entro e incremento se continua a salire",
    ],
    quizQuestion: "Quale frase descrive meglio un investimento intelligente?",
    quizOptions: [
      "Acquisto con margine di sicurezza e tesi verificabile",
      "Acquisto perché il prezzo sta salendo",
      "Acquisto perché ne parlano tutti",
    ],
    actionPlan: [
      "Definisci 3 criteri minimi pre-acquisto",
      "Rifiuta ogni idea che non supera i 3 criteri",
      "Rivedi i criteri ogni 30 giorni",
    ],
  },

  // Lesson 12: Orizzonte temporale e obiettivi - Graham Ch.1-3
  {
    id: "12",
    title: "Orizzonte temporale e obiettivi",
    chapterFocus: "Capitoli 1-3: aspettative e contesto di mercato",
    coreIdea: "L'obiettivo non è battere sempre il mercato, ma ottenere risultati adeguati al rischio e sostenibili nel tempo.",
    whyItMatters: "Aspettative irrealistiche portano overtrading, rincorsa ai rendimenti e scelte incoerenti con i tuoi obiettivi reali.",
    practicalRule: "Per ogni obiettivo finanziario fissa: orizzonte, rendimento atteso prudente, perdita massima tollerata.",
    commonMistake: "Usare performance recenti come previsione certa del futuro e cambiare strategia ogni trimestre.",
    caseStudy: "Un investitore punta al 20% annuo per comprare casa in 4 anni. Aumenta rischio, subisce drawdown e perde capitale proprio quando serve liquidità.",
    defensiveLens: "Rendimento adeguato, volatilità contenuta, priorità alla probabilità di centrare l'obiettivo.",
    enterprisingLens: "Extra-rendimento possibile solo su quota satellite separata dal capitale destinato a obiettivi certi.",
    checklist: ["Obiettivo con data", "Rendimento prudente", "Perdita tollerata", "Regola di revisione"],
    decisionScenario: "Obiettivo casa tra 4 anni. Hai due alternative: portafoglio aggressivo o bilanciato disciplinato. Cosa scegli?",
    decisionOptions: [
      "Bilanciato disciplinato, con probabilità più alta di centrare la data",
      "Aggressivo, per massimizzare il rendimento atteso",
      "Cambio approccio ogni mese seguendo il mercato",
    ],
    quizQuestion: "Come si definisce un obiettivo di investimento ben impostato?",
    quizOptions: [
      "Con orizzonte, rischio massimo e piano coerente",
      "Con il rendimento più alto possibile",
      "Confrontando solo i rendimenti passati",
    ],
    actionPlan: [
      "Scrivi un obiettivo reale con data precisa",
      "Assegna soglia di perdita accettabile",
      "Aggiorna il piano solo a scadenze prefissate",
    ],
  },

  // Lesson 13: Profilo investitore: difensivo vs intraprendente - Graham Ch.4-7, 14-15
  {
    id: "13",
    title: "Profilo investitore: difensivo vs intraprendente",
    chapterFocus: "Capitoli 4-7 e 14-15: profili e strategie",
    coreIdea: "Non esiste un profilo migliore in assoluto: il difensivo vince con semplicità, l'intraprendente con metodo rigoroso.",
    whyItMatters: "Scegliere il profilo sbagliato porta a errori costosi: il difensivo che fa trading o l'intraprendente senza processo.",
    practicalRule: "Valuta onestamente tempo, competenze e disciplina. Se hai dubbi, parti difensivo e rivaluta tra 12 mesi.",
    commonMistake: "Sopravvalutare le proprie capacità e sottovalutare il tempo richiesto per una gestione attiva efficace.",
    caseStudy: "Investitore con poco tempo passa da ETF globali a stock picking frequente: aumentano errori e costi, non la qualità del risultato.",
    defensiveLens: "Core diversificato, regole poche e chiare, decisioni solo su calendario. Processo ripetibile e robusto in qualunque scenario.",
    enterprisingLens: "Quota satellite con metriche e accountability. Prima del capitale attivo definisci universo titoli, criteri ingresso/uscita e limiti di esposizione.",
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

  // Lesson 15: Analisi fondamentale base - Graham Ch.11-12
  {
    id: "15",
    title: "Analisi fondamentale base",
    chapterFocus: "Capitoli 11 e 12: Security Analysis for the Lay Investor",
    coreIdea: "Pochi indicatori ben letti bastano per evitare molte trappole.",
    whyItMatters: "La narrativa può essere seducente; cassa, margini e debito raccontano la sostenibilità reale.",
    practicalRule: "Valuta insieme utili normalizzati, leva finanziaria e generazione di cassa.",
    commonMistake: "Guardare solo crescita ricavi ignorando qualità degli utili.",
    caseStudy: "Società con ricavi in forte crescita ma flussi di cassa deboli e debito in aumento: rischio di valutazione fragile.",
    defensiveLens: "Preferenza per bilanci solidi e utili meno ciclici.",
    enterprisingLens: "Possibile operare su disallineamenti, ma con maggiore onere analitico.",
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

  // Lesson 29: Inflazione e potere d'acquisto - Graham Ch.2
  {
    id: "29",
    title: "Inflazione e potere d'acquisto",
    chapterFocus: "Capitolo 2: The Investor and Inflation",
    coreIdea: "Il capitale nominale può crescere mentre il potere d'acquisto reale diminuisce.",
    whyItMatters: "Se non misuri rendimento reale netto, puoi credere di migliorare mentre stai solo inseguendo i prezzi.",
    practicalRule: "Monitora ogni trimestre: rendimento nominale - inflazione - costi = rendimento reale netto.",
    commonMistake: "Tenere troppa liquidità non remunerata pensando che sia sempre la scelta più sicura.",
    caseStudy: "Portafoglio +4%, inflazione +3%, costi 1%: risultato reale circa 0%. Nessuna crescita del potere d'acquisto.",
    defensiveLens: "Protezione graduale del potere d'acquisto con strumenti semplici e costi contenuti.",
    enterprisingLens: "Possibile ricerca di premi reali superiori, ma solo con controllo rigoroso di rischio e costi.",
    checklist: ["Inflazione media", "Costo totale", "Rendimento reale", "Correzione allocazione"],
    decisionScenario: "Saldo in crescita ma inflazione alta. Qual è il segnale corretto da guardare?",
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
      "Identifica il costo più impattante da ridurre",
      "Pianifica una revisione allocazione anti-inflazione",
    ],
  },

  // Lesson 35: Asset allocation e ribilanciamento - Graham Ch.4, 8
  {
    id: "35",
    title: "Asset allocation e ribilanciamento",
    chapterFocus: "Capitoli 4 e 8: policy di portafoglio e fluttuazioni",
    coreIdea: "L'allocazione guida il rischio complessivo molto più del singolo titolo scelto.",
    whyItMatters: "Senza ribilanciamento, il portafoglio deriva verso rischi non intenzionali dopo fasi estreme di mercato.",
    practicalRule: "Definisci pesi target e soglie di deviazione; ribilancia quando la soglia è superata.",
    commonMistake: "Lasciare correre l'asset vincente senza valutare che il rischio totale è aumentato.",
    caseStudy: "Target 60/40 diventa 72/28 dopo rally. Il rischio effettivo non è più quello deciso inizialmente.",
    defensiveLens: "Ribilanciamento periodico semplice, senza market timing.",
    enterprisingLens: "Possibili aggiustamenti tattici solo dentro limiti predefiniti.",
    checklist: ["Pesi target", "Soglia deviazione", "Frequenza controllo", "Regola esecuzione"],
    decisionScenario: "Portafoglio fuori target da mesi. Qual è la mossa disciplinata?",
    decisionOptions: [
      "Ribilanciare gradualmente verso i target",
      "Non toccare nulla finché il trend continua",
      "Aumentare ancora la parte già salita",
    ],
    quizQuestion: "Perché il ribilanciamento è centrale nel metodo Graham?",
    quizOptions: [
      "Perché riallinea rischio e processo",
      "Perché massimizza sempre il rendimento",
      "Perché elimina le perdite",
    ],
    actionPlan: [
      "Scrivi i target del tuo portafoglio",
      "Definisci la soglia di deviazione",
      "Imposta un controllo mensile o trimestrale",
    ],
  },

  // Lesson 37: Value investing - Graham principles (NEW)
  {
    id: "37",
    title: "Value investing",
    chapterFocus: "I principi fondamentali di Benjamin Graham",
    coreIdea: "Il value investing consiste nell'acquistare attività a un prezzo inferiore al loro valore intrinseco calcolato con prudenza.",
    whyItMatters: "Comprare valore con sconto offre protezione dal ribasso e potenziale di rendimento quando il mercato riconosce il vero valore.",
    practicalRule: "Calcola sempre un valore intrinseco prudente prima di guardare il prezzo. Compra solo con margine di sicurezza.",
    commonMistake: "Confondere un prezzo basso con un buon affare. Un'azienda cattiva a prezzo basso resta un cattivo investimento.",
    caseStudy: "Warren Buffett acquisisce Coca-Cola nel 1988 quando il mercato sottovalutava la forza del brand e dei cash flow ricorrenti.",
    defensiveLens: "Focus su aziende stabili, con utili prevedibili e valutazioni moderate rispetto ai multipli storici.",
    enterprisingLens: "Ricerca di situazioni speciali: spin-off, ristrutturazioni, small cap sottovalutate con catalyst identificabile.",
    checklist: ["Valore intrinseco stimato", "Margine di sicurezza", "Qualità del business", "Catalyst per riconoscimento valore"],
    decisionScenario: "Un'azienda solida scambia a 12x gli utili, sotto la media storica di 18x. Come procedi?",
    decisionOptions: [
      "Analizzo perché è sottovalutata e valuto se la tesi è solida",
      "Compro subito perché è a sconto",
      "Aspetto che scenda ancora per massimizzare il rendimento",
    ],
    quizQuestion: "Qual è il principio chiave del value investing secondo Graham?",
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

  // Lesson 38: Margin of safety - Graham Ch.20
  {
    id: "38",
    title: "Margin of safety",
    chapterFocus: "Capitolo 20: Margin of Safety as the Central Concept of Investment",
    coreIdea: "Il margine di sicurezza è la distanza protettiva tra valore prudente e prezzo pagato.",
    whyItMatters: "Riduce l'impatto di errori di stima, eventi imprevisti e volatilità.",
    practicalRule: "Stima valore prudente, definisci prezzo massimo d'ingresso, acquista solo se il gap è sufficiente.",
    commonMistake: "Abbassare il margine pur di partecipare a un'opportunità percepita come urgente.",
    caseStudy: "Valore prudente 100, prezzo 70: il 30% di margine non garantisce successo ma migliora il profilo rischio/rendimento.",
    defensiveLens: "Pretendere margine più ampio e business comprensibili.",
    enterprisingLens: "Margine variabile per qualità della tesi, ma mai azzerato.",
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

  // Lesson 39: Mr. Market e psicologia - Graham Ch.8
  {
    id: "39",
    title: "Mr. Market e psicologia",
    chapterFocus: "Capitolo 8: The Investor and Market Fluctuations",
    coreIdea: "Mr. Market offre prezzi ogni giorno; non impone decisioni ogni giorno.",
    whyItMatters: "Saper tollerare volatilità riduce vendite emotive nei momenti peggiori.",
    practicalRule: "Quando il mercato accelera o crolla, confronta prezzo e tesi prima di agire.",
    commonMistake: "Interpretare ogni movimento come un segnale operativo obbligatorio.",
    caseStudy: "Durante un -12% dell'indice, chi segue il piano ribilancia; chi segue la paura liquida nel punto di stress massimo.",
    defensiveLens: "Volatilità come costo temporaneo per rendimento di lungo termine.",
    enterprisingLens: "Volatilità come possibile fonte di opportunità selettive, non di frenesia.",
    checklist: ["Tesi invariata?", "Prezzo vs valore", "Rischio totale", "Regola piano"],
    decisionScenario: "Indice in forte calo ma fondamentali medi stabili. Cosa fai?",
    decisionOptions: [
      "Resto nel processo e valuto ribilanciamento",
      "Vendo tutto per ridurre ansia",
      "Compro a caso tutto ciò che scende",
    ],
    quizQuestion: "Qual è il modo corretto di usare Mr. Market?",
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

  // Lesson 40: Errori comuni dell'investitore - Graham Ch.17-18
  {
    id: "40",
    title: "Errori comuni dell'investitore",
    chapterFocus: "Capitoli 17 e 18: Four Extremely Instructive Case Histories & Comparison of Companies",
    coreIdea: "Gli errori ricorrenti non si eliminano con previsioni migliori, ma con un processo migliore.",
    whyItMatters: "Un buon processo riduce errori ripetuti e protegge il capitale nei momenti di stress.",
    practicalRule: "Tieni un diario decisionale con tesi, rischio, trigger di revisione e risultato finale.",
    commonMistake: "Valutare una decisione solo dall'esito di breve periodo, non dalla qualità del processo.",
    caseStudy: "Vendita in panico e ricompro più in alto: senza post-mortem, lo stesso pattern si ripete al prossimo shock.",
    defensiveLens: "Routine e checklist per evitare errori grossi.",
    enterprisingLens: "Revisioni più frequenti e metriche di performance risk-adjusted.",
    checklist: ["Tesi scritta", "Trigger revisione", "Errore emerso", "Correzione operativa"],
    decisionScenario: "Hai deviato dal piano sotto pressione emotiva. Qual è la mossa utile?",
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
          title: "Mappa della lezione",
          content: `${lesson.chapterFocus}. In questa lezione farai un percorso completo: principio, casi, checklist decisionale, test e piano operativo finale.`,
        },
        {
          kind: "explain",
          title: "Perché conta",
          content: lesson.whyItMatters,
        },
        {
          kind: "question",
          title: "Checkpoint",
          content:
            "Prima di proseguire: riesci a dire in parole semplici quale decisione concreta questa lezione ti aiuta a prendere meglio?",
        },
      ],
    },
    {
      nodeKey: "concept_core",
      semanticType: "concept",
      goal: "Capire il principio chiave senza ambiguità",
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
      goal: "Entrare nei meccanismi con maggiore profondità",
      estimatedMinutes: 2,
      checkpointPrompt: "Riesci a collegare il concetto a una decisione reale del tuo portafoglio?",
      criteria: ["integration", "application"],
      blocks: [
        {
          kind: "focus",
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
        { kind: "focus", title: "Lente difensiva", content: lesson.defensiveLens },
        { kind: "explain", title: "Lente intraprendente", content: lesson.enterprisingLens },
        {
          kind: "exercise",
          title: "Scelta profilo",
          content: "Scrivi una frase: oggi questa decisione appartiene al mio core difensivo oppure alla quota satellite? Perché?",
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
          title: "Checklist",
          content: `Prima di agire controlla: ${buildChecklistContent(lesson.checklist)}.`,
        },
        {
          kind: "explain",
          title: "Uso corretto",
          content: "La checklist non predice il mercato: riduce errori evitabili e mantiene coerenza nelle decisioni sotto stress.",
        },
        {
          kind: "exercise",
          title: "Applicazione",
          content: "Applica la checklist a una decisione che devi prendere questa settimana e annota il punto più difficile.",
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
        { kind: "focus", title: "Scenario", content: lesson.decisionScenario },
        {
          kind: "question",
          title: "Scegli",
          content: "Seleziona l'opzione più coerente con il metodo della lezione e spiega il perché in una riga.",
          pollAreas: [
            {
              id: `decision-${lesson.id}`,
              prompt: "Qual è la scelta corretta?",
              options: lesson.decisionOptions,
              allowText: true,
            },
          ],
        },
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
        { kind: "focus", title: "Quiz", content: lesson.quizQuestion },
        {
          kind: "question",
          title: "Domanda",
          content: "Scegli la risposta migliore e motiva in breve.",
          pollAreas: [
            {
              id: `quiz-${lesson.id}`,
              prompt: lesson.quizQuestion,
              options: lesson.quizOptions,
              allowText: true,
            },
          ],
        },
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
        "Aiutami a rendere questo piano più realistico",
        "Quale ostacolo potrei incontrare nei prossimi 7 giorni?",
        "Come controllo se sto davvero applicando la lezione?",
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
