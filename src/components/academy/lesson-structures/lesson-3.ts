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
        kind: "exercise",
        title: "🛠️ Esempio guidato",
        content:
          "Prestito A: 180€/mese per 48 mesi. Prestito B: 140€/mese per 72 mesi. Confronta: 1) durata e pressione mensile, 2) costo totale stimato, 3) sostenibilità reale.",
        pollAreas: [
          {
            id: "concept-solve-3",
            prompt: "Qual è il criterio decisivo?",
            options: [
              "Bilanciamento tra costo complessivo e tenuta mensile",
              "Solo la rata più bassa",
              "Solo la durata più corta",
            ],
            allowText: true,
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
        kind: "exercise",
        title: "🛠️ Scenario pratico",
        content:
          "3 debiti: rate 90€, 120€, 210€. Extra budget 80€. Piano: 1) scegli debito target, 2) alloca +80€ fisso, 3) revisione ogni 30 giorni.",
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
        kind: "exercise",
        title: "🛠️ Scenario",
        content:
          "Nuova offerta 75€/mese, margine attuale 95€. Nuovo margine: 20€. Valuta: se il buffer diventa troppo basso, rinvia o riduci importo.",
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
        kind: "exercise",
        title: "🛠️ Caso pratico",
        content:
          "Piano a 90 giorni: 1) scegli debito target, 2) applica extra costante, 3) scrivi regola anti-nuove-rate. Importo extra fisso + vincolo comportamentale.",
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
        kind: "exercise",
        title: "✍️ Piano 90 giorni",
        content: "Scrivi: debito target, extra-importo, giorno review.",
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
