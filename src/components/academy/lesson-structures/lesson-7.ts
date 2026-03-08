import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Il fondo emergenza e il cuscinetto che evita di trasformare imprevisti in debiti." },
      { kind: "explain", title: "Spiegazione rapida", content: "Serve per proteggere stabilita e decisioni: quando arriva il problema, non devi improvvisare." },
      { kind: "question", title: "Domanda guida", content: "Quanti mesi di spese essenziali vuoi coprire per sentirti davvero al sicuro?" },
      { kind: "exercise", title: "Micro-azione", content: "Calcola la tua spesa minima mensile e il target iniziale di cuscinetto." },
    ],
    options: ["Calcolo le spese essenziali", "Definisco il target", "Inizio con un mini fondo"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "learning"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Il fondo deve essere separato, liquido e facile da usare solo quando serve." },
      { kind: "explain", title: "Spiegazione rapida", content: "Prima costruisci il primo livello (es. 1 mese), poi estendi gradualmente." },
      { kind: "question", title: "Domanda guida", content: "Quale importo automatico settimanale puoi mantenere con continuita?" },
      { kind: "exercise", title: "Micro-azione", content: "Attiva un trasferimento ricorrente verso il conto emergenze." },
    ],
    options: ["Trasferimento automatico", "Conto separato", "Target a step"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Scenario: arriva una spesa imprevista mentre il fondo e ancora piccolo." },
      { kind: "explain", title: "Spiegazione rapida", content: "La priorita e non interrompere il piano: usa il fondo, poi ricostruiscilo con regola chiara." },
      { kind: "question", title: "Domanda guida", content: "Quale piano di ricostruzione attiverai dopo un prelievo?" },
      { kind: "exercise", title: "Micro-azione", content: "Scrivi la tua regola di ricarica: importo, frequenza e data di verifica." },
    ],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Il fondo emergenza compra tempo e lucidita nei momenti critici." },
      { kind: "explain", title: "Spiegazione rapida", content: "Non e una gara a chi accumula prima: e una routine che ti rende piu resiliente." },
      { kind: "question", title: "Domanda guida", content: "Quale importo minimo vuoi vedere sempre disponibile nel tuo cuscinetto?" },
      { kind: "exercise", title: "Micro-azione", content: "Imposta il prossimo check e il target del mese prossimo." },
    ],
    suggestedPrompts: [
      "Aiutami a calcolare il mio fondo emergenza",
      "Quanto devo tenere liquido e quanto investire?",
      "Come ricostruisco il fondo dopo un imprevisto?",
    ],
  },
};

const lesson7Definition = createStaticLessonDefinition("7", content);

export default lesson7Definition;
