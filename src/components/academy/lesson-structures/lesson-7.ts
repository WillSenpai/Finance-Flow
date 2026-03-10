import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Il fondo emergenza evita che un imprevisto si trasformi in debito." },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "Target pratico iniziale: 1 mese di spese essenziali, poi estensione a 3-6 mesi.",
      },
      { kind: "question", title: "Approfondimento", content: "Domanda didattica: perche il fondo deve essere liquido e separato dal conto operativo?" },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario: spese essenziali 1.250 euro/mese. Passi: 1) target livello 1 = 1.250, 2) target livello 2 = 3.750, 3) definisci tempo realistico. Soluzione: crescita a step evita frustrazione e mantiene la routine.",
      },
    ],
    options: ["Calcolo spese essenziali", "Definisco target a step", "Scelgo conto dedicato"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "learning"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Automatizzare piccoli importi rende il fondo stabile nel tempo." },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "Importo settimanale o mensile, data fissa, nome del fondo: tre elementi minimi operativi.",
      },
      { kind: "question", title: "Approfondimento", content: "Domanda didattica: quale frequenza di versamento riduce di piu il rischio di saltare?" },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario: vuoi accumulare 1.250 euro in 10 mesi. Passi: 1) quota media 125 euro/mese, 2) valuta versione minima 90 euro nei mesi critici, 3) pianifica recupero. Soluzione: sistema elastico ma continuo.",
      },
    ],
    options: ["Imposto quota base", "Definisco quota minima", "Attivo check mensile"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Dopo un prelievo, la priorita e ricostruire subito con una regola chiara." },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "Ogni uso del fondo deve attivare automaticamente un piano di ricostruzione.",
      },
      { kind: "question", title: "Approfondimento", content: "Domanda didattica: quale piano riattivi dopo un prelievo di emergenza?" },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario: prelievo imprevisto 600 euro. Passi: 1) obiettivo ricostruzione 600 in 6 mesi, 2) quota extra 100 euro/mese, 3) mantieni quota base invariata. Soluzione: ricarica completa senza interrompere il sistema.",
      },
    ],
  },
  quiz: {
    nodeKey: "quiz",
    criteria: ["integration", "application"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Quiz finale: verifica se il tuo fondo emergenza e progettato per reggere davvero." },
      { kind: "explain", title: "Spiegazione rapida", content: "Rispondi con logica: liquidita, separazione, progressione a step, ricostruzione." },
      {
        kind: "question",
        title: "Domanda 1",
        content: "Con spese essenziali 1.400 euro, qual e un primo target corretto?",
        pollAreas: [
          {
            id: "quiz-q1",
            prompt: "Scegli la risposta migliore",
            options: ["1.400 euro come livello iniziale", "50 euro simbolici senza piano", "10.000 euro immediati senza step"],
            allowText: true,
          },
        ],
      },
      {
        kind: "exercise",
        title: "Caso pratico",
        content:
          "Scenario: fondo attuale 900 euro, target 2.800 euro in 12 mesi. Passi: 1) gap da coprire 1.900 euro, 2) quota media 158 euro/mese, 3) definisci quota minima e recupero. Soluzione attesa: piano numerico sostenibile e monitorato.",
        pollAreas: [
          {
            id: "quiz-case",
            prompt: "Qual e il gap corretto da coprire?",
            options: ["1.900 euro", "2.800 euro", "900 euro"],
            allowText: true,
          },
        ],
      },
    ],
    options: ["Verifico target", "Calcolo il gap", "Definisco piano di ricarica"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Il fondo emergenza compra lucidita quando il contesto cambia all'improvviso." },
      { kind: "explain", title: "Spiegazione rapida", content: "Non serve perfezione: serve affidabilita del sistema mese dopo mese." },
      { kind: "question", title: "Approfondimento", content: "Quale importo minimo vuoi vedere sempre disponibile?" },
      { kind: "exercise", title: "Esempio guidato", content: "Scrivi il tuo patto: target, quota base, regola dopo prelievo." },
    ],
    suggestedPrompts: [
      "Aiutami a calcolare il mio fondo emergenza ideale",
      "Come ricostruisco il fondo dopo un imprevisto?",
      "Qual e una quota mensile realistica per iniziare?",
    ],
  },
};

const lesson7Definition = createStaticLessonDefinition("7", content);

export default lesson7Definition;
