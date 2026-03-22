import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Real Estate: investire nel mattone",
        content: "L'**immobiliare** è uno degli asset più antichi e comprensibili: possiedi edifici che generano affitti.\n\n**Perché l'immobiliare attrae:**\n- **Tangibile**: puoi 'vedere' il tuo investimento\n- **Reddito**: affitti regolari\n- **Protezione inflazione**: affitti e valori tendono a crescere con l'inflazione\n- **Leva**: le banche finanziano gli immobili\n\n**Le sfide:**\n- **Illiquido**: vendere richiede tempo\n- **Concentrazione**: un immobile è un investimento grande e singolo\n- **Costi nascosti**: manutenzione, tasse, sfitti\n- **Gestione**: inquilini, burocrazia, problemi\n\n**Il punto chiave:** l'immobiliare diretto è impegnativo. Richiede capitale, tempo e competenze. Esistono alternative per chi vuole esposizione senza possedere fisicamente.",
      },
      {
        kind: "explain",
        title: "📌 REITs: immobiliare in borsa",
        content: "I **REITs** (Real Estate Investment Trusts) sono società quotate che possiedono e gestiscono immobili.\n\n**Come funzionano:**\n- Raccolgono capitale da investitori\n- Comprano/gestiscono immobili (uffici, centri commerciali, magazzini, ospedali)\n- Distribuiscono gran parte degli utili come dividendi (obbligo legale ~90%)\n- Le quote si comprano/vendono in borsa come azioni\n\n**Vantaggi vs immobiliare diretto:**\n- **Liquidità**: vendi quando vuoi\n- **Diversificazione**: possiedi quote di centinaia di immobili\n- **Professionalità**: gestito da esperti\n- **Accessibilità**: puoi iniziare con pochi euro\n- **Nessuna gestione**: niente inquilini, niente manutenzione\n\n**Svantaggi:**\n- **Volatilità**: il prezzo oscilla come le azioni\n- **Correlazione**: in crisi, può crollare come le azioni\n- **Nessun controllo**: non decidi tu cosa comprare/vendere",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Qual è il principale vantaggio dei REITs rispetto all'immobiliare diretto?",
        pollAreas: [
          {
            id: "concept-verify-28",
            prompt: "Seleziona il vantaggio principale",
            options: [
              "Liquidità e diversificazione - puoi vendere quando vuoi e possiedi quote di molti immobili",
              "Rendimenti più alti garantiti",
              "Nessun rischio di perdita",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Liquidità e diversificazione** sono i vantaggi chiave. Puoi comprare/vendere in borsa e possiedi indirettamente centinaia di immobili invece di uno solo.",
            wrongExplanation: "I REITs non garantiscono rendimenti né eliminano il rischio.\n\n**Vantaggi reali:**\n- Liquidità: vendi quando vuoi\n- Diversificazione: molti immobili\n- Nessuna gestione diretta\n- Accessibilità: investi poco",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Tipi di REITs e settori",
        content: "Non tutti i REITs sono uguali. I settori hanno dinamiche diverse.\n\n**Settori principali:**\n\n**Residenziale:**\n- Appartamenti in affitto\n- Domanda stabile\n- Sensibile a tassi interesse\n\n**Uffici:**\n- Edifici per aziende\n- Sfidato dal lavoro remoto\n- Rischio strutturale post-COVID\n\n**Retail (centri commerciali):**\n- Sfidato dall'e-commerce\n- Alcuni in crisi strutturale\n- Altri si reinventano\n\n**Industriale/Logistica:**\n- Magazzini, centri distribuzione\n- Beneficia dell'e-commerce\n- Settore in crescita\n\n**Data center:**\n- Server e infrastrutture cloud\n- Domanda in forte crescita\n- Settore tech-correlato\n\n**Sanitario:**\n- Ospedali, RSA, cliniche\n- Domanda demografica (invecchiamento)\n- Contratti lungo termine",
      },
      {
        kind: "question",
        title: "🧠 Verifica: settori REITs",
        content: "Quale settore REITs è più sfidato dalle tendenze post-COVID?",
        pollAreas: [
          {
            id: "concept-solve-28",
            prompt: "Seleziona il settore più a rischio",
            options: [
              "Uffici - il lavoro remoto riduce la domanda",
              "Logistica - l'e-commerce aumenta la domanda",
              "Data center - il cloud è in crescita",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Gli **uffici** sono sfidati dal lavoro remoto/ibrido. Molte aziende riducono gli spazi. È un rischio strutturale che durerà anni.",
            wrongExplanation: "Logistica e data center beneficiano dei trend attuali.\n\n**Uffici:**\n- Lavoro remoto = meno domanda\n- Molti spazi vuoti\n- Riconversione difficile\n- Rischio strutturale lungo termine",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco i REITs", "Conosco i settori", "So i pro e contro"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Come investire in REITs",
        content: "Esistono vari modi per investire in REITs:\n\n**1. ETF su REITs:**\n- Diversificato su molti REITs\n- Es: iShares Global REIT ETF, Vanguard Real Estate ETF\n- Costi bassi, diversificazione automatica\n- **Consigliato per iniziare**\n\n**2. REITs singoli:**\n- Compri quote di un REIT specifico\n- Maggiore concentrazione\n- Richiede analisi del singolo REIT\n\n**3. Fondi immobiliari non quotati:**\n- Non scambiati in borsa\n- Illiquidi (lock-up period)\n- Spesso riservati a investitori qualificati\n\n**Cosa considerare:**\n- **Dividend yield**: quanto distribuiscono\n- **FFO (Funds From Operations)**: metrica di redditività\n- **Occupancy rate**: % immobili affittati\n- **Debt/Equity**: quanto sono indebitati\n- **Settore**: quale trend sta seguendo",
      },
      {
        kind: "explain",
        title: "📌 REITs nel portafoglio: quanto allocare",
        content: "I REITs in un portafoglio diversificato:\n\n**Allocazioni tipiche:**\n- **0-5%**: esposizione minima\n- **5-15%**: allocazione significativa\n- **>15%**: convinto sull'immobiliare\n\n**Considerazioni:**\n\n**Pro aggiungere REITs:**\n- Diversificazione rispetto ad azioni pure\n- Dividendi regolari (tipicamente 3-5%)\n- Esposizione a immobiliare senza possedere\n\n**Contro:**\n- Correlazione con azioni in crisi\n- Sensibili ai tassi (tassi alti = REITs soffrono)\n- Fiscalità dividendi può essere penalizzante\n\n**Nota per Italia:**\n- I REITs USA sono tassati al 26% sui dividendi\n- ETF REIT domiciliati in Irlanda sono fiscalmente efficienti\n- Considera l'efficienza fiscale nella scelta",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Qual è lo strumento più semplice per investire in REITs?",
        pollAreas: [
          {
            id: "widget-verify-28",
            prompt: "Seleziona lo strumento migliore per iniziare",
            options: [
              "ETF su REITs - diversificato, costi bassi, liquido",
              "Comprare un appartamento da affittare",
              "Fondi immobiliari non quotati",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Gli **ETF su REITs** sono lo strumento più semplice. Diversificati, costi bassi, liquidità immediata. Per chi inizia sono la scelta migliore.",
            wrongExplanation: "Un appartamento richiede capitale elevato e gestione. I fondi non quotati sono illiquidi.\n\n**ETF REIT:**\n- Diversificazione automatica\n- Liquidità in borsa\n- Costi bassi\n- Nessuna gestione",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Hai un portafoglio 60/40 azioni/obbligazioni. Vuoi aggiungere REITs. Come procedi?",
        pollAreas: [
          {
            id: "widget-scenario-28",
            prompt: "Quale approccio scegli?",
            options: [
              "Aggiungo 5-10% REITs riducendo leggermente azioni e obbligazioni",
              "Sostituisco tutte le obbligazioni con REITs",
              "Non aggiungo nulla - il 60/40 è perfetto",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Aggiungere **5-10% di REITs** riducendo leggermente le altre componenti è l'approccio bilanciato. Ottieni diversificazione senza stravolgere il portafoglio.",
            wrongExplanation: "Sostituire tutte le obbligazioni è troppo drastico - i REITs sono più volatili. Non aggiungere nulla è valido ma rinunci alla diversificazione.\n\n**Approccio equilibrato:**\n- Es: 55% azioni, 35% obbligazioni, 10% REITs\n- Mantieni il bilanciamento\n- Aggiungi diversificazione",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Conosco gli strumenti", "So allocare", "Ho un piano chiaro"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ REITs: rendimenti storici e aspettative",
        content: "Guardiamo i numeri reali dei REITs:\n\n**Performance storica (REITs USA 1972-2023):**\n- Rendimento medio annuo: ~10-11%\n- Simile alle azioni ma con più volatilità in alcuni periodi\n- Dividendi: ~3-5% annuo\n\n**Periodi positivi:**\n- 2010-2019: forte crescita post-crisi\n- Settori logistica/data center: boom negli ultimi anni\n\n**Periodi negativi:**\n- 2008-2009: crollo -70% (crisi immobiliare)\n- 2022: tassi in salita, REITs -25%\n- Post-COVID uffici: ancora in difficoltà\n\n**La lezione:**\n- I REITs sono ciclici\n- Molto sensibili ai tassi interesse\n- In crisi immobiliari crollano più delle azioni\n- Non sono 'sicuri come il mattone'",
      },
      {
        kind: "explain",
        title: "📌 REITs e tassi d'interesse: la relazione",
        content: "Capire la relazione tra REITs e tassi è fondamentale:\n\n**Perché i tassi influenzano i REITs:**\n\n**1. Costo del debito:**\n- I REITs usano leva (debito) per comprare immobili\n- Tassi alti = debito più costoso = margini ridotti\n\n**2. Competizione con obbligazioni:**\n- I REITs attraggono per i dividendi\n- Se le obbligazioni pagano 5%, i REITs al 4% sono meno attraenti\n\n**3. Valore degli immobili:**\n- Tassi alti = sconti più alti nel calcolare il valore\n- Gli immobili 'valgono meno' in ambiente tassi alti\n\n**Schema semplice:**\n- Tassi salgono → REITs soffrono (di solito)\n- Tassi scendono → REITs beneficiano\n\n**Eccezione:**\nSe i tassi salgono per inflazione alta, e i REITs possono alzare gli affitti in linea, l'effetto può essere attenuato.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Perché i REITs tendono a soffrire quando i tassi salgono?",
        pollAreas: [
          {
            id: "challenge-verify-28",
            prompt: "Seleziona la ragione principale",
            options: [
              "Debito più costoso e competizione con obbligazioni che pagano di più",
              "Gli inquilini smettono di pagare",
              "Le banche chiudono",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Tassi alti significano **debito più costoso** per i REITs (che usano leva) e **competizione** con obbligazioni che ora pagano rendimenti interessanti.",
            wrongExplanation: "Gli inquilini e le banche non c'entrano direttamente.\n\n**L'effetto dei tassi:**\n- Debito più costoso → margini ridotti\n- Obbligazioni competitive → meno domanda per REITs\n- Valutazioni immobiliari → scendono",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "I tassi sono saliti dal 0% al 4%. I tuoi REITs sono scesi del 20%. Cosa fai?",
        pollAreas: [
          {
            id: "challenge-scenario-28",
            prompt: "Quale azione prendi?",
            options: [
              "Mantengo se l'allocazione era corretta - i cicli si invertono",
              "Vendo tutto - i REITs non funzionano",
              "Raddoppio - compro quando è sceso",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! I **cicli si invertono**. Se l'allocazione era corretta e diversificata, mantieni. Vendere al minimo cristallizza le perdite. Raddoppiare senza analisi è speculazione.",
            wrongExplanation: "Vendere al minimo è spesso un errore. Raddoppiare senza analisi è rischioso.\n\n**L'approccio corretto:**\n- Valuta se la tesi originale è ancora valida\n- Se l'allocazione era prudente, mantieni\n- I cicli dei tassi si invertono\n- Non prendere decisioni emotive",
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
        title: "🧠 Quiz finale: real estate e REITs",
        content: "Hai imparato cosa sono i REITs, i settori, come investire e la relazione con i tassi.\n\n**Concetti chiave:**\n- REITs: società quotate che possiedono immobili\n- Vantaggi: liquidità, diversificazione, dividendi\n- Settori: residenziale, uffici, logistica, data center\n- Sensibilità ai tassi: tassi alti = REITs soffrono\n- Allocazione: 5-15% per diversificazione\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Qual è la differenza principale tra possedere un appartamento e un ETF REIT?",
        pollAreas: [
          {
            id: "quiz-q1-28",
            prompt: "Seleziona la differenza principale",
            options: [
              "L'ETF è liquido e diversificato, l'appartamento no",
              "L'appartamento rende di più sempre",
              "L'ETF non paga dividendi",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! L'**ETF è liquido** (vendi in borsa) e **diversificato** (quote di centinaia di immobili). L'appartamento è illiquido e concentrato.",
            wrongExplanation: "L'appartamento non rende sempre di più e gli ETF REIT pagano dividendi.\n\n**Differenze:**\n- ETF: liquido, diversificato, nessuna gestione\n- Appartamento: illiquido, concentrato, richiede gestione",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Quale settore REIT beneficia di più dalla crescita dell'e-commerce?",
        pollAreas: [
          {
            id: "quiz-q2-28",
            prompt: "Seleziona il settore beneficiato",
            options: [
              "Logistica e magazzini",
              "Centri commerciali retail",
              "Uffici",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! La **logistica** beneficia dell'e-commerce - servono più magazzini per le consegne. I centri commerciali invece soffrono la concorrenza online.",
            wrongExplanation: "I centri commerciali soffrono l'e-commerce. Gli uffici hanno altri problemi.\n\n**Logistica:**\n- Più ordini online = più magazzini\n- Centri distribuzione in crescita\n- Domanda strutturale",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Come influenzano i tassi d'interesse i REITs?",
        pollAreas: [
          {
            id: "quiz-q3-28",
            prompt: "Seleziona la relazione corretta",
            options: [
              "Tassi alti → REITs soffrono (debito costoso, competizione obbligazioni)",
              "Tassi alti → REITs crescono sempre",
              "Non c'è relazione",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Tassi alti** significano debito più costoso e obbligazioni competitive. I REITs tendono a soffrire in questi ambienti.",
            wrongExplanation: "C'è una chiara relazione inversa.\n\n**Tassi e REITs:**\n- Tassi alti = debito costoso\n- Tassi alti = obbligazioni competitive\n- REITs tendono a soffrire",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco i REITs", "Conosco i settori", "So la relazione con i tassi"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: real estate e REITs",
        content: "Complimenti! Hai completato la lezione sul real estate.\n\n**Principi chiave:**\n\n1. **REITs**: modo liquido e diversificato per investire in immobiliare\n2. **Settori**: logistica e data center in crescita, uffici sfidati\n3. **Strumento consigliato**: ETF su REITs per diversificazione\n4. **Tassi**: relazione inversa (tassi alti = REITs soffrono)\n5. **Allocazione**: 5-15% per diversificazione\n\nI REITs offrono esposizione immobiliare senza i problemi del possesso diretto.",
      },
      {
        kind: "explain",
        title: "📌 Fine sezione Asset Alternativi",
        content: "Questa lezione conclude la sezione **Asset Alternativi**.\n\n**Recap della sezione:**\n- **Crypto**: Bitcoin, altcoin, DeFi, NFT\n- **Commodities**: oro e materie prime\n- **Real estate**: immobiliare diretto e REITs\n\n**Il filo conduttore:**\nGli asset alternativi diversificano ma non sono per tutti. Ogni categoria ha pro e contro specifici. L'importante è capire cosa stai comprando.\n\n**Prossima sezione:**\nMacroeconomia - come inflazione, tassi, cicli economici e geopolitica influenzano i tuoi investimenti.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Cosa farai con questa conoscenza?",
        pollAreas: [
          {
            id: "feedback-action-28",
            prompt: "Indica il tuo prossimo passo",
            options: [
              "Valuto se aggiungere 5-10% REITs al portafoglio",
              "Preferisco l'immobiliare diretto se ho capitale",
              "Passo alla sezione macroeconomia",
            ],
            correctIndex: 0,
            correctExplanation: "Buona scelta! **Valutare i REITs** per diversificazione è ragionevole. ETF su REITs sono lo strumento più semplice per iniziare.",
            wrongExplanation: "Tutte le scelte sono valide!\n\n- REITs: liquidità e diversificazione\n- Immobiliare diretto: controllo ma richiede capitale\n- Continuare: per completare la visione\n\nScegli in base alla tua situazione.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Quali ETF REIT sono disponibili in Italia?",
      "Come valuto se comprare un appartamento vs REITs?",
      "Quali REITs sono meno sensibili ai tassi?",
    ],
  },
};

const lesson28Definition = createStaticLessonDefinition("28", content);

export default lesson28Definition;
