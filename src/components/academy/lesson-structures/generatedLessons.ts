import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { LessonDefinition, StructuredLessonContent, StructuredNodeContent } from "./types";

type SectionSlug = "fondamenta" | "investire" | "strumenti" | "alternativi" | "macro" | "strategie";

type LessonSeed = {
  id: string;
  title: string;
  section: SectionSlug;
  focus: string;
};

const LESSONS: LessonSeed[] = [
  // LIVELLO 1: FONDAMENTA (7 lezioni)
  { id: "1", title: "Cos'è la finanza personale", section: "fondamenta", focus: "comprendere il sistema di gestione delle risorse economiche personali" },
  { id: "2", title: "Budget e controllo del cash flow", section: "fondamenta", focus: "controllo del flusso di cassa e decisioni anticipate" },
  { id: "3", title: "Risparmio automatico e abitudini", section: "fondamenta", focus: "automazione del risparmio e abitudini sostenibili" },
  { id: "4", title: "Debiti buoni vs cattivi", section: "fondamenta", focus: "costo del debito, leva e priorità di rimborso" },
  { id: "5", title: "Obiettivi finanziari SMART", section: "fondamenta", focus: "definire obiettivi Specifici, Misurabili, Achievable, Rilevanti e Temporizzati" },
  { id: "6", title: "Fondo emergenza", section: "fondamenta", focus: "margine di sicurezza personale e liquidità per imprevisti" },
  { id: "7", title: "Assicurazioni essenziali", section: "fondamenta", focus: "trasferimento del rischio e coperture essenziali" },

  // LIVELLO 2: CONCETTI D'INVESTIMENTO (6 lezioni)
  { id: "8", title: "Cos'è un investimento (vs speculazione)", section: "investire", focus: "differenza tra investimento con tesi verificabile e speculazione sul prezzo" },
  { id: "9", title: "Rischio e rendimento", section: "investire", focus: "relazione tra rischio sostenibile, volatilità e disciplina" },
  { id: "10", title: "L'interesse composto", section: "investire", focus: "la forza esponenziale del tempo e dei rendimenti reinvestiti" },
  { id: "11", title: "La diversificazione", section: "investire", focus: "ridurre il rischio specifico distribuendo su asset non correlati" },
  { id: "12", title: "Orizzonte temporale e obiettivi", section: "investire", focus: "aspettative prudenziali e coerenza obiettivo-rischio" },
  { id: "13", title: "Profilo investitore: difensivo vs intraprendente", section: "investire", focus: "identificare il proprio approccio tra semplicità difensiva e gestione attiva" },

  // LIVELLO 3: STRUMENTI TRADIZIONALI (9 lezioni)
  { id: "14", title: "Azioni: cosa sono e come funzionano", section: "strumenti", focus: "quote di proprietà aziendale, dividendi e capital gain" },
  { id: "15", title: "Analisi fondamentale base", section: "strumenti", focus: "lettura utili, cassa e solidità aziendale" },
  { id: "16", title: "Obbligazioni e reddito fisso", section: "strumenti", focus: "prestiti agli emittenti, cedole e rischio credito" },
  { id: "17", title: "Fondi comuni d'investimento", section: "strumenti", focus: "diversificazione, costi e criteri di scelta" },
  { id: "18", title: "ETF: cosa sono", section: "strumenti", focus: "fondi quotati in borsa, replica passiva e vantaggi strutturali" },
  { id: "19", title: "ETF: come sceglierli", section: "strumenti", focus: "efficienza dei costi e diversificazione ampia tramite indici" },
  { id: "20", title: "Indici di mercato (S&P 500, MSCI, etc)", section: "strumenti", focus: "benchmark, composizione e utilizzo pratico degli indici" },
  { id: "21", title: "Broker, costi e commissioni", section: "strumenti", focus: "scegliere la piattaforma giusta e minimizzare i costi" },
  { id: "22", title: "Fiscalità degli investimenti (Italia)", section: "strumenti", focus: "capital gain, dividendi, regime amministrato vs dichiarativo" },

  // LIVELLO 4: ASSET ALTERNATIVI (6 lezioni)
  { id: "23", title: "Crypto: blockchain e Bitcoin", section: "alternativi", focus: "tecnologia blockchain, decentralizzazione e Bitcoin come asset" },
  { id: "24", title: "Altcoin, token e smart contract", section: "alternativi", focus: "ecosistema crypto oltre Bitcoin, utilità e rischi" },
  { id: "25", title: "DeFi e staking (basics)", section: "alternativi", focus: "finanza decentralizzata, rendimenti e rischi smart contract" },
  { id: "26", title: "Commodities (oro, petrolio, etc)", section: "alternativi", focus: "materie prime come protezione e diversificazione" },
  { id: "27", title: "Real Estate e REIT", section: "alternativi", focus: "investimento immobiliare diretto e tramite fondi quotati" },
  { id: "28", title: "Rischi degli asset alternativi", section: "alternativi", focus: "volatilità, liquidità, regolamentazione e sizing prudente" },

  // LIVELLO 5: MACROECONOMIA (6 lezioni)
  { id: "29", title: "Inflazione e potere d'acquisto", section: "macro", focus: "rendimento reale netto e protezione nel lungo periodo" },
  { id: "30", title: "Tassi d'interesse e loro impatto", section: "macro", focus: "costo del denaro, obbligazioni e valutazioni azionarie" },
  { id: "31", title: "Banche centrali e politica monetaria", section: "macro", focus: "Fed, BCE e strumenti di controllo dell'economia" },
  { id: "32", title: "Cicli economici", section: "macro", focus: "espansione, picco, recessione e ripresa" },
  { id: "33", title: "Indicatori economici chiave", section: "macro", focus: "PIL, disoccupazione, PMI e loro interpretazione" },
  { id: "34", title: "Geopolitica e mercati", section: "macro", focus: "eventi globali, sanzioni e impatto sui portafogli" },

  // LIVELLO 6: STRATEGIE (6 lezioni)
  { id: "35", title: "Asset allocation e ribilanciamento", section: "strategie", focus: "pesi target, soglie e mantenimento del profilo rischio" },
  { id: "36", title: "Dollar Cost Averaging (PAC)", section: "strategie", focus: "investimento periodico per ridurre il rischio timing" },
  { id: "37", title: "Value investing", section: "strategie", focus: "acquistare valore intrinseco con sconto sul prezzo" },
  { id: "38", title: "Margin of safety", section: "strategie", focus: "protezione dal downside come principio centrale" },
  { id: "39", title: "Mr. Market e psicologia", section: "strategie", focus: "prezzo come offerta, non come ordine di azione" },
  { id: "40", title: "Errori comuni dell'investitore", section: "strategie", focus: "bias comportamentali e prevenzione" },
];

