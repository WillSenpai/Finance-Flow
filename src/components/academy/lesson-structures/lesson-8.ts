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
        kind: "question",
        title: "🧠 Verifica: priorità dei rischi",
        content:
          "Hai identificato 4 rischi personali:\n\n1) Rischio salute: impatto 50.000€\n2) Rischio casa: impatto 30.000€\n3) Rischio auto: impatto 15.000€\n4) Rischio smartphone: impatto 800€",
        pollAreas: [
          {
            id: "concept-solve-8",
            prompt: "Qual è il criterio corretto per stabilire le priorità?",
            options: [
              "Impatto economico massimo potenziale",
              "Frequenza dell'evento nella vita quotidiana",
              "Costo della polizza più bassa disponibile",
            ],
            allowText: false,
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
        kind: "question",
        title: "🧠 Verifica: confronto polizze",
        content:
          "Polizza A: premio 240€/anno, franchigia 500€\nPolizza B: premio 320€/anno, franchigia 150€\n\nSinistro tipico stimato: 1.000€",
        pollAreas: [
          {
            id: "widget-scenario-8",
            prompt: "Qual è il ragionamento corretto per scegliere?",
            options: [
              "Valutare costo annuo + impatto franchigia su sinistro tipico",
              "Scegliere sempre la polizza con premio più basso",
              "Scegliere a caso tanto sono simili",
            ],
            allowText: false,
          },
        ],
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
        kind: "question",
        title: "🧠 Verifica: massimale vs rischio",
        content:
          "Ti propongono una polizza con:\n- Premio molto basso: 80€/anno\n- Massimale: 20.000€\n\nIl tuo rischio potenziale è stimato in 80.000€.",
        pollAreas: [
          {
            id: "challenge-scenario-8",
            prompt: "Qual è il problema principale di questa polizza?",
            options: [
              "Il massimale copre solo il 25% del rischio potenziale",
              "Il premio è troppo basso, quindi è sospetta",
              "Non c'è nessun problema, il premio è conveniente",
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
        kind: "question",
        title: "🧠 Verifica: gap di copertura",
        content:
          "Rischio stimato: 120.000€\nMassimale proposto: 40.000€\n\nGap di copertura: 80.000€ scoperti",
        pollAreas: [
          {
            id: "quiz-scenario-8",
            prompt: "Cosa devi fare con questo gap di copertura?",
            options: [
              "Cercare un'opzione con massimale adeguato al rischio reale",
              "Accettare comunque perché qualcosa è meglio di niente",
              "Ignorare il gap e sperare che non succeda nulla",
            ],
            allowText: false,
          },
        ],
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
        kind: "question",
        title: "🧠 Verifica finale: il tuo piano revisione",
        content:
          "Per gestire le tue polizze in modo efficace hai bisogno di un piano di revisione annuale.",
        pollAreas: [
          {
            id: "feedback-revisione-8",
            prompt: "Quali elementi deve contenere il piano di revisione?",
            options: [
              "Checklist standard + confronto offerte + data fissa annuale",
              "Solo controllare se il premio è aumentato",
              "Nessun piano, le polizze non vanno mai riviste",
            ],
            allowText: false,
          },
        ],
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
