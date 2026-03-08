import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Risparmiare senza fatica significa togliere attrito, non fare sacrifici eroici." },
      { kind: "explain", title: "Spiegazione rapida", content: "Se devi decidere ogni volta, molli. Se automatizzi una cifra piccola, accumuli senza pensarci troppo." },
      { kind: "question", title: "Domanda guida", content: "Quale piccola spesa ripetitiva puoi ridurre senza peggiorare la tua vita?" },
      { kind: "exercise", title: "Micro-azione", content: "Scegli una cifra minima automatica (es. 20-50 euro) da spostare appena entra lo stipendio." },
    ],
    options: ["Parto da una cifra piccola", "Automatizzo subito", "Ridisegno una spesa ricorrente"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      { kind: "focus", title: "Focus", content: "L'automazione e il tuo alleato principale: prima risparmi, poi spendi." },
      { kind: "explain", title: "Spiegazione rapida", content: "Regola pratica: una data fissa, un importo fisso, un conto separato." },
      { kind: "question", title: "Domanda guida", content: "In quale giorno del mese conviene attivare il trasferimento automatico?" },
      { kind: "exercise", title: "Micro-azione", content: "Imposta ora il bonifico automatico e nominare il salvadanaio (emergenze, viaggi, serenita)." },
    ],
    options: ["Data fissa", "Importo fisso", "Conto separato"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Scenario: questo mese hai una spesa imprevista e vuoi evitare di saltare il risparmio." },
      { kind: "explain", title: "Spiegazione rapida", content: "Invece di fermarti, riduci temporaneamente la quota e mantieni la routine attiva." },
      { kind: "question", title: "Domanda guida", content: "Qual e la quota minima che puoi comunque mantenere nei mesi difficili?" },
      { kind: "exercise", title: "Micro-azione", content: "Definisci la tua versione A (normale) e B (mese stretto) dell'automatismo." },
    ],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Risparmiare e una skill di continuita, non una prova di forza." },
      { kind: "explain", title: "Spiegazione rapida", content: "Meglio poco ma sempre, che tanto per due mesi e poi stop." },
      { kind: "question", title: "Domanda guida", content: "Quale segnale ti dira che il tuo sistema sta funzionando?" },
      { kind: "exercise", title: "Micro-azione", content: "Scegli il tuo check mensile: saldo obiettivo, quota rispettata, o progressione." },
    ],
    suggestedPrompts: [
      "Fammi un piano di risparmio senza rinunce drastiche",
      "Come adatto l'importo nei mesi difficili?",
      "Quali automatismi conviene impostare per primi?",
    ],
  },
};

const lesson2Definition = createStaticLessonDefinition("2", content);

export default lesson2Definition;