function conceptText(seed: LessonSeed): string {
  return `In questa lezione su "${seed.title}", il punto centrale è ${seed.focus}. Seguendo la logica di The Intelligent Investor, non partiamo dalla ricerca del guadagno veloce, ma dalla riduzione degli errori irreversibili. Un investitore disciplinato prende decisioni prima che le emozioni del momento entrino in campo, definendo criteri chiari e verificabili. Anche l'approccio divulgativo di Starting Finance conferma lo stesso principio: le buone scelte economiche nascono da processi semplici, ripetibili e comprensibili, non da intuizioni casuali. Per questo il nodo Concept ti chiede di fissare una regola pratica che puoi applicare subito nel tuo contesto, collegando teoria e realtà personale. Se il principio non è trasformabile in un comportamento concreto, allora non è ancora un apprendimento utile.`;
}

function widgetText(seed: LessonSeed): string {
  return `Il nodo Widget traduce il tema "${seed.title}" in una procedura operativa. L'obiettivo non è accumulare nozioni, ma creare un meccanismo decisionale che regga anche nei periodi complessi. Applichiamo tre passaggi: definire una metrica osservabile, impostare una soglia di allerta, scegliere un'azione correttiva standard. Questo schema evita sia il blocco da analisi sia le reazioni impulsive. Nella pratica, puoi usare una revisione settimanale o mensile per confrontare stato reale e obiettivo, poi correggere con piccoli aggiustamenti progressivi. Il vantaggio è cumulativo: quando il processo è stabile, diminuiscono gli errori costosi e aumenta la coerenza tra obiettivi finanziari, rischio sostenibile e tempo disponibile. La disciplina del metodo conta più del risultato del singolo giorno.`;
}

