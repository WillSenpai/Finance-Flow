import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Focus",
        content: "Assicurarsi significa trasferire rischi gravi che non vuoi sostenere da solo.",
      },
      {
        kind: "explain",
        title: "📌 Priorità ai rischi",
        content: "La priorità va ai rischi ad alto impatto: salute, responsabilità civile, reddito, casa.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Perché il criterio 'alto impatto, bassa frequenza' è centrale?",
        pollAreas: [
          {
            id: "concept-verify-8",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Questi eventi sono rari ma devastanti se non coperti",
              "I rischi frequenti sono più importanti",
              "Non serve assicurarsi",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Mappatura rischi",
        content: "Mappa i tuoi rischi, ordinali per impatto economico, copri prima i più gravi.",
      },
      {
        kind: "exercise",
        title: "🛠️ Esempio guidato",
        content:
          "4 rischi personali con impatto stimato. Piano: 1) ordina per impatto massimo, 2) seleziona i primi 2 da coprire, 3) definisci budget assicurativo annuo. Copertura mirata prima.",
        pollAreas: [
          {
            id: "concept-solve-8",
            prompt: "Qual è il criterio di priorità?",
            options: [
              "Impatto economico massimo potenziale",
              "Frequenza dell'evento",
              "Costo della polizza più bassa",
            ],
            allowText: true,
          },
        ],
      },
    ],
    options: ["Mappo i rischi", "Ordino per impatto", "Definisco priorità di copertura"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Focus",
        content: "Una polizza utile si valuta su coperture, esclusioni, franchigie e massimali.",
      },
      {
        kind: "explain",
        title: "📌 Oltre il prezzo",
        content: "Prezzo basso non basta: devi sapere in quali casi la polizza paga davvero e in quali no.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Quale clausola controlli prima di confrontare il premio?",
        pollAreas: [
          {
            id: "widget-verify-8",
            prompt: "Seleziona la clausola chiave",
            options: [
              "Esclusioni e franchigia",
              "Solo il premio annuale",
              "Il colore del contratto",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "exercise",
        title: "🛠️ Scenario pratico",
        content:
          "Polizza A: 240€, franchigia 500€. Polizza B: 320€, franchigia 150€. Valuta: 1) costo annuo, 2) impatto franchigia su sinistro tipico, 3) scegli in base a rischio reale. Non sempre la più economica è la migliore.",
      },
    ],
    options: ["Confronto clausole", "Valuto franchigia", "Controllo massimale"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Focus",
        content: "Il rischio tipico è comprare polizze economiche ma piene di esclusioni.",
      },
      {
        kind: "explain",
        title: "📌 Checklist minima",
        content: "Prima di firmare: checklist minima e chiarimento scritto sulle esclusioni principali.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Quali 3 condizioni minime pretendi in una nuova polizza?",
        pollAreas: [
          {
            id: "challenge-verify-8",
            prompt: "Seleziona le condizioni chiave",
            options: [
              "Massimale adeguato, franchigia accettabile, esclusioni chiare",
              "Solo prezzo basso",
              "Nessuna condizione particolare",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🛡️ Copertura proporzionata",
        content: "La copertura deve essere proporzionata al rischio economico da proteggere.",
      },
      {
        kind: "exercise",
        title: "🛠️ Scenario",
        content:
          "Proposta con premio basso ma massimale ridotto. Piano: 1) confronta massimale con danno potenziale, 2) valuta scoperto, 3) decidi se copertura è adeguata.",
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
        content: "Quiz finale: verifica se sai scegliere coperture in modo razionale.",
      },
      {
        kind: "explain",
        title: "📌 Metodo di scelta",
        content: "Applica il metodo: priorità rischio, lettura clausole, confronto costo/protezione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Qual è il primo criterio di scelta di una polizza?",
        pollAreas: [
          {
            id: "quiz-q1-8",
            prompt: "Seleziona la risposta più corretta",
            options: [
              "Adeguatezza della copertura al rischio da proteggere",
              "Premio più basso in assoluto",
              "Numero di pagine del contratto",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Rischio stimato 120.000€, massimale proposto 40.000€. Qual è il problema?",
        pollAreas: [
          {
            id: "quiz-q2-8",
            prompt: "Qual è il problema principale?",
            options: [
              "Massimale insufficiente rispetto al rischio",
              "Premio troppo basso",
              "Contratto troppo breve",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "exercise",
        title: "🛠️ Caso pratico",
        content:
          "Gap copertura: 80.000€ scoperti. Piano: 1) valuta opzione con massimale adeguato, 2) controlla franchigia, 3) scegli copertura coerente al rischio reale.",
      },
    ],
    options: ["Prioritizzo rischio", "Confronto clausole", "Scelgo copertura adeguata"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Focus",
        content: "Assicurarsi bene protegge la stabilità tua e della tua famiglia.",
      },
      {
        kind: "explain",
        title: "📌 Poche coperture ben comprese",
        content: "Meglio poche coperture comprese bene che molte coperture poco utili.",
      },
      {
        kind: "question",
        title: "🎯 La tua revisione",
        content: "Quale polizza vuoi rivedere per prima con criteri migliori?",
        pollAreas: [
          {
            id: "feedback-rule-8",
            prompt: "Seleziona la polizza prioritaria",
            options: [
              "Assicurazione sanitaria",
              "Responsabilità civile",
              "Protezione reddito/casa",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "exercise",
        title: "✍️ Piano revisione",
        content: "Programma revisione annuale: checklist standard, confronto offerte, data fissa.",
      },
    ],
    suggestedPrompts: [
      "Dammi una checklist base per confrontare polizze",
      "Come valuto se una copertura è davvero adeguata?",
      "Quali clausole devo leggere sempre prima di firmare?",
    ],
  },
};

const lesson8Definition = createStaticLessonDefinition("8", content);

export default lesson8Definition;
