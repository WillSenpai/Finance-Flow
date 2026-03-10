import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "integration"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Un fondo e un contenitore: il risultato dipende da cosa contiene e quanto costa mantenerlo." },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "Prima capisci strategia e rischi, poi confronti costi ricorrenti e coerenza con obiettivo.",
      },
      { kind: "question", title: "Approfondimento", content: "Domanda didattica: perche due fondi simili possono dare risultati diversi nel lungo periodo?" },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario: Fondo A costo annuo 0,25%, Fondo B 1,40%, stessa esposizione. Passi: 1) confronta costo annuo su 20.000 euro, 2) proietta impatto su 10 anni, 3) valuta se il maggior costo ha una motivazione reale. Soluzione: costi ricorrenti alti erodono risultato se non giustificati.",
      },
    ],
    options: ["Capisco cosa contiene", "Confronto costi", "Valuto coerenza"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "learning"],
    blocks: [
      { kind: "focus", title: "Focus", content: "La scelta pratica richiede una checklist minima sempre uguale." },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "Checklist base: obiettivo fondo, composizione, costo annuo, volatilita, orizzonte consigliato.",
      },
      { kind: "question", title: "Approfondimento", content: "Domanda didattica: quale elemento della checklist evita piu errori di acquisto?" },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario: devi scegliere tra 2 fondi bilanciati. Passi: 1) compila scheda per entrambi, 2) assegna voto 1-5 a ciascun criterio, 3) scegli il fondo con punteggio totale maggiore. Soluzione: decisione ripetibile e meno emotiva.",
      },
    ],
    options: ["Uso checklist", "Valuto costo-rischio", "Scelgo per punteggio"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Il pericolo e scegliere solo guardando il rendimento recente." },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "Rendimento passato non basta: deve essere coerente con rischio, costo e obiettivo.",
      },
      { kind: "question", title: "Approfondimento", content: "Domanda didattica: quale dato controlli per primo prima di comprare un fondo?" },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario: Fondo X +18% ultimo anno, costo 1,8%; Fondo Y +14%, costo 0,35%. Passi: 1) valuta orizzonte 5-10 anni, 2) confronta costi ricorrenti, 3) scegli in base a sostenibilita nel tempo. Soluzione: privilegia struttura robusta rispetto al picco recente.",
      },
    ],
  },
  quiz: {
    nodeKey: "quiz",
    criteria: ["integration", "application"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Quiz finale: verifica se sai confrontare fondi con metodo." },
      { kind: "explain", title: "Spiegazione rapida", content: "Applica checklist e logica costo-rischio-obiettivo." },
      {
        kind: "question",
        title: "Domanda 1",
        content: "Quale confronto e corretto tra due fondi potenzialmente simili?",
        pollAreas: [
          {
            id: "quiz-q1",
            prompt: "Scegli l'opzione migliore",
            options: [
              "Composizione + costo annuo + volatilita + coerenza obiettivo",
              "Solo rendimento ultimi 12 mesi",
              "Solo nome del gestore",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "exercise",
        title: "Caso pratico",
        content:
          "Scenario: capitale 30.000 euro; differenza di costo annuo tra due fondi 1,1%. Passi: 1) calcola costo annuo differenziale (330 euro), 2) stima impatto pluriennale, 3) valuta se il maggior costo e giustificato da strategia realmente diversa. Soluzione attesa: costo alto richiede motivazione concreta.",
        pollAreas: [
          {
            id: "quiz-case",
            prompt: "Quanto pesa la differenza costo annuo in euro?",
            options: ["330 euro", "33 euro", "3.300 euro"],
            allowText: true,
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
      { kind: "focus", title: "Focus", content: "Scegliere un fondo bene significa scegliere un processo decisionale, non una moda." },
      { kind: "explain", title: "Spiegazione rapida", content: "Con una checklist chiara riduci errori e ansia decisionale." },
      { kind: "question", title: "Approfondimento", content: "Quale criterio non vuoi piu saltare quando valuti un fondo?" },
      { kind: "exercise", title: "Esempio guidato", content: "Definisci la tua checklist finale in 5 punti e usala su ogni proposta." },
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
