import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Commodities: il mondo fisico",
        content: "Le **commodities** (materie prime) sono beni fisici standardizzati: oro, petrolio, grano, rame, caffè.\n\n**Perché interessano agli investitori:**\n- **Diversificazione**: correlazione diversa da azioni e obbligazioni\n- **Protezione inflazione**: i beni fisici tendono a mantenere valore\n- **Esposizione a trend globali**: urbanizzazione, transizione energetica\n\n**Categorie principali:**\n- **Metalli preziosi**: oro, argento, platino\n- **Energia**: petrolio, gas naturale\n- **Metalli industriali**: rame, alluminio, litio\n- **Agricole**: grano, mais, soia, caffè\n\n**Il punto chiave:** le commodities non producono reddito (dividendi, cedole). Il rendimento viene solo dalla variazione di prezzo. Questo le rende diverse dagli asset produttivi.",
      },
      {
        kind: "explain",
        title: "📌 L'oro: il bene rifugio per eccellenza",
        content: "L'**oro** è la commodity più discussa e la più accessibile per gli investitori.\n\n**Perché l'oro è speciale:**\n- **Storia**: usato come moneta per millenni\n- **Scarsità**: offerta limitata, estrazione costosa\n- **Nessun rischio di controparte**: non dipende da un emittente\n- **Universale**: accettato ovunque nel mondo\n\n**Quando l'oro tende a salire:**\n- Inflazione alta\n- Incertezza geopolitica\n- Tassi reali negativi (tassi nominali < inflazione)\n- Crisi finanziarie\n\n**Quando l'oro tende a scendere:**\n- Tassi reali positivi (tassi nominali > inflazione)\n- Economia in crescita stabile\n- Dollaro forte\n\n**Rendimenti storici:**\nL'oro ha rendimenti reali a lungo termine vicini allo zero - protegge il potere d'acquisto, non lo moltiplica.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Qual è la caratteristica distintiva dell'oro come investimento?",
        pollAreas: [
          {
            id: "concept-verify-27",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Non produce reddito - il rendimento viene solo dalla variazione di prezzo",
              "Paga dividendi regolari come le azioni",
              "È garantito dalle banche centrali",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! L'oro **non produce reddito** (niente dividendi, cedole, affitti). Guadagni solo se il prezzo sale. È diverso dagli asset produttivi come azioni o immobili.",
            wrongExplanation: "L'oro non paga dividendi e non è garantito da nessuno.\n\n**Caratteristiche dell'oro:**\n- Nessun rendimento periodico\n- Guadagno solo da apprezzamento prezzo\n- Costo di custodia (se fisico)\n- Protezione potere d'acquisto, non crescita",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Altre commodities: energia e metalli",
        content: "Oltre all'oro, esistono altre commodities con dinamiche diverse.\n\n**Petrolio e Gas:**\n- Fortemente ciclici (domanda economica)\n- Influenzati da geopolitica (OPEC, sanzioni)\n- Volatilità estrema (vedi 2020: petrolio negativo)\n- Transizione energetica = incertezza lungo termine\n\n**Metalli industriali (rame, litio):**\n- Legati a economia e industria\n- Rame: indicatore economico ('Dr. Copper')\n- Litio: domanda EV, ma volatilità alta\n\n**Agricole:**\n- Influenzate da clima e stagioni\n- Più complesse da analizzare\n- Meno accessibili per retail\n\n**Il problema delle commodities (non oro):**\n- Contango: i futures costano di più del prezzo spot\n- ETC/ETN possono perdere valore anche se il prezzo sale\n- Richiede comprensione dei mercati futures",
      },
      {
        kind: "question",
        title: "🧠 Verifica: commodities",
        content: "Perché investire in petrolio tramite ETF può essere diverso dal possedere petrolio fisico?",
        pollAreas: [
          {
            id: "concept-solve-27",
            prompt: "Qual è il problema principale?",
            options: [
              "Il contango: i futures costano più del prezzo spot, erodendo il rendimento",
              "Il petrolio fisico è illegale da possedere",
              "Gli ETF sul petrolio non esistono",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il **contango** è quando i futures costano più del prezzo spot. Gli ETF devono 'rollare' continuamente, comprando contratti più cari. Questo erode il rendimento anche se il prezzo sale.",
            wrongExplanation: "Gli ETF sul petrolio esistono e possedere petrolio (tramite prodotti finanziari) è legale.\n\n**Il problema:**\n- ETF usano futures, non petrolio fisico\n- Contango: futures > prezzo spot\n- Rollover costante = costo nascosto\n- Puoi perdere anche se il prezzo sale",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco le commodities", "So cos'è l'oro", "Conosco il contango"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Come investire in commodities: strumenti",
        content: "Esistono vari modi per ottenere esposizione alle commodities:\n\n**1. ETF/ETC su singola commodity:**\n- Es: iShares Physical Gold (IGLN), WisdomTree Gold\n- Per l'oro: ETC 'fisicamente garantiti' (l'oro è in caveau)\n- Per petrolio: attenzione al contango\n\n**2. ETF su paniere di commodities:**\n- Diversificano su più materie prime\n- Es: Bloomberg Commodity Index\n- Meno volatilità, ma contango su tutto\n\n**3. Azioni di produttori:**\n- Aziende minerarie (Barrick Gold, Newmont)\n- Aziende petrolifere (ENI, Shell)\n- Leva sul prezzo + dividendi\n- Ma anche rischi aziendali\n\n**4. Oro fisico:**\n- Monete, lingotti\n- Costi di custodia e assicurazione\n- Spread acquisto/vendita\n- Nessun rischio controparte\n\n**Per la maggior parte degli investitori:** ETC sull'oro fisicamente garantiti sono lo strumento più semplice e trasparente.",
      },
      {
        kind: "explain",
        title: "📌 Quanto allocare in commodities?",
        content: "Le commodities in un portafoglio diversificato:\n\n**Allocazioni tipiche:**\n- **0-5%**: approccio conservativo\n- **5-10%**: esposizione moderata\n- **>10%**: allocazione tattica/convinta\n\n**Perché limitare:**\n- Non producono reddito\n- Alta volatilità\n- Rendimenti reali a lungo termine bassi\n- Complessità (contango, rollover)\n\n**Quando ha senso:**\n- Diversificazione da azioni/obbligazioni\n- Protezione inflazione\n- Timori geopolitici\n\n**L'oro in particolare:**\n- 5-10% è allocazione comune\n- Funziona come 'assicurazione' di portafoglio\n- Non aspettarti rendimenti elevati\n- Aspettati protezione in scenari negativi\n\n**Il principio:** le commodities non sono il core del portafoglio. Sono diversificazione e protezione.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Qual è lo strumento più semplice per investire in oro?",
        pollAreas: [
          {
            id: "widget-verify-27",
            prompt: "Seleziona lo strumento migliore per semplicità",
            options: [
              "ETC sull'oro fisicamente garantito",
              "Futures sull'oro",
              "Azioni di miniere d'oro",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Gli **ETC fisicamente garantiti** sono lo strumento più semplice. L'oro fisico è in caveau, nessun contango, facilmente negoziabili in borsa.",
            wrongExplanation: "I futures sono complessi e richiedono rollover. Le azioni hanno rischio aziendale aggiuntivo.\n\n**ETC fisicamente garantiti:**\n- L'oro è realmente in caveau\n- Nessun contango\n- Facilmente comprabile/vendibile\n- Costi bassi (TER ~0.15-0.25%)",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Vuoi protezione inflazione nel portafoglio. Quanto allocare in oro?",
        pollAreas: [
          {
            id: "widget-scenario-27",
            prompt: "Quale allocazione scegli?",
            options: [
              "5-10% - esposizione significativa ma non dominante",
              "50% - l'oro è il miglior investimento",
              "0% - l'oro non rende nulla",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **5-10%** è un'allocazione ragionevole per chi vuole protezione. Abbastanza per fare la differenza in scenari negativi, non abbastanza da penalizzare in scenari positivi.",
            wrongExplanation: "50% è troppo - l'oro non produce reddito. 0% può lasciare il portafoglio senza protezione.\n\n**Allocazione ragionevole:**\n- 5-10% per la maggior parte\n- Funziona come assicurazione\n- Non aspettarti crescita\n- Aspettati protezione",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Conosco gli strumenti", "So quanto allocare", "Ho un approccio chiaro"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Oro: dati storici e aspettative realistiche",
        content: "Guardiamo i numeri reali dell'oro:\n\n**Performance storica (1971-2023):**\n- Rendimento medio annuo: ~7-8% nominale\n- Rendimento reale (aggiustato inflazione): ~1-2%\n- Volatilità: ~15% annua\n\n**Periodi d'oro (letteralmente):**\n- 1971-1980: da $35 a $800 (+2000%)\n- 2000-2011: da $280 a $1.900 (+580%)\n- 2019-2020: da $1.300 a $2.000 (+54%)\n\n**Periodi negativi:**\n- 1980-2000: da $800 a $280 (-65% nominale, peggio reale)\n- 2011-2015: da $1.900 a $1.050 (-45%)\n\n**La lezione:**\n- L'oro può avere decenni negativi\n- Non è sempre protezione in tutte le crisi\n- Funziona meglio in alcuni scenari (inflazione, tassi reali negativi)\n- Non è un 'investimento sicuro' - è volatile",
      },
      {
        kind: "explain",
        title: "📌 Quando l'oro NON protegge",
        content: "L'oro non è sempre un buon investimento:\n\n**Scenari dove l'oro soffre:**\n\n**1. Tassi reali positivi:**\n- Se i tassi nominali > inflazione, l'oro perde attrattività\n- Alternativa: obbligazioni che pagano interessi reali\n\n**2. Dollaro forte:**\n- L'oro è quotato in dollari\n- Dollaro forte = oro debole (generalmente)\n\n**3. Risk-on:**\n- Quando l'economia va bene e la fiducia è alta\n- Gli investitori preferiscono asset produttivi\n\n**4. Deflazione:**\n- In scenari deflattivi, il cash guadagna potere d'acquisto\n- L'oro non è necessariamente la scelta migliore\n\n**Il punto:**\nL'oro non è 'sempre sicuro'. È un asset con dinamiche proprie. Funziona bene in alcuni scenari, male in altri. Non è una soluzione universale.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "In quale scenario l'oro tende a performare peggio?",
        pollAreas: [
          {
            id: "challenge-verify-27",
            prompt: "Seleziona lo scenario negativo per l'oro",
            options: [
              "Tassi reali positivi e dollaro forte",
              "Inflazione alta e incertezza geopolitica",
              "Recessione economica",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Tassi reali positivi + dollaro forte** sono negativi per l'oro. Le obbligazioni diventano attraenti e il dollaro forte pesa sul prezzo dell'oro.",
            wrongExplanation: "Inflazione e incertezza sono generalmente positivi per l'oro. La recessione dipende dal tipo.\n\n**Scenari negativi per l'oro:**\n- Tassi reali positivi (nominali > inflazione)\n- Dollaro forte\n- Economia in crescita stabile\n- Risk-on generale",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "Hai 10% del portafoglio in oro. L'oro scende del 20% in un anno mentre le azioni salgono del 15%. Cosa fai?",
        pollAreas: [
          {
            id: "challenge-scenario-27",
            prompt: "Quale azione prendi?",
            options: [
              "Mantengo - l'oro è diversificazione, non ogni asset sale sempre",
              "Vendo tutto - l'oro non funziona",
              "Raddoppio - compro quando scende",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **L'oro è diversificazione**. Non deve salire sempre. Il suo valore sta nel proteggere quando le azioni crollano, non nel seguire le azioni. Un anno negativo non cambia la tesi.",
            wrongExplanation: "Un anno non definisce un asset. E raddoppiare senza motivo è speculazione.\n\n**L'approccio corretto:**\n- L'oro diversifica, non segue le azioni\n- Avrà periodi negativi\n- Il valore è nella protezione nei momenti di crisi\n- Mantieni l'allocazione target",
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
        title: "🧠 Quiz finale: commodities",
        content: "Hai imparato cosa sono le commodities, il ruolo dell'oro, come investire e quali aspettative avere.\n\n**Concetti chiave:**\n- Commodities: beni fisici, non producono reddito\n- Oro: protezione, non crescita\n- Contango: problema per ETF non-oro\n- Allocazione: 5-10% per diversificazione\n- L'oro non protegge sempre (tassi reali positivi, dollaro forte)\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Perché le commodities sono diverse dalle azioni?",
        pollAreas: [
          {
            id: "quiz-q1-27",
            prompt: "Seleziona la differenza principale",
            options: [
              "Non producono reddito - guadagni solo dalla variazione di prezzo",
              "Sono più sicure delle azioni",
              "Hanno rendimenti più alti",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Le commodities **non producono reddito**. Non pagano dividendi né cedole. Guadagni solo se il prezzo sale.",
            wrongExplanation: "Non sono più sicure (sono volatili) né hanno rendimenti più alti.\n\n**La differenza:**\n- Azioni: dividendi + crescita\n- Commodities: solo variazione prezzo\n- Rendimento a lungo termine diverso",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Qual è lo strumento migliore per un investitore retail che vuole oro?",
        pollAreas: [
          {
            id: "quiz-q2-27",
            prompt: "Seleziona lo strumento più adatto",
            options: [
              "ETC fisicamente garantito",
              "Futures sull'oro",
              "CFD sull'oro",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Gli **ETC fisicamente garantiti** sono semplici, trasparenti, senza contango. L'oro fisico è in caveau. Futures e CFD sono complessi e rischiosi.",
            wrongExplanation: "Futures e CFD sono complessi, richiedono margini, e non sono adatti a investitori retail.\n\n**ETC fisicamente garantito:**\n- Semplice da comprare\n- L'oro è in caveau\n- Nessun contango\n- Costi bassi",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Quale allocazione in oro è ragionevole per diversificazione?",
        pollAreas: [
          {
            id: "quiz-q3-27",
            prompt: "Seleziona l'allocazione appropriata",
            options: [
              "5-10% del portafoglio",
              "50% o più",
              "L'oro non dovrebbe mai essere in portafoglio",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **5-10%** è l'allocazione tipica. Abbastanza per diversificare e proteggere, non abbastanza da penalizzare la crescita.",
            wrongExplanation: "50% è eccessivo - l'oro non produce reddito. 0% rinuncia alla diversificazione.\n\n**Allocazione equilibrata:**\n- 5-10% per la maggior parte\n- Funziona come assicurazione\n- Non domina il portafoglio",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco le commodities", "So come investire", "Ho aspettative realistiche"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: commodities",
        content: "Complimenti! Hai completato la lezione sulle commodities.\n\n**Principi chiave:**\n\n1. **Commodities**: beni fisici, niente reddito\n2. **Oro**: protezione potere d'acquisto, non crescita\n3. **Contango**: problema per ETF su petrolio/energia\n4. **Strumento migliore**: ETC fisicamente garantiti\n5. **Allocazione**: 5-10% come diversificazione\n\nL'oro non è sempre la risposta, ma può essere parte di un portafoglio bilanciato.",
      },
      {
        kind: "explain",
        title: "📌 Collegamento con la sezione",
        content: "Questa lezione fa parte della sezione **Asset Alternativi**.\n\n**Percorso completato:**\n- Crypto (Bitcoin, altcoin, DeFi, NFT)\n- **Commodities** (oro, materie prime)\n\n**Prossima lezione:**\n- Real estate e REITs\n\n**Il filo conduttore:**\nGli asset alternativi offrono diversificazione ma ognuno ha caratteristiche uniche. Non esiste l'asset perfetto - esiste l'asset giusto per i tuoi obiettivi.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Cosa farai con questa conoscenza?",
        pollAreas: [
          {
            id: "feedback-action-27",
            prompt: "Indica il tuo prossimo passo",
            options: [
              "Valuto se aggiungere 5-10% di oro al portafoglio",
              "Preferisco concentrarmi su azioni/obbligazioni",
              "Continuo con real estate nella prossima lezione",
            ],
            correctIndex: 0,
            correctExplanation: "Buona scelta! **Valutare l'aggiunta di oro** al portafoglio è sensato. Usa ETC fisicamente garantiti e mantieni l'allocazione ragionevole.",
            wrongExplanation: "Tutte le scelte sono valide!\n\n- Aggiungere oro: per diversificazione\n- Focus azioni/obbligazioni: se preferisci semplicità\n- Continuare il corso: per visione completa\n\nL'importante è una scelta consapevole.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Quali ETC sull'oro sono disponibili in Italia?",
      "Come si conserva l'oro fisico?",
      "Ha senso investire in argento oltre all'oro?",
    ],
  },
};

const lesson27Definition = createStaticLessonDefinition("27", content);

export default lesson27Definition;
