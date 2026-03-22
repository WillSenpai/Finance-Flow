import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 NFT: cosa sono davvero",
        content: "**NFT** (Non-Fungible Token) sono token unici su blockchain che rappresentano la proprietà di un oggetto digitale (o fisico).\n\n**Fungibile vs Non-Fungibile:**\n- **Fungibile**: intercambiabile (1 euro = 1 euro, 1 BTC = 1 BTC)\n- **Non-Fungibile**: unico (la Gioconda, il tuo passaporto)\n\n**Cosa può essere un NFT:**\n- Arte digitale\n- Collezionabili (card, avatar)\n- Musica e video\n- Biglietti e pass\n- Proprietà in giochi\n- Certificati di autenticità\n\n**Il punto chiave:** un NFT è un certificato di proprietà su blockchain. Non è l'oggetto in sé - è la prova che 'possiedi' qualcosa di digitale. Ma 'possedere' un'immagine digitale è un concetto nuovo con implicazioni complesse.",
      },
      {
        kind: "explain",
        title: "📌 Come funzionano gli NFT",
        content: "**Tecnicamente:**\n- Un NFT è uno smart contract che registra: proprietario, metadati, cronologia\n- La maggior parte gira su Ethereum (ERC-721, ERC-1155)\n- L'immagine spesso NON è sulla blockchain (solo il link)\n\n**Il processo:**\n1. Un artista 'minta' (crea) un NFT collegato alla sua opera\n2. Lo mette in vendita su marketplace (OpenSea, Blur)\n3. Compratori fanno offerte in ETH\n4. Chi compra riceve l'NFT nel wallet\n5. Può rivenderlo, tenerlo, o usarlo\n\n**Royalties:**\nAlcuni NFT pagano royalties al creatore su ogni rivendita (es. 5-10%). È un nuovo modello per gli artisti.\n\n**Importante:** comprare un NFT non ti dà necessariamente i diritti d'autore. Possiedi il 'token', non l'opera stessa (dipende dalle condizioni specifiche).",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Cosa possiedi realmente quando compri un NFT di un'immagine?",
        pollAreas: [
          {
            id: "concept-verify-26",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Un certificato di proprietà su blockchain, non necessariamente i diritti sull'opera",
              "L'immagine originale e tutti i diritti",
              "Nulla - è solo una truffa",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Un NFT è un **certificato di proprietà** del token, non automaticamente dell'opera. I diritti dipendono dalle condizioni specifiche del progetto. Spesso puoi usare l'immagine come avatar, ma non rivenderla come merchandise.",
            wrongExplanation: "Non è automaticamente una truffa, ma non dai necessariamente tutti i diritti.\n\n**Cosa possiedi:**\n- Il token sulla blockchain\n- Prova di proprietà del token\n- Diritti dipendono dal progetto\n- Spesso: uso personale, non commerciale",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Tokenizzazione: oltre l'arte digitale",
        content: "Gli NFT per l'arte sono solo la punta dell'iceberg. La **tokenizzazione** è il concetto più ampio.\n\n**Tokenizzazione = rappresentare asset reali su blockchain**\n\n**Esempi concreti:**\n- **Immobili**: quote di proprietà immobiliare tokenizzate\n- **Arte fisica**: quote di un quadro di Picasso\n- **Azioni private**: equity di startup in forma di token\n- **Crediti carbonio**: certificati ambientali verificabili\n- **Identità**: documenti e certificati su blockchain\n\n**Vantaggi teorici:**\n- Frazionamento: possiedi 0.1% di un immobile\n- Liquidità: vendi quando vuoi (in teoria)\n- Trasparenza: proprietà verificabile\n- Automazione: dividendi automatici via smart contract\n\n**Realtà:** la tokenizzazione è ancora agli inizi. Aspetti legali, regolatori e pratici sono complessi.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: tokenizzazione",
        content: "La tokenizzazione di un immobile significa:",
        pollAreas: [
          {
            id: "concept-solve-26",
            prompt: "Seleziona il significato corretto",
            options: [
              "Dividere la proprietà in quote digitali scambiabili su blockchain",
              "Costruire case virtuali nel metaverso",
              "Vendere foto della casa come NFT",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Tokenizzare un immobile** significa creare token che rappresentano quote di proprietà. Così puoi possedere il 5% di un appartamento e ricevere 5% degli affitti.",
            wrongExplanation: "Non è costruire nel metaverso o vendere foto.\n\n**Tokenizzazione immobiliare:**\n- L'immobile reale viene 'diviso' in token\n- Ogni token = quota di proprietà\n- Proprietari ricevono proporzionalmente affitti\n- Possono vendere i token quando vogliono",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco gli NFT", "So cosa è la tokenizzazione", "Vedo le applicazioni future"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ I rischi degli NFT: lezioni dal crollo",
        content: "Il mercato NFT ha visto una bolla spettacolare nel 2021-2022, seguita da crollo.\n\n**Numeri del crollo:**\n- Volume trading: -97% dal picco\n- Floor price delle collezioni top: -70/90%\n- La maggior parte degli NFT: valore zero\n\n**Lezioni dal crollo:**\n\n**1. Liquidità illusoria:**\n- Molti NFT non hanno compratori\n- Puoi essere 'ricco' su carta ma non riuscire a vendere\n\n**2. Wash trading:**\n- Molte vendite erano false (stesso proprietario compra e vende)\n- I volumi erano gonfiati artificialmente\n\n**3. Zero valore intrinseco:**\n- La maggior parte degli NFT non ha utilità\n- Valore basato solo sulla speranza che altri paghino di più\n\n**4. Piattaforme che chiudono:**\n- Se il marketplace chiude, il tuo NFT potrebbe diventare inaccessibile",
      },
      {
        kind: "explain",
        title: "📌 NFT che potrebbero avere senso",
        content: "Nonostante la bolla, alcuni casi d'uso hanno potenziale:\n\n**Casi con utilità reale:**\n\n**1. Biglietti e pass:**\n- Biglietti concerti/eventi come NFT\n- Anti-contraffazione\n- Royalties su rivendita per artisti\n\n**2. Gaming:**\n- Oggetti di gioco posseduti realmente\n- Trasferibili tra giochi (in teoria)\n- Economia in-game\n\n**3. Identità e certificati:**\n- Diplomi verificabili\n- Credenziali professionali\n- Accesso a comunità\n\n**4. Tokenizzazione asset reali:**\n- Quote immobiliari\n- Arte fisica frazionata\n- Vini, orologi, auto d'epoca\n\n**Attenzione:** 'potenziale' non significa 'già funzionante'. La maggior parte di queste applicazioni è ancora sperimentale.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Qual è il problema principale dell'investire in NFT d'arte?",
        pollAreas: [
          {
            id: "widget-verify-26",
            prompt: "Seleziona il problema principale",
            options: [
              "Liquidità - potresti non trovare compratori quando vuoi vendere",
              "Sono illegali in alcuni paesi",
              "Costano troppo in commissioni",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! La **liquidità** è il problema principale. Puoi possedere un NFT 'valutato' 10 ETH ma non trovare nessuno disposto a comprarlo. Il prezzo è teorico finché non vendi.",
            wrongExplanation: "Gli NFT non sono generalmente illegali e le commissioni non sono il problema principale.\n\n**Il problema vero:**\n- Mercato illiquido\n- Pochi compratori\n- Floor price può crollare\n- Potresti rimanere con asset invendibile",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Un amico vuole comprare un NFT di una collezione 'in hype' per 2 ETH. Cosa gli consigli?",
        pollAreas: [
          {
            id: "widget-scenario-26",
            prompt: "Quale consiglio dai?",
            options: [
              "Solo se può perdere quei 2 ETH al 100% - gli NFT sono speculazione pura",
              "Ottima opportunità - l'hype significa che salirà",
              "Comprare 10 NFT della stessa collezione per diversificare",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Gli NFT sono **speculazione pura**. L'hype di oggi può essere il crollo di domani. Solo con fondi che puoi perdere completamente, e sapendo che probabilmente li perderai.",
            wrongExplanation: "L'hype non garantisce nulla - anzi, comprare durante l'hype spesso significa comprare ai massimi.\n\n**La regola:**\n- Speculazione pura, non investimento\n- Solo fondi che puoi perdere al 100%\n- L'hype spesso segna il picco, non l'inizio",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco i rischi NFT", "So valutare i casi d'uso", "Ho un approccio prudente"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Il futuro della tokenizzazione: hype vs realtà",
        content: "La tokenizzazione promette di rivoluzionare molti settori. Ma quanto è realistico?\n\n**Cosa funziona già (più o meno):**\n- Stablecoin tokenizzate (USDC, USDT)\n- Alcuni fondi tokenizzati (BlackRock BUIDL)\n- NFT come biglietti eventi (limitato)\n\n**Cosa è ancora sperimentale:**\n- Tokenizzazione immobiliare retail\n- Frazionamento arte fisica\n- Token equity startup\n\n**Ostacoli principali:**\n\n**1. Regolamentazione:**\n- Cosa succede se il token rappresenta un immobile e l'emittente fallisce?\n- Chi garantisce che il token corrisponda alla proprietà reale?\n\n**2. Aspetti legali:**\n- Un token è un titolo? Una security?\n- Varia da paese a paese\n\n**3. Adozione:**\n- Serve infrastruttura legale e tecnica\n- Le istituzioni sono lente ad adattarsi",
      },
      {
        kind: "explain",
        title: "📌 Come valutare progetti di tokenizzazione",
        content: "Se vuoi investire in asset tokenizzati:\n\n**Domande da porsi:**\n\n**1. Chi c'è dietro?**\n- Azienda regolamentata?\n- Track record verificabile?\n- Dove sono registrati?\n\n**2. Come è strutturato legalmente?**\n- Il token è un titolo?\n- Quali diritti hai effettivamente?\n- Cosa succede in caso di fallimento?\n\n**3. Come funziona la custodia dell'asset?**\n- Chi detiene l'immobile/opera reale?\n- È assicurato?\n- Come viene gestito?\n\n**4. Liquidità:**\n- C'è un mercato secondario?\n- Quanto è facile vendere?\n- Quali sono le commissioni?\n\n**Red flags:**\n- Promesse di rendimenti garantiti\n- Struttura legale opaca\n- Nessuna informazione sui custodi reali",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Qual è il principale ostacolo alla tokenizzazione di massa?",
        pollAreas: [
          {
            id: "challenge-verify-26",
            prompt: "Seleziona l'ostacolo principale",
            options: [
              "Regolamentazione e aspetti legali ancora indefiniti",
              "La tecnologia blockchain è troppo lenta",
              "La gente non capisce cosa sono i token",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! La **regolamentazione** è il principale ostacolo. Le leggi non sono ancora adattate, e non è chiaro cosa succede quando qualcosa va storto. La tecnologia esiste, ma il framework legale no.",
            wrongExplanation: "La tecnologia funziona e la comprensione sta migliorando.\n\n**L'ostacolo vero:**\n- Regole poco chiare\n- Varia da paese a paese\n- Chi protegge l'investitore?\n- Cosa succede in caso di disputa?",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "Una piattaforma offre 'quote tokenizzate' di immobili a Parigi con 8% rendimento annuo. Come valuti?",
        pollAreas: [
          {
            id: "challenge-scenario-26",
            prompt: "Quale valutazione fai?",
            options: [
              "Verifico regolamentazione, struttura legale, e chi custodisce realmente gli immobili",
              "8% è buono, investo subito",
              "Parigi è una città sicura, quindi l'investimento è sicuro",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Prima di tutto: **verifica**. Chi è l'azienda? È regolamentata? Chi possiede legalmente gli immobili? Cosa succede se falliscono? La città non c'entra - conta la struttura legale.",
            wrongExplanation: "Il rendimento e la città non determinano la sicurezza.\n\n**Cosa conta:**\n- La piattaforma è regolamentata?\n- Chi detiene legalmente gli immobili?\n- Quali sono i tuoi diritti reali?\n- Cosa succede in caso di fallimento?",
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
        title: "🧠 Quiz finale: NFT e tokenizzazione",
        content: "Hai imparato cosa sono gli NFT, come funziona la tokenizzazione, i rischi del mercato e come valutare i progetti.\n\n**Concetti chiave:**\n- NFT: certificato di proprietà unico su blockchain\n- Tokenizzazione: rappresentare asset reali su blockchain\n- Crollo NFT: -97% dal picco, liquidità illusoria\n- Casi d'uso reali: biglietti, gaming, frazionamento asset\n- Ostacolo principale: regolamentazione\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Un NFT è:",
        pollAreas: [
          {
            id: "quiz-q1-26",
            prompt: "Seleziona la definizione corretta",
            options: [
              "Un token unico che rappresenta la proprietà di un oggetto digitale",
              "Una criptovaluta come Bitcoin",
              "Un tipo di azione di azienda tech",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Un **NFT è un token non-fungibile** - unico, non intercambiabile, che rappresenta la proprietà di qualcosa (digitale o fisico).",
            wrongExplanation: "Non è una criptovaluta (quelle sono fungibili) né un'azione.\n\n**NFT:**\n- Non-Fungible Token\n- Unico, non intercambiabile\n- Rappresenta proprietà digitale\n- Registrato su blockchain",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Il problema principale degli NFT come investimento è:",
        pollAreas: [
          {
            id: "quiz-q2-26",
            prompt: "Seleziona il problema principale",
            options: [
              "Liquidità - potresti non trovare compratori",
              "Sono troppo complessi da usare",
              "Consumano troppa energia",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! La **liquidità** è il problema centrale. Il prezzo è teorico se non c'è nessuno che compra. Puoi essere 'ricco' su carta e non riuscire a vendere.",
            wrongExplanation: "Complessità ed energia non sono i problemi principali per l'investitore.\n\n**Il problema vero:**\n- Mercato illiquido\n- Il prezzo dipende da trovare un compratore\n- Molti NFT valgono zero in pratica",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Prima di investire in asset tokenizzati, cosa verifichi?",
        pollAreas: [
          {
            id: "quiz-q3-26",
            prompt: "Seleziona la verifica prioritaria",
            options: [
              "Regolamentazione dell'emittente e struttura legale",
              "Solo il rendimento promesso",
              "Il design del sito web",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Regolamentazione e struttura legale** sono fondamentali. Chi possiede realmente l'asset? Cosa succede se l'emittente fallisce? Quali diritti hai?",
            wrongExplanation: "Il rendimento non dice nulla sulla sicurezza. Il design del sito ancora meno.\n\n**Verifiche essenziali:**\n- È regolamentato?\n- Chi custodisce l'asset reale?\n- Quali sono i tuoi diritti legali?\n- Cosa succede in caso di problemi?",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco gli NFT", "Valuto i rischi", "Verifico prima di investire"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: NFT e tokenizzazione",
        content: "Complimenti! Hai completato la lezione su NFT e tokenizzazione.\n\n**Principi chiave:**\n\n1. **NFT**: certificato di proprietà unico, non l'opera stessa\n2. **Tokenizzazione**: rappresentare asset reali su blockchain\n3. **Rischi NFT**: liquidità, wash trading, zero valore intrinseco\n4. **Casi d'uso reali**: biglietti, gaming, frazionamento asset\n5. **Ostacoli**: regolamentazione ancora indefinita\n\nLa tokenizzazione ha potenziale, ma siamo ancora agli inizi. La prudenza è fondamentale.",
      },
      {
        kind: "explain",
        title: "📌 Collegamento con la sezione",
        content: "Questa lezione completa il blocco crypto della sezione **Asset Alternativi**.\n\n**Recap crypto:**\n- Bitcoin e blockchain (base)\n- Altcoin e token (ecosistema)\n- DeFi e staking (applicazioni)\n- NFT e tokenizzazione (proprietà digitale)\n\n**Prossime lezioni:**\n- Commodities (oro e materie prime)\n- Real estate e REITs\n\nPassiamo dagli asset digitali a quelli tangibili, ma il principio resta: capire prima di investire.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Cosa farai con questa conoscenza?",
        pollAreas: [
          {
            id: "feedback-action-26",
            prompt: "Indica il tuo prossimo passo",
            options: [
              "Evito gli NFT speculativi - troppo rischiosi",
              "Approfondisco la tokenizzazione immobiliare",
              "Continuo con commodities e real estate",
            ],
            correctIndex: 0,
            correctExplanation: "Scelta prudente! Gli **NFT speculativi** hanno perso il 90%+ del valore. Se un giorno troverai un caso d'uso reale che ti interessa, potrai rivalutare.",
            wrongExplanation: "Tutte le scelte sono valide!\n\n- Evitare NFT speculativi: prudente\n- Approfondire tokenizzazione: se ti interessa l'immobiliare\n- Continuare il corso: per completare la visione\n\nL'importante è non lanciarsi in asset che non capisci.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Quali piattaforme di tokenizzazione immobiliare sono regolamentate in Italia?",
      "Ha senso comprare NFT come collezionabili?",
      "Come funziona il frazionamento di opere d'arte?",
    ],
  },
};

const lesson26Definition = createStaticLessonDefinition("26", content);

export default lesson26Definition;
