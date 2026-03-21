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
        content: "Un debito è buono se crea valore futuro, cattivo se erode margine senza ritorno.",
      },
      {
        kind: "explain",
        title: "📌 Le tre leve",
        content: "Per decidere guarda 3 leve: costo totale, durata, impatto sul cashflow mensile.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Perché il tasso da solo non basta per giudicare un debito?",
        pollAreas: [
          {
            id: "concept-verify-3",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Conta anche la durata e l'impatto mensile",
              "Il tasso è l'unico indicatore",
              "La durata non influisce sul costo totale",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "⚖️ Valore vs Consumo",
        content: "Debito per formazione o casa può creare valore. Debito per consumo immediato spesso erode patrimonio.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: confronto prestiti",
        content:
          "Prestito A: 180€/mese per 48 mesi = 8.640€ totali\nPrestito B: 140€/mese per 72 mesi = 10.080€ totali\n\nDevi scegliere quale prestito è migliore per te.",
        pollAreas: [
          {
            id: "concept-solve-3",
            prompt: "Qual è il criterio decisivo per scegliere?",
            options: [
              "Bilanciamento tra costo complessivo e tenuta mensile",
              "Sempre la rata più bassa possibile",
              "Sempre la durata più corta possibile",
            ],
            allowText: false,
          },
        ],
      },
    ],
    options: ["Valuto costo totale", "Valuto sostenibilità mensile", "Distinguo valore da consumo"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Focus",
        content: "Ordina i debiti: prima quelli con maggiore impatto economico o psicologico.",
      },
      {
        kind: "explain",
        title: "📌 Strategia semplice",
        content: "Una strategia semplice: mantieni minimi su tutti, concentra extra-importo su un solo debito target.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Quando conviene priorità per tasso e quando per sollievo di cassa?",
        pollAreas: [
          {
            id: "widget-verify-3",
            prompt: "Seleziona l'approccio migliore",
            options: [
              "Dipende dalla pressione mensile e dalla stabilità del reddito",
              "Sempre per tasso più alto",
              "Non importa l'ordine",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica: strategia debiti multipli",
        content:
          "Hai 3 debiti con rate:\n- Debito 1: 90€/mese\n- Debito 2: 120€/mese\n- Debito 3: 210€/mese\n\nHai 80€ extra da destinare ai debiti.",
        pollAreas: [
          {
            id: "widget-scenario-3",
            prompt: "Qual è la strategia corretta?",
            options: [
              "Scegliere un debito target e allocare tutti gli 80€ su quello",
              "Dividere gli 80€ equamente tra i tre debiti",
              "Usare gli 80€ per spese personali e pagare solo i minimi",
            ],
            allowText: false,
          },
        ],
      },
    ],
    options: ["Scelgo debito target", "Aggiungo quota extra", "Rivedo ogni mese"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Focus",
        content: "Il vero rischio è aggiungere nuove rate prima di aver ridotto quelle attuali.",
      },
      {
        kind: "explain",
        title: "📌 Regola anti-nuovo-debito",
        content: "Nuovo debito accettabile solo se non compromette obiettivi e margine di sicurezza.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Quale vincolo personale imposti prima di accettare una nuova rata?",
        pollAreas: [
          {
            id: "challenge-verify-3",
            prompt: "Seleziona il vincolo chiave",
            options: [
              "Il margine residuo deve coprire imprevisti",
              "Non serve nessun vincolo",
              "Accetto sempre se la rata è bassa",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🛡️ Buffer imprevisti",
        content: "Se il nuovo debito riduce il buffer a zero, il rischio di stress finanziario aumenta molto.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: valutazione nuovo debito",
        content:
          "Ti propongono un finanziamento con rata 75€/mese.\n\nIl tuo margine mensile attuale è 95€.\n\nAccettando, il nuovo margine sarebbe 20€.",
        pollAreas: [
          {
            id: "challenge-scenario-3",
            prompt: "Cosa dovresti fare?",
            options: [
              "Rinviare o ridurre l'importo perché il buffer diventa troppo basso",
              "Accettare perché la rata è inferiore al margine disponibile",
              "Accettare e ridurre altre spese per compensare",
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
        content: "Quiz finale: testa la tua capacità di decidere sui debiti con metodo.",
      },
      {
        kind: "explain",
        title: "📌 Criterio guida",
        content: "La risposta migliore è quella che protegge insieme cashflow, costo e sostenibilità comportamentale.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Hai due prestiti: X tasso alto ma rata piccola, Y tasso medio ma rata pesante. Da dove parti?",
        pollAreas: [
          {
            id: "quiz-q1-3",
            prompt: "Scelta più coerente",
            options: [
              "Priorità al debito che libera più respiro mensile",
              "Priorità casuale senza criterio",
              "Nuovo prestito per coprire le rate",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Margine libero 220€/mese, extra per debiti 70€. Qual è il pilastro del piano?",
        pollAreas: [
          {
            id: "quiz-q2-3",
            prompt: "Qual è il pilastro che non deve mancare?",
            options: [
              "Importo extra costante sul debito target",
              "Decisioni improvvisate",
              "Nessun monitoraggio",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica: piano 90 giorni",
        content:
          "Devi creare un piano di 90 giorni per gestire i tuoi debiti.\n\nIl piano deve includere elementi concreti e misurabili.",
        pollAreas: [
          {
            id: "quiz-scenario-3",
            prompt: "Quali sono i tre elementi essenziali del piano?",
            options: [
              "Debito target + extra fisso mensile + regola anti-nuove-rate",
              "Solo decidere di pagare quando possibile",
              "Chiedere un nuovo prestito per consolidare",
            ],
            allowText: false,
          },
        ],
      },
    ],
    options: ["Applico criterio", "Difendo il margine", "Chiudo con regola 90 giorni"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Focus",
        content: "Gestire debiti bene significa recuperare controllo economico e mentale.",
      },
      {
        kind: "explain",
        title: "📌 Strategia sostenibile",
        content: "Scegli una strategia che puoi mantenere 12 mesi, non 12 giorni.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo piano",
        content: "Qual è la tua decisione operativa da oggi sui debiti?",
        pollAreas: [
          {
            id: "feedback-rule-3",
            prompt: "Seleziona la tua priorità",
            options: [
              "Identifico il debito target da aggredire",
              "Definisco l'extra mensile fisso",
              "Creo regola anti-nuovo-debito",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica finale: il tuo piano debiti",
        content:
          "Per gestire efficacemente i debiti devi definire un piano con elementi specifici.",
        pollAreas: [
          {
            id: "feedback-piano-3",
            prompt: "Quali tre informazioni deve contenere il tuo piano?",
            options: [
              "Debito target + importo extra mensile + giorno di revisione",
              "Solo l'importo totale del debito",
              "Solo la data di estinzione prevista",
            ],
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Aiutami a ordinare i debiti per priorità",
      "Come definisco una rata davvero sostenibile?",
      "Dammi una regola anti-nuovo-debito",
    ],
  },
};

const lesson3Definition = createStaticLessonDefinition("3", content);

export default lesson3Definition;
