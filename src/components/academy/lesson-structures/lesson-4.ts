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
        kind: "question",
        title: "🧠 Verifica: piano di investimento",
        content:
          "Obiettivo: anticipo casa in 8 anni\n\nCapitale iniziale: 2.000€\nVersamento: 180€/mese\n\nDevi scegliere l'approccio corretto.",
        pollAreas: [
          {
            id: "concept-solve-4",
            prompt: "Qual è l'elemento chiave del piano?",
            options: [
              "Orizzonte medio-lungo coerente con l'obiettivo",
              "Scegliere sempre l'investimento più rischioso",
              "Cambiare strategia ogni mese",
            ],
            allowText: false,
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
        kind: "question",
        title: "🧠 Verifica: mercato in calo",
        content:
          "Versi 120€/mese da 6 mesi.\n\nIl mercato scende del 12%.\n\nIl tuo obiettivo resta a 10 anni.",
        pollAreas: [
          {
            id: "widget-scenario-4",
            prompt: "Qual è la mossa corretta?",
            options: [
              "Continuare il piano se obiettivo e orizzonte non cambiano",
              "Vendere tutto per fermare la perdita",
              "Smettere di investire fino a quando risale",
            ],
            allowText: false,
          },
        ],
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
        kind: "question",
        title: "🧠 Verifica: portafoglio in perdita",
        content:
          "Il tuo portafoglio è sceso del 18% in 4 mesi.\n\nL'obiettivo resta a 8 anni.\n\nLa tua situazione personale non è cambiata.",
        pollAreas: [
          {
            id: "challenge-scenario-4",
            prompt: "Cosa devi verificare prima di agire?",
            options: [
              "Distanza dall'obiettivo e liquidità personale",
              "Le previsioni degli analisti sui social",
              "I consigli degli amici che investono",
            ],
            allowText: false,
          },
        ],
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
        kind: "question",
        title: "🧠 Verifica: modifica del piano",
        content:
          "Vuoi ridurre il contributo mensile da 250€ a 125€ per paura.\n\nL'obiettivo è 90.000€ in 15 anni.",
        pollAreas: [
          {
            id: "quiz-scenario-4",
            prompt: "Qual è l'errore principale in questa situazione?",
            options: [
              "Cambiare piano senza valutare l'impatto sull'obiettivo",
              "Fare una review con criteri oggettivi",
              "Cercare un'alternativa sostenibile come 200€/mese",
            ],
            allowText: false,
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
        kind: "question",
        title: "🧠 Verifica finale: protocollo anti-panico",
        content:
          "Per evitare decisioni impulsive hai bisogno di un protocollo definito in anticipo.",
        pollAreas: [
          {
            id: "feedback-protocollo-4",
            prompt: "Quali sono i tre elementi del protocollo?",
            options: [
              "Trigger + verifica + azione definita",
              "Solo aspettare che passi la paura",
              "Chiedere consigli a chi ha panico come te",
            ],
            allowText: false,
          },
        ],
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
