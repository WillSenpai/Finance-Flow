import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "integration"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Un fondo raccoglie tanti investitori e li gestisce con una strategia definita." },
      { kind: "explain", title: "Spiegazione rapida", content: "Tu scegli il tipo di fondo in base a obiettivo, costi, rischio e orizzonte." },
      { kind: "question", title: "Domanda guida", content: "Quale caratteristica conta di piu per te: costo, volatilita o semplicità?" },
      { kind: "exercise", title: "Micro-azione", content: "Confronta due fondi su costi annui e composizione, prima di qualsiasi scelta." },
    ],
    options: ["Capisco come funziona", "Confronto i costi", "Guardo il rischio"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "learning"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Il costo ricorrente impatta il risultato nel tempo piu di quanto sembri." },
      { kind: "explain", title: "Spiegazione rapida", content: "Regola pratica: prima capisci cosa c'e dentro il fondo, poi guarda quanto paghi per tenerlo." },
      { kind: "question", title: "Domanda guida", content: "Sai spiegare in una frase dove investe il fondo che stai valutando?" },
      { kind: "exercise", title: "Micro-azione", content: "Scrivi una scheda sintetica: obiettivo, asset principali, costi, rischio." },
    ],
    options: ["Scheda sintetica", "Confronto costi", "Confronto rischio"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Scenario: due fondi sembrano simili ma hanno costi diversi." },
      { kind: "explain", title: "Spiegazione rapida", content: "Nel lungo periodo, differenze piccole di costo possono diventare differenze grandi di risultato." },
      { kind: "question", title: "Domanda guida", content: "Quale criterio userai per scegliere in modo coerente tra alternative simili?" },
      { kind: "exercise", title: "Micro-azione", content: "Definisci una soglia massima di costo annuo oltre cui non vai." },
    ],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "caring"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Scegliere un fondo e scegliere un processo, non inseguire la moda del mese." },
      { kind: "explain", title: "Spiegazione rapida", content: "Quando il criterio e chiaro, le decisioni diventano piu veloci e meno emotive." },
      { kind: "question", title: "Domanda guida", content: "Qual e la tua regola personale minima per valutare un fondo?" },
      { kind: "exercise", title: "Micro-azione", content: "Scrivi la tua checklist in 4 punti e usala su ogni nuova proposta." },
    ],
    suggestedPrompts: [
      "Come confronto due fondi in modo semplice?",
      "Quali costi devo controllare sempre?",
      "Fammi una checklist base prima di investire",
    ],
  },
};

const lesson5Definition = createStaticLessonDefinition("5", content);

export default lesson5Definition;
