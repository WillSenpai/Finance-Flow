import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Un debito e buono se aumenta il tuo valore futuro; e cattivo se finanzia abitudini che ti bloccano." },
      { kind: "explain", title: "Spiegazione rapida", content: "La domanda chiave non e solo il tasso: e se quel debito migliora o peggiora la tua vita nei prossimi anni." },
      { kind: "question", title: "Domanda guida", content: "Quale debito oggi ti sta dando valore concreto e quale invece solo pressione?" },
      { kind: "exercise", title: "Micro-azione", content: "Fai due colonne: debiti che costruiscono valore e debiti che drenano margine." },
    ],
    options: ["Distinguo valore vs consumo", "Parto dal costo totale", "Controllo la sostenibilita mensile"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Ordina i debiti per priorita: interesse alto e rischio alto prima." },
      { kind: "explain", title: "Spiegazione rapida", content: "Quando il cash e limitato, la sequenza delle estinzioni conta piu della velocita." },
      { kind: "question", title: "Domanda guida", content: "Quale rata, se ridotta, libererebbe piu respiro mensile?" },
      { kind: "exercise", title: "Micro-azione", content: "Scegli un debito target e un extra-importo fisso da aggiungere ogni mese." },
    ],
    options: ["Priorita per tasso", "Priorita per stress", "Priorita per impatto sul cashflow"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Scenario: compare una nuova offerta a rate mentre stai gia pagando due debiti." },
      { kind: "explain", title: "Spiegazione rapida", content: "La decisione giusta dipende dal costo totale e dalla tua capacita reale di reggere il piano." },
      { kind: "question", title: "Domanda guida", content: "Se accetti questa nuova rata, quale obiettivo dovrai rinviare?" },
      { kind: "exercise", title: "Micro-azione", content: "Definisci una regola personale: nessun nuovo debito finche non riduci di X% quello attuale." },
    ],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Gestire i debiti e recuperare margine mentale prima ancora che economico." },
      { kind: "explain", title: "Spiegazione rapida", content: "Una strategia semplice e sostenibile batte piani aggressivi che non riesci a mantenere." },
      { kind: "question", title: "Domanda guida", content: "Quale decisione concreta prendi da oggi sui tuoi debiti?" },
      { kind: "exercise", title: "Micro-azione", content: "Scrivi il tuo piano a 90 giorni con target, importo e giorno controllo." },
    ],
    suggestedPrompts: [
      "Aiutami a ordinare i miei debiti per priorita",
      "Conviene estinguere prima o investire una parte?",
      "Come capisco se una rata e sostenibile?",
    ],
  },
};

const lesson3Definition = createStaticLessonDefinition("3", content);

export default lesson3Definition;
