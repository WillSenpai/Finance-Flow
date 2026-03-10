import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Un debito e buono se crea valore futuro, cattivo se erode margine senza ritorno." },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "Per decidere guarda 3 leve: costo totale, durata, impatto sul cashflow mensile.",
      },
      {
        kind: "question",
        title: "Approfondimento",
        content: "Domanda didattica: perche il tasso da solo non basta per giudicare un debito?",
      },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario: prestito A rata 180 euro per 48 mesi; prestito B rata 140 euro per 72 mesi. Passi: 1) confronta durata e pressione mensile, 2) valuta costo totale stimato, 3) scegli in base a sostenibilita reale. Soluzione: la scelta dipende dal bilanciamento tra costo complessivo e tenuta mensile del budget.",
      },
    ],
    options: ["Valuto costo totale", "Valuto sostenibilita mensile", "Distinguo valore da consumo"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Ordina i debiti: prima quelli con maggiore impatto economico o psicologico." },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "Una strategia semplice: mantieni minimi su tutti, concentri extra-importo su un solo debito target.",
      },
      {
        kind: "question",
        title: "Approfondimento",
        content: "Domanda didattica: quando conviene priorita per tasso e quando per sollievo di cassa?",
      },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario: hai 3 debiti con rate 90, 120, 210 euro e extra budget 80 euro. Passi: 1) scegli debito target, 2) alloca +80 fisso, 3) ricalcola tempo stimato estinzione. Soluzione attesa: piano con un target chiaro e revisione ogni 30 giorni.",
      },
    ],
    options: ["Scelgo debito target", "Aggiungo quota extra", "Rivedo ogni mese"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Il vero rischio e aggiungere nuove rate prima di aver ridotto quelle attuali." },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "Nuovo debito accettabile solo se non compromette obiettivi e margine di sicurezza.",
      },
      {
        kind: "question",
        title: "Approfondimento",
        content: "Domanda didattica: quale vincolo personale imposti prima di accettare una nuova rata?",
      },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario: nuova offerta da 75 euro/mese, margine attuale libero 95 euro. Passi: 1) stima nuovo margine (20 euro), 2) verifica se resta buffer imprevisti, 3) decidi. Soluzione: se il buffer diventa troppo basso, rinvia o riduci importo della nuova spesa.",
      },
    ],
  },
  quiz: {
    nodeKey: "quiz",
    criteria: ["integration", "application"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Quiz finale: testa la tua capacita di decidere sui debiti con metodo." },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "La risposta migliore e quella che protegge insieme cashflow, costo e sostenibilita comportamentale.",
      },
      {
        kind: "question",
        title: "Domanda 1",
        content: "Hai due prestiti: X tasso alto ma rata piccola, Y tasso medio ma rata molto pesante. Da dove parti?",
        pollAreas: [
          {
            id: "quiz-q1",
            prompt: "Scelta piu coerente",
            options: [
              "Priorita al debito che libera piu respiro mensile se ridotto",
              "Priorita casuale senza criterio",
              "Nuovo prestito per coprire temporaneamente le rate",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "exercise",
        title: "Caso pratico",
        content:
          "Scenario: margine libero 220 euro/mese, extra che puoi destinare ai debiti 70 euro. Passi: 1) scegli target, 2) applica extra costante, 3) scrivi regola anti-nuove-rate per 90 giorni. Soluzione attesa: piano con priorita, importo extra fisso e vincolo comportamentale.",
        pollAreas: [
          {
            id: "quiz-case",
            prompt: "Qual e il pilastro che non deve mancare nel piano?",
            options: ["Importo extra costante", "Decisioni improvvisate", "Nessun monitoraggio"],
            allowText: true,
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
      { kind: "focus", title: "Focus", content: "Gestire debiti bene significa recuperare controllo economico e mentale." },
      { kind: "explain", title: "Spiegazione rapida", content: "Scegli una strategia che puoi mantenere 12 mesi, non 12 giorni." },
      { kind: "question", title: "Approfondimento", content: "Qual e la tua decisione operativa da oggi sui debiti?" },
      { kind: "exercise", title: "Esempio guidato", content: "Scrivi un piano a 90 giorni: debito target, extra-importo, giorno review." },
    ],
    suggestedPrompts: [
      "Aiutami a ordinare i debiti per priorita",
      "Come definisco una rata davvero sostenibile?",
      "Dammi una regola anti-nuovo-debito",
    ],
  },
};

const lesson3Definition = createStaticLessonDefinition("3", content);

export default lesson3Definition;
