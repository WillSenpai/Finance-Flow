import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "Cos'e il Dollar Cost Averaging (DCA)?",
        content:
          "Il **Dollar Cost Averaging** (DCA), in Italia noto come **PAC** (Piano di Accumulo del Capitale), e una strategia di investimento che consiste nell'**investire somme fisse a intervalli regolari**, indipendentemente dal prezzo di mercato.\n\n**L'idea di base:**\nInvece di investire tutto in una volta (lump sum), dividi l'investimento nel tempo.\n\n**Esempio:**\nHai 12.000 euro da investire.\n- Lump sum: investi tutti i 12.000 euro oggi\n- DCA/PAC: investi 1.000 euro ogni mese per 12 mesi\n\n**Perche funziona:**\nQuando i prezzi sono alti, compri meno quote. Quando i prezzi sono bassi, compri piu quote. Nel tempo, il tuo **prezzo medio di acquisto** si livella, riducendo l'impatto delle oscillazioni di mercato.",
      },
      {
        kind: "explain",
        title: "Il problema del market timing",
        content:
          "Il DCA nasce per risolvere un problema fondamentale: **nessuno sa quando e il momento giusto per investire**.\n\n**La trappola del timing:**\n- Se aspetti il 'momento perfetto', potresti non investire mai\n- Se investi tutto nel momento sbagliato, subisci perdite immediate importanti\n- Lo stress del timing erode i rendimenti e la serenita\n\n**Studi accademici dimostrano che:**\n- E impossibile battere il mercato con il timing in modo consistente\n- Anche i professionisti sbagliano regolarmente le previsioni\n- Rimanere fuori dal mercato aspettando il ribasso costa piu che entrare 'male'\n\n**Il DCA elimina il problema del timing:**\nNon cerchi il momento perfetto. Investi sempre, a prescindere. La media matematica lavora per te.",
      },
      {
        kind: "question",
        title: "Verifica veloce",
        content: "Qual e il problema principale che il DCA risolve?",
        pollAreas: [
          {
            id: "concept-verify-36",
            prompt: "Seleziona la risposta corretta",
            options: [
              "L'impossibilita di prevedere il momento giusto per investire",
              "La scelta del singolo titolo migliore",
              "Il calcolo delle tasse sugli investimenti",
            ],
            correctIndex: 0,
            correctExplanation:
              "Esatto! Il DCA elimina lo stress del market timing investendo regolarmente indipendentemente dalle condizioni di mercato.",
            wrongExplanation:
              "Il DCA risolve il problema del timing: invece di cercare il momento perfetto (impossibile da prevedere), investi costantemente nel tempo.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "La matematica del DCA: il prezzo medio",
        content:
          "Come funziona concretamente la media matematica nel DCA?\n\n**Esempio pratico:**\nInvesti 100 euro al mese per 4 mesi.\n\n| Mese | Prezzo quota | Quote acquistate |\n|------|--------------|------------------|\n| 1 | 10 euro | 10 quote |\n| 2 | 8 euro | 12,5 quote |\n| 3 | 5 euro | 20 quote |\n| 4 | 10 euro | 10 quote |\n\n**Totale:** 400 euro investiti, 52,5 quote acquistate\n**Prezzo medio:** 400 / 52,5 = **7,62 euro** per quota\n\n**Osservazione chiave:**\nIl prezzo medio (7,62 euro) e **inferiore alla media aritmetica** dei prezzi (8,25 euro).\n\nPerche? Perche hai comprato **piu quote quando il prezzo era basso**. Questa e la magia matematica del DCA.",
      },
      {
        kind: "question",
        title: "Verifica: calcolo DCA",
        content:
          "Investi 200 euro al mese. Mese 1: prezzo 20 euro (10 quote). Mese 2: prezzo 10 euro (20 quote). Qual e il tuo prezzo medio di acquisto?",
        pollAreas: [
          {
            id: "concept-solve-36",
            prompt: "Calcola il prezzo medio",
            options: [
              "13,33 euro (400 euro / 30 quote)",
              "15 euro (media di 20 e 10)",
              "20 euro",
            ],
            correctIndex: 0,
            correctExplanation:
              "Corretto! 400 euro / 30 quote = 13,33 euro. Nota che e inferiore alla media aritmetica dei prezzi (15 euro).",
            wrongExplanation:
              "Il prezzo medio di acquisto e il totale investito diviso le quote totali: 400 euro / 30 quote = 13,33 euro. E inferiore alla media aritmetica (15 euro) perche hai comprato piu quote quando il prezzo era basso.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco il DCA", "Calcolo il prezzo medio", "Preparo il mio PAC"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "Come impostare un PAC efficace",
        content:
          "Un PAC efficace richiede poche decisioni chiare, prese una volta sola.\n\n**Le 4 decisioni fondamentali:**\n\n1. **Importo fisso mensile**\n   - Quanto puoi investire ogni mese senza stress?\n   - Regola pratica: 10-20% del reddito netto\n   - Deve essere sostenibile nel lungo periodo\n\n2. **Strumento di investimento**\n   - ETF diversificato (consigliato per i principianti)\n   - Fondo indicizzato\n   - Mix di asset secondo la tua asset allocation\n\n3. **Frequenza**\n   - Mensile (piu comune)\n   - Settimanale o trimestrale (alternative valide)\n   - Importante: scegli e mantieni la frequenza\n\n4. **Automazione**\n   - Imposta un bonifico automatico\n   - Rimuovi la necessita di decidere ogni mese\n   - L'automazione previene le tentazioni",
      },
      {
        kind: "explain",
        title: "L'importanza dell'automazione",
        content:
          "Il PAC funziona solo se **lo fai davvero, ogni mese, senza eccezioni**.\n\n**Perche l'automazione e fondamentale:**\n\nSenza automazione:\n- Ogni mese devi ricordarti di investire\n- Quando il mercato scende, sei tentato di 'aspettare'\n- Quando il mercato sale, pensi 'aspetto il ritracciamento'\n- Alla fine non investi, o investi in modo irregolare\n\nCon automazione:\n- Il denaro viene investito prima che tu possa spenderlo\n- Non devi prendere decisioni (che portano errori)\n- Il PAC diventa 'invisibile' - parte della routine\n- Benefici appieno della media matematica\n\n**Come automatizzare:**\n1. Imposta un bonifico automatico dal conto corrente\n2. Scegli la data subito dopo lo stipendio\n3. Il broker/banca investe automaticamente\n4. Tu non devi fare nulla",
      },
      {
        kind: "question",
        title: "Verifica veloce",
        content: "Perche l'automazione e cosi importante nel PAC?",
        pollAreas: [
          {
            id: "widget-verify-36",
            prompt: "Seleziona la ragione principale",
            options: [
              "Elimina le decisioni mensili che portano a errori comportamentali",
              "Permette di ottenere rendimenti piu alti",
              "E richiesta dalla legge",
            ],
            correctIndex: 0,
            correctExplanation:
              "Esatto! L'automazione elimina il momento della decisione, prevenendo gli errori comportamentali che sabotano la strategia.",
            wrongExplanation:
              "L'automazione e fondamentale perche elimina le decisioni mensili. Ogni decisione e un'opportunita di errore: aspettare, rimandare, farsi influenzare dal mercato.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "Scenario pratico",
        content:
          "Hai impostato un PAC da 300 euro al mese. Il mercato crolla del 20%. Cosa fai?",
        pollAreas: [
          {
            id: "widget-scenario-36",
            prompt: "Seleziona l'azione corretta",
            options: [
              "Continuo il PAC normalmente - sto comprando piu quote a prezzo basso",
              "Sospendo il PAC e aspetto che il mercato risalga",
              "Vendo tutto per limitare le perdite",
            ],
            correctIndex: 0,
            correctExplanation:
              "Perfetto! Un calo e esattamente quando il PAC lavora meglio: compri piu quote a prezzi bassi. Non interrompere la strategia.",
            wrongExplanation:
              "Quando il mercato scende, il PAC ti permette di comprare piu quote a prezzi bassi. E il momento in cui la strategia funziona meglio. Interrompere significherebbe perdere questo vantaggio.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Imposto l'importo mensile", "Scelgo lo strumento", "Automatizzo il PAC"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "DCA vs Lump Sum: quando usare cosa",
        content:
          "Il DCA non e sempre la scelta ottimale in termini di rendimento puro. E importante capire quando usarlo.\n\n**Statisticamente il Lump Sum vince:**\nStudi su dati storici mostrano che investire tutto subito (lump sum) batte il DCA circa 2/3 delle volte. Perche? Perche i mercati tendono a salire nel lungo periodo, e prima entri, prima benefici della crescita.\n\n**Ma il DCA vince in altri modi:**\n\n1. **Psicologicamente**: E molto piu facile da sostenere. Un calo del 20% subito dopo un lump sum e devastante. Lo stesso calo durante un PAC e un'opportunita.\n\n2. **Praticamente**: La maggior parte delle persone non ha somme importanti da investire tutte insieme. Il PAC usa il flusso di reddito mensile.\n\n3. **Comportamentalmente**: Il DCA riduce il rimpianto: non puoi sbagliare il timing perche non stai cercando di azzeccarlo.\n\n**Regola pratica:**\n- Hai una somma importante e nervi d'acciaio? Considera il lump sum\n- Investi dal reddito mensile o vuoi dormire tranquillo? PAC",
      },
      {
        kind: "explain",
        title: "Gli errori da evitare nel PAC",
        content:
          "Anche una strategia semplice come il PAC puo essere sabotata.\n\n**Errore 1: Interrompere durante i ribassi**\n- E l'errore piu comune e piu costoso\n- Proprio quando dovresti comprare di piu (prezzi bassi), smetti\n- Perdi tutto il vantaggio matematico del DCA\n\n**Errore 2: Aumentare quando il mercato sale**\n- Entusiasmo = aumenti l'importo\n- Compri piu quote a prezzi alti\n- Alzi il tuo prezzo medio invece di abbassarlo\n\n**Errore 3: Scegliere importi insostenibili**\n- Inizi con 500 euro al mese, poi non riesci a mantenere\n- Interrompi e riprendi irregolarmente\n- Meglio 200 euro costanti che 500 euro intermittenti\n\n**Errore 4: Guardare troppo spesso**\n- Piu guardi, piu sei tentato di intervenire\n- Il PAC funziona meglio se lo dimentichi\n- Controllo trimestrale o semestrale e sufficiente",
      },
      {
        kind: "question",
        title: "Verifica comprensione",
        content: "Qual e l'errore piu costoso nel PAC?",
        pollAreas: [
          {
            id: "challenge-verify-36",
            prompt: "Seleziona l'errore principale",
            options: [
              "Interrompere il PAC durante i ribassi di mercato",
              "Investire un importo troppo basso",
              "Non controllare il portafoglio ogni giorno",
            ],
            correctIndex: 0,
            correctExplanation:
              "Esatto! Interrompere durante i ribassi significa smettere di comprare proprio quando i prezzi sono bassi - l'opposto di cio che il PAC dovrebbe fare.",
            wrongExplanation:
              "L'errore piu costoso e interrompere durante i ribassi. Il PAC funziona perche compri piu quote quando i prezzi sono bassi. Interrompere in quei momenti annulla il vantaggio della strategia.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "Il PAC come abitudine finanziaria",
        content:
          "Il vero potere del PAC non e solo matematico. E **comportamentale**.\n\n**Il PAC costruisce abitudini:**\n\n1. **Risparmio automatico**: Prima investi, poi spendi cio che resta\n2. **Disciplina**: Non devi motivarti ogni mese, il sistema lo fa per te\n3. **Pazienza**: Impari che l'investimento e un processo, non un evento\n4. **Distacco emotivo**: Il mercato sale o scende, tu continui\n\n**L'effetto composto dell'abitudine:**\nUn PAC da 300 euro al mese per 30 anni, con un rendimento medio del 7% annuo, diventa circa **340.000 euro**. Di questi, 108.000 euro sono i tuoi versamenti, il resto e crescita.\n\n**Il PAC trasforma il tempo in alleato:**\nNon devi essere un genio degli investimenti. Devi solo essere costante. Il tempo e l'interesse composto fanno il resto.",
      },
      {
        kind: "question",
        title: "Verifica: il potere del tempo",
        content:
          "300 euro al mese per 30 anni al 7% diventano circa 340.000 euro. Quanto di questa cifra sono i tuoi versamenti?",
        pollAreas: [
          {
            id: "challenge-scenario-36",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Circa 108.000 euro (300 x 12 x 30)",
              "Circa 250.000 euro",
              "Tutta la cifra e versamenti",
            ],
            correctIndex: 0,
            correctExplanation:
              "Corretto! I versamenti sono 300 x 12 x 30 = 108.000 euro. Gli altri 232.000 euro sono interessi composti!",
            wrongExplanation:
              "I versamenti sono 300 euro x 12 mesi x 30 anni = 108.000 euro. Il resto (circa 232.000 euro) e crescita grazie all'interesse composto. Questo e il potere del tempo.",
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
        title: "Quiz finale: Dollar Cost Averaging",
        content:
          "Hai imparato cos'e il DCA/PAC, perche funziona, come impostarlo e quali errori evitare.\n\n**Concetti chiave:**\n- Il DCA elimina il problema del market timing\n- Comprare regolarmente abbassa il prezzo medio di acquisto\n- L'automazione e essenziale per il successo\n- Non interrompere mai durante i ribassi\n- Il tempo e l'interesse composto sono i tuoi alleati\n\nApplica questi principi alle domande seguenti.",
      },
      {
        kind: "explain",
        title: "Come rispondere",
        content:
          "Per ogni domanda:\n\n1. Ricorda il **principio base** del DCA (investimento regolare indipendente dal mercato)\n2. Identifica se la risposta rispetta la **disciplina** della strategia\n3. Verifica che non cada negli **errori comportamentali** tipici\n\nIl DCA e una strategia di umilta: ammette che non sai prevedere il mercato e agisce di conseguenza.",
      },
      {
        kind: "question",
        title: "Domanda 1",
        content: "In un PAC, quando compri piu quote?",
        pollAreas: [
          {
            id: "quiz-q1-36",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Quando i prezzi sono bassi",
              "Quando i prezzi sono alti",
              "Sempre lo stesso numero di quote",
            ],
            correctIndex: 0,
            correctExplanation:
              "Corretto! Con un importo fisso, compri piu quote quando il prezzo e basso e meno quote quando e alto. Questa e la chiave del DCA.",
            wrongExplanation:
              "Con un importo fisso mensile, quando il prezzo e basso compri piu quote. Questa matematica semplice e il motivo per cui il DCA abbassa il prezzo medio di acquisto.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "Domanda 2",
        content: "Il mercato e sceso del 30% dall'inizio del tuo PAC. Cosa dovresti fare?",
        pollAreas: [
          {
            id: "quiz-q2-36",
            prompt: "Seleziona l'azione corretta",
            options: [
              "Continuare normalmente - stai comprando a prezzi scontati",
              "Sospendere e aspettare la ripresa",
              "Vendere per limitare le perdite",
            ],
            correctIndex: 0,
            correctExplanation:
              "Perfetto! Un calo e esattamente quando il PAC lavora meglio. Stai comprando piu quote a prezzi bassi.",
            wrongExplanation:
              "Un calo del 30% significa che stai comprando quote a prezzi molto bassi. E il momento in cui il PAC funziona meglio. Interrompere o vendere significherebbe annullare il vantaggio della strategia.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "Domanda 3",
        content: "Qual e la frequenza di controllo consigliata per un PAC automatizzato?",
        pollAreas: [
          {
            id: "quiz-q3-36",
            prompt: "Seleziona la frequenza migliore",
            options: [
              "Trimestrale o semestrale",
              "Quotidiana",
              "Ad ogni movimento di mercato",
            ],
            correctIndex: 0,
            correctExplanation:
              "Esatto! Controlli frequenti portano a tentazioni di intervenire. Un check trimestrale o semestrale e sufficiente.",
            wrongExplanation:
              "Guardare troppo spesso il portafoglio aumenta le tentazioni di intervenire (e sbagliare). Un controllo trimestrale o semestrale e piu che sufficiente per un PAC automatizzato.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Rivedo il principio DCA", "Controllo la mia automazione", "Pianifico il lungo termine"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "Cosa hai imparato: la semplicita che funziona",
        content:
          "Complimenti! Hai completato la lezione sul Dollar Cost Averaging.\n\n**I punti chiave:**\n\n1. **DCA/PAC**: investire importi fissi a intervalli regolari\n2. **Prezzo medio**: comprare di piu quando i prezzi sono bassi abbassa la media\n3. **Timing**: il DCA elimina il problema impossibile del market timing\n4. **Automazione**: e la chiave del successo - rimuove le decisioni\n5. **Disciplina**: mai interrompere durante i ribassi\n6. **Tempo**: l'interesse composto trasforma piccoli importi in grandi somme\n\n**Il PAC e la strategia perfetta per chi:**\n- Investe dal reddito mensile\n- Non vuole preoccuparsi del timing\n- Preferisce la semplicita all'ottimizzazione",
      },
      {
        kind: "explain",
        title: "Imposta il tuo PAC",
        content:
          "Ora e il momento di passare dalla teoria alla pratica.\n\n**Azione pratica in 4 step:**\n\n1. **Definisci l'importo mensile**\n   - Quanto puoi investire ogni mese SENZA stress?\n   - Meglio partire bassi e aumentare che partire alti e interrompere\n\n2. **Scegli lo strumento**\n   - Un ETF diversificato globale e un ottimo punto di partenza\n   - Costi bassi, diversificazione automatica\n\n3. **Imposta l'automazione**\n   - Bonifico automatico subito dopo lo stipendio\n   - Il denaro deve sparire prima che tu possa spenderlo\n\n4. **Dimentica (quasi)**\n   - Controllo trimestrale o semestrale\n   - Non guardare durante i ribassi\n   - Lascia che il tempo lavori per te",
      },
      {
        kind: "question",
        title: "Il tuo importo mensile",
        content: "Quale importo mensile ti sembra sostenibile per iniziare?",
        pollAreas: [
          {
            id: "feedback-amount-36",
            prompt: "Seleziona un range",
            options: [
              "100-200 euro al mese",
              "200-400 euro al mese",
              "Oltre 400 euro al mese",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "La tua data di investimento",
        content: "Quale giorno del mese e migliore per il tuo PAC automatico?",
        pollAreas: [
          {
            id: "feedback-timing-36",
            prompt: "Seleziona il giorno",
            options: [
              "Subito dopo lo stipendio (1-5 del mese)",
              "Meta mese (15)",
              "Fine mese (25-30)",
            ],
            allowText: true,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Aiutami a calcolare quanto dovrei investire ogni mese",
      "Quale ETF e adatto per iniziare un PAC?",
      "Come imposto un bonifico automatico per il PAC?",
    ],
  },
};

const lesson36Definition = createStaticLessonDefinition("36", content);

export default lesson36Definition;
