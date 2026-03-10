import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "Focus",
        content: "Risparmiare senza fatica significa ridurre attrito: meno decisioni manuali, piu automatismi utili.",
      },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content:
          "La regola efficace e 'prima risparmio, poi spendo': anche una quota piccola ma fissa crea continuita e fiducia.",
      },
      {
        kind: "question",
        title: "Approfondimento",
        content: "Domanda didattica: perche un importo basso automatico batte un importo alto deciso ogni mese?",
      },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario: stipendio 1.700 euro, obiettivo 1.200 euro in 12 mesi. Passi: 1) quota media mensile 100 euro, 2) scegli data automatica giorno stipendio, 3) imposta versione B da 60 euro nei mesi stretti. Soluzione: piano sostenibile con continuita anche in mesi difficili.",
      },
    ],
    options: ["Scelgo quota base", "Attivo automatismo", "Definisco piano A/B"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "Focus",
        content: "Il salvadanaio migliore ha nome chiaro, data fissa e importo realistico.",
      },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content:
          "Collega ogni obiettivo a una cifra e a una scadenza: obiettivi vaghi generano rinvii, obiettivi numerici guidano azione.",
      },
      {
        kind: "question",
        title: "Approfondimento",
        content: "Domanda didattica: quale metrica guardi per capire se il tuo automatismo sta funzionando?",
      },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario: vuoi 600 euro per emergenze leggere in 8 mesi. Passi: 1) quota target 75 euro/mese, 2) verifica sostenibilita su budget, 3) imposta check mensile. Soluzione: quota automatica 75 euro, con soglia minima 50 euro nei mesi di picco spese.",
      },
    ],
    options: ["Importo realistico", "Data fissa", "Check mensile"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "Focus",
        content: "Il rischio tipico e sospendere il risparmio al primo imprevisto invece di adattarlo.",
      },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "La continuita conta piu del volume: meglio ridurre temporaneamente che fermare del tutto.",
      },
      {
        kind: "question",
        title: "Approfondimento",
        content: "Domanda didattica: quale soglia minima protegge l'abitudine nei mesi difficili?",
      },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario: mese con bolletta extra da 180 euro. Passi: 1) riduci risparmio da 100 a 60 euro, 2) pianifica recupero 40 euro nei due mesi successivi, 3) mantieni data automatica invariata. Soluzione: abitudine salva, obiettivo recuperabile senza reset.",
      },
    ],
  },
  quiz: {
    nodeKey: "quiz",
    criteria: ["integration", "application"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Quiz finale: verifica se il tuo sistema di risparmio regge anche sotto stress." },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "Scegli sempre l'opzione che massimizza continuita e sostenibilita, non quella piu aggressiva.",
      },
      {
        kind: "question",
        title: "Domanda 1",
        content: "Hai 1.900 euro netti e vuoi risparmiare per un fondo da 1.500 euro in 15 mesi. Quale quota e coerente?",
        pollAreas: [
          {
            id: "quiz-q1",
            prompt: "Risposta corretta",
            options: ["100 euro/mese con automatismo", "30 euro/mese senza data fissa", "200 euro/mese senza margine sul budget"],
            allowText: true,
          },
        ],
      },
      {
        kind: "exercise",
        title: "Caso pratico",
        content:
          "Scenario: nei primi 2 mesi hai versato 80 e 60 euro invece di 100. Passi: 1) calcola deficit (60 euro), 2) distribuisci recupero su 3 mesi (+20), 3) conferma quota base. Soluzione attesa: 120 euro per 3 mesi, poi ritorno a 100 euro.",
        pollAreas: [
          {
            id: "quiz-case",
            prompt: "Qual e il recupero mensile corretto?",
            options: ["+20 euro per 3 mesi", "+60 euro in un mese", "Nessun recupero necessario"],
            allowText: true,
          },
        ],
      },
    ],
    options: ["Valido la quota", "Verifico il recupero", "Confermo la regola"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Risparmiare bene e un sistema replicabile, non una sfida di motivazione." },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "Mantieni poche regole stabili: quota base, quota minima, check mensile.",
      },
      { kind: "question", title: "Approfondimento", content: "Quale segnale userai per misurare che il tuo piano sta funzionando?" },
      { kind: "exercise", title: "Esempio guidato", content: "Definisci il tuo cruscotto: quota attesa, quota versata, gap da recuperare." },
    ],
    suggestedPrompts: [
      "Aiutami a scegliere una quota di risparmio sostenibile",
      "Come gestisco i mesi con spese extra?",
      "Dammi un modello semplice per monitorare i progressi",
    ],
  },
};

const lesson2Definition = createStaticLessonDefinition("2", content);

export default lesson2Definition;
