import type { LessonDefinition, LessonVisualConfig, StructuredLessonContent, StepType } from "./types";

export const defaultFallbackFlow: Array<{ key: StepType; title: string }> = [
  { key: "concept", title: "Concept" },
  { key: "widget", title: "Widget" },
  { key: "challenge", title: "Challenge" },
  { key: "quiz", title: "Quiz" },
  { key: "feedback", title: "Feedback" },
];

const defaultVisual: LessonVisualConfig = {
  nodeBadgeTitles: {
    concept: "Nodo 1 · Capisci",
    widget: "Nodo 2 · Applica",
    challenge: "Nodo 3 · Verifica",
    quiz: "Nodo 4 · Quiz finale",
    feedback: "Nodo 5 · Chiudi il cerchio",
  },
  blockLabels: {
    concept: {
      focus: { emoji: "🎯", title: "Definizione", subtitle: "Capisci la logica di base" },
      explain: { emoji: "🤔", title: "Tipi di Budget", subtitle: "Budget Operativi" },
      question: { emoji: "🧠", title: "Approfondimento", subtitle: "Aggiungi contesto e chiarezza" },
      exercise: { emoji: "⚡", title: "Esempio guidato", subtitle: "Vedi come applicarlo davvero" },
    },
    widget: {
      focus: { emoji: "🛠️", title: "Strumento utile", subtitle: "A cosa ti serve davvero" },
      explain: { emoji: "📌", title: "Uso guidato", subtitle: "Come usarlo passo dopo passo" },
      question: { emoji: "🔍", title: "Approfondimento", subtitle: "Cosa guardare senza confusione" },
      exercise: { emoji: "✅", title: "Esempio guidato", subtitle: "Applicazione spiegata passo passo" },
    },
    challenge: {
      focus: { emoji: "🎯", title: "Scenario reale", subtitle: "Dove si gioca la decisione" },
      explain: { emoji: "🧪", title: "Test rapido", subtitle: "Prova la tua scelta sul campo" },
      question: { emoji: "⚖️", title: "Approfondimento", subtitle: "Capisci i criteri della scelta" },
      exercise: { emoji: "🔁", title: "Esempio guidato", subtitle: "Correzione spiegata chiaramente" },
    },
    quiz: {
      focus: { emoji: "🧪", title: "Quiz finale", subtitle: "Verifica cosa sai applicare" },
      explain: { emoji: "🧭", title: "Istruzioni", subtitle: "Come rispondere in modo efficace" },
      question: { emoji: "❓", title: "Domanda", subtitle: "Scegli la risposta migliore" },
      exercise: { emoji: "🧮", title: "Caso pratico", subtitle: "Applica i numeri al tuo contesto" },
    },
    feedback: {
      focus: { emoji: "🪞", title: "Sintesi personale", subtitle: "Cosa ti porti via davvero" },
      explain: { emoji: "💬", title: "Confronto", subtitle: "Chiarisci i dubbi con il tutor" },
      question: { emoji: "📝", title: "Approfondimento", subtitle: "Fissa i concetti principali" },
      exercise: { emoji: "📅", title: "Esempio guidato", subtitle: "Vedi il piano in modo concreto" },
    },
  },
};

function fallbackContent(lessonId: string): StructuredLessonContent {
  return {
    concept: {
      nodeKey: "concept",
      criteria: ["foundational", "integration"],
      blocks: [
        { kind: "focus", title: "Focus", content: `Lezione ${lessonId}: contenuto non configurato.` },
        { kind: "explain", title: "Spiegazione rapida", content: "Questa lezione usa un fallback tecnico. Crea o aggiorna il file lesson dedicato." },
        { kind: "question", title: "Approfondimento", content: "Approfondimento: Quale obiettivo vuoi raggiungere con questa lezione?" },
        { kind: "exercise", title: "Esempio guidato", content: "Esempio guidato: Definisci una micro-azione da completare oggi." },
      ],
      options: ["Obiettivo chiaro", "Devo chiarire meglio", "Mi serve un esempio pratico"],
    },
    widget: {
      nodeKey: "widget",
      criteria: ["application", "learning"],
      blocks: [
        { kind: "focus", title: "Focus", content: "Scegli uno strumento semplice per iniziare." },
        { kind: "explain", title: "Spiegazione rapida", content: "Usa un criterio ripetibile e controllabile ogni settimana." },
        { kind: "question", title: "Approfondimento", content: "Approfondimento: Quale criterio userai da subito?" },
        { kind: "exercise", title: "Esempio guidato", content: "Esempio guidato: Imposta il primo check in calendario." },
      ],
      options: ["Creo una regola", "Imposto un promemoria", "Semplifico il piano"],
    },
    challenge: {
      nodeKey: "challenge",
      criteria: ["learning", "caring"],
      blocks: [
        { kind: "focus", title: "Focus", content: "Metti alla prova la regola su un caso reale." },
        { kind: "explain", title: "Spiegazione rapida", content: "Osserva cosa funziona e cosa va corretto." },
        { kind: "question", title: "Approfondimento", content: "Approfondimento: Qual e il rischio che vuoi ridurre per primo?" },
        { kind: "exercise", title: "Esempio guidato", content: "Esempio guidato: Aggiorna la regola con una modifica concreta." },
      ],
    },
    quiz: {
      nodeKey: "quiz",
      criteria: ["integration", "application"],
      blocks: [
        { kind: "focus", title: "Focus", content: "Metti insieme concetti e pratica in un check finale della lezione." },
        { kind: "explain", title: "Spiegazione rapida", content: "Rispondi alle domande applicando una regola chiara e motivando la scelta." },
        { kind: "question", title: "Approfondimento", content: "Domanda didattica: qual e la decisione piu coerente con il metodo della lezione?" },
        { kind: "exercise", title: "Esempio guidato", content: "Caso guidato: usa dati semplici, scegli la risposta e spiega il perche." },
      ],
      options: ["Rispondo con criterio", "Rivedo il passaggio critico", "Consolido la regola pratica"],
    },
    feedback: {
      nodeKey: "feedback",
      criteria: ["human", "caring"],
      blocks: [
        { kind: "focus", title: "Focus", content: "Raccogli i punti che ti sono stati piu utili." },
        { kind: "explain", title: "Spiegazione rapida", content: "Trasforma l'apprendimento in una routine semplice." },
        { kind: "question", title: "Approfondimento", content: "Approfondimento: Cosa cambia concretamente da questa settimana?" },
        { kind: "exercise", title: "Esempio guidato", content: "Esempio guidato: Definisci il prossimo check e una soglia chiara." },
      ],
      suggestedPrompts: [
        "Aiutami a trasformare questo in un piano settimanale",
        "Dammi un esempio pratico per la mia situazione",
        "Che errore devo evitare da subito?",
      ],
    },
  };
}

export function getDefaultLessonVisualConfig(): LessonVisualConfig {
  return defaultVisual;
}

export function createStaticLessonDefinition(
  lessonId: string,
  content: StructuredLessonContent,
  visual?: Partial<LessonVisualConfig>,
): LessonDefinition {
  return {
    id: lessonId,
    buildStructuredContent: () => content,
    visual,
  };
}

export function createDefaultLessonDefinition(lessonId: string): LessonDefinition {
  return createStaticLessonDefinition(lessonId, fallbackContent(lessonId));
}
