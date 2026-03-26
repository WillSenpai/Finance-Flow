import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { LessonDefinition, StructuredLessonContent, StructuredNodeContent } from "./types";

type LessonSeed = {
  id: string;
  title: string;
  section: "basics" | "investing" | "protection" | "intelligent-investor";
  focus: string;
};

const LESSONS: LessonSeed[] = [
  { id: "1", title: "Cos'è la Finanza?", section: "basics", focus: "La base di tutto" },
  { id: "2", title: "Cos'è un budget?", section: "basics", focus: "controllo del flusso di cassa e decisioni anticipate" },
  { id: "3", title: "Risparmiare senza fatica", section: "basics", focus: "automazione del risparmio e abitudini sostenibili" },
  { id: "4", title: "Debiti buoni e cattivi", section: "basics", focus: "costo del debito, leva e priorita di rimborso" },
  { id: "5", title: "Che cos'e un investimento?", section: "investing", focus: "differenza tra investimento, consumo e speculazione" },
  { id: "6", title: "I fondi spiegati semplice", section: "investing", focus: "diversificazione, costi e criteri di scelta" },
  { id: "7", title: "Rischio: non e una parolaccia", section: "investing", focus: "rischio sostenibile, volatilita e disciplina" },
  { id: "8", title: "Fondo emergenza: perche serve", section: "protection", focus: "margine di sicurezza personale e liquidita" },
  { id: "9", title: "Assicurazioni in parole povere", section: "protection", focus: "trasferimento del rischio e coperture essenziali" },
  { id: "10", title: "Investimento vs Speculazione", section: "intelligent-investor", focus: "tesi verificabile contro scommessa di prezzo" },
  { id: "11", title: "Risultati attesi e obiettivi realistici", section: "intelligent-investor", focus: "aspettative prudenziali e coerenza obiettivo-rischio" },
  { id: "12", title: "Inflazione e potere d'acquisto", section: "intelligent-investor", focus: "rendimento reale netto e protezione nel lungo periodo" },
  { id: "13", title: "Asset allocation e ribilanciamento", section: "intelligent-investor", focus: "pesi target, soglie e mantenimento del profilo rischio" },
  { id: "14", title: "Profilo Defensive Investor", section: "intelligent-investor", focus: "semplicita, costi bassi e continuita operativa" },
  { id: "15", title: "Profilo Enterprising Investor", section: "intelligent-investor", focus: "processo attivo con regole verificabili" },
  { id: "16", title: "Mr. Market e volatilita", section: "intelligent-investor", focus: "prezzo come offerta, non come ordine di azione" },
  { id: "17", title: "Fondi e index investing", section: "intelligent-investor", focus: "efficienza dei costi e diversificazione ampia" },
  { id: "18", title: "Analisi di bilancio per investitori", section: "intelligent-investor", focus: "lettura utili, cassa e solidita aziendale" },
  { id: "19", title: "Selezione titoli: difensivo vs intraprendente", section: "intelligent-investor", focus: "criteri quantitativi e margine di sicurezza" },
  { id: "20", title: "Errori tipici dell'investitore", section: "intelligent-investor", focus: "bias comportamentali e prevenzione" },
  { id: "21", title: "Margin of safety", section: "intelligent-investor", focus: "protezione dal downside come principio centrale" },
];

function conceptText(seed: LessonSeed): string {
  return `In questa lezione su "${seed.title}", il punto centrale e ${seed.focus}. Seguendo la logica di The Intelligent Investor, non partiamo dalla ricerca del guadagno veloce, ma dalla riduzione degli errori irreversibili. Un investitore disciplinato prende decisioni prima che le emozioni del momento entrino in campo, definendo criteri chiari e verificabili. Anche l'approccio divulgativo di Starting Finance conferma lo stesso principio: le buone scelte economiche nascono da processi semplici, ripetibili e comprensibili, non da intuizioni casuali. Per questo il nodo Concept ti chiede di fissare una regola pratica che puoi applicare subito nel tuo contesto, collegando teoria e realta personale. Se il principio non e trasformabile in un comportamento concreto, allora non e ancora un apprendimento utile.`;
}

