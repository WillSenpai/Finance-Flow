import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Oltre Bitcoin: l'ecosistema crypto",
        content: "Bitcoin è stata la prima criptovaluta, ma oggi esistono migliaia di 'altcoin' (alternative coin). Non sono tutte uguali - anzi, la maggior parte non vale nulla.\n\n**Le categorie principali:**\n- **Altcoin**: criptovalute alternative a Bitcoin\n- **Token**: asset digitali costruiti su blockchain esistenti\n- **Stablecoin**: crypto agganciate a valute fiat (USD, EUR)\n- **Meme coin**: senza utilità reale, guidate dalla speculazione\n\n**Il punto chiave:** mentre Bitcoin cerca di essere 'oro digitale', molte altcoin cercano di risolvere problemi specifici o abilitare applicazioni. Ma il 99% fallirà. Distinguere i progetti validi dalla speculazione è fondamentale.",
      },
      {
        kind: "explain",
        title: "📌 Ethereum e gli smart contract",
        content: "**Ethereum** è la seconda crypto per capitalizzazione e la più importante dopo Bitcoin. Ma è fondamentalmente diversa.\n\n**Bitcoin = calcolatrice**\n- Fa una cosa sola: transazioni di valore\n- Semplice, sicuro, limitato\n\n**Ethereum = computer mondiale**\n- Esegue programmi chiamati 'smart contract'\n- Può creare applicazioni decentralizzate (dApp)\n- È una piattaforma, non solo una valuta\n\n**Cos'è uno smart contract:**\nUn programma che si esegue automaticamente quando le condizioni sono soddisfatte.\n\nEsempio: 'Se ricevo 1 ETH da Mario, trasferisci automaticamente la proprietà del NFT a Mario'\n\nNessun intermediario, nessuna banca, nessun notaio. Il codice esegue l'accordo.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Qual è la differenza principale tra Bitcoin ed Ethereum?",
        pollAreas: [
          {
            id: "concept-verify-24",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Bitcoin trasferisce valore; Ethereum esegue programmi (smart contract)",
              "Bitcoin è più vecchio ma funzionano allo stesso modo",
              "Ethereum è più veloce, per il resto sono uguali",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Bitcoin** è progettato per trasferire valore in modo sicuro. **Ethereum** è una piattaforma programmabile che può eseguire smart contract e ospitare applicazioni decentralizzate.",
            wrongExplanation: "Non è solo questione di età o velocità.\n\n**La differenza fondamentale:**\n- Bitcoin: trasferimento di valore (oro digitale)\n- Ethereum: piattaforma programmabile (computer mondiale)\n\nEthereum può fare ciò che fa Bitcoin, ma anche molto di più.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Token: la differenza con le coin",
        content: "**Coin vs Token - confusione comune:**\n\n**Coin (moneta nativa):**\n- Ha la propria blockchain\n- Esempi: BTC, ETH, SOL, ADA\n- Serve a pagare le transazioni sulla sua rete\n\n**Token:**\n- Costruito su una blockchain esistente\n- Esempio: USDC, UNI, LINK (su Ethereum)\n- Può rappresentare qualsiasi cosa\n\n**Cosa possono rappresentare i token:**\n- **Utility token**: accesso a servizi (es. Filecoin per storage)\n- **Governance token**: diritti di voto (es. UNI per Uniswap)\n- **Security token**: quote di asset reali (tokenizzazione)\n- **Stablecoin**: valore ancorato a fiat (USDC, USDT)\n- **NFT**: oggetti digitali unici (arte, collezionabili)\n\n**Attenzione:** la maggior parte dei token non ha valore reale. Molti sono truffe o progetti falliti.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: token",
        content: "Un token costruito su Ethereum che ti dà diritto di voto sulle decisioni di un protocollo DeFi è un:",
        pollAreas: [
          {
            id: "concept-solve-24",
            prompt: "Che tipo di token è?",
            options: [
              "Governance token",
              "Security token",
              "Stablecoin",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! I **governance token** danno diritto di voto sulle decisioni del protocollo. Esempi: UNI (Uniswap), AAVE, CRV (Curve). È una forma di 'democrazia digitale' decentralizzata.",
            wrongExplanation: "Security token rappresentano quote di asset reali. Stablecoin sono ancorate a valute fiat.\n\n**Governance token:**\n- Danno diritto di voto\n- Influenzano le decisioni del protocollo\n- Esempi: UNI, AAVE, MKR",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco coin vs token", "So cosa sono gli smart contract", "Riconosco le categorie"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Valutare un progetto crypto: red flags",
        content: "Il 99% dei progetti crypto fallisce o è una truffa. Come riconoscere i segnali d'allarme?\n\n**Red flags immediate:**\n- **Promesse di rendimenti garantiti**: impossibile nel crypto\n- **Team anonimo**: chi c'è dietro?\n- **Whitepaper vago**: se non spiega cosa fa, non lo sa nemmeno chi l'ha scritto\n- **Tokenomics sospette**: team che possiede 50%+ dei token\n- **Marketing aggressivo**: più hype che sostanza\n- **'Approvato da Elon/celebrity'**: quasi sempre falso\n\n**Domande da porsi:**\n1. Quale problema risolve? (Se nessuno, scappa)\n2. Perché serve una blockchain? (Spesso non serve)\n3. Chi è il team? (Esperienza verificabile)\n4. Qual è il modello di business? (Come genera valore)\n5. Chi sono i competitor? (Se nessuno, perché?)",
      },
      {
        kind: "explain",
        title: "📌 Le principali altcoin serie",
        content: "Alcune altcoin hanno uso reale e team verificabili:\n\n**Ethereum (ETH):**\n- Piattaforma smart contract dominante\n- Passata a Proof of Stake nel 2022\n- La maggior parte della DeFi gira su Ethereum\n\n**Solana (SOL):**\n- Alta velocità, basse commissioni\n- Competitor di Ethereum\n- Ha avuto problemi di stabilità\n\n**Chainlink (LINK):**\n- 'Oracle' che porta dati reali nella blockchain\n- Usato da molti protocolli DeFi\n- Utility reale e verificabile\n\n**Polygon (MATIC):**\n- Layer 2 per Ethereum\n- Riduce costi e aumenta velocità\n- Partnerships con aziende mainstream\n\n**Nota:** 'serio' non significa 'sicuro'. Anche questi possono crollare dell'80%.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Un progetto crypto promette '100% rendimento garantito in 30 giorni'. Cosa fai?",
        pollAreas: [
          {
            id: "widget-verify-24",
            prompt: "Qual è la reazione corretta?",
            options: [
              "Red flag immediata - è quasi certamente una truffa",
              "Verifico se il team è affidabile",
              "Investo poco per vedere se è vero",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Rendimenti garantiti nel crypto non esistono**. È la red flag più chiara di una truffa (schema Ponzi, rug pull, scam). Non c'è bisogno di verificare altro - evita.",
            wrongExplanation: "Non 'investire poco per vedere'. Anche 100€ persi sono 100€ regalati a truffatori.\n\n**La regola:**\n- Rendimenti garantiti = truffa\n- Nessuna eccezione\n- Nel crypto niente è garantito, nemmeno sopravvivere",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Un amico ti parla di una nuova crypto 'che farà 100x'. Il team è anonimo ma 'il codice è open source'. Investi?",
        pollAreas: [
          {
            id: "widget-scenario-24",
            prompt: "Cosa fai?",
            options: [
              "No - team anonimo e promesse di 100x sono red flags",
              "Sì - il codice open source è garanzia di trasparenza",
              "Investo poco - se fa 100x recupero comunque",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **Team anonimo + promesse di rendimenti astronomici = scappa**. Il codice open source non significa che il progetto sia legittimo - può essere copiato o avere backdoor. Le red flags superano qualsiasi 'garanzia'.",
            wrongExplanation: "Il codice open source non protegge da truffe. Può essere:\n- Copiato da progetti legittimi\n- Contenere backdoor nascoste\n- Modificato dopo il lancio\n\n**Team anonimo + promesse eccessive = evita sempre**",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Riconosco le red flags", "So valutare i progetti", "Capisco le altcoin serie"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Il rischio delle altcoin: dati reali",
        content: "Le altcoin sono ancora più volatili di Bitcoin. E molte vanno a zero.\n\n**Statistiche storiche:**\n- Il 92% delle crypto del 2014 non esiste più\n- Il 99% delle ICO del 2017 ha perso valore\n- Molte altcoin top-20 di ogni bull market non tornano mai ai massimi\n\n**Esempi di crolli definitivi:**\n- Luna/UST (2022): da $120 a $0.00001 in una settimana\n- FTT (2022): token di FTX, crollato con l'exchange\n- Bitconnect (2018): schema Ponzi, -99%\n\n**Esempi di crolli temporanei:**\n- Ethereum: -94% nel 2018, poi nuovi massimi\n- Solana: -96% nel 2022, poi parziale recupero\n\n**La lezione:** anche le altcoin 'serie' possono crollare del 90%+. E molte non recuperano mai. Mai allocare più di quanto puoi perdere al 100%.",
      },
      {
        kind: "explain",
        title: "📌 Diversificazione nel crypto: ha senso?",
        content: "Diversificare nel crypto non funziona come negli asset tradizionali.\n\n**Il problema:**\n- Le altcoin sono spesso correlate a Bitcoin\n- Quando BTC crolla, le altcoin crollano di più\n- Non c'è vera diversificazione del rischio\n\n**Approcci possibili:**\n\n**1. Solo Bitcoin (BTC maximalist):**\n- Il più semplice e meno rischioso nel crypto\n- Lindy effect: più a lungo sopravvive, più probabilmente continuerà\n\n**2. BTC + ETH (blue chip crypto):**\n- Le due crypto più capitalizzate e 'provate'\n- Es: 70% BTC, 30% ETH\n\n**3. Diversificato (più rischioso):**\n- BTC, ETH, + 2-3 altcoin con uso reale\n- Rischio di perdere tutto sulle altcoin\n\n**Il principio:** più ti allontani da BTC, più aumenta il rischio. Non diversifichi il rischio crypto comprando 10 altcoin - lo moltiplichi.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Perché diversificare comprando molte altcoin non riduce il rischio?",
        pollAreas: [
          {
            id: "challenge-verify-24",
            prompt: "Seleziona il motivo corretto",
            options: [
              "Le altcoin sono correlate - crollano tutte insieme quando BTC crolla",
              "Le altcoin costano troppo da comprare insieme",
              "È illegale possedere troppe crypto diverse",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Le **altcoin sono fortemente correlate** a Bitcoin. Quando BTC crolla, le altcoin crollano ancora di più. Comprare 10 altcoin non diversifica - moltiplica il rischio.",
            wrongExplanation: "Non c'è limite legale o di costo.\n\n**Il problema:**\n- Alta correlazione: BTC giù = altcoin giù (più forte)\n- Le altcoin aggiungono rischio specifico (fallimento, hack)\n- Non c'è vera diversificazione del rischio",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "Vuoi esposizione crypto nel tuo portafoglio. Budget: 5.000€. Quale approccio è più prudente?",
        pollAreas: [
          {
            id: "challenge-scenario-24",
            prompt: "Quale allocazione scegli?",
            options: [
              "80% BTC, 20% ETH - le due crypto più consolidate",
              "20% ciascuno su 5 altcoin diverse per diversificare",
              "100% sulla nuova altcoin che sta pompando",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **BTC + ETH** sono le crypto più consolidate con track record più lungo. Concentrarsi sulle più solide riduce (relativamente) il rischio rispetto a sparpagliare su altcoin o inseguire 'la nuova cosa'.",
            wrongExplanation: "Diversificare su 5 altcoin moltiplica il rischio. Inseguire altcoin in pump è pura speculazione.\n\n**L'approccio prudente:**\n- Concentra su BTC + ETH (più consolidate)\n- Se vuoi altcoin, massimo 10-20% del budget crypto\n- Mai inseguire i pump",
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
        title: "🧠 Quiz finale: altcoin e token",
        content: "Hai imparato la differenza tra coin e token, cos'è Ethereum, come valutare progetti, e i rischi delle altcoin.\n\n**Concetti chiave:**\n- Ethereum: piattaforma smart contract, non solo valuta\n- Token vs Coin: token sono costruiti su blockchain esistenti\n- Red flags: rendimenti garantiti, team anonimo, hype eccessivo\n- 99% delle altcoin fallisce o è truffa\n- Diversificare in crypto = moltiplicare il rischio\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Uno smart contract è:",
        pollAreas: [
          {
            id: "quiz-q1-24",
            prompt: "Seleziona la definizione corretta",
            options: [
              "Un programma che si esegue automaticamente quando le condizioni sono soddisfatte",
              "Un contratto legale firmato digitalmente",
              "Un accordo tra due exchange",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Uno **smart contract** è codice che si esegue automaticamente. 'Se succede X, allora fai Y' - senza intermediari, senza possibilità di modifica.",
            wrongExplanation: "Non è un contratto legale nel senso tradizionale.\n\n**Smart contract:**\n- È un programma\n- Gira sulla blockchain\n- Si esegue automaticamente\n- Non richiede intermediari",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Quale red flag indica quasi certamente una truffa crypto?",
        pollAreas: [
          {
            id: "quiz-q2-24",
            prompt: "Seleziona la red flag più grave",
            options: [
              "Rendimenti garantiti ('100% in 30 giorni')",
              "Team con profili LinkedIn",
              "Whitepaper di 50 pagine",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **Rendimenti garantiti nel crypto non esistono**. Chiunque li prometta sta gestendo una truffa (Ponzi, rug pull). È la red flag più chiara.",
            wrongExplanation: "Team con LinkedIn e whitepaper lungo possono essere positivi (non garanzia).\n\n**La red flag suprema:**\n- Rendimenti garantiti = truffa al 100%\n- Nel crypto niente è garantito\n- Se sembra troppo bello, lo è",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Qual è l'approccio più prudente per esposizione crypto?",
        pollAreas: [
          {
            id: "quiz-q3-24",
            prompt: "Seleziona l'approccio corretto",
            options: [
              "Concentrarsi su BTC + ETH, limitare le altcoin",
              "Comprare 10+ altcoin per diversificare",
              "Solo meme coin - rendimenti più alti",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **BTC + ETH** sono le più consolidate. Diversificare su molte altcoin non riduce il rischio, lo aumenta. Meme coin sono pura speculazione.",
            wrongExplanation: "Diversificare su altcoin moltiplica il rischio (alta correlazione + rischio specifico).\n\n**Approccio prudente:**\n- Core: BTC + ETH\n- Se vuoi altcoin: piccola % su progetti con uso reale\n- Evita meme coin (speculazione pura)",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco coin vs token", "So riconoscere truffe", "Ho un approccio prudente"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: altcoin e token",
        content: "Complimenti! Hai completato la lezione sull'ecosistema crypto oltre Bitcoin.\n\n**Principi chiave:**\n\n1. **Ethereum**: piattaforma programmabile, smart contract, base della DeFi\n2. **Token vs Coin**: i token sono costruiti su blockchain esistenti\n3. **Red flags**: rendimenti garantiti, team anonimo, hype > sostanza\n4. **Rischio altcoin**: 99% fallisce, anche le 'serie' possono perdere 90%+\n5. **Diversificazione crypto**: non funziona come negli asset tradizionali\n\nNella prossima lezione esploreremo la DeFi e lo staking: rendimenti possibili, ma anche rischi significativi.",
      },
      {
        kind: "explain",
        title: "📌 Riepilogo pratico",
        content: "Come applicare questa conoscenza:\n\n**Se vuoi esposizione crypto:**\n- Inizia da BTC + ETH (le più consolidate)\n- Massimo 1-5% del portafoglio totale\n- Solo exchange regolamentati\n\n**Per le altcoin:**\n- Solo dopo aver capito bene BTC/ETH\n- Massimo 10-20% del budget crypto\n- Solo progetti con uso reale verificabile\n\n**Red flags da evitare sempre:**\n- Rendimenti garantiti\n- Team anonimo + promesse astronomiche\n- 'Nuova crypto che farà 1000x'\n- Consigli da sconosciuti su Telegram/Discord\n\n**La regola d'oro:**\nSe non capisci come un progetto genera valore, non investire.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Cosa farai con questa conoscenza?",
        pollAreas: [
          {
            id: "feedback-action-24",
            prompt: "Indica il tuo prossimo passo",
            options: [
              "Verifico se eventuali crypto che ho sono legittime",
              "Approfondisco Ethereum e gli smart contract",
              "Continuo con la lezione sulla DeFi",
            ],
            correctIndex: 0,
            correctExplanation: "Ottima scelta! **Verificare** le crypto che hai è il primo passo. Usa le red flags che hai imparato. Se qualcosa non convince, considera di uscire.",
            wrongExplanation: "Tutte le azioni sono valide!\n\n- Verificare le posizioni esistenti: priorità se hai già crypto\n- Approfondire Ethereum: base per capire DeFi\n- Continuare il corso: per visione completa\n\nL'importante è agire con consapevolezza.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Come verifico se un progetto crypto è legittimo?",
      "Qual è la differenza tra Ethereum e Solana?",
      "Ha senso comprare altcoin nel mio caso?",
    ],
  },
};

const lesson24Definition = createStaticLessonDefinition("24", content);

export default lesson24Definition;
