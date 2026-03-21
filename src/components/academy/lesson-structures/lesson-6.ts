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
        content: "Rischio non significa errore: significa variabilità da gestire con regole.",
      },
      {
        kind: "explain",
        title: "📌 Rischio sostenibile",
        content: "Il rischio giusto è quello che puoi sostenere senza abbandonare il piano nei momenti critici.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Quale differenza c'è tra rischio percepito e rischio sostenibile?",
        pollAreas: [
          {
            id: "concept-verify-6",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Il rischio sostenibile è quello che non ti fa cambiare piano",
              "Sono la stessa cosa",
              "Il rischio percepito è sempre più basso",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Soglia personale",
        content: "Definisci la tua soglia: quale perdita temporanea puoi tollerare senza cedere al panico?",
      },
      {
        kind: "exercise",
        title: "🛠️ Esempio guidato",
        content:
          "Su 20.000€ tolleri perdita massima del 15% = 3.000€. Piano: 1) calcola perdita nominale, 2) verifica reazione comportamentale, 3) allinea composizione. Il profilo deve rispettare questa soglia.",
        pollAreas: [
          {
            id: "concept-solve-6",
            prompt: "Qual è la verifica chiave?",
            options: [
              "Reazione emotiva alla perdita ipotetica",
              "Solo il rendimento atteso",
              "Il nome degli strumenti",
            ],
            allowText: true,
          },
        ],
      },
    ],
    options: ["Definisco soglia perdita", "Allineo il piano", "Controllo la reazione emotiva"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Focus",
        content: "Diversificazione e ribilanciamento riducono concentrazione del rischio.",
      },
      {
        kind: "explain",
        title: "📌 Protocollo semplice",
        content: "Un protocollo semplice: verifica trimestrale e ribilanciamento solo oltre soglia predefinita.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Quale soglia di scostamento usi prima di ribilanciare?",
        pollAreas: [
          {
            id: "widget-verify-6",
            prompt: "Seleziona la soglia tipica",
            options: [
              "5-10% di scostamento dal target",
              "Qualsiasi scostamento",
              "Non ribilancio mai",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "exercise",
        title: "🛠️ Scenario pratico",
        content:
          "Asset azionario target 60%, attuale 68%. Scostamento +8%. Se soglia è 5%, ribilancia parzialmente per tornare vicino al target.",
      },
    ],
    options: ["Definisco soglia", "Ribilancio con criterio", "Evito concentrazioni"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Focus",
        content: "Senza protocollo, la paura prende il controllo delle decisioni.",
      },
      {
        kind: "explain",
        title: "📌 I tre step",
        content: "Il protocollo minimo: 1) pausa, 2) verifica dati, 3) decisione con regola scritta.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Quale dato oggettivo consulti prima di cambiare strategia?",
        pollAreas: [
          {
            id: "challenge-verify-6",
            prompt: "Seleziona il dato chiave",
            options: [
              "Allineamento con obiettivo e soglia rischio",
              "Titoli dei giornali",
              "Opinioni sui social",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🛡️ Regola 24h",
        content: "Mai decisioni immediate: attendi 24h, controlla allineamento, agisci solo se cambia il tuo contesto.",
      },
      {
        kind: "exercise",
        title: "🛠️ Scenario",
        content:
          "Notizia negativa + calo rapido. Piano: 1) attendi 24h, 2) controlla allineamento con obiettivo, 3) agisci solo se cambia la TUA situazione. Niente decisioni senza verifica.",
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
        content: "Quiz finale: dimostra che sai gestire il rischio con regole e numeri.",
      },
      {
        kind: "explain",
        title: "📌 Coerenza",
        content: "Premia coerenza tra soglia personale, composizione e protocollo decisionale.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Portafoglio target 50/50, attuale 62/38. Cosa fai?",
        pollAreas: [
          {
            id: "quiz-q1-6",
            prompt: "Scelta corretta",
            options: [
              "Valuto ribilanciamento secondo soglia definita",
              "Non controllo mai per evitare ansia",
              "Aumento rischio per recuperare prima",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Soglia perdita tollerata 12%, perdita corrente 14%. Qual è il segnale?",
        pollAreas: [
          {
            id: "quiz-q2-6",
            prompt: "Qual è il segnale che richiede revisione?",
            options: [
              "Perdita oltre soglia tollerata",
              "Una singola notizia social",
              "Consiglio casuale",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "exercise",
        title: "🛠️ Caso pratico",
        content:
          "Piano: 1) verifica se tolleranza era realistica, 2) riduci rischio al livello sostenibile, 3) aggiorna protocollo. Ricalibrazione sulla tua soglia reale.",
      },
    ],
    options: ["Confronto target-attuale", "Rispetto soglia", "Aggiorno protocollo"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Focus",
        content: "Gestire rischio bene significa restare nel piano con serenità.",
      },
      {
        kind: "explain",
        title: "📌 Regole semplici",
        content: "Regole semplici, ripetute nel tempo, proteggono più delle intuizioni del momento.",
      },
      {
        kind: "question",
        title: "🎯 La tua policy",
        content: "Quale regola di rischio applicherai da questa settimana?",
        pollAreas: [
          {
            id: "feedback-rule-6",
            prompt: "Seleziona la tua regola",
            options: [
              "Soglia di perdita massima definita",
              "Review trimestrale obbligatoria",
              "Protocollo anti-panico scritto",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "exercise",
        title: "✍️ Policy personale",
        content: "Scrivi la tua policy: soglia, frequenza review, azioni consentite.",
      },
    ],
    suggestedPrompts: [
      "Come definisco il mio livello di rischio reale?",
      "Quando devo ribilanciare il portafoglio?",
      "Dammi un protocollo anti-panico in 3 passi",
    ],
  },
};

const lesson6Definition = createStaticLessonDefinition("6", content);

export default lesson6Definition;
