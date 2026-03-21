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
        kind: "exercise",
        title: "🛠️ Esempio guidato",
        content:
          "Fondo A: costo 0,25%. Fondo B: costo 1,40%. Stessa esposizione. Su 20.000€ in 10 anni: Fondo A risparmia migliaia di euro in commissioni.",
        pollAreas: [
          {
            id: "concept-solve-5",
            prompt: "Qual è la lezione chiave?",
            options: [
              "Costi ricorrenti alti richiedono giustificazione reale",
              "Il fondo più costoso è sempre migliore",
              "I costi non influiscono sul risultato",
            ],
            allowText: true,
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
        kind: "exercise",
        title: "🛠️ Scenario pratico",
        content:
          "2 fondi bilanciati da valutare. Piano: 1) compila scheda per entrambi, 2) assegna voto 1-5 a ogni criterio, 3) scegli il fondo con punteggio totale maggiore. Decisione ripetibile.",
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
        kind: "exercise",
        title: "🛠️ Scenario",
        content:
          "Fondo X: +18% ultimo anno, costo 1,8%. Fondo Y: +14%, costo 0,35%. Su 5-10 anni, i costi ricorrenti di X erodono il vantaggio iniziale.",
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
        kind: "exercise",
        title: "🛠️ Caso pratico",
        content:
          "330€/anno di differenza. Su 10 anni: 3.300€ + mancato rendimento composto. Costo alto richiede motivazione concreta.",
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
        kind: "exercise",
        title: "✍️ Checklist finale",
        content: "Definisci la tua checklist in 5 punti e usala su ogni proposta.",
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
