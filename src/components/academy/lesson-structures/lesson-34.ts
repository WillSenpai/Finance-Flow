import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Geopolitica: quando il mondo influenza il portafoglio",
        content: "La **geopolitica** è l'intersezione tra geografia, politica e potere. E ha impatto diretto sui mercati.\n\n**Perché conta per i tuoi investimenti:**\n- Guerre e conflitti → volatilità, rifugi sicuri\n- Sanzioni → interruzione supply chain\n- Elezioni → incertezza politiche future\n- Relazioni commerciali → tariffe, dazi\n- Risorse energetiche → prezzo petrolio/gas\n\n**Il punto chiave:** non puoi prevedere gli eventi geopolitici, ma puoi costruire un portafoglio resiliente e capire come reagire quando accadono.\n\n**Eventi recenti:**\n- Guerra Russia-Ucraina (2022): energia, grano, volatilità\n- Tensioni USA-Cina: supply chain, semiconduttori\n- Brexit: impatto su UK e Europa\n- COVID: shock globale sincronizzato",
      },
      {
        kind: "explain",
        title: "📌 Come i mercati reagiscono agli shock",
        content: "Gli shock geopolitici hanno pattern tipici:\n\n**Fase 1: Panico (giorni/settimane)**\n- Vendite indiscriminate\n- Fuga verso rifugi (oro, Treasury, dollaro, CHF)\n- VIX (volatilità) esplode\n- Tutto sembra crollare\n\n**Fase 2: Valutazione (settimane/mesi)**\n- I mercati capiscono l'impatto reale\n- Settori colpiti vs non colpiti\n- Riprezzamento più razionale\n\n**Fase 3: Nuova normalità (mesi/anni)**\n- L'economia si adatta\n- Nuovi vincitori e perdenti\n- Il mercato guarda avanti\n\n**La regola storica:**\nGli shock geopolitici causano volatilità a breve termine, ma raramente cambiano il trend di lungo periodo. Chi vende nel panico spesso si pente.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Durante uno shock geopolitico, dove tendono a spostarsi i capitali?",
        pollAreas: [
          {
            id: "concept-verify-34",
            prompt: "Seleziona gli asset rifugio",
            options: [
              "Oro, Treasury USA, dollaro, franco svizzero",
              "Azioni growth, crypto, mercati emergenti",
              "Immobili e auto di lusso",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! In momenti di panico i capitali fuggono verso i **safe havens**: oro (bene reale), Treasury (governo USA), dollaro e franco svizzero (valute rifugio).",
            wrongExplanation: "Azioni growth e crypto sono risk-on, non rifugi. Immobili sono illiquidi.\n\n**Safe havens:**\n- Oro: bene fisico, nessun rischio controparte\n- Treasury: 'risk-free' del mondo\n- USD/CHF: valute rifugio storiche",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Rischi geopolitici: tipologie",
        content: "I rischi geopolitici si dividono in categorie:\n\n**1. Conflitti militari:**\n- Guerre, invasioni, tensioni regionali\n- Impatto: energia, commodities, supply chain\n- Esempi: Ucraina, Taiwan, Medio Oriente\n\n**2. Sanzioni e guerre commerciali:**\n- Tariffe, dazi, blocchi\n- Impatto: aziende specifiche, settori\n- Esempi: Cina-USA, Russia-Occidente\n\n**3. Instabilità politica:**\n- Colpi di stato, rivoluzioni, elezioni contestate\n- Impatto: valute, debito sovrano\n- Esempi: mercati emergenti, populismi\n\n**4. Risorse e energia:**\n- Controllo di petrolio, gas, minerali\n- Impatto: prezzi energia, inflazione\n- Esempi: OPEC, gas russo, terre rare\n\n**5. Tecnologia e dati:**\n- Cyber attacchi, guerre informatiche\n- Impatto: infrastrutture, aziende tech\n- Esempi: semiconduttori, 5G",
      },
      {
        kind: "question",
        title: "🧠 Verifica: tipologie",
        content: "Le tensioni USA-Cina sui semiconduttori sono un esempio di quale rischio?",
        pollAreas: [
          {
            id: "concept-solve-34",
            prompt: "Seleziona la categoria corretta",
            options: [
              "Sanzioni/guerre commerciali + tecnologia",
              "Conflitto militare diretto",
              "Instabilità politica interna",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! È una combinazione di **guerra commerciale** (restrizioni export) e **rischio tecnologico** (semiconduttori strategici). Impatta aziende come TSMC, ASML, Nvidia.",
            wrongExplanation: "Non è un conflitto militare diretto né instabilità interna.\n\n**Le tensioni sui chip:**\n- USA limita export a Cina\n- Cina cerca autosufficienza\n- Taiwan strategica (TSMC)\n- Impatto su tutto il tech",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco i rischi geopolitici", "Conosco le reazioni di mercato", "Identifico le categorie"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Costruire un portafoglio resiliente",
        content: "Non puoi prevedere gli shock, ma puoi prepararti:\n\n**1. Diversificazione geografica:**\n- Non solo Italia/Europa\n- Esposizione globale\n- Nessun paese > 30-40%\n\n**2. Diversificazione settoriale:**\n- Settori difensivi (healthcare, utilities)\n- Settori ciclici (industria, consumi)\n- Bilanciamento\n\n**3. Cuscinetto di liquidità:**\n- Fondo emergenza robusto\n- Capacità di non vendere nel panico\n\n**4. Oro come assicurazione:**\n- 5-10% come hedge\n- Tende a salire negli shock\n\n**5. Duration obbligazionaria:**\n- Obbligazioni brevi/medie\n- Meno sensibili a sorprese\n\n**Il principio:** un portafoglio che sopravvive agli shock senza che tu debba agire è meglio di uno che richiede timing perfetto.",
      },
      {
        kind: "explain",
        title: "📌 Come reagire durante uno shock",
        content: "Quando arriva lo shock geopolitico:\n\n**Cosa NON fare:**\n- Vendere nel panico\n- Fare all-in su rifugi dopo il rialzo\n- Prendere decisioni basate sui titoli\n- Cercare di 'timing' la fine della crisi\n\n**Cosa fare:**\n1. **Respirare**: la volatilità è normale\n2. **Valutare**: il tuo portafoglio è diversificato?\n3. **Attendere**: i dati, non le emozioni\n4. **Ribilanciare** (se previsto dal piano)\n5. **Opportunità** (se hai liquidità e stomaco)\n\n**La regola:**\nLe decisioni prese nel panico sono quasi sempre sbagliate. I mercati recuperano più velocemente di quanto pensi.\n\n**Storico:**\n- 11 settembre 2001: S&P recuperato in 2 mesi\n- Invasione Ucraina: mercati minimi a marzo 2022, poi rialzo\n- COVID crash: bottom a marzo 2020, nuovi massimi in mesi",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Scoppia una crisi geopolitica. I mercati crollano del 10% in una settimana. Cosa fai?",
        pollAreas: [
          {
            id: "widget-verify-34",
            prompt: "Seleziona la reazione appropriata",
            options: [
              "Niente di drastico - valuto con calma se ribilanciare secondo il piano",
              "Vendo tutto per proteggermi",
              "Compro oro a qualsiasi prezzo",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Valutare con calma** è la reazione giusta. -10% in una settimana è doloroso ma normale in uno shock. Vendi quando tutti vendono = cristallizzi le perdite.",
            wrongExplanation: "Vendere nel panico è l'errore classico. Comprare oro dopo che è già salito è 'timing' sbagliato.\n\n**L'approccio:**\n- Respira\n- Valuta se la tua situazione è cambiata\n- Segui il piano\n- Non reagire alle emozioni",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Hai 0% di oro in portafoglio. Scoppia una crisi e l'oro sale del 15%. Cosa fai?",
        pollAreas: [
          {
            id: "widget-scenario-34",
            prompt: "Quale azione è più sensata?",
            options: [
              "Non compro ora - se serve, lo aggiungo quando le acque si calmano",
              "Compro subito - sta salendo",
              "Oro inutile, non compro mai",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Comprare **dopo un rialzo del 15%** è comprare ai massimi. Se vuoi oro, aspetta che la volatilità si calmi. O meglio, avere già oro PRIMA della crisi.",
            wrongExplanation: "Comprare quando sta salendo è inseguire. Non avere mai oro è rigido.\n\n**La lezione:**\n- L'oro va comprato PRIMA della crisi\n- Comprare durante = comprare caro\n- Meglio aspettare normalizzazione",
            allowText: false,
          },
        ],
      },
    ],
    options: ["So costruire resilienza", "Conosco la reazione corretta", "Ho un piano per gli shock"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Casi studio: shock e recuperi",
        content: "La storia insegna che i mercati recuperano:\n\n**11 settembre 2001:**\n- S&P 500: -12% in una settimana\n- Recupero: 2 mesi dopo era tornato ai livelli pre-attacco\n- Lesson: panico iniziale, poi normalità\n\n**Crisi finanziaria 2008:**\n- S&P 500: -57% dal picco\n- Recupero: 4 anni per tornare ai massimi\n- Lesson: crisi sistemiche richiedono più tempo\n\n**COVID marzo 2020:**\n- S&P 500: -34% in un mese\n- Recupero: 5 mesi per nuovi massimi\n- Lesson: shock veloci, recuperi veloci\n\n**Guerra Ucraina 2022:**\n- Mercati: -15% circa\n- Energia: +100%\n- Lesson: shock asimmetrici, vincitori e perdenti\n\n**Il pattern:** panico → valutazione → adattamento → recupero. I tempi variano, ma la direzione di lungo termine è al rialzo.",
      },
      {
        kind: "explain",
        title: "📌 Identificare opportunità (con cautela)",
        content: "Nelle crisi ci sono anche opportunità:\n\n**Quando cercare opportunità:**\n- Hai liquidità dedicata (non il fondo emergenza)\n- Il tuo portafoglio base è OK\n- Hai nervi saldi\n- Puoi permetterti di sbagliare\n\n**Dove cercare:**\n- Aziende solide vendute indiscriminatamente\n- Settori non impattati dalla crisi specifica\n- Asset che scendono per panico, non per fondamentali\n\n**Come procedere:**\n- Incrementi graduali, non all-in\n- Diversifica le entrate\n- Accetta che non centrerai il minimo\n\n**Attenzione:**\nNon tutto ciò che scende è un affare. Alcune aziende/settori sono davvero colpiti e non recupereranno. Fai analisi, non speculazione cieca.\n\n**Il principio:** le crisi creano opportunità per chi è preparato, non per chi improvvisa.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Qual è la condizione principale per cercare opportunità durante una crisi?",
        pollAreas: [
          {
            id: "challenge-verify-34",
            prompt: "Seleziona la condizione essenziale",
            options: [
              "Avere liquidità dedicata e portafoglio base già solido",
              "Essere sicuri che il minimo è stato toccato",
              "Avere esperienza di trading",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Liquidità dedicata** e portafoglio base solido sono prerequisiti. Se non hai il fondo emergenza o devi vendere per comprare, non sei in posizione di cercare opportunità.",
            wrongExplanation: "Non puoi mai essere 'sicuro' del minimo. L'esperienza di trading non è necessaria.\n\n**I prerequisiti:**\n- Fondo emergenza OK\n- Portafoglio base diversificato\n- Liquidità extra\n- Nervi saldi",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "Guerra in una regione critica. Il petrolio raddoppia. I mercati crollano. Hai 10.000€ di liquidità extra. Cosa fai?",
        pollAreas: [
          {
            id: "challenge-scenario-34",
            prompt: "Quale approccio scegli?",
            options: [
              "Incrementi graduali su azioni diversificate, non all-in",
              "Tutto sul petrolio che sta salendo",
              "Tutto in cash finché non passa la crisi",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **Incrementi graduali** su asset diversificati è l'approccio prudente. Non sai quando finirà la crisi. Comprare petrolio che è già raddoppiato è inseguire il treno.",
            wrongExplanation: "Il petrolio potrebbe essere già al massimo. Cash a oltranza può farti perdere la ripresa.\n\n**L'approccio:**\n- Incrementi graduali (20% ora, 20% tra un mese...)\n- Asset diversificati (non il settore 'caldo')\n- Accetta di non centrare il minimo",
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
        title: "🧠 Quiz finale: geopolitica e mercati",
        content: "Hai imparato come gli eventi geopolitici impattano i mercati e come prepararsi.\n\n**Concetti chiave:**\n- Shock → panico → valutazione → adattamento\n- Safe havens: oro, Treasury, USD, CHF\n- Diversificazione geografica e settoriale\n- Non vendere nel panico\n- Opportunità solo con liquidità dedicata\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Durante uno shock geopolitico, cosa succede tipicamente ai safe havens?",
        pollAreas: [
          {
            id: "quiz-q1-34",
            prompt: "Seleziona il comportamento tipico",
            options: [
              "Salgono - i capitali cercano rifugio",
              "Scendono - tutto scende insieme",
              "Nessun movimento particolare",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! I **safe havens salgono** durante gli shock. Oro, Treasury, dollaro e franco svizzero attraggono capitali in fuga dal rischio.",
            wrongExplanation: "I safe havens hanno comportamento opposto agli asset rischiosi.\n\n**Durante gli shock:**\n- Risk-on: scendono\n- Safe havens: salgono\n- È la 'fuga verso la qualità'",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Qual è l'errore più comune durante uno shock geopolitico?",
        pollAreas: [
          {
            id: "quiz-q2-34",
            prompt: "Seleziona l'errore tipico",
            options: [
              "Vendere nel panico",
              "Mantenere le posizioni",
              "Diversificare",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **Vendere nel panico** è l'errore classico. Si cristallizzano le perdite e si perde il recupero che spesso arriva velocemente.",
            wrongExplanation: "Mantenere e diversificare sono comportamenti corretti.\n\n**L'errore:**\n- Vendere quando tutti vendono\n- Cristallizzare le perdite\n- Perdere il recupero",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Per cercare opportunità durante una crisi, cosa devi avere?",
        pollAreas: [
          {
            id: "quiz-q3-34",
            prompt: "Seleziona il prerequisito essenziale",
            options: [
              "Liquidità dedicata e portafoglio base solido",
              "Certezza di aver trovato il minimo",
              "Account margin per fare leva",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Liquidità dedicata** (non il fondo emergenza) e portafoglio base solido sono i prerequisiti. Non si cercano opportunità se si è già in difficoltà.",
            wrongExplanation: "Non puoi mai essere certo del minimo. La leva è pericolosa nelle crisi.\n\n**I prerequisiti:**\n- Liquidità extra\n- Portafoglio solido\n- Nervi stabili",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco gli shock", "So come reagire", "Ho un piano di resilienza"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: geopolitica e mercati",
        content: "Complimenti! Hai completato la lezione sulla geopolitica.\n\n**Principi chiave:**\n\n1. **Shock**: panico → valutazione → adattamento\n2. **Safe havens**: oro, Treasury, USD, CHF\n3. **Resilienza**: diversificazione geografica e settoriale\n4. **Comportamento**: non vendere nel panico\n5. **Opportunità**: solo con liquidità dedicata\n\nLa geopolitica è imprevedibile, ma la tua preparazione non deve esserlo.",
      },
      {
        kind: "explain",
        title: "📌 Fine sezione Macroeconomia",
        content: "Questa lezione conclude la sezione **Macroeconomia**.\n\n**Recap della sezione:**\n- Inflazione: cos'è e come ti impatta\n- Tassi d'interesse: il prezzo del denaro\n- Banche centrali: BCE, Fed, strumenti\n- Cicli economici: le 4 fasi\n- Indicatori: PIL, PMI, occupazione\n- **Geopolitica**: shock e resilienza\n\n**Prossima sezione:**\nStrategie di investimento - asset allocation, PAC, value investing e errori comuni.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Cosa farai con questa conoscenza?",
        pollAreas: [
          {
            id: "feedback-action-34",
            prompt: "Indica il tuo prossimo passo",
            options: [
              "Verifico se il mio portafoglio è geograficamente diversificato",
              "Aggiungo oro come hedge se non ce l'ho",
              "Passo alla sezione strategie",
            ],
            correctIndex: 0,
            correctExplanation: "Ottima scelta! **Verificare la diversificazione geografica** è il primo passo. Se sei troppo concentrato su un paese/regione, uno shock locale può colpirti duramente.",
            wrongExplanation: "Tutte le scelte sono valide!\n\n- Diversificazione geografica: fondamentale\n- Oro come hedge: utile (5-10%)\n- Continuare: per completare il percorso",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Come diversifico geograficamente con poco capitale?",
      "Quanto oro dovrei avere come hedge?",
      "Quali settori sono più esposti ai rischi geopolitici?",
    ],
  },
};

const lesson34Definition = createStaticLessonDefinition("34", content);

export default lesson34Definition;
