import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Il rischio non e un nemico: e il prezzo da capire e governare." },
      { kind: "explain", title: "Spiegazione rapida", content: "Ogni scelta finanziaria ha rischio. Il punto e allinearlo alla tua tolleranza e al tuo orizzonte." },
      { kind: "question", title: "Domanda guida", content: "Quale perdita temporanea riusciresti a tollerare senza abbandonare il piano?" },
      { kind: "exercise", title: "Micro-azione", content: "Definisci il tuo livello di rischio pratico con tre scenari: basso, medio, alto." },
    ],
    options: ["Capisco il trade-off", "Definisco la mia tolleranza", "Scelgo un livello coerente"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Diversificare significa evitare che una sola scelta decida tutto." },
      { kind: "explain", title: "Spiegazione rapida", content: "Il rischio si gestisce con mix, regole e tempo, non con previsioni perfette." },
      { kind: "question", title: "Domanda guida", content: "Qual e il punto debole del tuo piano se un asset va male?" },
      { kind: "exercise", title: "Micro-azione", content: "Aggiungi una regola di ribilanciamento periodico semplice." },
    ],
    options: ["Diversifico", "Ribilancio", "Mantengo disciplina"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Scenario: una notizia negativa ti fa dubitare del piano." },
      { kind: "explain", title: "Spiegazione rapida", content: "Senza protocollo, reagisci all'emozione. Con protocollo, agisci secondo regole." },
      { kind: "question", title: "Domanda guida", content: "Quale controllo oggettivo fai prima di cambiare strategia?" },
      { kind: "exercise", title: "Micro-azione", content: "Scrivi il tuo protocollo decisionale in 3 passaggi prima di ogni modifica." },
    ],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Gestire il rischio bene significa dormire tranquillo e restare nel piano." },
      { kind: "explain", title: "Spiegazione rapida", content: "La serenita finanziaria nasce da scelte sostenibili, non da scelte estreme." },
      { kind: "question", title: "Domanda guida", content: "Quale regola protegge meglio il tuo comportamento nei momenti difficili?" },
      { kind: "exercise", title: "Micro-azione", content: "Definisci una soglia oltre la quale non aumenti rischio senza una revisione completa." },
    ],
    suggestedPrompts: [
      "Come capisco il mio vero livello di rischio?",
      "Che differenza c'e tra volatilita e rischio reale?",
      "Dammi una regola di emergenza per i mercati in calo",
    ],
  },
};

const lesson6Definition = createStaticLessonDefinition("6", content);

export default lesson6Definition;
