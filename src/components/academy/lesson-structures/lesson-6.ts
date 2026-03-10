import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Rischio non significa errore: significa variabilita da gestire con regole." },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "Il rischio giusto e quello che puoi sostenere senza abbandonare il piano nei momenti critici.",
      },
      { kind: "question", title: "Approfondimento", content: "Domanda didattica: quale differenza c'e tra rischio percepito e rischio sostenibile?" },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario: su 20.000 euro puoi tollerare perdita temporanea massima del 15%. Passi: 1) calcola perdita nominale (3.000 euro), 2) verifica reazione comportamentale, 3) allinea composizione del piano. Soluzione: il tuo profilo deve rispettare questa soglia reale.",
      },
    ],
    options: ["Definisco soglia perdita", "Allineo il piano", "Controllo la reazione emotiva"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Diversificazione e ribilanciamento riducono concentrazione del rischio." },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "Un protocollo semplice: verifica trimestrale e ribilanciamento solo oltre soglia predefinita.",
      },
      { kind: "question", title: "Approfondimento", content: "Domanda didattica: quale soglia di scostamento usi prima di ribilanciare?" },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario: asset azionario target 60%, attuale 68%. Passi: 1) calcola scostamento (+8), 2) confronta con soglia (es. 5), 3) ribilancia parzialmente. Soluzione: ribilanciamento necessario per tornare vicino alla strategia target.",
      },
    ],
    options: ["Definisco soglia", "Ribilancio con criterio", "Evito concentrazioni"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Senza protocollo, la paura prende il controllo delle decisioni." },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "Il protocollo minimo ha 3 step: pausa, verifica dati, decisione con regola scritta.",
      },
      { kind: "question", title: "Approfondimento", content: "Domanda didattica: quale dato oggettivo consulti prima di cambiare strategia?" },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario: notizia negativa + calo rapido del mercato. Passi: 1) attendi 24h, 2) controlla allineamento con obiettivo e soglia rischio, 3) agisci solo se cambia il tuo contesto personale. Soluzione: niente decisioni immediate senza verifica strutturata.",
      },
    ],
  },
  quiz: {
    nodeKey: "quiz",
    criteria: ["integration", "application"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Quiz finale: dimostra che sai gestire il rischio con regole e numeri." },
      { kind: "explain", title: "Spiegazione rapida", content: "Premia la coerenza tra soglia personale, composizione e protocollo decisionale." },
      {
        kind: "question",
        title: "Domanda 1",
        content: "Portafoglio target 50/50, attuale 62/38. Cosa fai?",
        pollAreas: [
          {
            id: "quiz-q1",
            prompt: "Scelta corretta",
            options: ["Valuto ribilanciamento secondo soglia definita", "Non controllo mai per evitare ansia", "Aumento rischio per recuperare prima"],
            allowText: true,
          },
        ],
      },
      {
        kind: "exercise",
        title: "Caso pratico",
        content:
          "Scenario: soglia perdita tollerata 12%, perdita corrente 14%. Passi: 1) verifica se la tolleranza era realistica, 2) riduci rischio al livello sostenibile, 3) aggiorna protocollo scritto. Soluzione attesa: ricalibrazione del piano sulla tua soglia reale.",
        pollAreas: [
          {
            id: "quiz-case",
            prompt: "Qual e il segnale che richiede revisione?",
            options: ["Perdita oltre soglia tollerata", "Una singola notizia social", "Consiglio casuale non contestualizzato"],
            allowText: true,
          },
        ],
      },
    ],
    options: ["Confronto target-attuale", "Rispetto soglia", "Aggiorno protocollo"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Gestire rischio bene significa restare nel piano con serenita." },
      { kind: "explain", title: "Spiegazione rapida", content: "Regole semplici, ripetute nel tempo, proteggono piu delle intuizioni del momento." },
      { kind: "question", title: "Approfondimento", content: "Quale regola di rischio applicherai da questa settimana?" },
      { kind: "exercise", title: "Esempio guidato", content: "Scrivi la tua policy personale: soglia, frequenza review, azioni consentite." },
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