function widgetText(seed: LessonSeed): string {
  return `Il nodo Widget traduce il tema "${seed.title}" in una procedura operativa. L'obiettivo non e accumulare nozioni, ma creare un meccanismo decisionale che regga anche nei periodi complessi. Applichiamo tre passaggi: definire una metrica osservabile, impostare una soglia di allerta, scegliere un'azione correttiva standard. Questo schema evita sia il blocco da analisi sia le reazioni impulsive. Nella pratica, puoi usare una revisione settimanale o mensile per confrontare stato reale e obiettivo, poi correggere con piccoli aggiustamenti progressivi. Il vantaggio e cumulativo: quando il processo e stabile, diminuiscono gli errori costosi e aumenta la coerenza tra obiettivi finanziari, rischio sostenibile e tempo disponibile. La disciplina del metodo conta piu del risultato del singolo giorno.`;
}

function challengeText(seed: LessonSeed): string {
  return `Nel nodo Challenge mettiamo sotto stress il metodo della lezione "${seed.title}" con uno scenario realistico, simile alle oscillazioni che Graham descrive quando parla di mercato e comportamento. Qui non vince chi indovina, ma chi resta coerente con regole definite in anticipo. Il compito e riconoscere la differenza tra un problema temporaneo e un errore strutturale: nel primo caso correggi l'esecuzione, nel secondo aggiorni il piano. L'esercizio ti porta a quantificare impatto, priorita e trade-off, cosi da evitare scelte vaghe. Questa abilita e fondamentale: gli investitori perdono valore soprattutto quando cambiano strategia nel momento sbagliato, non quando seguono un processo robusto con pazienza. Il tuo obiettivo e uscire dal nodo con una regola anti-panico chiara.`;
}

function quizText(seed: LessonSeed): string {
  return `Il nodo Quiz verifica se hai interiorizzato il principio "${seed.title}" in modo applicabile. Le domande sono progettate per misurare la qualita del ragionamento, non la memoria di definizioni isolate. La sequenza corretta resta sempre la stessa: chiarisci l'obiettivo, valuta i vincoli, confronta alternative, seleziona l'azione con miglior equilibrio rischio-rendimento nel tuo orizzonte temporale. Se una risposta sembra attraente ma richiede assunzioni non verificate, va scartata. Questo approccio riflette la filosofia del margine di sicurezza: preferire decisioni robuste anche quando promettono meno entusiasmo nel breve termine. Alla fine del quiz devi poter spiegare il perche della scelta in linguaggio semplice, con numeri essenziali e conseguenze pratiche comprensibili.`;
}

function feedbackText(seed: LessonSeed): string {
  return `Il nodo Feedback chiude il ciclo della lezione "${seed.title}" e trasforma il contenuto in abitudine. Il risultato atteso non e una risposta perfetta oggi, ma una routine affidabile che migliori nel tempo. Per questo sintetizziamo tre elementi: cosa mantenere, cosa correggere, quando ricontrollare. Se non pianifichi il prossimo controllo, l'apprendimento resta teorico e tende a svanire. Invece, una piccola revisione programmata riduce la frizione e consolida il comportamento, proprio come un ribilanciamento periodico mantiene il portafoglio allineato alla strategia. Usa il tutor per chiarire i dubbi residui e rendere il piano personale, misurabile e sostenibile. La coerenza ripetuta vale piu di qualsiasi sprint motivazionale occasionale.`;
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
        content: `${body} Applica questa logica con un controllo periodico e una soglia numerica, cosi ogni decisione resta coerente con il tuo piano.`,
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
        "Qual e l'errore principale da evitare nel mio caso?",
        "Dammi un esempio numerico semplice da seguire",
      ],
    },
  };
}

export const generatedLessonDefinitions: Record<string, LessonDefinition> = Object.fromEntries(
  LESSONS.map((seed) => [seed.id, createStaticLessonDefinition(seed.id, buildLessonContent(seed))]),
);

export const generatedLessonSeeds = LESSONS;
