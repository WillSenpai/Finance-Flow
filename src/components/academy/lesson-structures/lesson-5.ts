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
        content: "Un fondo è un contenitore: il risultato dipende da cosa contiene e quanto costa mantenerlo.",
      },
      {
        kind: "explain",
        title: "📌 Ordine di valutazione",
        content: "Prima capisci strategia e rischi, poi confronti costi ricorrenti e coerenza con obiettivo.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Perché due fondi simili possono dare risultati diversi nel lungo periodo?",
        pollAreas: [
          {
            id: "concept-verify-5",
            prompt: "Seleziona la risposta corretta",
            options: [
              "I costi ricorrenti erodono il rendimento nel tempo",
              "Il nome del fondo determina il risultato",
              "I fondi simili danno sempre lo stesso risultato",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "📊 Impatto dei costi",
        content: "Costi ricorrenti alti erodono il risultato se non giustificati da valore aggiunto reale.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: impatto dei costi",
        content:
          "Fondo A: costo annuo 0,25%\nFondo B: costo annuo 1,40%\n\nStessa esposizione di mercato.\nCapitale investito: 20.000€ per 10 anni.",
        pollAreas: [
          {
            id: "concept-solve-5",
            prompt: "Qual è la lezione chiave di questo confronto?",
            options: [
              "Costi ricorrenti alti richiedono giustificazione reale",
              "Il fondo più costoso è sempre migliore",
              "I costi non influiscono sul risultato finale",
            ],
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco cosa contiene", "Confronto costi", "Valuto coerenza"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Focus",
        content: "La scelta pratica richiede una checklist minima sempre uguale.",
      },
      {
        kind: "explain",
        title: "📌 Checklist base",
        content: "Elementi: obiettivo fondo, composizione, costo annuo, volatilità, orizzonte consigliato.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Quale elemento della checklist evita più errori di acquisto?",
        pollAreas: [
          {
            id: "widget-verify-5",
            prompt: "Seleziona l'elemento chiave",
            options: [
              "Costo annuo confrontato con alternative",
              "Solo il nome del fondo",
              "Solo il rendimento dell'ultimo mese",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica: metodo di confronto",
        content:
          "Devi confrontare 2 fondi bilanciati.\n\nHai bisogno di un metodo sistematico per decidere.",
        pollAreas: [
          {
            id: "widget-scenario-5",
            prompt: "Qual è il metodo corretto per confrontare i fondi?",
            options: [
              "Compilare una scheda con criteri e assegnare un punteggio",
              "Scegliere quello con il nome più conosciuto",
              "Guardare solo il rendimento dell'ultimo mese",
            ],
            allowText: false,
          },
        ],
      },
    ],
    options: ["Uso checklist", "Valuto costo-rischio", "Scelgo per punteggio"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Focus",
        content: "Il pericolo è scegliere solo guardando il rendimento recente.",
      },
      {
        kind: "explain",
        title: "📌 Rendimento non basta",
        content: "Rendimento passato non basta: deve essere coerente con rischio, costo e obiettivo.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Quale dato controlli per primo prima di comprare un fondo?",
        pollAreas: [
          {
            id: "challenge-verify-5",
            prompt: "Seleziona la priorità",
            options: [
              "Costi ricorrenti e composizione",
              "Solo il rendimento dell'ultimo anno",
              "Il colore del logo",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🛡️ Struttura robusta",
        content: "Privilegia struttura robusta rispetto al picco recente: i costi bassi lavorano per te nel tempo.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: rendimento vs costi",
        content:
          "Fondo X: rendimento +18% ultimo anno, costo 1,8%\nFondo Y: rendimento +14% ultimo anno, costo 0,35%\n\nOrizzonte di investimento: 5-10 anni.",
        pollAreas: [
          {
            id: "challenge-scenario-5",
            prompt: "Quale fondo è probabilmente migliore nel lungo periodo?",
            options: [
              "Fondo Y: i costi bassi vincono nel lungo periodo",
              "Fondo X: il rendimento recente conta di più",
              "Sono equivalenti nel lungo periodo",
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
        content: "Quiz finale: verifica se sai confrontare fondi con metodo.",
      },
      {
        kind: "explain",
        title: "📌 Logica costo-rischio",
        content: "Applica checklist e logica costo-rischio-obiettivo.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Quale confronto è corretto tra due fondi simili?",
        pollAreas: [
          {
            id: "quiz-q1-5",
            prompt: "Scegli l'opzione migliore",
            options: [
              "Composizione + costo annuo + volatilità + coerenza obiettivo",
              "Solo rendimento ultimi 12 mesi",
              "Solo nome del gestore",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Capitale 30.000€, differenza costo tra due fondi: 1,1%. Quanto costa in euro all'anno?",
        pollAreas: [
          {
            id: "quiz-q2-5",
            prompt: "Quanto pesa la differenza costo annuo in euro?",
            options: ["330€", "33€", "3.300€"],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica: calcolo impatto costi",
        content:
          "Capitale: 30.000€\nDifferenza costo tra due fondi: 1,1%\n\nIn euro all'anno la differenza è 330€.",
        pollAreas: [
          {
            id: "quiz-scenario-5",
            prompt: "Su 10 anni, quanto pesa questa differenza di costo?",
            options: [
              "3.300€ + mancato rendimento composto",
              "Solo 330€ in totale",
              "Il costo non impatta nel lungo periodo",
            ],
            allowText: false,
          },
        ],
      },
    ],
    options: ["Confronto completo", "Calcolo impatto costi", "Scelgo per coerenza"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Focus",
        content: "Scegliere un fondo bene significa scegliere un processo decisionale, non una moda.",
      },
      {
        kind: "explain",
        title: "📌 Ridurre ansia",
        content: "Con una checklist chiara riduci errori e ansia decisionale.",
      },
      {
        kind: "question",
        title: "🎯 La tua checklist",
        content: "Quale criterio non vuoi più saltare quando valuti un fondo?",
        pollAreas: [
          {
            id: "feedback-rule-5",
            prompt: "Seleziona il criterio prioritario",
            options: [
              "Costo annuo reale",
              "Composizione del portafoglio",
              "Coerenza con il mio obiettivo",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica finale: la tua checklist",
        content:
          "Per valutare ogni fondo hai bisogno di una checklist con criteri essenziali.",
        pollAreas: [
          {
            id: "feedback-checklist-5",
            prompt: "Quali sono i criteri essenziali della checklist?",
            options: [
              "Obiettivo + composizione + costo + volatilità + orizzonte",
              "Solo il rendimento dell'ultimo anno",
              "Solo il nome del gestore del fondo",
            ],
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Aiutami a confrontare due fondi con un metodo semplice",
      "Quali costi devo sempre controllare?",
      "Dammi una checklist pronta da riutilizzare",
    ],
  },
};

const lesson5Definition = createStaticLessonDefinition("5", content);

export default lesson5Definition;