function challengeText(seed: LessonSeed): string {
  return `Nel nodo Challenge mettiamo sotto stress il metodo della lezione "${seed.title}" con uno scenario realistico, simile alle oscillazioni che Graham descrive quando parla di mercato e comportamento. Qui non vince chi indovina, ma chi resta coerente con regole definite in anticipo. Il compito è riconoscere la differenza tra un problema temporaneo e un errore strutturale: nel primo caso correggi l'esecuzione, nel secondo aggiorni il piano. L'esercizio ti porta a quantificare impatto, priorità e trade-off, così da evitare scelte vaghe. Questa abilità è fondamentale: gli investitori perdono valore soprattutto quando cambiano strategia nel momento sbagliato, non quando seguono un processo robusto con pazienza. Il tuo obiettivo è uscire dal nodo con una regola anti-panico chiara.`;
}

function quizText(seed: LessonSeed): string {
  return `Il nodo Quiz verifica se hai interiorizzato il principio "${seed.title}" in modo applicabile. Le domande sono progettate per misurare la qualità del ragionamento, non la memoria di definizioni isolate. La sequenza corretta resta sempre la stessa: chiarisci l'obiettivo, valuta i vincoli, confronta alternative, seleziona l'azione con miglior equilibrio rischio-rendimento nel tuo orizzonte temporale. Se una risposta sembra attraente ma richiede assunzioni non verificate, va scartata. Questo approccio riflette la filosofia del margine di sicurezza: preferire decisioni robuste anche quando promettono meno entusiasmo nel breve termine. Alla fine del quiz devi poter spiegare il perché della scelta in linguaggio semplice, con numeri essenziali e conseguenze pratiche comprensibili.`;
}

function feedbackText(seed: LessonSeed): string {
  return `Il nodo Feedback chiude il ciclo della lezione "${seed.title}" e trasforma il contenuto in abitudine. Il risultato atteso non è una risposta perfetta oggi, ma una routine affidabile che migliori nel tempo. Per questo sintetizziamo tre elementi: cosa mantenere, cosa correggere, quando ricontrollare. Se non pianifichi il prossimo controllo, l'apprendimento resta teorico e tende a svanire. Invece, una piccola revisione programmata riduce la frizione e consolida il comportamento, proprio come un ribilanciamento periodico mantiene il portafoglio allineato alla strategia. Usa il tutor per chiarire i dubbi residui e rendere il piano personale, misurabile e sostenibile. La coerenza ripetuta vale più di qualsiasi sprint motivazionale occasionale.`;
}

function buildNode(seed: LessonSeed, nodeKey: string, title: string, body: string): StructuredNodeContent {
  return {
    nodeKey,
    criteria: ["foundational", "application", "learning"],
    blocks: [
      { kind: "focus", title: "Focus", content: body },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: `${body} Applica questa logica con un controllo periodico e una soglia numerica, così ogni decisione resta coerente con il tuo piano.`,
      },
      {
        kind: "question",
        title: "Approfondimento",
        content: `Domanda guida: quale regola concreta adotti da oggi per rendere operativa la lezione "${seed.title}" senza dipendere dall'umore del momento?`,
      },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content: `Caso pratico: definisci un obiettivo, una metrica e un limite massimo di deviazione. Poi scegli un'azione di correzione automatica se superi la soglia. Chiudi con data del prossimo check.`,
      },
    ],
    options: ["Scelgo una regola", "Imposto una soglia", "Programmo il check"],
  };
}

function buildLessonContent(seed: LessonSeed): StructuredLessonContent {
  return {
    concept: buildNode(seed, "concept", "Concept", conceptText(seed)),
    widget: buildNode(seed, "widget", "Widget", widgetText(seed)),
    challenge: buildNode(seed, "challenge", "Challenge", challengeText(seed)),
    quiz: buildNode(seed, "quiz", "Quiz finale", quizText(seed)),
    feedback: {
      ...buildNode(seed, "feedback", "Feedback", feedbackText(seed)),
      criteria: ["human", "caring", "learning"],
      suggestedPrompts: [
        `Aiutami a trasformare "${seed.title}" in un piano settimanale`,
        "Qual è l'errore principale da evitare nel mio caso?",
        "Dammi un esempio numerico semplice da seguire",
      ],
    },
  };
}

export const generatedLessonDefinitions: Record<string, LessonDefinition> = Object.fromEntries(
  LESSONS.map((seed) => [seed.id, createStaticLessonDefinition(seed.id, buildLessonContent(seed))]),
);

export const generatedLessonSeeds = LESSONS;
