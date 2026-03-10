import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Assicurarsi significa trasferire rischi gravi che non vuoi sostenere da solo." },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "La priorita va ai rischi ad alto impatto economico: salute, responsabilita civile, reddito, casa.",
      },
      { kind: "question", title: "Approfondimento", content: "Domanda didattica: perche il criterio 'alto impatto, bassa frequenza' e centrale?" },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario: valuti 4 rischi personali con impatto stimato. Passi: 1) ordina per impatto economico massimo, 2) seleziona i primi 2 da coprire subito, 3) definisci budget assicurativo annuo. Soluzione: copertura mirata prima, non dispersione su polizze minori.",
      },
    ],
    options: ["Mappo i rischi", "Ordino per impatto", "Definisco priorita di copertura"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Una polizza utile si valuta su coperture, esclusioni, franchigie e massimali." },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "Prezzo basso non basta: devi sapere in quali casi la polizza paga davvero e in quali no.",
      },
      { kind: "question", title: "Approfondimento", content: "Domanda didattica: quale clausola controlli prima di confrontare il premio?" },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario: Polizza A premio 240 euro, franchigia 500; Polizza B premio 320 euro, franchigia 150. Passi: 1) confronta costo annuo, 2) valuta impatto franchigia su sinistro tipico, 3) scegli in base a rischio reale. Soluzione: non sempre la polizza meno cara e la piu conveniente.",
      },
    ],
    options: ["Confronto clausole", "Valuto franchigia", "Controllo massimale"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Il rischio tipico e comprare polizze economiche ma piene di esclusioni." },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "Prima di firmare, usa checklist minima e richiedi sempre chiarimento scritto sulle esclusioni principali.",
      },
      { kind: "question", title: "Approfondimento", content: "Domanda didattica: quali 3 condizioni minime pretendi in una nuova polizza?" },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario: proposta con premio basso ma massimale ridotto. Passi: 1) confronta massimale con danno potenziale, 2) valuta scoperto/franchigia, 3) decidi se copertura e adeguata. Soluzione: copertura deve essere proporzionata al rischio economico da proteggere.",
      },
    ],
  },
  quiz: {
    nodeKey: "quiz",
    criteria: ["integration", "application"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Quiz finale: verifica se sai scegliere coperture in modo razionale." },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "Applica il metodo: priorita rischio, lettura clausole, confronto costo/protezione.",
      },
      {
        kind: "question",
        title: "Domanda 1",
        content: "Qual e il primo criterio di scelta di una polizza?",
        pollAreas: [
          {
            id: "quiz-q1",
            prompt: "Seleziona la risposta piu corretta",
            options: ["Adeguatezza della copertura al rischio da proteggere", "Premio piu basso in assoluto", "Numero di pagine del contratto"],
            allowText: true,
          },
        ],
      },
      {
        kind: "exercise",
        title: "Caso pratico",
        content:
          "Scenario: rischio stimato 120.000 euro, massimale polizza proposta 40.000 euro. Passi: 1) confronta gap copertura, 2) valuta opzione con massimale adeguato, 3) controlla franchigia e esclusioni. Soluzione attesa: scegliere copertura con massimale coerente al rischio reale.",
        pollAreas: [
          {
            id: "quiz-case",
            prompt: "Qual e il problema principale della proposta?",
            options: ["Massimale insufficiente rispetto al rischio", "Premio troppo basso", "Contratto troppo breve"],
            allowText: true,
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
      { kind: "focus", title: "Focus", content: "Assicurarsi bene protegge la stabilita tua e della tua famiglia." },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "Meglio poche coperture comprese bene che molte coperture poco utili.",
      },
      { kind: "question", title: "Approfondimento", content: "Quale polizza vuoi rivedere per prima con criteri migliori?" },
      { kind: "exercise", title: "Esempio guidato", content: "Programma una revisione annuale con checklist standard e confronto offerte." },
    ],
    suggestedPrompts: [
      "Dammi una checklist base per confrontare polizze",
      "Come valuto se una copertura e davvero adeguata?",
      "Quali clausole devo leggere sempre prima di firmare?",
    ],
  },
};

const lesson8Definition = createStaticLessonDefinition("8", content);

export default lesson8Definition;
