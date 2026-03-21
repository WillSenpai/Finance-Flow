import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Focus",
        content:
          "Il budget non è una prigione per i tuoi soldi, ma uno strumento di illuminazione finanziaria. Investire senza un piano strutturato equivale a speculare alla cieca, esponendosi a rischi permanenti.",
      },
      {
        kind: "explain",
        title: "📌 Il principio chiave",
        content:
          "Un budget personale è una decisione anticipata: definisci dove devono andare i tuoi soldi prima che ti sfuggano. Questo riduce gli errori impulsivi dettati dalle emozioni.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Perché definire il budget in anticipo è meglio che controllare a fine mese?",
        pollAreas: [
          {
            id: "concept-verify-1",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Riduce le decisioni emotive nel momento dell'acquisto",
              "È più facile da calcolare",
              "Non serve controllare le spese",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🛡️ Costruire sicurezza",
        content:
          "Avere un piano chiaro ti permette di evitare l'indebitamento e costruire quel 'Margine di Sicurezza' vitale per gli imprevisti. Governare le uscite è il primo passo per ogni investitore.",
      },
      {
        kind: "explain",
        title: "📊 I tre pilastri",
        content:
          "Un budget minimo prevede tre macro-aree: 1) entrate nette, 2) spese essenziali (affitto, bollette, cibo), 3) spese variabili (svago, scelte discrezionali).",
      },
      {
        kind: "question",
        title: "🧠 Quiz comprensione",
        content: "Qual è la causa principale degli sforamenti senza un budget strutturato?",
        pollAreas: [
          {
            id: "concept-cause-1",
            prompt: "Qual è la causa principale degli sforamenti?",
            options: [
              "Decisioni prese sotto pressione emotiva",
              "Mancanza di entrate sufficienti",
              "Troppe categorie di spesa",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "explain",
        title: "💰 Paga prima te stesso",
        content:
          "Prevedi sempre una quota inamovibile per risparmio o investimento. Se le spese essenziali superano l'80% delle entrate, il budget è fragile.",
      },
      {
        kind: "exercise",
        title: "🛠️ Esempio guidato",
        content:
          "Con 1.850€ mensili: 1) 1.100€ spese essenziali, 2) 300€ risparmio pre-allocato, 3) 450€ variabili. Il risparmio non è 'quello che avanza' ma è pre-allocato.",
        pollAreas: [
          {
            id: "concept-solve-1",
            prompt: "Qual è la prima verifica da fare?",
            options: [
              "Controllare che la somma delle categorie sia uguale alle entrate",
              "Aumentare la quota di spesa variabile",
              "Eliminare la voce risparmio",
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
        title: "🛠️ Focus",
        content:
          "L'efficacia di un budget non sta nella perfezione del foglio Excel, ma nella visibilità e sistematicità. Un budget invisibile diventa rapidamente carta straccia.",
      },
      {
        kind: "explain",
        title: "📌 Limite e check-up",
        content:
          "Il funzionamento richiede un limite chiaro abbinato a un check-up ricorrente. Senza misurazione costante, la deriva comportamentale prende il sopravvento.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Qual è l'indicatore che ti permette di capire se il budget sta deragliando?",
        pollAreas: [
          {
            id: "widget-verify-1",
            prompt: "Seleziona l'indicatore guida",
            options: [
              "Tasso di consumo nei primi 10 giorni del mese",
              "Saldo residuo a fine mese",
              "Numero di transazioni effettuate",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "⚡ Tracciamento agile",
        content:
          "Non serve un foglio sterminato. Basta un tracciamento settimanale: confronta speso vs residuo e identifica subito la correzione.",
      },
      {
        kind: "explain",
        title: "🎯 Tempestività della correzione",
        content:
          "Il fine non è la precisione millimetrica, ma la tempestività. Se scopri lo sforamento a metà settimana, l'azione correttiva è limitata al weekend.",
      },
      {
        kind: "question",
        title: "🧠 Quiz pratico",
        content: "Quando è meglio verificare il budget?",
        pollAreas: [
          {
            id: "widget-timing-1",
            prompt: "Seleziona la frequenza migliore",
            options: [
              "Settimanalmente, pochi minuti alla volta",
              "Solo a fine mese",
              "Solo quando ci sono problemi",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "exercise",
        title: "🛠️ Scenario pratico",
        content:
          "Tetto settimanale 95€, venerdì hai speso 82€. Calcola residuo (13€), identifica una spesa rinviabile, imponi limite weekend. Niente erosione dei risparmi.",
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
        title: "⚡ Focus",
        content:
          "Il vero test del budget non è la gestione di settimane normali. È quando arrivano imprevisti, inviti inaspettati o micro-spese urgenti.",
      },
      {
        kind: "explain",
        title: "📌 Stress test",
        content:
          "Come le recessioni economiche testano i portafogli, gli imprevisti testano il budget. Mantenere sangue freddo e assorbire l'anomalia senza bruciare il piano è l'obiettivo.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Qual è la differenza tra errore occasionale e budget irrealistico?",
        pollAreas: [
          {
            id: "challenge-verify-1",
            prompt: "Seleziona la differenza chiave",
            options: [
              "Errore occasionale si compensa, budget irrealistico va rivisto",
              "Non c'è differenza",
              "Entrambi richiedono di azzerare il risparmio",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🛡️ Regola di recupero",
        content:
          "Invece di scartare il piano con frustrazione, applica una regola di recupero: decurta le categorie opzionali della settimana successiva.",
      },
      {
        kind: "explain",
        title: "📊 Ribilanciamento",
        content:
          "Come nei fondi dopo un drawdown, il ribilanciamento tempestivo ristabilisce l'equilibrio. La quota risparmio resta sacra.",
      },
      {
        kind: "question",
        title: "🧠 Quiz pratico",
        content: "Hai sforato di 28€. Come recuperi?",
        pollAreas: [
          {
            id: "challenge-recover-1",
            prompt: "Seleziona la strategia migliore",
            options: [
              "Recupero 18€ da svago + 10€ da micro-spese, risparmio intatto",
              "Azzero il risparmio del mese",
              "Ignoro e aspetto il mese prossimo",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "exercise",
        title: "🛠️ Scenario",
        content:
          "Sforamento 28€: 1) Recupera 18€ dal budget svago, 2) Elimina micro-spese superflue per 10€, 3) Mantieni intatta la quota risparmio. Recupero completo in 7 giorni.",
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
        content:
          "Quiz valutativo: verifica la tua capacità di tradurre le regole del budget in decisioni pratiche. L'intelligenza finanziaria si conferma nella trasposizione in comportamenti coerenti.",
      },
      {
        kind: "explain",
        title: "📌 Approccio corretto",
        content:
          "Rispondi verificando l'equilibrio macroeconomico (entrate = uscite), poi analizza le priorità di spesa, infine progetta il piano di correzione settimanale.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Con 2.100€ netti mensili, quale struttura è più resiliente?",
        pollAreas: [
          {
            id: "quiz-q1",
            prompt: "Seleziona la struttura migliore",
            options: [
              "Essenziali 1.250€, variabili 500€, risparmio 350€",
              "Essenziali 1.500€, variabili 600€, risparmio 50€",
              "Essenziali 1.000€, variabili 1.000€, risparmio 100€",
            ],
            allowText: true,
          },
          {
            id: "quiz-q1-why",
            prompt: "Perché questa struttura garantisce protezione?",
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "In due settimane hai consumato il 70% del budget variabile mensile. Prima mossa?",
        pollAreas: [
          {
            id: "quiz-q2",
            prompt: "Seleziona la prima azione",
            options: [
              "Tagliare le categorie discrezionali più alte",
              "Innalzare il budget variabile usando il risparmio",
              "Ignorare fino a fine mese",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "exercise",
        title: "🛠️ Caso pratico",
        content:
          "Stima sforamento, calcola ammanco, proponi due correzioni senza debito. Soluzione: azzerare ultra-discrezionale + tetto giornaliero rigido sui giorni restanti.",
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
        title: "✅ Focus",
        content:
          "Un budget ben architettato diventa un motore di calma anche nei mesi disordinati. Come non farsi prendere dal panico al primo ribasso, così la pianificazione permette di rispondere con lucidità.",
      },
      {
        kind: "explain",
        title: "📌 Il fattore decisivo",
        content:
          "Nella creazione della ricchezza trionfa la costanza. Dieci minuti settimanali per monitorare entrate, uscite e scostamenti sconfiggono l'approccio emotivo di chi ignora il bilancio.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo piano",
        content: "Quale regola hai scelto di applicare per le prossime 4 settimane?",
        pollAreas: [
          {
            id: "feedback-rule-1",
            prompt: "Seleziona la tua regola principale",
            options: [
              "Check settimanale del budget",
              "Tetto rigido alle spese variabili",
              "Pre-allocazione del risparmio",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "exercise",
        title: "✍️ Commitment",
        content:
          "Scrivi: 1) Limite massimo spese variabili settimanali, 2) Giorno fisso per il check di allineamento, 3) Contromisura compensativa in caso di sforamento.",
      },
    ],
    suggestedPrompts: [
      "Aiutami a costruire il mio budget mensile bilanciato",
      "Quali categorie devo monitorare settimanalmente?",
      "Dammi una regola semplice per ridurre le uscite in emergenza",
    ],
  },
};

const lesson1Definition = createStaticLessonDefinition("1", content);

export default lesson1Definition;
