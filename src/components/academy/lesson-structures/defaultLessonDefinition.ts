import type { LessonDefinition, LessonVisualConfig, StructuredLessonContent, StepType } from "./types";

export const defaultFallbackFlow: Array<{ key: StepType; title: string }> = [
  { key: "concept", title: "Concept" },
  { key: "widget", title: "Widget" },
  { key: "challenge", title: "Challenge" },
  { key: "feedback", title: "Feedback" },
];

const defaultVisual: LessonVisualConfig = {
  nodeBadgeTitles: {
    concept: "Nodo 1 · Capisci",
    widget: "Nodo 2 · Applica",
    challenge: "Nodo 3 · Verifica",
    feedback: "Nodo 4 · Chiudi il cerchio",
  },
  blockLabels: {
    concept: {
      focus: { emoji: "🧭", title: "Le basi", subtitle: "Capisci la logica di base" },
      explain: { emoji: "🤔", title: "Cosa c'è da sapere?", subtitle: "Il denaro è fondamentale" },
      question: { emoji: "🧠", title: "Controllo veloce", subtitle: "Verifica se e chiaro" },
      exercise: { emoji: "⚡", title: "Mossa concreta", subtitle: "Scegli cosa fare ora" },
    },
    widget: {
      focus: { emoji: "🛠️", title: "Strumento utile", subtitle: "A cosa ti serve davvero" },
      explain: { emoji: "📌", title: "Uso guidato", subtitle: "Come usarlo passo dopo passo" },
      question: { emoji: "🔍", title: "Controllo pratico", subtitle: "Cosa guardare per non sbagliare" },
      exercise: { emoji: "✅", title: "Applicazione", subtitle: "Fai la prova sul tuo caso" },
    },
    challenge: {
      focus: { emoji: "🎯", title: "Scenario reale", subtitle: "Dove si gioca la decisione" },
      explain: { emoji: "🧪", title: "Test rapido", subtitle: "Prova la tua scelta sul campo" },
      question: { emoji: "⚖️", title: "Scelta migliore", subtitle: "Valuta pro e contro in fretta" },
      exercise: { emoji: "🔁", title: "Correzione", subtitle: "Aggiusta subito la strategia" },
    },
    feedback: {
      focus: { emoji: "🪞", title: "Sintesi personale", subtitle: "Cosa ti porti via davvero" },
      explain: { emoji: "💬", title: "Confronto", subtitle: "Chiarisci i dubbi con il tutor" },
      question: { emoji: "📝", title: "Punto aperto", subtitle: "Segna cio che vuoi rivedere" },
      exercise: { emoji: "📅", title: "Piano prossimo", subtitle: "Definisci il prossimo passo" },
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
        { kind: "question", title: "Domanda guida", content: "Quale obiettivo vuoi raggiungere con questa lezione?" },
        { kind: "exercise", title: "Micro-azione", content: "Definisci una micro-azione da completare oggi." },
      ],
      options: ["Obiettivo chiaro", "Devo chiarire meglio", "Mi serve un esempio pratico"],
    },
    widget: {
      nodeKey: "widget",
      criteria: ["application", "learning"],
      blocks: [
        { kind: "focus", title: "Focus", content: "Scegli uno strumento semplice per iniziare." },
        { kind: "explain", title: "Spiegazione rapida", content: "Usa un criterio ripetibile e controllabile ogni settimana." },
        { kind: "question", title: "Domanda guida", content: "Quale criterio userai da subito?" },
        { kind: "exercise", title: "Micro-azione", content: "Imposta il primo check in calendario." },
      ],
      options: ["Creo una regola", "Imposto un promemoria", "Semplifico il piano"],
    },
    challenge: {
      nodeKey: "challenge",
      criteria: ["learning", "caring"],
      blocks: [
        { kind: "focus", title: "Focus", content: "Metti alla prova la regola su un caso reale." },
        { kind: "explain", title: "Spiegazione rapida", content: "Osserva cosa funziona e cosa va corretto." },
        { kind: "question", title: "Domanda guida", content: "Qual e il rischio che vuoi ridurre per primo?" },
        { kind: "exercise", title: "Micro-azione", content: "Aggiorna la regola con una modifica concreta." },
      ],
    },
    feedback: {
      nodeKey: "feedback",
      criteria: ["human", "caring"],
      blocks: [
        { kind: "focus", title: "Focus", content: "Raccogli i punti che ti sono stati piu utili." },
        { kind: "explain", title: "Spiegazione rapida", content: "Trasforma l'apprendimento in una routine semplice." },
        { kind: "question", title: "Domanda guida", content: "Cosa cambia concretamente da questa settimana?" },
        { kind: "exercise", title: "Micro-azione", content: "Definisci il prossimo check e una soglia chiara." },
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
