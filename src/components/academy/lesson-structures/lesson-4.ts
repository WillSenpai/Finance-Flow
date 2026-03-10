import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "integration"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Investire e comprare tempo: rinunci a consumo oggi per obiettivi futuri." },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "Tre domande base: per cosa investi, per quanto tempo, con quale oscillazione puoi convivere.",
      },
      { kind: "question", title: "Approfondimento", content: "Domanda didattica: perche obiettivo e orizzonte vengono prima dello strumento?" },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario: obiettivo anticipo casa in 8 anni, capitale iniziale 2.000 euro, versamento 180 euro/mese. Passi: 1) definisci orizzonte, 2) scegli contributo sostenibile, 3) imposta regola di revisione. Soluzione: piano periodico coerente con orizzonte medio-lungo.",
      },
    ],
    options: ["Definisco obiettivo", "Definisco orizzonte", "Definisco contributo"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "learning"],
    blocks: [
      { kind: "focus", title: "Focus", content: "La regola operativa batte la previsione perfetta del mercato." },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "Contributo periodico, data fissa, revisione trimestrale: semplice, replicabile, meno emotivo.",
      },
      { kind: "question", title: "Approfondimento", content: "Domanda didattica: quale errore evita un piano automatico rispetto all'investimento occasionale?" },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario: versi 120 euro/mese e il mercato scende 12%. Passi: 1) verifica se il contributo resta sostenibile, 2) conferma regola, 3) evita variazioni impulsive. Soluzione: continui il piano se obiettivo e orizzonte non cambiano.",
      },
    ],
    options: ["Contributo periodico", "Regola anti-panico", "Check trimestrale"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "caring"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Il momento critico e quando i prezzi scendono e senti urgenza di uscire." },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "Serve un protocollo scritto prima: cosa fai, cosa non fai, quando rivaluti.",
      },
      { kind: "question", title: "Approfondimento", content: "Domanda didattica: quale criterio oggettivo usi prima di modificare il piano?" },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario: portafoglio -18% in 4 mesi. Passi: 1) controlla distanza da obiettivo e orizzonte residuo, 2) verifica liquidita extra, 3) conferma o riduci solo se cambia la tua situazione. Soluzione: decisione guidata da obiettivo, non dal rumore giornaliero.",
      },
    ],
  },
  quiz: {
    nodeKey: "quiz",
    criteria: ["integration", "application"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Quiz finale: verifica se sai investire con processo e non con emozione." },
      { kind: "explain", title: "Spiegazione rapida", content: "Scegli sempre l'opzione che protegge coerenza e orizzonte." },
      {
        kind: "question",
        title: "Domanda 1",
        content: "Se il mercato scende ma il tuo obiettivo resta a 10 anni, cosa e piu coerente?",
        pollAreas: [
          {
            id: "quiz-q1",
            prompt: "Scelta migliore",
            options: ["Mantenere il piano e monitorare con cadenza definita", "Vendere tutto per bloccare la perdita", "Smettere di investire senza una data di ripresa"],
            allowText: true,
          },
        ],
      },
      {
        kind: "exercise",
        title: "Caso pratico",
        content:
          "Scenario: obiettivo 90.000 euro in 15 anni, contributo 250 euro/mese. Dopo 1 anno vuoi dimezzare per paura. Passi: 1) valuta impatto sul traguardo, 2) cerca alternativa sostenibile (es. 200), 3) aggiorna regola solo se necessario. Soluzione attesa: modifica ragionata, non stop totale impulsivo.",
        pollAreas: [
          {
            id: "quiz-case",
            prompt: "Qual e l'errore piu grave?",
            options: ["Cambiare piano senza valutare impatto sull'obiettivo", "Ridurre leggermente il contributo in modo pianificato", "Fare review trimestrale con criteri chiari"],
            allowText: true,
          },
        ],
      },
    ],
    options: ["Confermo il processo", "Misuro l'impatto", "Aggiorno solo con criterio"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Investire bene e gestire comportamento, non inseguire previsioni." },
      { kind: "explain", title: "Spiegazione rapida", content: "La vera competenza e restare nel piano quando e scomodo." },
      { kind: "question", title: "Approfondimento", content: "Quale regola userai per non agire di impulso?" },
      { kind: "exercise", title: "Esempio guidato", content: "Scrivi il tuo protocollo in 3 righe: trigger, verifica, azione." },
    ],
    suggestedPrompts: [
      "Dammi un piano investimento semplice per iniziare",
      "Come evito decisioni emotive nei ribassi?",
      "Quali metriche devo monitorare ogni trimestre?",
    ],
  },
};

const lesson4Definition = createStaticLessonDefinition("4", content);

export default lesson4Definition;
