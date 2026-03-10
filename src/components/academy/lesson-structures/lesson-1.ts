import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "Focus",
        content:
          "Il budget e una decisione anticipata: decidi prima dove vanno i soldi, cosi riduci errori impulsivi durante il mese.",
      },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content:
          "Un budget personale minimo ha 3 parti: entrate nette, spese essenziali, spese variabili. Se sai questi 3 numeri, sai gia governare il mese.",
      },
      {
        kind: "question",
        title: "Approfondimento",
        content:
          "Domanda didattica: perche fissare un tetto prima di spendere riduce gli sforamenti rispetto al controllo a fine mese?",
        pollAreas: [
          {
            id: "concept-cause",
            prompt: "Qual e la causa principale degli sforamenti senza budget?",
            options: [
              "Decisioni prese sotto pressione nel momento dell'acquisto",
              "Mancanza di entrate sufficienti in assoluto",
              "Uso di troppe categorie di spesa",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario: entrate nette 1.850 euro. Passi: 1) assegna 1.100 euro a essenziali, 2) 450 euro a variabili, 3) 300 euro a risparmio/obiettivi. Soluzione: il piano e sostenibile perche la somma e 1.850 euro e il risparmio e preallocato.",
        pollAreas: [
          {
            id: "concept-solve",
            prompt: "Qual e la prima verifica numerica da fare in questo esercizio?",
            options: [
              "Controllare che la somma delle categorie sia uguale alle entrate",
              "Aumentare subito la quota variabile",
              "Eliminare del tutto la voce risparmio",
            ],
            allowText: true,
          },
        ],
      },
    ],
    options: ["Definisco i 3 numeri base", "Imposto un tetto per categoria", "Scrivo la mia regola mensile"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "Focus",
        content: "Il budget funziona se e visibile: limite chiaro + check ricorrente breve.",
      },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content:
          "Non serve un foglio complesso: basta una tabella settimanale con speso, residuo e correzione. L'obiettivo e correggere presto, non essere perfetto.",
      },
      {
        kind: "question",
        title: "Approfondimento",
        content: "Domanda didattica: quale indicatore ti avvisa prima che il budget sta deragliando?",
      },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario: tetto settimanale 95 euro, al venerdi hai gia speso 82 euro. Passi: 1) calcola residuo (13 euro), 2) identifica 1 spesa rinviabile, 3) imposta limite weekend. Soluzione: limite weekend massimo 13 euro, con rinvio di almeno una spesa discrezionale.",
      },
    ],
    options: ["Faccio check settimanale", "Correggo prima del weekend", "Tengo una categoria cuscinetto"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "Focus",
        content: "Il test reale del budget e quando arriva una settimana irregolare, non quando fila tutto liscio.",
      },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content:
          "Quando sfori, non buttare il piano: applica una regola di recupero semplice nella categoria opzionale successiva.",
      },
      {
        kind: "question",
        title: "Approfondimento",
        content: "Domanda didattica: cosa cambia tra errore occasionale e budget strutturalmente irrealistico?",
      },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario: sfori di 28 euro questa settimana. Passi: 1) recupera 18 euro da svago settimana prossima, 2) recupera 10 euro da micro-spese, 3) mantieni invariata la quota risparmio. Soluzione: recupero completo in 7 giorni senza toccare l'obiettivo principale.",
      },
    ],
  },
  quiz: {
    nodeKey: "quiz",
    criteria: ["integration", "application"],
    blocks: [
      {
        kind: "focus",
        title: "Focus",
        content: "Quiz finale: verifica se sai trasformare il budget in decisioni pratiche.",
      },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content:
          "Rispondi ragionando sui numeri: prima equilibrio tra entrate e uscite, poi priorita, poi correzione settimanale.",
      },
      {
        kind: "question",
        title: "Domanda 1",
        content: "Con entrate nette di 2.100 euro, quale struttura e piu robusta?",
        pollAreas: [
          {
            id: "quiz-q1",
            prompt: "Scegli la risposta migliore",
            options: [
              "Essenziali 1.250, variabili 500, risparmio 350",
              "Essenziali 1.500, variabili 600, risparmio 50",
              "Essenziali 1.000, variabili 1.000, risparmio 100",
            ],
            allowText: true,
          },
          {
            id: "quiz-q1-why",
            prompt: "Perche hai scelto questa opzione?",
            allowText: true,
          },
        ],
      },
      {
        kind: "exercise",
        title: "Caso pratico",
        content:
          "Scenario: a meta mese hai consumato il 70% del budget variabile. Passi: 1) stima spesa fine mese mantenendo ritmo attuale, 2) calcola lo sforamento, 3) proponi una correzione in 2 mosse. Soluzione attesa: riduzione immediata categorie discrezionali + limite giornaliero fino a fine mese.",
        pollAreas: [
          {
            id: "quiz-case",
            prompt: "Qual e la prima mossa correttiva piu efficace?",
            options: [
              "Ridurre subito la categoria discrezionale piu alta",
              "Aumentare il budget variabile per stare piu comodi",
              "Ignorare il dato e valutare solo a fine mese",
            ],
            allowText: true,
          },
        ],
      },
    ],
    options: ["Completo il quiz con numeri", "Rivedo il passaggio critico", "Chiudo con una regola personale"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "Focus",
        content: "Un budget valido ti fa decidere con calma anche quando il mese diventa caotico.",
      },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "Conta la costanza: 10 minuti a settimana battono un reset totale a fine mese.",
      },
      {
        kind: "question",
        title: "Approfondimento",
        content: "Quale regola manterrai per i prossimi 30 giorni?",
      },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content: "Scrivi il tuo patto operativo: limite settimanale, giorno di controllo e azione correttiva se sfori.",
      },
    ],
    suggestedPrompts: [
      "Aiutami a costruire il mio budget mensile completo",
      "Che categorie devo monitorare ogni settimana?",
      "Dammi una regola anti-sforamento semplice",
    ],
  },
};

const lesson1Definition = createStaticLessonDefinition("1", content);

export default lesson1Definition;
