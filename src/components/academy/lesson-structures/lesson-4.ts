import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "integration"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Investire significa usare il tempo per far crescere capitale, accettando oscillazioni." },
      { kind: "explain", title: "Spiegazione rapida", content: "Non e scommettere: e scegliere strumenti, orizzonte e regole coerenti con i tuoi obiettivi." },
      { kind: "question", title: "Domanda guida", content: "Per quale obiettivo reale vuoi investire: casa, pensione o liberta futura?" },
      { kind: "exercise", title: "Micro-azione", content: "Definisci orizzonte (anni) e importo mensile sostenibile prima di scegliere lo strumento." },
    ],
    options: ["Capisco rischio e orizzonte", "Definisco l'obiettivo", "Scelgo una regola semplice"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "learning"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Parti da strumenti comprensibili e ripetibili, non da prodotti complessi." },
      { kind: "explain", title: "Spiegazione rapida", content: "La coerenza mensile vale piu del market timing perfetto." },
      { kind: "question", title: "Domanda guida", content: "Quale regola di investimento puoi rispettare anche nei mesi caotici?" },
      { kind: "exercise", title: "Micro-azione", content: "Imposta una quota periodica e un giorno fisso di verifica portafoglio." },
    ],
    options: ["Quota periodica", "Regola anti-impulso", "Check trimestrale"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "caring"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Scenario: il mercato scende e senti il bisogno di fermarti." },
      { kind: "explain", title: "Spiegazione rapida", content: "Le emozioni sono parte del processo. Per questo servono regole definite prima." },
      { kind: "question", title: "Domanda guida", content: "Quale regola ti impedisce di vendere in panico?" },
      { kind: "exercise", title: "Micro-azione", content: "Scrivi il tuo protocollo: cosa fai se il portafoglio scende del 10%, 20% o 30%." },
    ],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Investire bene e gestire comportamento e aspettative, non solo rendimento." },
      { kind: "explain", title: "Spiegazione rapida", content: "L'obiettivo e restare nel piano abbastanza a lungo per vedere i risultati." },
      { kind: "question", title: "Domanda guida", content: "Come misurerai i progressi senza farti guidare dal rumore quotidiano?" },
      { kind: "exercise", title: "Micro-azione", content: "Definisci tre metriche: contributi, coerenza del piano, distanza dall'obiettivo." },
    ],
    suggestedPrompts: [
      "Che differenza c'e tra investire e speculare?",
      "Come scelgo un orizzonte realistico?",
      "Dammi una regola semplice per non agire di impulso",
    ],
  },
};

const lesson4Definition = createStaticLessonDefinition("4", content);

export default lesson4Definition;
