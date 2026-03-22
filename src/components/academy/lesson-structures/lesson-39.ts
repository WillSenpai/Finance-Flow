import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Mr. Market: l'allegoria di Graham",
        content: "Benjamin Graham creò **Mr. Market** per spiegare il comportamento del mercato.\n\n**L'allegoria:**\nImmagina di essere socio di un'azienda con un partner chiamato Mr. Market. Ogni giorno ti propone di comprare la tua quota o venderti la sua.\n\n**Il problema di Mr. Market:**\n- È emotivamente instabile\n- A volte euforico: offre prezzi altissimi\n- A volte depresso: offre prezzi bassissimi\n- Le sue proposte non riflettono il valore reale\n\n**La lezione:**\n- Non sei obbligato ad accettare le sue offerte\n- Puoi ignorarlo quando è irrazionale\n- Puoi approfittarne quando ti conviene\n- Il valore dell'azienda non cambia per i suoi sbalzi d'umore\n\n**Graham:** 'The investor's chief problem - and even his worst enemy - is likely to be himself.'",
      },
      {
        kind: "explain",
        title: "📌 Cosa Mr. Market ci insegna",
        content: "**1. Il prezzo non è il valore**\n- Mr. Market offre prezzi\n- Tu devi valutare il valore\n- Spesso sono diversi\n\n**2. L'emotività è il nemico**\n- Mr. Market è guidato da emozioni\n- Non seguire le sue emozioni\n- Resta razionale\n\n**3. Puoi scegliere quando agire**\n- Non devi comprare/vendere ogni giorno\n- Aspetta le occasioni\n- L'inazione è un'opzione\n\n**4. Il mercato è al tuo servizio**\n- Non è lui che comanda\n- Sei tu che scegli\n- Usa le sue follie a tuo vantaggio\n\n**Buffett ha detto:**\n'Be fearful when others are greedy, and greedy when others are fearful.'\n\nTraduzi: approfitta degli eccessi di Mr. Market.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Cosa rappresenta Mr. Market?",
        pollAreas: [
          {
            id: "concept-verify-39",
            prompt: "Seleziona il significato",
            options: [
              "L'emotività e l'irrazionalità del mercato azionario",
              "Un consulente finanziario affidabile",
              "Un indicatore tecnico preciso",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Mr. Market rappresenta **l'emotività del mercato**. I prezzi oscillano non perché il valore cambia, ma perché l'umore degli investitori cambia.",
            wrongExplanation: "Mr. Market non è affidabile né preciso - è il contrario.\n\n**Rappresenta:**\n- L'irrazionalità del mercato\n- Gli sbalzi di umore collettivi\n- La differenza tra prezzo e valore",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Psicologia e finanza comportamentale",
        content: "La **finanza comportamentale** studia come le emozioni influenzano le decisioni:\n\n**Bias cognitivi comuni:**\n\n**1. Avversione alla perdita:**\n- Le perdite fanno più male dei guadagni\n- Vendere i vincitori troppo presto, tenere i perdenti\n\n**2. Effetto gregge:**\n- Seguire la massa\n- Comprare quando tutti comprano\n- Vendere nel panico collettivo\n\n**3. Overconfidence:**\n- Sovrastimare le proprie capacità\n- Tradare troppo\n- Concentrare troppo\n\n**4. Recency bias:**\n- Dare troppo peso agli eventi recenti\n- 'Il mercato è salito sempre, continuerà'\n\n**5. Confirmation bias:**\n- Cercare solo informazioni che confermano la tua tesi\n- Ignorare i segnali contrari",
      },
      {
        kind: "question",
        title: "🧠 Verifica: bias",
        content: "Vendi un'azione che sta salendo per 'prendere profitto', ma tieni quella in perdita sperando che recuperi. Quale bias?",
        pollAreas: [
          {
            id: "concept-solve-39",
            prompt: "Identifica il bias",
            options: [
              "Avversione alla perdita",
              "Overconfidence",
              "Effetto gregge",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! L'**avversione alla perdita** fa vendere i vincitori troppo presto (per 'assicurarsi' il guadagno) e tenere i perdenti troppo a lungo (per evitare di 'realizzare' la perdita).",
            wrongExplanation: "Non è overconfidence né effetto gregge.\n\n**Avversione alla perdita:**\n- Le perdite pesano 2x i guadagni\n- Vendiamo i vincitori per paura\n- Teniamo i perdenti per speranza",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco Mr. Market", "Conosco i bias", "Riconosco l'emotività"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Proteggersi da se stessi",
        content: "I bias sono inevitabili, ma puoi proteggerti:\n\n**1. Regole scritte in anticipo**\n- Definisci i criteri prima di investire\n- Scrivi quando vendere\n- Rispetta le regole quando le emozioni arrivano\n\n**2. Automatizzazione**\n- PAC automatico\n- Ribilanciamento periodico\n- Meno decisioni discrezionali\n\n**3. Checklist**\n- Prima di comprare: passa la checklist\n- Prima di vendere: passa la checklist\n- Rallenta le decisioni impulsive\n\n**4. Tempo**\n- Mai decidere subito\n- 'Dormi una notte' su decisioni importanti\n- Le emozioni si calmano\n\n**5. Accountability**\n- Scrivi le tue decisioni e perché\n- Rivedi periodicamente\n- Impara dagli errori",
      },
      {
        kind: "explain",
        title: "📌 L'investitore intelligente: razionalità > intelligenza",
        content: "Graham distingueva tra investitore 'intelligente' e genio:\n\n**L'investitore intelligente:**\n- Non è il più intelligente\n- È il più disciplinato\n- Controlla le emozioni\n- Segue un processo\n\n**Caratteristiche:**\n1. **Pazienza**: aspetta le opportunità\n2. **Disciplina**: segue le regole\n3. **Umiltà**: sa di poter sbagliare\n4. **Contrarianismo**: pensa indipendentemente\n5. **Lungo termine**: ignora il rumore\n\n**Graham diceva:**\n'The investor's chief problem - and even his worst enemy - is likely to be himself.'\n\n**Il nemico non è il mercato:**\n- Non è Mr. Market che ti frega\n- Sei tu che ti freghi seguendo Mr. Market\n- La battaglia è contro te stesso",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Qual è il nemico principale dell'investitore secondo Graham?",
        pollAreas: [
          {
            id: "widget-verify-39",
            prompt: "Seleziona il nemico principale",
            options: [
              "Se stesso - le proprie emozioni e bias",
              "Mr. Market",
              "I consulenti finanziari",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il nemico principale è **te stesso**. Le tue emozioni e i tuoi bias ti portano a decisioni sbagliate. Mr. Market è solo un'opportunità.",
            wrongExplanation: "Mr. Market offre opportunità, non è il nemico.\n\n**Il vero nemico:**\n- Le tue emozioni\n- I tuoi bias\n- La tua impazienza\n- La tua overconfidence",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Il mercato crolla del 20%. Tutti i tuoi amici vendono. Cosa fai?",
        pollAreas: [
          {
            id: "widget-scenario-39",
            prompt: "Quale reazione è più razionale?",
            options: [
              "Ignoro Mr. Market depresso - valuto se è opportunità",
              "Vendo anche io - gli altri sanno qualcosa",
              "Compro tutto subito - è sicuramente il minimo",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **Ignorare l'umore di Mr. Market** è la reazione razionale. Valuta se il valore è cambiato. Se no, potrebbe essere opportunità. Non seguire il gregge né fare all-in.",
            wrongExplanation: "Vendere col gregge è effetto gregge. Comprare tutto è impulsivo.\n\n**L'approccio razionale:**\n- Mr. Market è depresso, non tu\n- Il valore è cambiato? Probabilmente no\n- Valuta con calma\n- Incrementi graduali se opportunità",
            allowText: false,
          },
        ],
      },
    ],
    options: ["So proteggermi", "Capisco la disciplina", "Resisto alle emozioni"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Casi reali: Mr. Market impazzito",
        content: "La storia è piena di esempi di Mr. Market irrazionale:\n\n**Bolla dot-com (2000):**\n- Mr. Market euforico: P/E 100+ per aziende senza utili\n- 'Questa volta è diverso'\n- Crash: Nasdaq -78%\n\n**Crisi 2008:**\n- Mr. Market panico: vendeva tutto a qualsiasi prezzo\n- Aziende solide crollavano -80%\n- Poi rimbalzo +300%\n\n**COVID marzo 2020:**\n- Mr. Market terrore: -34% in un mese\n- 'Il mondo finisce'\n- 5 mesi dopo: nuovi massimi\n\n**Meme stocks 2021:**\n- Mr. Market euforico: GameStop da $20 a $480\n- 'Reddit contro Wall Street'\n- Poi crollo a $40\n\n**La lezione:**\nMr. Market oscilla tra euforia e panico. Chi mantiene la calma vince.",
      },
      {
        kind: "explain",
        title: "📌 Costruire il tuo sistema anti-emotivo",
        content: "Per battere te stesso, serve un sistema:\n\n**1. Investment Policy Statement (IPS):**\n- Scrivi i tuoi obiettivi\n- Definisci l'asset allocation\n- Specifica le regole\n- Firmalo (impegno con te stesso)\n\n**2. Regole di ribilanciamento:**\n- 'Quando un asset supera X% del portafoglio, vendo'\n- 'Quando scende sotto Y%, compro'\n- Automatico, non discrezionale\n\n**3. Diario di investimento:**\n- Scrivi ogni decisione e perché\n- Rivedi dopo 6-12 mesi\n- Impara dai tuoi errori\n\n**4. Pause forzate:**\n- Mai decidere durante volatilità alta\n- 24-48h di attesa minima\n- Le emozioni si calmano\n\n**5. Accountability partner:**\n- Qualcuno che ti chiede 'perché?'\n- Rallenta le decisioni impulsive",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Qual è lo strumento più efficace contro i bias emotivi?",
        pollAreas: [
          {
            id: "challenge-verify-39",
            prompt: "Seleziona lo strumento migliore",
            options: [
              "Regole scritte in anticipo da seguire",
              "Più intelligenza finanziaria",
              "Leggere più notizie",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Regole scritte in anticipo** ti proteggono quando le emozioni arrivano. L'intelligenza non basta, anzi può aumentare l'overconfidence.",
            wrongExplanation: "Più intelligenza non aiuta con le emozioni. Più notizie possono peggiorare.\n\n**Le regole:**\n- Decise a freddo\n- Seguite a caldo\n- Proteggono dai bias",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "Un'azione che hai comprato a 100€ ora vale 60€. Secondo la tua analisi vale ancora 100€. Cosa fai?",
        pollAreas: [
          {
            id: "challenge-scenario-39",
            prompt: "Quale azione prendi?",
            options: [
              "Se il valore non è cambiato, mantengo o incremento",
              "Vendo per fermare le perdite",
              "Vendo metà per 'ridurre il rischio'",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Se la tua analisi dice che **vale ancora 100€**, Mr. Market ti sta offrendo un affare maggiore. Mantieni o incrementa (se hai liquidità e convinzione).",
            wrongExplanation: "Vendere perché il prezzo è sceso non è razionale se il valore non è cambiato.\n\n**Il ragionamento:**\n- Prezzo ≠ valore\n- Se il valore è 100€, 60€ è più attraente\n- Mr. Market è depresso, non tu",
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
        title: "🧠 Quiz finale: Mr. Market e psicologia",
        content: "Hai imparato l'allegoria di Mr. Market, i bias cognitivi e come proteggerti.\n\n**Concetti chiave:**\n- Mr. Market: emotivo e irrazionale\n- Prezzo ≠ valore\n- Bias: avversione perdita, gregge, overconfidence\n- Il nemico sei tu, non il mercato\n- Regole scritte come protezione\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Chi è Mr. Market?",
        pollAreas: [
          {
            id: "quiz-q1-39",
            prompt: "Seleziona la definizione",
            options: [
              "Allegoria per l'emotività e irrazionalità del mercato",
              "Un famoso investitore",
              "Un indice di borsa",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Mr. Market è l'**allegoria di Graham** per rappresentare come il mercato oscilla emotivamente tra euforia e panico.",
            wrongExplanation: "Non è una persona né un indice.\n\n**Mr. Market:**\n- Creato da Graham\n- Rappresenta il mercato\n- Emotivo e instabile\n- Le sue offerte non riflettono il valore",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Qual è il nemico principale dell'investitore?",
        pollAreas: [
          {
            id: "quiz-q2-39",
            prompt: "Seleziona il nemico",
            options: [
              "Se stesso - le proprie emozioni",
              "Il mercato",
              "Le banche",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **Te stesso** - le tue emozioni, i tuoi bias, la tua impazienza. Il mercato offre opportunità, non è il nemico.",
            wrongExplanation: "Il mercato e le banche non sono il nemico.\n\n**Il vero nemico:**\n- Le tue emozioni\n- I tuoi bias cognitivi\n- La tua mancanza di disciplina",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Come ti proteggi dai bias emotivi?",
        pollAreas: [
          {
            id: "quiz-q3-39",
            prompt: "Seleziona la protezione migliore",
            options: [
              "Regole scritte in anticipo",
              "Seguire le notizie più attentamente",
              "Chiedere agli amici",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Regole scritte in anticipo**, decise a freddo, ti proteggono quando le emozioni arrivano.",
            wrongExplanation: "Le notizie possono aumentare l'emotività. Gli amici hanno gli stessi bias.\n\n**Le regole:**\n- Decise razionalmente\n- Prima che le emozioni arrivino\n- Seguite con disciplina",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco Mr. Market", "Conosco i bias", "Ho un sistema"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: Mr. Market e psicologia",
        content: "Complimenti! Hai completato la lezione sulla psicologia dell'investitore.\n\n**Principi chiave:**\n\n1. **Mr. Market**: emotivo, irrazionale, da ignorare o sfruttare\n2. **Prezzo ≠ valore**: non confonderli\n3. **Bias**: avversione perdita, gregge, overconfidence\n4. **Il nemico sei tu**: le tue emozioni\n5. **Protezione**: regole scritte, automatizzazione, disciplina\n\nLa battaglia più importante è contro te stesso.",
      },
      {
        kind: "explain",
        title: "📌 Collegamento con la sezione",
        content: "Questa lezione fa parte della sezione **Strategie di Investimento**.\n\n**Percorso:**\n- Asset allocation\n- Dollar Cost Averaging\n- Value investing\n- Margin of safety\n- **Mr. Market e psicologia** (questa lezione)\n- Errori comuni (prossima - ultima)\n\nCapire la psicologia è fondamentale per applicare tutte le altre strategie.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Cosa farai con questa conoscenza?",
        pollAreas: [
          {
            id: "feedback-action-39",
            prompt: "Indica il tuo prossimo passo",
            options: [
              "Scrivo le mie regole di investimento",
              "Riconosco i miei bias passati",
              "Completo il corso con l'ultima lezione",
            ],
            correctIndex: 0,
            correctExplanation: "Ottima scelta! **Scrivere le regole** è l'azione più importante. Ti proteggeranno quando Mr. Market impazzirà.",
            wrongExplanation: "Tutte le scelte sono valide!\n\n- Scrivere regole: protezione concreta\n- Riconoscere i bias: consapevolezza\n- Completare il corso: visione finale",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Aiutami a scrivere le mie regole di investimento",
      "Quali sono i bias più pericolosi per me?",
      "Come creo un diario di investimento?",
    ],
  },
};

const lesson39Definition = createStaticLessonDefinition("39", content);

export default lesson39Definition;
