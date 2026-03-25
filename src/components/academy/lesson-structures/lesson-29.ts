import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Cos'è l'inflazione e perché ti riguarda",
        content: "Hai costruito il tuo sistema finanziario: budget, risparmio, investimenti. Ma c'è un nemico silenzioso che erode tutto questo nel tempo: l'**inflazione**.\n\n**Inflazione = aumento generalizzato dei prezzi nel tempo.**\n\nQuando i prezzi salgono, la stessa quantità di denaro compra meno cose. Questo è il **potere d'acquisto** - quanto puoi effettivamente comprare con i tuoi soldi.\n\n**Esempio concreto:**\n• Nel 2000, con 100€ compravi un carrello della spesa pieno\n• Nel 2024, con 100€ compri solo metà di quel carrello\n• I tuoi 100€ non sono spariti, ma valgono MENO\n\n**L'inflazione media storica** in Europa è circa 2% all'anno. Sembra poco, ma su 20 anni significa che 100€ diventano equivalenti a circa 67€ in termini di potere d'acquisto.\n\nCapire l'inflazione è fondamentale per proteggere i tuoi risparmi e investimenti nel lungo periodo.",
      },
      {
        kind: "explain",
        title: "📌 Rendimento nominale vs rendimento reale",
        content: "Quando valuti un investimento, devi distinguere tra due rendimenti molto diversi:\n\n**Rendimento NOMINALE**: quello che vedi sul conto.\nSe investi 10.000€ e dopo un anno hai 10.300€, il rendimento nominale è +3%.\n\n**Rendimento REALE**: quello che conta davvero.\nÈ il rendimento nominale MENO l'inflazione.\n\n**Formula semplificata:**\nRendimento reale ≈ Rendimento nominale - Inflazione\n\n**Esempio:**\n• Investimento rende +3% (nominale)\n• Inflazione annua: 2,5%\n• Rendimento REALE: +0,5%\n\n**Caso peggiore (rendimento reale negativo):**\n• Conto deposito rende +1%\n• Inflazione: 3%\n• Rendimento REALE: -2%\n• Stai PERDENDO potere d'acquisto anche se il saldo cresce!\n\nQuesto è il motivo per cui tenere troppi soldi sul conto corrente a lungo termine è una scelta che costa cara.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Un investimento rende il 4% nominale con inflazione al 3%. Qual è il rendimento reale?",
        pollAreas: [
          {
            id: "concept-verify-29",
            prompt: "Calcola il rendimento reale",
            options: [
              "Circa +1% (4% - 3%)",
              "Sempre +4%, l'inflazione non conta",
              "+7% sommando i due valori",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il rendimento reale è circa +1%. Il tuo potere d'acquisto cresce solo dell'1% all'anno.",
            wrongExplanation: "Attenzione: il rendimento reale si calcola sottraendo l'inflazione dal nominale. In questo caso: 4% - 3% = 1%.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 L'effetto composto dell'inflazione",
        content: "L'inflazione, come l'interesse composto, lavora nel tempo. Ma lavora CONTRO di te.\n\n**Simulazione: 10.000€ lasciati sul conto per 20 anni**\n\nCon inflazione media del 2,5%:\n• Anno 0: potere d'acquisto = 10.000€\n• Anno 5: potere d'acquisto ≈ 8.839€\n• Anno 10: potere d'acquisto ≈ 7.812€\n• Anno 20: potere d'acquisto ≈ 6.103€\n\n**Hai 'perso' quasi il 40% del valore reale** senza toccare quei soldi!\n\n**Lezione chiave:**\nNon investire = perdere valore.\nL'alternativa 'sicura' di lasciare soldi fermi è in realtà una perdita certa nel lungo periodo.\n\n**Cosa proteggere:**\n• Fondo emergenza: va bene tenerlo liquido (è per emergenze, non crescita)\n• Risparmi a lungo termine: DEVONO essere investiti per battere l'inflazione\n• Pensione: orizzonte lungo, essenziale superare l'inflazione",
      },
      {
        kind: "question",
        title: "🧠 Verifica: erosione nel tempo",
        content: "Hai 50.000€ di risparmi. Non li investi per 15 anni. Con inflazione al 2,5% annuo, quanto vale realmente quella somma alla fine?",
        pollAreas: [
          {
            id: "concept-solve-29",
            prompt: "Stima il potere d'acquisto residuo",
            options: [
              "Circa 34.000€ (erosione di circa il 32%)",
              "Sempre 50.000€, i soldi non spariscono",
              "Circa 45.000€ (erosione minima)",
            ],
            correctIndex: 0,
            correctExplanation: "Corretto! Con il 2,5% di inflazione per 15 anni, il potere d'acquisto si riduce a circa il 68% del valore iniziale.",
            wrongExplanation: "Attenzione: anche se il numero sul conto resta 50.000€, il potere d'acquisto si erode. Formula: 50.000 × (1-0,025)^15 ≈ 34.000€.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco rendimento reale", "Calcolo erosione", "Valuto protezione"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Come proteggere il potere d'acquisto",
        content: "Ora che capisci il problema, vediamo le soluzioni. Ci sono diversi strumenti per proteggere i tuoi risparmi dall'inflazione:\n\n**1. Azioni (equity)**\nLe aziende possono aumentare i prezzi con l'inflazione → i profitti tendono a seguire l'inflazione nel lungo periodo.\nStoricamente: rendimenti reali positivi sul lungo termine.\n\n**2. Obbligazioni indicizzate all'inflazione**\nTitoli il cui rendimento è legato all'inflazione (es. BTP Italia, TIPS americani).\nProtezione diretta: se l'inflazione sale, sale anche il rendimento.\n\n**3. Immobili**\nGli affitti tendono ad aumentare con l'inflazione.\nProtezione indiretta ma storicamente efficace.\n\n**4. Commodities e oro**\nL'oro è considerato 'rifugio' in periodi di alta inflazione.\nVolatili, non adatti come unica protezione.\n\n**La strategia migliore:** un portafoglio diversificato che includa asset con protezione naturale dall'inflazione.",
      },
      {
        kind: "explain",
        title: "📌 Il rendimento reale netto: il numero che conta",
        content: "Per valutare davvero un investimento nel lungo periodo, devi calcolare il **rendimento reale netto**.\n\n**Formula completa:**\nRendimento reale netto = Rendimento nominale - Inflazione - Tasse - Costi\n\n**Esempio pratico:**\n• Fondo azionario rende +7% nominale\n• Inflazione: 2,5%\n• Tasse su capital gain: 26% sul guadagno\n• Costi del fondo: 1,5% annuo\n\n**Calcolo:**\n• Rendimento lordo: 7%\n• Dopo costi: 7% - 1,5% = 5,5%\n• Dopo tasse (approssimato): 5,5% × 0,74 ≈ 4,07%\n• Rendimento reale netto: 4,07% - 2,5% ≈ **1,57%**\n\nDa un +7% apparente sei sceso a +1,57% di crescita REALE del potere d'acquisto.\n\n**Lezione:** i costi dei fondi e le tasse contano molto quando aggiungi l'inflazione all'equazione.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Quale elemento NON va sottratto per calcolare il rendimento reale netto?",
        pollAreas: [
          {
            id: "widget-verify-29",
            prompt: "Identifica l'elemento estraneo",
            options: [
              "Il prezzo di acquisto iniziale",
              "Inflazione",
              "Costi e commissioni",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il prezzo di acquisto determina il rendimento nominale, non va sottratto separatamente. Si sottrae: inflazione, tasse, costi.",
            wrongExplanation: "Rivedi la formula: Rendimento reale netto = Nominale - Inflazione - Tasse - Costi. Il prezzo di acquisto è già incorporato nel rendimento nominale.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica: valutazione completa",
        content: "Confronti due investimenti:\n\n• Investimento A: 5% nominale, costi 0,2%\n• Investimento B: 6% nominale, costi 1,8%\n\nInflazione attesa: 2,5%",
        pollAreas: [
          {
            id: "widget-scenario-29",
            prompt: "Quale offre il rendimento reale migliore?",
            options: [
              "A: (5% - 0,2% - 2,5%) = 2,3% reale",
              "B: il 6% nominale è sempre migliore",
              "Sono equivalenti",
            ],
            correctIndex: 0,
            correctExplanation: "Corretto! A rende 2,3% reale (5%-0,2%-2,5%), B rende 1,7% reale (6%-1,8%-2,5%). I costi fanno la differenza!",
            wrongExplanation: "Calcola il rendimento reale: A = 5% - 0,2% - 2,5% = 2,3%. B = 6% - 1,8% - 2,5% = 1,7%. A vince nonostante il nominale inferiore.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Calcolo reale netto", "Confronto strumenti", "Valuto protezione"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Scenari di inflazione: come adattare la strategia",
        content: "L'inflazione non è costante. Può essere bassa, normale o alta. La tua strategia deve adattarsi.\n\n**Scenario 1: Inflazione bassa (0-2%)**\nContesto normale, le obbligazioni tradizionali funzionano bene.\nAzioni crescono sopra l'inflazione.\nMinore urgenza di protezione specifica.\n\n**Scenario 2: Inflazione moderata (2-4%)**\nContesto attuale tipico.\nBilanciamento azioni/obbligazioni funziona.\nConsidera obbligazioni indicizzate per parte del portafoglio.\n\n**Scenario 3: Inflazione alta (>5%)**\nLe obbligazioni tradizionali soffrono (rendimenti reali negativi).\nAzioni volatili ma protezione nel medio termine.\nOro e commodities possono aiutare.\nObbligazioni indicizzate diventano cruciali.\n\n**Errore comune:** non adattare il portafoglio quando l'inflazione cambia drasticamente.",
      },
      {
        kind: "explain",
        title: "📌 Costruire un portafoglio resistente all'inflazione",
        content: "Un portafoglio ben costruito dovrebbe avere protezione 'incorporata' contro l'inflazione.\n\n**Componenti con protezione naturale:**\n\n**1. Azioni globali (40-60%)**\nLe aziende aumentano i prezzi → profitti seguono l'inflazione.\nStoricamente la migliore protezione nel lungo termine.\n\n**2. Obbligazioni indicizzate (10-20%)**\nBTP Italia, inflation-linked bonds.\nProtezione diretta e prevedibile.\n\n**3. Immobiliare/REITs (5-15%)**\nAffitti crescono con l'inflazione.\nDiversificazione reale.\n\n**4. Commodities/Oro (5-10%)**\nVolatili ma utili in scenari estremi.\nPiccola allocazione come 'assicurazione'.\n\n**5. Obbligazioni tradizionali (20-30%)**\nStabilità, ma rendimenti reali bassi in alta inflazione.\nRidurre la duration quando l'inflazione sale.\n\n**Principio:** diversifica tra asset che reagiscono diversamente all'inflazione.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "L'inflazione sale al 6%. Quale asset class soffre di più nel breve termine?",
        pollAreas: [
          {
            id: "challenge-verify-29",
            prompt: "Identifica l'asset più vulnerabile",
            options: [
              "Obbligazioni a lunga scadenza a tasso fisso",
              "Azioni di aziende con pricing power",
              "Obbligazioni indicizzate all'inflazione",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Le obbligazioni a tasso fisso perdono valore quando l'inflazione (e i tassi) salgono. È il rischio duration.",
            wrongExplanation: "Le obbligazioni a tasso fisso sono le più vulnerabili: cedole fisse perdono potere d'acquisto, e i prezzi scendono quando i tassi salgono.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🛡️ La trappola della 'sicurezza' del conto corrente",
        content: "Molti italiani tengono troppi soldi sul conto corrente pensando sia 'sicuro'. È una trappola.\n\n**I numeri della trappola:**\n• Saldo medio conto corrente italiani: circa 15.000€\n• Rendimento conto corrente: 0-0,1%\n• Inflazione media: 2-3%\n• Perdita REALE annua: -2% / -3%\n\n**Su 10 anni con 50.000€ 'parcheggiati':**\n• Valore nominale: sempre 50.000€\n• Potere d'acquisto reale (inflazione 2,5%): circa 39.000€\n• Hai 'perso' 11.000€ di potere d'acquisto\n\n**Cosa tenere sul conto:**\n• Spese correnti 1-2 mesi\n• Fondo emergenza (questo è ok, serve liquidità)\n\n**Cosa NON tenere sul conto:**\n• Risparmi per obiettivi >3 anni\n• Patrimonio a lungo termine\n\nLa vera sicurezza è proteggere il potere d'acquisto, non il numero sul conto.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: allocazione corretta",
        content: "Hai 60.000€ di risparmi oltre al fondo emergenza. Spese mensili: 2.500€. Quanto ha senso tenere sul conto corrente?",
        pollAreas: [
          {
            id: "challenge-scenario-29",
            prompt: "Scegli l'allocazione più razionale",
            options: [
              "5.000-7.500€ (1-3 mesi di spese), il resto investito",
              "Tutto sul conto, è più sicuro",
              "30.000€ sul conto, 30.000€ investiti",
            ],
            correctIndex: 0,
            correctExplanation: "Corretto! Il fondo emergenza copre gli imprevisti. Il resto deve essere investito per proteggersi dall'inflazione.",
            wrongExplanation: "Tenere troppo sul conto significa perdere potere d'acquisto. 1-3 mesi di spese più il fondo emergenza bastano per la liquidità.",
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
        title: "🧠 Quiz finale: proteggere il tuo futuro dall'inflazione",
        content: "Hai imparato cos'è l'inflazione, come calcolare il rendimento reale, e come costruire un portafoglio che protegga il tuo potere d'acquisto.\n\n**Concetti chiave da applicare:**\n• Rendimento reale = Nominale - Inflazione\n• Rendimento reale netto = Nominale - Inflazione - Tasse - Costi\n• L'inflazione erode il valore nel tempo (effetto composto)\n• Diversi asset reagiscono diversamente all'inflazione\n• Tenere troppa liquidità è una perdita certa\n\nOra verifica la tua comprensione con scenari pratici.",
      },
      {
        kind: "explain",
        title: "📌 Come rispondere: calcola sempre il reale",
        content: "Quando valuti scenari di investimento:\n\n**Step 1: Identifica i rendimenti nominali**\nQuanto rende 'sulla carta' l'investimento?\n\n**Step 2: Sottrai l'inflazione**\nQual è l'inflazione attuale o attesa?\n\n**Step 3: Considera costi e tasse**\nQuanto ti costa l'investimento? Quante tasse paghi?\n\n**Step 4: Valuta il reale netto**\nQuesto è il numero che conta per il tuo potere d'acquisto.\n\nSe una risposta ignora l'inflazione o i costi, è quasi sempre incompleta.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Un BTP rende il 3,5% annuo. L'inflazione è al 4%. Qual è la situazione reale?",
        pollAreas: [
          {
            id: "quiz-q1-29",
            prompt: "Valuta il rendimento reale",
            options: [
              "Rendimento reale negativo (-0,5%): stai perdendo potere d'acquisto",
              "Rendimento positivo: il 3,5% è garantito",
              "Neutro: inflazione e rendimento si compensano",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! 3,5% - 4% = -0,5%. Anche con un rendimento nominale positivo, stai perdendo potere d'acquisto.",
            wrongExplanation: "Calcola: 3,5% rendimento - 4% inflazione = -0,5% reale. Il tuo potere d'acquisto diminuisce.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Quale strategia protegge meglio dall'inflazione nel lungo periodo (20+ anni)?",
        pollAreas: [
          {
            id: "quiz-q2-29",
            prompt: "Scegli la strategia più efficace",
            options: [
              "Portafoglio diversificato con prevalenza azionaria",
              "100% obbligazioni a tasso fisso",
              "100% conto deposito al miglior tasso",
            ],
            correctIndex: 0,
            correctExplanation: "Corretto! Le azioni hanno storicamente battuto l'inflazione nel lungo periodo. La diversificazione riduce il rischio.",
            wrongExplanation: "Le azioni, nonostante la volatilità, sono l'asset class che meglio protegge dall'inflazione nel lungo termine.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Hai 100.000€ da investire per 15 anni. Inflazione attesa media: 2,5%. Due opzioni:\n\n• Opzione A: Conto deposito 2%\n• Opzione B: Portafoglio 60/40 con rendimento atteso 5%",
        pollAreas: [
          {
            id: "quiz-scenario-29",
            prompt: "Quale protegge meglio il tuo potere d'acquisto?",
            options: [
              "B: rendimento reale +2,5% vs -0,5% di A",
              "A: il capitale è garantito",
              "Sono equivalenti nel lungo periodo",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! A rende -0,5% reale (2%-2,5%), B rende +2,5% reale (5%-2,5%). Su 15 anni la differenza è enorme.",
            wrongExplanation: "Calcola i rendimenti reali: A = 2% - 2,5% = -0,5%, B = 5% - 2,5% = +2,5%. La differenza su 15 anni è drammatica.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Calcolo rendimento reale", "Valuto protezione", "Confronto strategie"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: pensare in termini reali",
        content: "Complimenti! Hai completato la lezione sull'inflazione e il potere d'acquisto.\n\n**I concetti chiave che porti via:**\n• L'inflazione erode silenziosamente il valore dei tuoi risparmi\n• Il rendimento che conta è quello REALE (dopo inflazione, tasse, costi)\n• Tenere troppi soldi fermi è una perdita certa nel lungo periodo\n• Un portafoglio diversificato con azioni protegge nel lungo termine\n• Le obbligazioni indicizzate offrono protezione diretta\n\n**Il cambio di mentalità:**\nDa 'quanto rende?' a 'quanto cresce il mio POTERE D'ACQUISTO?'\n\nQuesto modo di pensare ti guiderà in tutte le decisioni di investimento future.",
      },
      {
        kind: "explain",
        title: "📌 Azioni pratiche da fare subito",
        content: "Trasforma questa conoscenza in azioni concrete:\n\n**1. Calcola il tuo 'costo inflazione' attuale**\n• Quanti soldi hai fermi sul conto?\n• Moltiplica per 2,5% (inflazione media)\n• Questo è quanto 'perdi' ogni anno\n\n**2. Rivedi l'asset allocation**\n• Il tuo portafoglio batte l'inflazione?\n• Hai abbastanza esposizione azionaria per il lungo termine?\n• Considera obbligazioni indicizzate?\n\n**3. Definisci cosa può restare liquido**\n• Fondo emergenza: OK liquido\n• Risparmi >3 anni: devono essere investiti\n\n**Nella prossima lezione** esploreremo i tassi d'interesse - l'altro grande fattore macroeconomico che influenza i tuoi investimenti.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo piano anti-inflazione",
        content: "Quale azione prioritaria prendi per proteggere meglio i tuoi risparmi dall'inflazione?",
        pollAreas: [
          {
            id: "feedback-rule-29",
            prompt: "Scegli la tua priorità",
            options: [
              "Ridurre liquidità eccessiva e investire",
              "Aggiungere obbligazioni indicizzate al portafoglio",
              "Aumentare esposizione azionaria per il lungo termine",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica finale: il tuo benchmark",
        content: "D'ora in poi, quando valuti un investimento, qual è il primo calcolo che farai?",
        pollAreas: [
          {
            id: "feedback-benchmark-29",
            prompt: "Il tuo nuovo standard di valutazione",
            options: [
              "Rendimento nominale - Inflazione = Rendimento reale",
              "Solo il rendimento nominale conta",
              "Guardo solo il capitale garantito",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Pensare in termini reali è il primo passo per proteggere davvero il tuo potere d'acquisto.",
            wrongExplanation: "Il rendimento reale (nominale - inflazione) è il numero che conta. È l'unico che misura la crescita del tuo potere d'acquisto.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Come calcolo il rendimento reale netto del mio portafoglio attuale?",
      "Quali obbligazioni indicizzate sono disponibili in Italia?",
      "Quanta liquidità dovrei tenere sul conto in base alla mia situazione?",
    ],
  },
};

const lesson29Definition = createStaticLessonDefinition("29", content);

export default lesson29Definition;
