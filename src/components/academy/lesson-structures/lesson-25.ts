import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 DeFi: finanza senza intermediari",
        content: "**DeFi** (Decentralized Finance) è l'insieme di servizi finanziari costruiti su blockchain, senza banche o intermediari tradizionali.\n\n**Cosa puoi fare con la DeFi:**\n- **Prestare** le tue crypto e guadagnare interessi\n- **Prendere in prestito** usando crypto come collaterale\n- **Scambiare** token senza exchange centralizzati\n- **Fornire liquidità** e guadagnare commissioni\n- **Staking**: bloccare crypto per validare la rete e guadagnare ricompense\n\n**Il punto chiave:** la DeFi elimina gli intermediari, ma non elimina i rischi. Anzi, introduce rischi nuovi e complessi che devi comprendere prima di partecipare.",
      },
      {
        kind: "explain",
        title: "📌 Come funziona: i protocolli principali",
        content: "**I tipi di protocolli DeFi:**\n\n**1. DEX (Decentralized Exchange):**\n- Scambi crypto senza intermediario\n- Esempi: Uniswap, Curve, PancakeSwap\n- Funzionano con 'pool di liquidità'\n\n**2. Lending/Borrowing:**\n- Presta crypto e guadagna interessi\n- Prendi in prestito depositando collaterale\n- Esempi: Aave, Compound\n\n**3. Yield Farming:**\n- Sposti fondi tra protocolli per massimizzare rendimenti\n- Alto rischio, alta complessità\n\n**4. Liquid Staking:**\n- Fai staking ma mantieni liquidità\n- Esempi: Lido, Rocket Pool\n\n**Attenzione:** ogni protocollo ha rischi specifici. 'DeFi' non significa 'sicuro' - significa 'senza intermediario'. Il rischio è tutto tuo.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Cosa significa 'decentralizzato' nella DeFi?",
        pollAreas: [
          {
            id: "concept-verify-25",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Non c'è un'azienda centrale che controlla - il codice esegue le operazioni",
              "È gratis perché non ci sono costi",
              "È garantito dal governo",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Decentralizzato** significa che nessuna azienda controlla il protocollo. Gli smart contract eseguono le operazioni automaticamente. Ma questo significa anche che non c'è supporto clienti se qualcosa va storto.",
            wrongExplanation: "La DeFi non è gratis (ci sono costi di transazione) e non è garantita da nessuno.\n\n**Decentralizzato significa:**\n- Nessuna azienda centrale\n- Smart contract eseguono le operazioni\n- Nessun supporto clienti\n- Se perdi i fondi, nessuno ti aiuta",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Staking: guadagnare validando la rete",
        content: "**Cos'è lo staking:**\nBlocchi le tue crypto per aiutare a validare le transazioni sulla rete. In cambio, ricevi ricompense.\n\n**Come funziona (Proof of Stake):**\n1. Depositi crypto nel protocollo di staking\n2. Le tue crypto vengono usate per validare blocchi\n3. Ricevi ricompense (es. 4-6% annuo su ETH)\n4. Puoi sbloccare dopo un periodo (es. giorni/settimane)\n\n**Tipi di staking:**\n- **Staking nativo**: direttamente sulla blockchain (richiede minimo alto, es. 32 ETH)\n- **Staking delegato**: deleghi a un validatore (minimo basso)\n- **Liquid staking**: ricevi un token che rappresenta lo stake (mantieni liquidità)\n\n**Rendimenti tipici:**\n- Ethereum: 4-5% APY\n- Solana: 6-7% APY\n- Polkadot: 10-14% APY\n\n**Attenzione:** i rendimenti sono in crypto. Se la crypto crolla, puoi perdere nonostante lo staking.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: staking",
        content: "Fai staking di ETH al 5% APY. ETH crolla del 50% nell'anno. Quanto hai alla fine?",
        pollAreas: [
          {
            id: "concept-solve-25",
            prompt: "Qual è il risultato?",
            options: [
              "Meno di quanto avevi - il rendimento non compensa il crollo",
              "Esattamente quanto avevi - il 5% compensa",
              "Di più - lo staking ti protegge dai crolli",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Se ETH crolla del 50% e guadagni 5% in staking, hai comunque perso circa il 45% in valore. **Lo staking non protegge dalla volatilità** - guadagni più crypto, ma se il prezzo crolla, perdi comunque valore.",
            wrongExplanation: "Il 5% non compensa un crollo del 50%.\n\n**Calcolo:**\n- Inizio: 1 ETH a 2.000€ = 2.000€\n- Staking: +0.05 ETH\n- Fine: 1.05 ETH a 1.000€ = 1.050€\n- Perdita: -47.5%\n\nLo staking guadagna crypto, non protegge dal prezzo.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco la DeFi", "So cos'è lo staking", "Riconosco i rischi"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ I rischi della DeFi: smart contract e oltre",
        content: "La DeFi ha rischi specifici che non esistono nella finanza tradizionale:\n\n**1. Rischio smart contract:**\n- Bug nel codice = fondi rubati\n- Esempio: Wormhole hack (320M$), Ronin hack (600M$)\n- Audit non garantiscono sicurezza al 100%\n\n**2. Rischio di liquidazione:**\n- Se il collaterale scende, vieni liquidato\n- Puoi perdere tutto il deposito\n\n**3. Rischio di impermanent loss:**\n- Fornendo liquidità puoi perdere vs holding semplice\n- Complesso da calcolare\n\n**4. Rischio di rug pull:**\n- Il team scappa con i fondi\n- Comune nei protocolli nuovi\n\n**5. Rischio regolatorio:**\n- La DeFi opera in zona grigia\n- Potrebbero arrivare regolamentazioni restrittive",
      },
      {
        kind: "explain",
        title: "📌 Rendimenti DeFi: da dove vengono?",
        content: "Quando vedi APY del 10%, 50%, o 1000%, chiediti: **da dove vengono questi soldi?**\n\n**Fonti legittime di rendimento:**\n- **Staking**: ricompense di validazione (inflazione del token)\n- **Lending**: interessi pagati da chi prende in prestito\n- **Trading fees**: commissioni da chi scambia\n\n**Fonti insostenibili (red flags):**\n- **Emissione di token**: ti pagano in token che stampano\n- **Ponzi**: pagano i vecchi con i soldi dei nuovi\n- **Marketing**: rendimenti alti per attirare liquidità\n\n**La regola:**\nSe il rendimento sembra troppo alto (es. 100% APY), probabilmente:\n1. Il token che ricevi sta perdendo valore\n2. È uno schema insostenibile\n3. C'è un rischio che non stai considerando\n\n**Rendimenti sostenibili realistici:** 3-10% APY",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Un protocollo DeFi offre 200% APY. Qual è la domanda giusta da porsi?",
        pollAreas: [
          {
            id: "widget-verify-25",
            prompt: "Seleziona la domanda corretta",
            options: [
              "Da dove vengono questi rendimenti? È sostenibile?",
              "Come faccio a depositare più soldi possibile?",
              "Posso fidarmi perché ha molti utenti?",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Da dove vengono i rendimenti** è la domanda chiave. 200% APY non è sostenibile a lungo termine - o il token perde valore, o è uno schema Ponzi, o il rischio è altissimo.",
            wrongExplanation: "Molti utenti non significano sicurezza (vedi Terra/Luna).\n\n**La domanda giusta:**\n- Da dove vengono i rendimenti?\n- È sostenibile nel tempo?\n- Qual è il rischio che non sto vedendo?\n\n200% APY = red flag enorme",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Vuoi provare la DeFi con 1.000€. Qual è l'approccio più prudente?",
        pollAreas: [
          {
            id: "widget-scenario-25",
            prompt: "Quale strategia scegli?",
            options: [
              "Liquid staking su ETH con protocollo grande e auditato",
              "Il protocollo con APY più alto disponibile",
              "Yield farming su più protocolli per diversificare",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **Liquid staking su ETH** con protocollo consolidato (es. Lido, Rocket Pool) è l'opzione più semplice e meno rischiosa. APY modesto (4-6%) ma rischio smart contract ridotto.",
            wrongExplanation: "APY alto = rischio alto. Yield farming è complesso e rischioso per chi inizia.\n\n**Per iniziare:**\n- Protocollo grande, auditato, con track record\n- Accetta rendimenti modesti (4-6%)\n- Impara prima di complicare",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco i rischi DeFi", "So valutare i rendimenti", "Ho un approccio prudente"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Casi studio: successi e fallimenti DeFi",
        content: "**Fallimenti spettacolari:**\n\n**Terra/Luna (2022):**\n- Stablecoin algoritmico UST perde il peg\n- Luna crolla da $120 a $0.00001\n- 40 miliardi bruciati in giorni\n- Lezione: 'stablecoin' non significa stabile\n\n**Celsius (2022):**\n- Piattaforma lending 'DeFi-like' centralizzata\n- Prometteva rendimenti insostenibili\n- Fallimento, fondi bloccati per anni\n\n**Protocolli hackerati:**\n- Ronin: 600M$ rubati\n- Wormhole: 320M$\n- Nomad: 190M$\n\n**Successi relativi:**\n- Uniswap: DEX funzionante da anni\n- Aave: lending con track record\n- Lido: liquid staking dominante\n\n**La lezione:** anche i protocolli 'di successo' possono fallire. Usa solo ciò che puoi permetterti di perdere.",
      },
      {
        kind: "explain",
        title: "📌 Checklist sicurezza DeFi",
        content: "Prima di usare QUALSIASI protocollo DeFi:\n\n**1. Verifica il protocollo:**\n- È auditato? (Certora, Trail of Bits, OpenZeppelin)\n- Da quanto tempo esiste?\n- Qual è il TVL (Total Value Locked)?\n- Ha subito hack in passato?\n\n**2. Comprendi i rischi:**\n- Qual è lo scenario peggiore?\n- Cosa succede se il protocollo viene hackerato?\n- C'è rischio di liquidazione?\n\n**3. Limita l'esposizione:**\n- Mai più del 5-10% del portafoglio totale\n- Solo fondi che puoi perdere al 100%\n- Diversifica tra protocolli\n\n**4. Sicurezza operativa:**\n- Usa hardware wallet\n- Verifica sempre gli URL (phishing)\n- Non approvare contratti sconosciuti",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Un protocollo DeFi è 'auditato'. Questo significa che:",
        pollAreas: [
          {
            id: "challenge-verify-25",
            prompt: "Seleziona il significato corretto",
            options: [
              "Il codice è stato revisionato ma non è garantito al 100%",
              "È impossibile che venga hackerato",
              "Il governo lo ha approvato",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Un **audit** significa che esperti hanno revisionato il codice, ma non garantisce sicurezza al 100%. Molti protocolli auditati sono stati comunque hackerati. È un segnale positivo, non una garanzia.",
            wrongExplanation: "L'audit riduce il rischio ma non lo elimina.\n\n**Cosa significa auditato:**\n- Esperti hanno controllato il codice\n- Hanno cercato vulnerabilità note\n- Ma non possono trovare TUTTO\n- Molti hack sono avvenuti su protocolli auditati",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "Hai 10.000€ in crypto. Un amico ti consiglia un protocollo DeFi con 50% APY. Il protocollo esiste da 2 mesi. Cosa fai?",
        pollAreas: [
          {
            id: "challenge-scenario-25",
            prompt: "Quale decisione prendi?",
            options: [
              "Non partecipo - protocollo troppo nuovo, rendimento insostenibile",
              "Metto 5.000€ - l'APY è troppo buono per rifiutare",
              "Metto tutto - in 6 mesi raddoppio i soldi",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **2 mesi di storia + 50% APY = red flags multiple**. Protocolli nuovi sono i più rischiosi per rug pull e hack. Rendimenti così alti sono insostenibili. È il classico scenario 'too good to be true'.",
            wrongExplanation: "50% APY per 6 mesi non esiste nella realtà sostenibile.\n\n**I segnali d'allarme:**\n- 2 mesi: troppo nuovo, nessun track record\n- 50% APY: insostenibile, probabilmente token farming\n- Scenario tipico di rug pull\n\nMeglio perdere l'opportunità che perdere i fondi.",
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
        title: "🧠 Quiz finale: DeFi e staking",
        content: "Hai imparato cos'è la DeFi, come funziona lo staking, i rischi specifici e come valutare i protocolli.\n\n**Concetti chiave:**\n- DeFi: finanza senza intermediari, ma con rischi propri\n- Staking: blocchi crypto, guadagni ricompense (non protegge dal prezzo)\n- Rischi: smart contract, liquidazione, rug pull, rendimenti insostenibili\n- Rendimenti sostenibili: 3-10% APY, non 100%+\n- Checklist: audit, track record, limite esposizione\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Qual è il rischio principale dello staking?",
        pollAreas: [
          {
            id: "quiz-q1-25",
            prompt: "Seleziona il rischio principale",
            options: [
              "Non protegge dal crollo del prezzo della crypto",
              "Richiede troppo tempo",
              "È illegale in Italia",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Lo **staking non protegge dalla volatilità**. Guadagni più crypto, ma se il prezzo crolla perdi comunque valore in euro.",
            wrongExplanation: "Lo staking è legale e non richiede tempo attivo.\n\n**Il rischio principale:**\n- Guadagni crypto, non euro\n- Se la crypto crolla, perdi valore\n- Il rendimento non compensa crolli importanti",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Vedi un protocollo DeFi con 500% APY. Cosa pensi?",
        pollAreas: [
          {
            id: "quiz-q2-25",
            prompt: "Qual è la valutazione corretta?",
            options: [
              "Insostenibile - o il token perde valore o è uno schema Ponzi",
              "Ottima opportunità da cogliere subito",
              "Normale per la DeFi",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **500% APY non è sostenibile**. O stai ricevendo token che perdono valore, o è uno schema che pagherà finché non collassa. I rendimenti realistici sono 3-10%.",
            wrongExplanation: "500% APY non è normale né sostenibile.\n\n**Rendimenti realistici:**\n- Staking: 4-10% APY\n- Lending: 2-8% APY\n- Oltre: probabilmente insostenibile",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Prima di usare un protocollo DeFi, cosa verifichi?",
        pollAreas: [
          {
            id: "quiz-q3-25",
            prompt: "Seleziona la verifica prioritaria",
            options: [
              "Audit, track record, TVL, scenario peggiore",
              "Solo l'APY offerto",
              "Quanti follower ha su Twitter",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Audit, track record, TVL** sono verifiche essenziali. Devi capire i rischi prima di depositare. I follower social non significano sicurezza.",
            wrongExplanation: "L'APY da solo non dice nulla sulla sicurezza. I follower possono essere fake.\n\n**Checklist corretta:**\n- Audit da aziende riconosciute\n- Track record (da quanto tempo esiste)\n- TVL (quanto è depositato)\n- Scenario peggiore (cosa perdi se va male)",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco la DeFi", "So valutare i rendimenti", "Conosco i rischi"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: DeFi e staking",
        content: "Complimenti! Hai completato la lezione sulla finanza decentralizzata.\n\n**Principi chiave:**\n\n1. **DeFi**: servizi finanziari senza intermediari, ma con rischi propri\n2. **Staking**: guadagni crypto, ma non sei protetto dal prezzo\n3. **Rischi specifici**: smart contract, liquidazione, rug pull\n4. **Rendimenti sostenibili**: 3-10% APY, diffida di numeri più alti\n5. **Due diligence**: audit, track record, limite esposizione\n\nLa DeFi è un'area sperimentale con opportunità e rischi. Se decidi di partecipare, fallo con cautela e solo con fondi che puoi permetterti di perdere.",
      },
      {
        kind: "explain",
        title: "📌 Collegamento con la sezione",
        content: "Questa lezione fa parte della sezione **Asset Alternativi**.\n\nAbbiamo visto:\n- Blockchain e Bitcoin (base)\n- Altcoin e token (ecosistema)\n- **DeFi e staking** (applicazioni finanziarie)\n\nProssimi temi della sezione:\n- NFT e tokenizzazione\n- Commodities (oro, materie prime)\n- Real estate e REITs\n\n**Il filo conduttore:**\nGli asset alternativi offrono diversificazione ma richiedono competenze specifiche. Non sono per tutti, e va bene così.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Cosa farai con questa conoscenza?",
        pollAreas: [
          {
            id: "feedback-action-25",
            prompt: "Indica il tuo prossimo passo",
            options: [
              "Per ora osservo - la DeFi è troppo rischiosa per me",
              "Provo liquid staking su ETH con protocollo sicuro",
              "Approfondisco gli NFT nella prossima lezione",
            ],
            correctIndex: 0,
            correctExplanation: "Scelta saggia! **Osservare prima di agire** è l'approccio più prudente. La DeFi non scappa. Meglio capire bene prima di rischiare fondi.",
            wrongExplanation: "Tutte le scelte sono valide!\n\n- Osservare: prudente e saggio\n- Liquid staking: se hai già esperienza crypto\n- Continuare il corso: per visione completa\n\nL'importante è non lanciarsi senza preparazione.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Qual è il protocollo di liquid staking più sicuro?",
      "Come funziona una liquidazione su Aave?",
      "Conviene fare staking diretto o delegato?",
    ],
  },
};

const lesson25Definition = createStaticLessonDefinition("25", content);

export default lesson25Definition;
