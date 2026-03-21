import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Focus",
        content: "Investire è comprare tempo: rinunci a consumo oggi per obiettivi futuri.",
      },
      {
        kind: "explain",
        title: "📌 Tre domande base",
        content: "Per cosa investi? Per quanto tempo? Con quale oscillazione puoi convivere?",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Perché obiettivo e orizzonte vengono prima dello strumento?",
        pollAreas: [
          {
            id: "concept-verify-4",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Lo strumento deve servire l'obiettivo, non viceversa",
              "Lo strumento è sempre la prima scelta",
              "L'orizzonte non conta",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Obiettivo chiaro",
        content: "Un obiettivo vago genera decisioni vaghe. Un obiettivo numerico con data genera un piano.",
      },
      {
        kind: "exercise",
        title: "🛠️ Esempio guidato",
        content:
          "Obiettivo: anticipo casa in 8 anni. Capitale iniziale 2.000€, versamento 180€/mese. Piano: 1) definisci orizzonte, 2) scegli contributo sostenibile, 3) imposta regola di revisione.",
        pollAreas: [
          {
            id: "concept-solve-4",
            prompt: "Qual è l'elemento chiave?",
            options: [
              "Orizzonte medio-lungo coerente con l'obiettivo",
              "Scegliere sempre l'investimento più rischioso",
              "Cambiare strategia ogni mese",
            ],
            allowText: true,
          },
        ],
      },
    ],
    options: ["Definisco obiettivo", "Definisco orizzonte", "Definisco contributo"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Focus",
        content: "La regola operativa batte la previsione perfetta del mercato.",
      },
      {
        kind: "explain",
        title: "📌 Sistema replicabile",
        content: "Contributo periodico, data fissa, revisione trimestrale: semplice, replicabile, meno emotivo.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Quale errore evita un piano automatico rispetto all'investimento occasionale?",
        pollAreas: [
          {
            id: "widget-verify-4",
            prompt: "Seleziona l'errore evitato",
            options: [
              "Tentare di indovinare il momento giusto",
              "Investire troppo poco",
              "Non avere un conto dedicato",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "exercise",
        title: "🛠️ Scenario pratico",
        content:
          "Versi 120€/mese, il mercato scende del 12%. Piano: 1) verifica sostenibilità del contributo, 2) conferma regola, 3) evita variazioni impulsive. Continui se obiettivo e orizzonte non cambiano.",
      },
    ],
    options: ["Contributo periodico", "Regola anti-panico", "Check trimestrale"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Focus",
        content: "Il momento critico è quando i prezzi scendono e senti urgenza di uscire.",
      },
      {
        kind: "explain",
        title: "📌 Protocollo scritto",
        content: "Serve un protocollo scritto prima: cosa fai, cosa non fai, quando rivaluti.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Quale criterio oggettivo usi prima di modificare il piano?",
        pollAreas: [
          {
            id: "challenge-verify-4",
            prompt: "Seleziona il criterio chiave",
            options: [
              "Cambiamento nella mia situazione personale",
              "Notizie sui social media",
              "Consiglio di un amico",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🛡️ Distanza dall'obiettivo",
        content: "Prima di agire, controlla sempre: distanza dall'obiettivo, orizzonte residuo, liquidità extra.",
      },
      {
        kind: "exercise",
        title: "🛠️ Scenario",
        content:
          "Portafoglio -18% in 4 mesi. Passi: 1) controlla distanza da obiettivo, 2) verifica liquidità, 3) agisci solo se cambia la TUA situazione. Decisione guidata da obiettivo, non dal rumore.",
      },
    ],
  },
  quiz: {
    nodeKey: "quiz",
    criteria: ["integration", "application"],
    blocks: [
      {
        kind: "focus",
        title: "🧠 Focus",
        content: "Quiz finale: verifica se sai investire con processo e non con emozione.",
      },
      {
        kind: "explain",
        title: "📌 Coerenza e orizzonte",
        content: "Scegli sempre l'opzione che protegge coerenza e orizzonte.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Il mercato scende ma il tuo obiettivo resta a 10 anni. Cosa è più coerente?",
        pollAreas: [
          {
            id: "quiz-q1-4",
            prompt: "Scelta migliore",
            options: [
              "Mantenere il piano e monitorare con cadenza definita",
              "Vendere tutto per bloccare la perdita",
              "Smettere di investire senza una data di ripresa",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Obiettivo 90.000€ in 15 anni, contributo 250€/mese. Dopo 1 anno vuoi dimezzare per paura. Qual è l'errore?",
        pollAreas: [
          {
            id: "quiz-q2-4",
            prompt: "Qual è l'errore più grave?",
            options: [
              "Cambiare piano senza valutare impatto sull'obiettivo",
              "Ridurre leggermente il contributo in modo pianificato",
              "Fare review trimestrale con criteri chiari",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "exercise",
        title: "🛠️ Caso pratico",
        content:
          "Piano: 1) valuta impatto sul traguardo, 2) cerca alternativa sostenibile (es. 200€), 3) aggiorna regola solo se necessario. Modifica ragionata, non stop impulsivo.",
      },
    ],
    options: ["Confermo il processo", "Misuro l'impatto", "Aggiorno solo con criterio"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Focus",
        content: "Investire bene è gestire comportamento, non inseguire previsioni.",
      },
      {
        kind: "explain",
        title: "📌 La vera competenza",
        content: "La vera competenza è restare nel piano quando è scomodo.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo protocollo",
        content: "Quale regola userai per non agire di impulso?",
        pollAreas: [
          {
            id: "feedback-rule-4",
            prompt: "Seleziona la tua regola",
            options: [
              "Pausa 48h prima di qualsiasi modifica",
              "Review solo a date fisse",
              "Confronto con il mio obiettivo originale",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "exercise",
        title: "✍️ Protocollo personale",
        content: "Scrivi il tuo protocollo in 3 righe: trigger, verifica, azione.",
      },
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
