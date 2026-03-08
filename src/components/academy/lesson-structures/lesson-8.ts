import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Le assicurazioni servono a trasferire rischi grandi che non vuoi gestire da solo." },
      { kind: "explain", title: "Spiegazione rapida", content: "Non tutto va assicurato: conviene proteggere gli eventi ad alto impatto e bassa frequenza." },
      { kind: "question", title: "Domanda guida", content: "Quale rischio oggi avrebbe l'impatto economico piu serio sulla tua vita?" },
      { kind: "exercise", title: "Micro-azione", content: "Fai una lista rischi: casa, salute, responsabilita, reddito." },
    ],
    options: ["Identifico rischi critici", "Capisco cosa coprire", "Valuto costo vs impatto"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Una buona polizza e chiara su coperture, esclusioni, franchigie e massimali." },
      { kind: "explain", title: "Spiegazione rapida", content: "Il prezzo da solo non basta: conta quando e come la polizza risponde davvero." },
      { kind: "question", title: "Domanda guida", content: "Sai indicare in modo preciso cosa NON copre la tua polizza attuale?" },
      { kind: "exercise", title: "Micro-azione", content: "Confronta due polizze sullo stesso rischio con una tabella di copertura." },
    ],
    options: ["Confronto coperture", "Controllo esclusioni", "Valuto massimali"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Scenario: trovi una polizza molto economica con condizioni poco chiare." },
      { kind: "explain", title: "Spiegazione rapida", content: "Una copertura economica ma incompleta puo costare di piu quando serve davvero." },
      { kind: "question", title: "Domanda guida", content: "Quali tre condizioni minime pretendi prima di scegliere una polizza?" },
      { kind: "exercise", title: "Micro-azione", content: "Scrivi la tua checklist assicurativa e usala su ogni nuova proposta." },
    ],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Assicurarsi bene vuol dire proteggere stabilita tua e delle persone vicino a te." },
      { kind: "explain", title: "Spiegazione rapida", content: "Meglio poche coperture mirate e comprese bene, che tante coperture confuse." },
      { kind: "question", title: "Domanda guida", content: "Qual e la prima copertura che vuoi rivedere con criteri piu chiari?" },
      { kind: "exercise", title: "Micro-azione", content: "Programma una revisione annuale delle polizze con checklist standard." },
    ],
    suggestedPrompts: [
      "Come capisco se una polizza vale il costo?",
      "Quali clausole devo leggere sempre?",
      "Fammi una checklist base per confrontare polizze",
    ],
  },
};

const lesson8Definition = createStaticLessonDefinition("8", content);

export default lesson8Definition;
