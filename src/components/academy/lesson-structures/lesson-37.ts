import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Value Investing: comprare a sconto",
        content: "Il **Value Investing** è la filosofia di investimento resa famosa da Benjamin Graham e Warren Buffett.\n\n**L'idea centrale:**\nComprare asset quando il prezzo di mercato è inferiore al loro valore intrinseco.\n\n**Come un affare al supermercato:**\n- Un prodotto vale 10€\n- È in sconto a 6€\n- Compri con un 'margine di sicurezza' del 40%\n\n**Lo stesso vale per le azioni:**\n- Un'azienda vale (secondo la tua analisi) 100€ per azione\n- Il mercato la quota a 60€\n- Compri con margine di sicurezza\n\n**Il principio:** il mercato è emotivo e a volte sbaglia. Un value investor cerca questi errori per comprare 'valore' a prezzo scontato.\n\n**Richiede:** pazienza, disciplina, analisi, e tolleranza per andare controcorrente.",
      },
      {
        kind: "explain",
        title: "📌 Graham e Buffett: i padri del value",
        content: "**Benjamin Graham (1894-1976):**\n- Professore alla Columbia\n- Autore di 'The Intelligent Investor' e 'Security Analysis'\n- Ha definito i principi del value investing\n- Maestro di Warren Buffett\n- Focus: analisi quantitativa, margine di sicurezza\n\n**Warren Buffett (1930-):**\n- CEO di Berkshire Hathaway\n- Uno degli investitori più ricchi della storia\n- Ha evoluto Graham: oltre i numeri, la qualità del business\n- Focus: 'moat' competitivi, management, lungo termine\n\n**I principi condivisi:**\n1. Il prezzo e il valore sono cose diverse\n2. Il mercato è emotivo (Mr. Market)\n3. Margine di sicurezza sempre\n4. Lungo termine\n5. Circle of competence (investi in ciò che capisci)",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Qual è l'idea centrale del value investing?",
        pollAreas: [
          {
            id: "concept-verify-37",
            prompt: "Seleziona il principio chiave",
            options: [
              "Comprare asset quando il prezzo è sotto il valore intrinseco",
              "Comprare azioni che salgono molto",
              "Comprare solo aziende tech",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il value investing cerca **prezzi sotto il valore intrinseco**. L'obiettivo è comprare 1 euro di valore pagando 60-70 centesimi.",
            wrongExplanation: "Non si tratta di seguire il momentum o settori specifici.\n\n**Value investing:**\n- Cerca valore sottovalutato\n- Ignora le mode\n- Richiede analisi\n- Pazienza di lungo termine",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Value vs Growth: due filosofie",
        content: "**Value Investing:**\n- Cerca aziende sottovalutate\n- P/E bassi, dividendi alti\n- Spesso aziende mature, stabili\n- Esempi: banche, utilities, industriali\n- Rischio: 'value trap' (economiche per un motivo)\n\n**Growth Investing:**\n- Cerca aziende in forte crescita\n- P/E alti, reinvestimento utili\n- Spesso tech, innovazione\n- Esempi: Amazon, Google (nei primi anni)\n- Rischio: valutazioni eccessive\n\n**Importante:** non sono mutually exclusive. Buffett cerca 'wonderful companies at fair prices' - qualità a prezzo ragionevole.\n\n**I cicli:** value e growth si alternano. 2010-2020 dominato da growth. 2022 recovery del value. Non c'è un 'sempre vincente'.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: value vs growth",
        content: "Un'azione con P/E 8 e dividendo 5% è tipicamente classificata come:",
        pollAreas: [
          {
            id: "concept-solve-37",
            prompt: "Seleziona la classificazione",
            options: [
              "Value - P/E basso e dividendo alto",
              "Growth - sta crescendo velocemente",
              "Neutrale - impossibile classificare",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **P/E basso + dividendo alto** sono caratteristiche tipiche value. L'azienda è matura, genera cassa, il mercato la valuta poco.",
            wrongExplanation: "Growth ha tipicamente P/E alti e poco dividendo.\n\n**Caratteristiche value:**\n- P/E basso (<15)\n- Dividendo significativo\n- Azienda matura\n- Crescita moderata",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco il value investing", "Conosco Graham e Buffett", "Distinguo value e growth"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Come valutare un'azienda: metriche base",
        content: "Le metriche usate dai value investor:\n\n**P/E (Price/Earnings):**\n- Prezzo / Utile per azione\n- Quanti anni di utili stai pagando?\n- P/E 15 = paghi 15 anni di utili\n- Più basso = più economico (non sempre meglio)\n\n**P/B (Price/Book):**\n- Prezzo / Patrimonio netto per azione\n- P/B 1 = paghi il valore contabile\n- P/B < 1 = sotto il valore dei beni\n\n**Dividend Yield:**\n- Dividendo / Prezzo\n- Quanto rende il dividendo?\n- 4-5% è interessante per value\n\n**Debt/Equity:**\n- Debito / Patrimonio\n- Quanto è indebitata?\n- Troppo debito = rischio\n\n**Attenzione:** nessuna metrica va usata da sola. Un P/E basso può essere una trappola (value trap).",
      },
      {
        kind: "explain",
        title: "📌 La value trap: quando economico non basta",
        content: "Una **value trap** è un'azione che sembra economica ma in realtà sta perdendo valore.\n\n**Come si presenta:**\n- P/E bassissimo (es. 5)\n- Dividendo alto (es. 8%)\n- Sembra un affare!\n\n**Il problema:**\n- Il business è in declino strutturale\n- Gli utili continueranno a calare\n- Il dividendo verrà tagliato\n- Il prezzo scenderà ancora\n\n**Esempi storici:**\n- Banche prima del 2008\n- Retail fisico vs Amazon\n- Petrolifere in declino\n\n**Come evitarla:**\n1. Capire il PERCHÉ il prezzo è basso\n2. Analizzare il business, non solo i numeri\n3. Chiedere: 'questo business esisterà tra 10 anni?'\n4. Cercare un catalizzatore per il recupero\n\n**Graham diceva:** 'cheap can always get cheaper'.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Un'azienda ha P/E 4 ma è in un settore in declino irreversibile. È un affare?",
        pollAreas: [
          {
            id: "widget-verify-37",
            prompt: "Seleziona la valutazione corretta",
            options: [
              "Probabilmente una value trap - il P/E basso riflette il declino",
              "Sì - P/E 4 è sempre un affare",
              "Dipende solo dal dividendo",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! P/E basso + settore in declino = probabile **value trap**. Il mercato sta prezzando la fine del business. 'Economico' non significa 'buon affare'.",
            wrongExplanation: "P/E basso non basta. Bisogna capire il PERCHÉ.\n\n**Value trap:**\n- Business in declino\n- Utili destinati a calare\n- Il P/E salirà perché gli utili scendono\n- Non c'è recupero in vista",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Trovi un'azienda con P/E 8, buon bilancio, leader di mercato, ma il prezzo è sceso del 30%. Cosa fai?",
        pollAreas: [
          {
            id: "widget-scenario-37",
            prompt: "Quale approccio è corretto?",
            options: [
              "Analizzo perché è scesa - se è temporaneo, può essere opportunità",
              "Compro subito - è sceso quindi è economico",
              "Evito - se scende c'è un motivo",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **Capire il perché** è fondamentale. Se il calo è per panico temporaneo e il business è solido, può essere value. Se è per problemi strutturali, può essere trap.",
            wrongExplanation: "Né comprare ciecamente né evitare ciecamente.\n\n**L'approccio value:**\n- Perché è sceso?\n- Il business è intatto?\n- C'è un catalizzatore?\n- Il margine di sicurezza c'è?",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Conosco le metriche", "So identificare value trap", "Ho un approccio analitico"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Applicare il value investing oggi",
        content: "Il value investing funziona ancora? E come applicarlo?\n\n**Le sfide moderne:**\n- Informazione disponibile a tutti\n- Algoritmi e hedge fund competono\n- Mercati più efficienti (forse)\n- Intangibili difficili da valutare (tech)\n\n**Come adattarsi:**\n1. **Orizzonte lungo:** il tuo vantaggio vs i fondi\n2. **Circle of competence:** specializzati in settori che capisci\n3. **Pazienza:** aspetta le opportunità, non forzare\n4. **ETF value:** se non vuoi fare stock picking\n\n**ETF Value:**\n- iShares MSCI World Value\n- Vanguard Value ETF\n- Esposizione diversificata al 'fattore value'\n- Non devi analizzare singole azioni\n\n**Per la maggior parte:** ETF value come parte del portafoglio è più pratico che stock picking.",
      },
      {
        kind: "explain",
        title: "📌 I principi di Buffett per tutti",
        content: "Anche senza fare stock picking, i principi value si applicano:\n\n**1. Investi in ciò che capisci**\n- Non comprare perché 'sale'\n- Comprendi il business/l'asset\n\n**2. Pensa da proprietario**\n- Compreresti l'intera azienda?\n- Lungo termine, non trading\n\n**3. Il prezzo è ciò che paghi, il valore è ciò che ottieni**\n- Non inseguire i trend\n- Cerca valore\n\n**4. Sii avido quando gli altri hanno paura**\n- Le crisi creano opportunità\n- Ma con margine di sicurezza\n\n**5. La diversificazione protegge dall'ignoranza**\n- Se non sai analizzare, diversifica\n- ETF ampi per chi non fa stock picking\n\n**Il punto:** non devi essere Buffett per applicare i suoi principi.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Qual è il modo più pratico per applicare il value investing senza stock picking?",
        pollAreas: [
          {
            id: "challenge-verify-37",
            prompt: "Seleziona l'approccio pratico",
            options: [
              "ETF Value - esposizione diversificata al fattore value",
              "Comprare le azioni che suggeriscono online",
              "Ignorare il value e comprare solo growth",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Gli **ETF Value** offrono esposizione al fattore value senza dover analizzare singole azioni. Diversificato, economico, accessibile.",
            wrongExplanation: "Seguire suggerimenti online è rischioso. Ignorare il value non è necessario.\n\n**ETF Value:**\n- Esposizione al fattore\n- Diversificazione automatica\n- Nessun stock picking\n- Costi bassi",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "Il mercato crolla del 25%. Tutti i giornali titolano 'fine del mondo'. Come reagisce un value investor?",
        pollAreas: [
          {
            id: "challenge-scenario-37",
            prompt: "Quale reazione è più coerente?",
            options: [
              "'Sii avido quando gli altri hanno paura' - cerca opportunità con margine di sicurezza",
              "Vendi tutto prima che scenda di più",
              "Non fare nulla per sempre",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! I crolli sono **opportunità per i value investor** preparati. Ma con disciplina: margine di sicurezza, liquidità, analisi. Non comprare tutto ciecamente.",
            wrongExplanation: "Vendere nel panico è l'opposto del value. Non fare nulla è passivo ma accettabile.\n\n**L'approccio value:**\n- Panico = opportunità potenziale\n- Ma con analisi e disciplina\n- Margine di sicurezza sempre\n- Incrementi graduali",
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
        title: "🧠 Quiz finale: value investing",
        content: "Hai imparato i principi del value investing, le metriche, le trappole e come applicarlo.\n\n**Concetti chiave:**\n- Comprare valore sotto il prezzo intrinseco\n- Margine di sicurezza\n- Value trap: economico non basta\n- P/E, P/B, dividend yield come indicatori\n- ETF value per chi non fa stock picking\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Chi sono i 'padri' del value investing?",
        pollAreas: [
          {
            id: "quiz-q1-37",
            prompt: "Seleziona i nomi corretti",
            options: [
              "Benjamin Graham e Warren Buffett",
              "Elon Musk e Jeff Bezos",
              "Ray Dalio e George Soros",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Graham** ha definito i principi, **Buffett** li ha evoluti e applicati con successo straordinario.",
            wrongExplanation: "Musk e Bezos sono imprenditori, non value investor. Dalio e Soros sono investitori ma con filosofie diverse.\n\n**I padri del value:**\n- Graham: teoria, libri\n- Buffett: applicazione, successo",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Cos'è una 'value trap'?",
        pollAreas: [
          {
            id: "quiz-q2-37",
            prompt: "Seleziona la definizione corretta",
            options: [
              "Un'azione che sembra economica ma ha problemi strutturali",
              "Una strategia per guadagnare velocemente",
              "Un tipo di ETF value",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Una value trap è un'azione **apparentemente economica** ma con business in declino. Il prezzo è basso per motivi reali.",
            wrongExplanation: "Non è una strategia né un ETF.\n\n**Value trap:**\n- Sembra un affare (P/E basso)\n- Ma il business sta morendo\n- Il prezzo continuerà a scendere\n- 'Cheap can get cheaper'",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Come può un investitore retail applicare il value investing?",
        pollAreas: [
          {
            id: "quiz-q3-37",
            prompt: "Seleziona l'approccio pratico",
            options: [
              "ETF Value per esposizione diversificata",
              "Solo stock picking su singole azioni",
              "Ignorare completamente il value",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Gli **ETF Value** sono il modo più pratico. Offrono esposizione al fattore value senza richiedere analisi approfondite di singole aziende.",
            wrongExplanation: "Lo stock picking richiede tempo e competenze. Ignorare il value perde diversificazione.\n\n**ETF Value:**\n- Pratico\n- Diversificato\n- Economico\n- Per tutti",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco il value", "Evito le trappole", "So come applicarlo"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: value investing",
        content: "Complimenti! Hai completato la lezione sul value investing.\n\n**Principi chiave:**\n\n1. **Valore vs prezzo**: sono cose diverse\n2. **Margine di sicurezza**: compra a sconto\n3. **Value trap**: economico non basta, serve analisi\n4. **Metriche**: P/E, P/B, dividend yield come indicatori\n5. **Applicazione**: ETF value per chi non fa stock picking\n\nIl value investing richiede pazienza e disciplina, ma i principi sono universali.",
      },
      {
        kind: "explain",
        title: "📌 Collegamento con la sezione",
        content: "Questa lezione fa parte della sezione **Strategie di Investimento**.\n\n**Percorso:**\n- Asset allocation e ribilanciamento\n- Dollar Cost Averaging (PAC)\n- **Value investing** (questa lezione)\n- Margin of safety (prossima)\n- Mr. Market e psicologia\n- Errori comuni dell'investitore\n\nIl value investing è una filosofia che si integra con le altre strategie.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Cosa farai con questa conoscenza?",
        pollAreas: [
          {
            id: "feedback-action-37",
            prompt: "Indica il tuo prossimo passo",
            options: [
              "Considero aggiungere un ETF Value al portafoglio",
              "Leggo 'The Intelligent Investor' di Graham",
              "Continuo con la lezione sul margin of safety",
            ],
            correctIndex: 0,
            correctExplanation: "Ottima scelta! Un **ETF Value** può aggiungere diversificazione al portafoglio esponendoti al fattore value senza stock picking.",
            wrongExplanation: "Tutte le scelte sono valide!\n\n- ETF Value: azione pratica\n- Leggere Graham: approfondimento\n- Continuare: per completare la sezione",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Quali ETF Value sono disponibili in Italia?",
      "Come identifico una value trap?",
      "Value o Growth: quale performerà meglio nei prossimi anni?",
    ],
  },
};

const lesson37Definition = createStaticLessonDefinition("37", content);

export default lesson37Definition;
