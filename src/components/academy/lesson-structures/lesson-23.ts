import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Crypto: oltre il clamore mediatico",
        content: "Le criptovalute sono ovunque nei titoli dei giornali. Ma cosa sono davvero? E perché un investitore consapevole dovrebbe capirle?\n\n**La definizione essenziale:**\nLe criptovalute sono asset digitali che usano la crittografia per garantire transazioni sicure, senza bisogno di intermediari (banche, governi).\n\n**Il punto chiave:** non devi 'credere' nelle crypto per capirle. Come investitore, il tuo compito è valutarle oggettivamente: cosa sono, quali rischi comportano, e se (e quanto) ha senso includerle in un portafoglio diversificato.\n\nIn questa sezione sugli asset alternativi, esploreremo crypto, commodities e real estate. Iniziamo dalle basi.",
      },
      {
        kind: "explain",
        title: "📌 Cos'è la blockchain",
        content: "Prima delle crypto, c'è la **blockchain**: la tecnologia che le rende possibili.\n\n**Immagina un registro contabile:**\n- Tradizionale: una banca tiene il registro delle transazioni. Ti fidi della banca.\n- Blockchain: migliaia di computer tengono copie identiche del registro. Nessuno può alterarlo senza che tutti se ne accorgano.\n\n**Le caratteristiche chiave:**\n- **Decentralizzazione**: nessuna autorità centrale controlla il registro\n- **Immutabilità**: una volta registrata, una transazione non può essere modificata\n- **Trasparenza**: chiunque può verificare le transazioni\n- **Consenso**: le nuove transazioni vengono validate dalla rete\n\n**Perché è importante:**\nLa blockchain risolve il problema della 'fiducia' senza intermediari. Questo ha applicazioni ben oltre le crypto: supply chain, identità digitale, contratti.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Qual è la caratteristica principale della blockchain che la distingue dai sistemi tradizionali?",
        pollAreas: [
          {
            id: "concept-verify-23",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Non richiede un'autorità centrale per validare le transazioni",
              "È più veloce dei sistemi bancari",
              "Costa meno delle transazioni tradizionali",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! La **decentralizzazione** è il cuore della blockchain. Il registro è distribuito su migliaia di computer, eliminando la necessità di fidarsi di un'unica autorità centrale come una banca.",
            wrongExplanation: "Velocità e costi non sono i vantaggi principali - anzi, alcune blockchain sono lente e costose.\n\n**Il vero vantaggio:** decentralizzazione. Nessuna autorità centrale controlla il registro. La fiducia viene dalla matematica e dal consenso della rete, non da un intermediario.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Bitcoin: il primo e il più importante",
        content: "**Bitcoin (BTC)** è la prima criptovaluta, creata nel 2009 da Satoshi Nakamoto (pseudonimo, identità sconosciuta).\n\n**Cosa rende Bitcoin unico:**\n- **Offerta limitata**: esisteranno solo 21 milioni di Bitcoin, mai di più\n- **Scarsità programmata**: l'emissione si dimezza ogni 4 anni (halving)\n- **Decentralizzazione**: nessun governo o azienda lo controlla\n- **Resistenza alla censura**: nessuno può bloccare una transazione\n\n**Bitcoin come 'oro digitale':**\nMolti vedono Bitcoin come riserva di valore, simile all'oro:\n- Scarso (offerta fissa)\n- Divisibile (fino a 8 decimali)\n- Facilmente trasferibile\n- Non confiscabile (se custodito correttamente)\n\n**Attenzione:** questo non significa che Bitcoin sia sicuro o stabile. È estremamente volatile e rischioso.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: Bitcoin",
        content: "Perché Bitcoin viene spesso paragonato all'oro?",
        pollAreas: [
          {
            id: "concept-solve-23",
            prompt: "Qual è l'analogia principale?",
            options: [
              "Entrambi hanno offerta limitata e sono visti come riserva di valore",
              "Entrambi sono controllati dalle banche centrali",
              "Entrambi hanno lo stesso livello di volatilità",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Come l'oro, Bitcoin ha **offerta limitata** (21 milioni max) e viene visto da alcuni come **riserva di valore** alternativa alle valute fiat. L'analogia è sulla scarsità, non sulla stabilità.",
            wrongExplanation: "Bitcoin non è controllato da banche centrali (è decentralizzato) e ha volatilità molto maggiore dell'oro.\n\n**L'analogia con l'oro:**\n- Offerta limitata (scarsità)\n- Non emesso da governi\n- Potenziale riserva di valore\n\nMa Bitcoin è molto più volatile e recente dell'oro.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco la blockchain", "So cosa rende Bitcoin unico", "Riconosco i rischi"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Come funziona Bitcoin in pratica",
        content: "Vediamo i meccanismi concreti:\n\n**Wallet (portafoglio):**\nPer possedere Bitcoin, hai bisogno di un wallet. Esistono:\n- **Hot wallet**: app su smartphone/PC, connessi a internet (più comodi, meno sicuri)\n- **Cold wallet**: dispositivi hardware offline (più sicuri, meno comodi)\n- **Exchange wallet**: custodito dall'exchange (rischio controparte)\n\n**Chiavi private e pubbliche:**\n- **Chiave pubblica**: come un IBAN, la condividi per ricevere BTC\n- **Chiave privata**: come la password, chi la possiede controlla i BTC\n\n**La regola d'oro:**\n'Not your keys, not your coins' - se non controlli le chiavi private, non possiedi davvero i Bitcoin. L'exchange potrebbe fallire (vedi FTX).",
      },
      {
        kind: "explain",
        title: "📌 Mining e Proof of Work",
        content: "**Come vengono creati nuovi Bitcoin?**\n\nAttraverso il **mining** (estrazione):\n1. I miner usano computer potenti per risolvere problemi matematici\n2. Chi risolve per primo valida il blocco di transazioni\n3. Come ricompensa, riceve nuovi Bitcoin\n\n**Proof of Work (PoW):**\nQuesto meccanismo di consenso si chiama Proof of Work:\n- Richiede energia e potenza computazionale\n- Rende economicamente svantaggioso attaccare la rete\n- Garantisce sicurezza attraverso il costo\n\n**Il lato negativo:**\n- Consumo energetico elevato (quanto un paese medio)\n- Concentrazione del mining in pochi pool\n- Non scalabile: ~7 transazioni al secondo\n\n**Nota:** altre crypto usano Proof of Stake, che vedremo nella prossima lezione.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Perché si dice 'Not your keys, not your coins'?",
        pollAreas: [
          {
            id: "widget-verify-23",
            prompt: "Seleziona il significato corretto",
            options: [
              "Chi controlla le chiavi private controlla i Bitcoin - se li lasci su un exchange rischi di perderli",
              "Devi sempre usare più chiavi per sicurezza",
              "Le chiavi pubbliche sono più importanti delle private",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! La **chiave privata** è l'unica prova di proprietà. Se lasci i BTC su un exchange e questo fallisce (come FTX), potresti perdere tutto. Self-custody = più sicurezza, più responsabilità.",
            wrongExplanation: "La chiave privata è la password che controlla i tuoi Bitcoin.\n\n**Il rischio degli exchange:**\n- FTX: fallito nel 2022, miliardi persi\n- Mt. Gox: hackato nel 2014\n- Celsius, Voyager: falliti nel 2022\n\nSe non hai le chiavi, dipendi dalla solidità dell'exchange.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Vuoi comprare Bitcoin per la prima volta. Qual è l'approccio più prudente?",
        pollAreas: [
          {
            id: "widget-scenario-23",
            prompt: "Quale strategia scegli?",
            options: [
              "Exchange regolamentato, importo piccolo, poi valuto self-custody",
              "Compro subito il massimo che posso permettermi",
              "Uso solo exchange decentralizzati per massima privacy",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **Approccio graduale**: exchange regolamentato per semplicità, importo contenuto per imparare, poi valuti se spostare su cold wallet. La prudenza è fondamentale con asset così volatili.",
            wrongExplanation: "Mai investire 'il massimo possibile' in asset così volatili. Gli exchange decentralizzati sono complessi per chi inizia.\n\n**Approccio prudente:**\n1. Exchange regolamentato (più tutele)\n2. Importo piccolo (massimo 5-10% del portafoglio totale)\n3. Impara la custodia gradualmente",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco wallet e chiavi", "Conosco i rischi degli exchange", "So come iniziare"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ La volatilità di Bitcoin: numeri reali",
        content: "Parliamo di volatilità con dati concreti:\n\n**Crolli storici di Bitcoin:**\n- 2011: -93% (da $32 a $2)\n- 2014: -86% (da $1.100 a $150)\n- 2018: -84% (da $20.000 a $3.200)\n- 2022: -77% (da $69.000 a $16.000)\n\n**Rialzi storici:**\n- 2010-2011: +12.000%\n- 2015-2017: +7.000%\n- 2020-2021: +500%\n\n**La lezione:** Bitcoin può farti guadagnare enormemente o perdere quasi tutto. In un anno può perdere l'80% del valore. Chiediti: se investissi 1.000€ e ne rimanessero 200€, come reagiresti?\n\n**Questo è fondamentale:** Bitcoin non è un investimento per tutti. È un asset speculativo con potenziale ma rischio estremo.",
      },
      {
        kind: "explain",
        title: "📌 Sizing prudente: quanto allocare",
        content: "Data la volatilità, quanto ha senso allocare?\n\n**Regole comunemente suggerite:**\n- **0%**: legittimo, non devi avere crypto per forza\n- **1-5%**: esposizione esplorativa, non compromette il portafoglio\n- **5-10%**: esposizione convinta ma ancora prudente\n- **>10%**: alto rischio, solo se capisci profondamente e puoi permetterti di perdere\n\n**Il principio:**\nInvesti solo ciò che puoi perdere completamente senza compromettere i tuoi obiettivi finanziari.\n\n**Esempio:**\nPortafoglio totale: 50.000€\n- 5% in crypto = 2.500€\n- Se crolla del 80% = perdi 2.000€\n- Il portafoglio totale perde il 4%\n\nQuesto è gestibile. Il 50% in crypto che crolla dell'80%? Il portafoglio perde il 40%. Non gestibile.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Qual è l'approccio corretto al sizing delle crypto in portafoglio?",
        pollAreas: [
          {
            id: "challenge-verify-23",
            prompt: "Seleziona la strategia corretta",
            options: [
              "Allocazione piccola (1-5%) che puoi perdere senza compromettere gli obiettivi",
              "Almeno 30% per catturare i rialzi",
              "Tutto o niente - se non credi al 100% non comprare",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Sizing prudente** è la chiave. Un'allocazione del 1-5% ti espone al potenziale rialzo ma limita il danno se crolla. La diversificazione funziona anche con le crypto.",
            wrongExplanation: "Il 30% in un asset che può perdere l'80% significa rischiare di perdere il 24% del portafoglio totale. Troppo.\n\n**La regola:**\n- Investi solo ciò che puoi perdere al 100%\n- Un crollo crypto non deve compromettere pensione, emergenze, obiettivi\n- 1-5% è ragionevole per chi vuole esposizione",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "Hai comprato Bitcoin a 60.000€. Ora vale 20.000€ (-67%). I social urlano 'è morto'. Cosa fai?",
        pollAreas: [
          {
            id: "challenge-scenario-23",
            prompt: "Qual è la tua azione?",
            options: [
              "Se l'allocazione era corretta all'inizio, mantengo o ribilancio secondo il piano",
              "Vendo tutto per salvare il salvabile",
              "Compro ancora di più - è un'opportunità",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Se hai fatto un **sizing corretto** dall'inizio, il crollo era già 'accettato' come possibilità. Segui il piano, non le emozioni. Vendere nel panico o comprare per 'mediare' senza criterio sono entrambi errori.",
            wrongExplanation: "Vendere dopo -67% cristallizza la perdita. Comprare senza criterio può peggiorare le cose.\n\n**L'approccio disciplinato:**\n- Se l'allocazione iniziale era prudente, il crollo è gestibile\n- Segui il piano di ribilanciamento, non le emozioni\n- Non prendere decisioni basate sui social",
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
        title: "🧠 Quiz finale: blockchain e Bitcoin",
        content: "Hai imparato cos'è la blockchain, come funziona Bitcoin, i rischi di custodia e il sizing prudente.\n\n**Concetti chiave:**\n- Blockchain: registro decentralizzato, immutabile, trasparente\n- Bitcoin: offerta limitata, scarso come l'oro digitale\n- Not your keys, not your coins: custodia = responsabilità\n- Volatilità estrema: -80% è normale\n- Sizing: 1-5% per esposizione prudente\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Cosa garantisce la blockchain che i sistemi tradizionali non garantiscono?",
        pollAreas: [
          {
            id: "quiz-q1-23",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Transazioni validate senza autorità centrale",
              "Transazioni più veloci",
              "Costi più bassi",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! La **decentralizzazione** è il cuore della blockchain: la rete valida le transazioni tramite consenso, senza bisogno di banche o governi.",
            wrongExplanation: "Velocità e costi non sono i vantaggi principali della blockchain.\n\n**Il vantaggio chiave:** decentralizzazione. Nessuna autorità centrale necessaria per validare e garantire le transazioni.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Quanti Bitcoin esisteranno al massimo?",
        pollAreas: [
          {
            id: "quiz-q2-23",
            prompt: "Seleziona il numero corretto",
            options: [
              "21 milioni",
              "Infiniti - vengono creati continuamente",
              "100 milioni",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **21 milioni** è il limite massimo, scritto nel codice. Questa scarsità programmata è il motivo per cui Bitcoin viene paragonato all'oro.",
            wrongExplanation: "Bitcoin non è inflazionario. L'offerta è limitata a 21 milioni, con emissione che si dimezza ogni 4 anni (halving). Questa scarsità programmata è fondamentale.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Qual è un'allocazione prudente di Bitcoin in un portafoglio diversificato?",
        pollAreas: [
          {
            id: "quiz-q3-23",
            prompt: "Seleziona l'allocazione corretta",
            options: [
              "1-5% - esposizione senza compromettere il portafoglio",
              "20-30% - per catturare i guadagni",
              "50%+ - Bitcoin è il futuro",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **1-5%** è l'allocazione comunemente suggerita per chi vuole esposizione. Se crolla dell'80%, il portafoglio totale perde solo il 1-4%.",
            wrongExplanation: "Allocazioni alte in asset così volatili possono devastare il portafoglio.\n\n**Calcolo:**\n- 30% in BTC che crolla del 80% = -24% sul portafoglio totale\n- 5% in BTC che crolla del 80% = -4% sul portafoglio totale\n\nLa prudenza è fondamentale.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco la blockchain", "Conosco i limiti di Bitcoin", "So dimensionare l'esposizione"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: blockchain e Bitcoin",
        content: "Complimenti! Hai completato la prima lezione sulla crypto.\n\n**Principi chiave:**\n\n1. **Blockchain**: registro decentralizzato che elimina la necessità di intermediari\n2. **Bitcoin**: prima crypto, offerta limitata a 21 milioni, alta volatilità\n3. **Custodia**: 'not your keys, not your coins' - gli exchange possono fallire\n4. **Sizing**: 1-5% per esposizione prudente, mai più di quanto puoi perdere\n5. **Volatilità**: crolli del 70-90% sono storicamente normali\n\nQuesta è solo l'introduzione. Nella prossima lezione esploreremo l'ecosistema oltre Bitcoin: altcoin, token e smart contract.",
      },
      {
        kind: "explain",
        title: "📌 Collegamento con la sezione",
        content: "Questa è la prima lezione della sezione **Asset Alternativi**.\n\nGli asset alternativi (crypto, commodities, real estate) hanno caratteristiche diverse dagli strumenti tradizionali:\n- Spesso meno liquidi\n- Potenzialmente più volatili\n- Possono offrire diversificazione\n- Richiedono competenze specifiche\n\n**Il filo conduttore:**\nIn ogni lezione di questa sezione valuteremo:\n1. Cosa sono e come funzionano\n2. Vantaggi e rischi specifici\n3. Come dimensionare l'esposizione\n4. Se e quando ha senso includerli\n\nL'obiettivo non è 'comprare crypto' ma capire se e come integrarle in modo consapevole.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Quale azione concreta farai dopo questa lezione?",
        pollAreas: [
          {
            id: "feedback-action-23",
            prompt: "Scegli il tuo prossimo passo",
            options: [
              "Approfondisco la custodia: wallet e chiavi private",
              "Verifico quanta esposizione crypto ho già (se ne ho)",
              "Continuo con la prossima lezione sulle altcoin",
            ],
            correctIndex: 0,
            correctExplanation: "Ottima scelta! Capire la **custodia** è fondamentale prima di investire. Un cold wallet ben gestito protegge dai rischi di controparte.",
            wrongExplanation: "Tutte le azioni sono valide!\n\n- Custodia: fondamentale prima di investire\n- Verificare esposizione: buon punto di partenza\n- Continuare il corso: per una visione completa\n\nL'importante è procedere con consapevolezza.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Come scelgo un wallet sicuro per Bitcoin?",
      "Quale exchange è più affidabile in Italia?",
      "Come valuto se ha senso avere crypto nel mio portafoglio?",
    ],
  },
};

const lesson23Definition = createStaticLessonDefinition("23", content);

export default lesson23Definition;
