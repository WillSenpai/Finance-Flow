import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Cos'è davvero investire?",
        content: "Nelle lezioni precedenti hai costruito le fondamenta: budget, risparmio automatico, gestione dei debiti. Ora sei pronto per il passo successivo: **investire**.\n\nMa cosa significa davvero?\n\nInvestire è **comprare tempo**: rinunci a consumare i tuoi soldi oggi per avere di più in futuro. È l'opposto del debito per consumo: invece di pagare interessi, li ricevi (o li fai crescere tramite rendimento).\n\n**La differenza chiave** rispetto al semplice risparmio:\n• Risparmiare = mettere da parte (il valore resta più o meno uguale)\n• Investire = far lavorare i soldi (il valore può crescere nel tempo)\n\nQuesto comporta anche rischi, che vedremo nelle prossime lezioni. Per ora, il concetto base: l'investimento è un ponte tra il presente e i tuoi obiettivi futuri.",
      },
      {
        kind: "explain",
        title: "📌 Le tre domande da farti PRIMA di investire",
        content: "Prima di scegliere qualsiasi strumento di investimento (azioni, fondi, ETF...), devi rispondere a tre domande fondamentali:\n\n**1. Per cosa investi?**\nL'obiettivo deve essere concreto: anticipo casa, pensione integrativa, università dei figli. Come hai imparato nella lezione sul risparmio, gli obiettivi vaghi non funzionano.\n\n**2. Per quanto tempo?**\nL'orizzonte temporale cambia tutto. Con 20 anni davanti puoi accettare più oscillazioni. Con 3 anni, devi essere più prudente.\n\n**3. Con quale oscillazione puoi convivere?**\nQuesto è il 'rischio' in termini pratici: quanto sei disposto a vedere il tuo capitale scendere temporaneamente senza farti prendere dal panico?\n\nQueste tre domande vengono PRIMA dello strumento. Come diceva un grande investitore: 'Lo strumento deve servire l'obiettivo, non viceversa'.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Perché obiettivo e orizzonte vengono prima dello strumento?",
        pollAreas: [
          {
            id: "concept-verify-4",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Lo strumento deve servire l'obiettivo, non viceversa",
              "Lo strumento è sempre la prima scelta",
              "L'orizzonte non conta",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Perché serve un obiettivo chiaro",
        content: "Nella lezione sul risparmio hai visto che 'voglio risparmiare' non funziona, mentre 'voglio 3.000€ entro dicembre' sì. Lo stesso principio vale per gli investimenti, amplificato.\n\n**Un obiettivo vago genera:**\n• Decisioni impulsive ('questo titolo sembra interessante')\n• Cambi di strategia continui\n• Impossibilità di misurare i progressi\n\n**Un obiettivo numerico con data genera:**\n• Un piano concreto ('devo accumulare X entro il 2030')\n• Coerenza nelle scelte\n• Capacità di valutare se sei in linea\n\n**Esempio pratico:**\n• ❌ 'Voglio investire per il futuro'\n• ✅ 'Voglio accumulare 50.000€ per l'anticipo casa entro 8 anni = circa 520€/mese'\n\nIl secondo obiettivo ti dice esattamente cosa fare ogni mese.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: piano di investimento",
        content:
          "Obiettivo: anticipo casa in 8 anni\n\nCapitale iniziale: 2.000€\nVersamento: 180€/mese\n\nDevi scegliere l'approccio corretto.",
        pollAreas: [
          {
            id: "concept-solve-4",
            prompt: "Qual è l'elemento chiave del piano?",
            options: [
              "Orizzonte medio-lungo coerente con l'obiettivo",
              "Scegliere sempre l'investimento più rischioso",
              "Cambiare strategia ogni mese",
            ],
            allowText: false,
          },
        ],
      },
    ],
    options: ["Definisco obiettivo", "Definisco orizzonte", "Definisco contributo"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Il metodo operativo: regole che battono le previsioni",
        content: "Molti pensano che per investire bene serva 'indovinare' il momento giusto: comprare quando il mercato è basso, vendere quando è alto. Spoiler: nessuno ci riesce in modo consistente, nemmeno i professionisti.\n\n**La buona notizia**: non serve prevedere nulla.\n\nUna **regola operativa semplice** batte qualsiasi tentativo di previsione perfetta. È lo stesso principio del risparmio automatico: l'automatismo elimina l'emotività.\n\nIl metodo che funziona:\n• Decidi IN ANTICIPO quanto investire ogni mese\n• Decidi IN ANTICIPO come allocare (es. 70% azionario, 30% obbligazionario)\n• Esegui il piano senza cercare di 'fare il timing'\n\nQuesto approccio si chiama 'Dollar Cost Averaging' o Piano di Accumulo (PAC). Ne parleremo approfonditamente nelle lezioni avanzate.",
      },
      {
        kind: "explain",
        title: "📌 Un sistema semplice e replicabile",
        content: "Come il tuo sistema di risparmio automatico, anche l'investimento funziona meglio con poche regole stabili:\n\n**1. Contributo periodico**: stessa cifra ogni mese (es. 150€), come il bonifico automatico per il risparmio.\n\n**2. Data fissa**: sempre lo stesso giorno del mese, per eliminare la tentazione di 'aspettare il momento giusto'.\n\n**3. Revisione trimestrale**: ogni 3 mesi controlli se sei in linea con l'obiettivo, se l'allocazione è ancora corretta, se la tua situazione è cambiata.\n\nQuesto sistema è:\n• **Semplice**: non richiede analisi complesse\n• **Replicabile**: funziona ogni mese allo stesso modo\n• **Meno emotivo**: le decisioni sono già prese, devi solo eseguire\n\nRicorda: le emozioni sono il nemico numero uno dell'investitore. Un sistema automatico ti protegge da te stesso.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Quale errore evita un piano automatico rispetto all'investimento occasionale?",
        pollAreas: [
          {
            id: "widget-verify-4",
            prompt: "Seleziona l'errore evitato",
            options: [
              "Tentare di indovinare il momento giusto",
              "Investire troppo poco",
              "Non avere un conto dedicato",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica: mercato in calo",
        content:
          "Versi 120€/mese da 6 mesi.\n\nIl mercato scende del 12%.\n\nIl tuo obiettivo resta a 10 anni.",
        pollAreas: [
          {
            id: "widget-scenario-4",
            prompt: "Qual è la mossa corretta?",
            options: [
              "Continuare il piano se obiettivo e orizzonte non cambiano",
              "Vendere tutto per fermare la perdita",
              "Smettere di investire fino a quando risale",
            ],
            allowText: false,
          },
        ],
      },
    ],
    options: ["Contributo periodico", "Regola anti-panico", "Check trimestrale"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Il momento critico: quando il mercato scende",
        content: "Hai impostato il tuo piano, tutto procede bene... e poi il mercato scende del 15%. Le notizie sono negative, tutti parlano di crisi, il tuo portafoglio è in rosso.\n\nQuesto è il momento critico. Non perché la situazione sia necessariamente grave, ma perché **senti l'urgenza di fare qualcosa** - e quel 'qualcosa' è spesso vendere nel momento peggiore.\n\n**Il paradosso**: il momento in cui senti più forte l'urgenza di uscire è spesso il momento peggiore per farlo.\n\nÈ lo stesso meccanismo del panico che abbiamo visto nella lezione sul budget: le decisioni prese sotto stress emotivo sono quasi sempre sbagliate.\n\nLa soluzione? Un protocollo definito IN ANTICIPO, quando sei lucido e razionale.",
      },
      {
        kind: "explain",
        title: "📌 Il protocollo anti-panico: decidere prima",
        content: "Come nella lezione sul risparmio hai definito una 'versione B' per i mesi difficili, negli investimenti ti serve un **protocollo scritto** per i momenti di stress.\n\n**Il protocollo risponde a tre domande:**\n\n**1. Cosa fai quando il mercato scende?**\nEs: 'Se il mercato scende oltre il 10%, verifico se la mia situazione personale è cambiata. Se no, continuo il piano.'\n\n**2. Cosa NON fai mai?**\nEs: 'Non vendo mai in preda al panico. Aspetto sempre 48 ore prima di qualsiasi decisione non pianificata.'\n\n**3. Quando rivaluti il piano?**\nEs: 'Rivaluto SOLO se cambiano i miei obiettivi, il mio orizzonte temporale, o la mia situazione finanziaria. Non perché il mercato è sceso.'\n\nScrivilo e salvalo dove puoi ritrovarlo. Nei momenti di panico, leggerlo ti riporterà alla razionalità.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Quale criterio oggettivo usi prima di modificare il piano?",
        pollAreas: [
          {
            id: "challenge-verify-4",
            prompt: "Seleziona il criterio chiave",
            options: [
              "Cambiamento nella mia situazione personale",
              "Notizie sui social media",
              "Consiglio di un amico",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🛡️ Il filtro razionale: tre verifiche prima di agire",
        content: "Quando senti l'urgenza di 'fare qualcosa' con i tuoi investimenti, fermati e fai tre verifiche oggettive:\n\n**1. Distanza dall'obiettivo**: a che punto sei? Se sei a metà strada per la casa e mancano ancora 5 anni, una discesa temporanea è meno rilevante.\n\n**2. Orizzonte residuo**: quanto tempo ti resta? Se l'obiettivo è tra 15 anni, un ribasso oggi non dovrebbe cambiarti il piano.\n\n**3. Liquidità extra**: hai il fondo emergenza intatto? Le tue spese essenziali sono coperte? Se sì, non hai BISOGNO di toccare gli investimenti.\n\nSe tutte e tre le verifiche danno esito positivo (sei in linea, hai tempo, hai liquidità), la risposta corretta è quasi sempre: **continua il piano**.\n\nQuesto filtro ti protegge dalle decisioni emotive, esattamente come le regole del budget ti proteggono dagli acquisti impulsivi.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: portafoglio in perdita",
        content:
          "Il tuo portafoglio è sceso del 18% in 4 mesi.\n\nL'obiettivo resta a 8 anni.\n\nLa tua situazione personale non è cambiata.",
        pollAreas: [
          {
            id: "challenge-scenario-4",
            prompt: "Cosa devi verificare prima di agire?",
            options: [
              "Distanza dall'obiettivo e liquidità personale",
              "Le previsioni degli analisti sui social",
              "I consigli degli amici che investono",
            ],
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
        title: "🧠 Quiz finale: investire con processo, non con emozione",
        content: "Hai imparato i fondamenti dell'investimento: definire obiettivi chiari, costruire un sistema replicabile, avere un protocollo per i momenti difficili.\n\nOra mettiamo tutto insieme con un quiz pratico. Le domande simulano situazioni reali che ogni investitore affronta.\n\n**Ricorda i principi chiave:**\n• Le tre domande (per cosa, per quanto tempo, quale oscillazione)\n• Regola operativa > previsione perfetta\n• Protocollo anti-panico definito in anticipo\n• Filtro razionale: distanza, orizzonte, liquidità\n\nApplica il metodo, non l'istinto. Nelle prossime lezioni approfondirai rischio, rendimento e strumenti specifici.",
      },
      {
        kind: "explain",
        title: "📌 Come rispondere: coerenza e orizzonte",
        content: "Quando rispondi alle domande sugli investimenti, cerca sempre l'opzione che **protegge insieme due elementi**:\n\n**1. Coerenza con il piano**\nLa scelta mantiene il piano originale o lo tradisce? Cambiare strategia ogni volta che il mercato si muove non è coerenza, è reazione emotiva.\n\n**2. Rispetto dell'orizzonte temporale**\nSe hai un obiettivo a 10 anni, una decisione basata su cosa è successo questa settimana non ha senso. L'orizzonte deve guidare le scelte.\n\nQuesto approccio è lo stesso del budget e del risparmio: le regole definite in anticipo battono le decisioni prese sotto pressione emotiva.\n\nNelle prossime lezioni su rischio e rendimento vedrai come questi principi si applicano alla costruzione del portafoglio.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Il mercato scende ma il tuo obiettivo resta a 10 anni. Cosa è più coerente?",
        pollAreas: [
          {
            id: "quiz-q1-4",
            prompt: "Scelta migliore",
            options: [
              "Mantenere il piano e monitorare con cadenza definita",
              "Vendere tutto per bloccare la perdita",
              "Smettere di investire senza una data di ripresa",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Obiettivo 90.000€ in 15 anni, contributo 250€/mese. Dopo 1 anno vuoi dimezzare per paura. Qual è l'errore?",
        pollAreas: [
          {
            id: "quiz-q2-4",
            prompt: "Qual è l'errore più grave?",
            options: [
              "Cambiare piano senza valutare impatto sull'obiettivo",
              "Ridurre leggermente il contributo in modo pianificato",
              "Fare review trimestrale con criteri chiari",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica: modifica del piano",
        content:
          "Vuoi ridurre il contributo mensile da 250€ a 125€ per paura.\n\nL'obiettivo è 90.000€ in 15 anni.",
        pollAreas: [
          {
            id: "quiz-scenario-4",
            prompt: "Qual è l'errore principale in questa situazione?",
            options: [
              "Cambiare piano senza valutare l'impatto sull'obiettivo",
              "Fare una review con criteri oggettivi",
              "Cercare un'alternativa sostenibile come 200€/mese",
            ],
            allowText: false,
          },
        ],
      },
    ],
    options: ["Confermo il processo", "Misuro l'impatto", "Aggiorno solo con criterio"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: le basi dell'investimento",
        content: "Complimenti! Hai completato la lezione introduttiva sugli investimenti. Vediamo il percorso che hai fatto:\n\n**Nelle lezioni precedenti** hai costruito:\n• Budget per controllare dove vanno i soldi\n• Risparmio automatico per accumulare costantemente\n• Gestione debiti per liberare risorse\n\n**In questa lezione** hai aggiunto:\n• Le tre domande fondamentali (obiettivo, tempo, oscillazione)\n• Il sistema operativo (contributo, data, revisione)\n• Il protocollo anti-panico\n\n**Il principio chiave**: investire bene non significa prevedere il mercato o trovare l'affare del secolo. Significa **gestire il proprio comportamento** con regole definite in anticipo.",
      },
      {
        kind: "explain",
        title: "📌 La vera competenza dell'investitore",
        content: "Sai qual è la differenza tra un investitore che ottiene risultati e uno che fallisce? Non è l'intelligenza, non è l'informazione, non è la fortuna.\n\n**La vera competenza è restare nel piano quando è scomodo.**\n\nQuando il mercato scende e tutti vendono, l'investitore disciplinato continua il piano. Quando il mercato sale e tutti comprano a prezzi alti, l'investitore disciplinato continua il piano.\n\nQuesto richiede:\n• Regole chiare definite in anticipo\n• Un sistema automatico che funziona senza decisioni emotive\n• La capacità di distinguere tra rumore di breve termine e segnali reali\n\nNelle prossime lezioni approfondirai rischio e rendimento, diversificazione, e gli strumenti specifici (azioni, obbligazioni, fondi, ETF). Ma ricorda: gli strumenti sono secondari. Il comportamento viene prima.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo protocollo",
        content: "Quale regola userai per non agire di impulso?",
        pollAreas: [
          {
            id: "feedback-rule-4",
            prompt: "Seleziona la tua regola",
            options: [
              "Pausa 48h prima di qualsiasi modifica",
              "Review solo a date fisse",
              "Confronto con il mio obiettivo originale",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica finale: protocollo anti-panico",
        content:
          "Per evitare decisioni impulsive hai bisogno di un protocollo definito in anticipo.",
        pollAreas: [
          {
            id: "feedback-protocollo-4",
            prompt: "Quali sono i tre elementi del protocollo?",
            options: [
              "Trigger + verifica + azione definita",
              "Solo aspettare che passi la paura",
              "Chiedere consigli a chi ha panico come te",
            ],
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Dammi un piano investimento semplice per iniziare",
      "Come evito decisioni emotive nei ribassi?",
      "Quali metriche devo monitorare ogni trimestre?",
    ],
  },
};

const lesson4Definition = createStaticLessonDefinition("4", content);

export default lesson4Definition;
