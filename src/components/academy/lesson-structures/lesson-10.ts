import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 L'interesse composto: l'ottava meraviglia del mondo",
        content: "Einstein (forse) lo definì 'l'ottava meraviglia del mondo'. Che l'abbia detto o no, il concetto è vero: l'**interesse composto** è la forza più potente nella finanza personale.\n\nIl principio è semplice: i guadagni generano altri guadagni. Non cresci in modo lineare (1, 2, 3, 4...) ma esponenziale (1, 2, 4, 8, 16...).\n\n**Esempio base:**\n- Investi 1.000€ al 7% annuo\n- Anno 1: 1.070€ (+70€)\n- Anno 10: 1.967€ (quasi raddoppiato)\n- Anno 30: 7.612€ (7x il capitale iniziale)\n\nIl tempo è il tuo alleato più potente.",
      },
      {
        kind: "explain",
        title: "📌 La magia del reinvestimento",
        content: "L'interesse composto funziona solo se **reinvesti i guadagni**. Questa è la chiave.\n\n**Interesse semplice** (senza reinvestimento):\n- 1.000€ al 7% = 70€/anno\n- Dopo 30 anni: 1.000€ + (70€ × 30) = 3.100€\n\n**Interesse composto** (con reinvestimento):\n- 1.000€ al 7% reinvestito\n- Dopo 30 anni: 7.612€\n\n**Differenza:** 4.512€ in più, senza fare nulla di diverso se non lasciare i guadagni investiti.\n\nQuesto è il motivo per cui la pazienza batte l'attivismo frenetico. Ogni volta che vendi e compri, interrompi il compounding.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Perché l'interesse composto funziona meglio con il tempo?",
        pollAreas: [
          {
            id: "concept-verify-10",
            prompt: "Seleziona la risposta corretta",
            options: [
              "I guadagni generano altri guadagni, creando crescita esponenziale",
              "I tassi di interesse aumentano nel tempo",
              "Le commissioni diminuiscono dopo molti anni",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! L'interesse composto crea una **spirale positiva**: guadagni che generano altri guadagni. Più tempo passa, più la crescita accelera.",
            wrongExplanation: "I tassi non aumentano automaticamente, e le commissioni restano uguali.\n\n**Il segreto dell'interesse composto:**\nI guadagni vengono reinvestiti e generano altri guadagni. È una crescita esponenziale, non lineare. Il tempo amplifica questo effetto.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 La regola del 72",
        content: "Vuoi sapere in quanto tempo raddoppia il tuo capitale? Usa la **regola del 72**.\n\n**Formula:** 72 ÷ tasso di interesse = anni per raddoppiare\n\n**Esempi:**\n- Al 3% annuo: 72 ÷ 3 = 24 anni\n- Al 6% annuo: 72 ÷ 6 = 12 anni\n- Al 9% annuo: 72 ÷ 9 = 8 anni\n\n**Applicazione pratica:**\nSe investi 10.000€ in un ETF azionario globale (rendimento storico ~7%), raddoppierai in circa 10 anni. Dopo 20 anni: 4x. Dopo 30 anni: 8x.\n\nQuesta regola ti aiuta a valutare rapidamente qualsiasi proposta di investimento.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: regola del 72",
        content: "Hai 5.000€ investiti al 6% annuo. In quanto tempo diventeranno 10.000€?",
        pollAreas: [
          {
            id: "concept-solve-10",
            prompt: "Applica la regola del 72",
            options: [
              "12 anni (72 ÷ 6 = 12)",
              "6 anni",
              "18 anni",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! 72 ÷ 6 = **12 anni** per raddoppiare. La regola del 72 è uno strumento rapido per stimare i tempi dell'interesse composto.",
            wrongExplanation: "La regola è semplice: **72 ÷ tasso = anni per raddoppiare**.\n\nCon il 6% annuo: 72 ÷ 6 = 12 anni.\n\nMemorizza questa formula - ti sarà utile per valutare qualsiasi investimento.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco il compounding", "Uso la regola del 72", "Valorizzo il tempo"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Iniziare presto vs iniziare con tanto",
        content: "Una delle lezioni più controintuitive dell'interesse composto: **iniziare presto batte iniziare con più soldi**.\n\n**Scenario A - Anna inizia a 25 anni:**\n- Investe 200€/mese per 10 anni (fino a 35 anni)\n- Poi smette di versare\n- Totale versato: 24.000€\n- A 65 anni (con 7% annuo): ~270.000€\n\n**Scenario B - Bruno inizia a 35 anni:**\n- Investe 200€/mese per 30 anni (fino a 65 anni)\n- Totale versato: 72.000€\n- A 65 anni (con 7% annuo): ~245.000€\n\n**Anna ha versato 1/3 di Bruno, ma finisce con più soldi.** Perché? Ha dato 10 anni in più al compounding.",
      },
      {
        kind: "explain",
        title: "📌 Il costo dell'attesa",
        content: "Ogni anno che aspetti ha un costo enorme. Vediamo quanto costa aspettare.\n\n**Investire 300€/mese per la pensione:**\n\n| Inizio | Anni investiti | Versato | Valore a 65 (7%) |\n|--------|----------------|---------|------------------|\n| 25 anni | 40 | 144.000€ | ~790.000€ |\n| 30 anni | 35 | 126.000€ | ~540.000€ |\n| 35 anni | 30 | 108.000€ | ~365.000€ |\n| 40 anni | 25 | 90.000€ | ~240.000€ |\n\n**Il costo dei 5 anni di ritardo (25→30):** 250.000€ di differenza finale!\n\nNon puoi recuperare il tempo. Inizia con quello che hai, anche se poco.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Quale fattore ha il maggior impatto sull'interesse composto?",
        pollAreas: [
          {
            id: "widget-verify-10",
            prompt: "Seleziona il fattore più importante",
            options: [
              "Il tempo (iniziare presto)",
              "L'importo iniziale",
              "Il tasso di interesse",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il **tempo** è il moltiplicatore più potente. Un importo piccolo investito presto batte un importo grande investito tardi.",
            wrongExplanation: "Tutti i fattori contano, ma il **tempo** ha l'impatto maggiore.\n\nPerché? Il compounding è esponenziale. Ogni anno in più moltiplica tutti i guadagni accumulati. Non puoi 'comprare' più tempo.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Hai 25 anni e puoi scegliere:\nA) Iniziare subito con 100€/mese\nB) Aspettare 5 anni e iniziare con 200€/mese\n\nQuale opzione porta a più soldi a 65 anni (7% annuo)?",
        pollAreas: [
          {
            id: "widget-scenario-10",
            prompt: "Quale opzione è migliore?",
            options: [
              "A) 100€/mese da subito - il tempo batte l'importo",
              "B) 200€/mese tra 5 anni - il doppio dell'importo compensa",
              "Sono equivalenti",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **100€/mese per 40 anni** (48.000€ versati) → ~264.000€\n**200€/mese per 35 anni** (84.000€ versati) → ~360.000€\n\nOk, in questo caso B è più alto, ma nota: hai versato quasi il doppio! Il punto è che quei 5 anni di anticipo hanno un valore enorme. Il meglio è iniziare subito E aumentare dopo.",
            wrongExplanation: "In questo caso specifico, versare il doppio compensa il ritardo. Ma nota:\n\n- **A)** Versi 48.000€ → ottieni ~264.000€ (5.5x)\n- **B)** Versi 84.000€ → ottieni ~360.000€ (4.3x)\n\nIl ritorno sul capitale investito è migliore partendo prima. La strategia ottimale? **Inizia subito con quello che hai e aumenta quando puoi.**",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Inizio subito", "Calcolo il costo dell'attesa", "Pianifico i versamenti"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ I nemici dell'interesse composto",
        content: "L'interesse composto è potente, ma ha dei nemici. Conoscerli ti permette di evitarli.\n\n**Nemico #1: Le commissioni**\nUna differenza di 1% all'anno sembra piccola. Ma su 30 anni:\n- 100.000€ al 7% = 761.000€\n- 100.000€ al 6% (1% di commissioni) = 574.000€\n- **Differenza: 187.000€ persi in commissioni**\n\n**Nemico #2: Le tasse**\nOgni volta che realizzi un guadagno e paghi le tasse, interrompi il compounding. Meglio strumenti efficienti fiscalmente.\n\n**Nemico #3: L'impazienza**\nVendere e comprare spesso interrompe il compounding, genera commissioni e tasse.",
      },
      {
        kind: "explain",
        title: "📌 Come proteggere il compounding",
        content: "Ecco come difendere il tuo interesse composto:\n\n**1. Minimizza le commissioni**\n- ETF a basso costo (TER < 0.3%)\n- Broker con commissioni basse o zero\n- Evita fondi attivi con costi dell'1-2%\n\n**2. Ottimizza la fiscalità**\n- Preferisci ETF ad accumulazione (reinvestono automaticamente)\n- Non vendere inutilmente\n- Usa conti efficienti (quando disponibili)\n\n**3. Coltiva la pazienza**\n- Non guardare il portafoglio ogni giorno\n- Ignora le notizie finanziarie sensazionalistiche\n- Ricorda: il tempo è dalla tua parte\n\nOgni decisione impulsiva è un nemico del compounding.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Perché una differenza di commissioni dell'1% annuo è importante?",
        pollAreas: [
          {
            id: "challenge-verify-10",
            prompt: "Seleziona la motivazione corretta",
            options: [
              "Si accumula nel tempo e sottrae capitale al compounding",
              "1% è già una percentuale alta",
              "Le commissioni non impattano realmente sui rendimenti",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! L'1% sembra poco, ma **si compone negativamente** per 30 anni. Sottrae capitale che avrebbe generato altri rendimenti. Su una vita di investimenti, può costare centinaia di migliaia di euro.",
            wrongExplanation: "Le commissioni sembrano piccole ma si accumulano.\n\n**Esempio su 30 anni con 100.000€:**\n- Al 7%: 761.000€\n- Al 6% (1% commissioni): 574.000€\n\n**Differenza: 187.000€** - solo per quell'1% apparentemente insignificante.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario: ETF a confronto",
        content: "Devi scegliere tra due ETF identici:\n- ETF A: costo 0.07% annuo\n- ETF B: costo 0.50% annuo\n\nInvesti 50.000€ per 25 anni al 7% lordo. Quale scegli?",
        pollAreas: [
          {
            id: "challenge-scenario-10",
            prompt: "Quale ETF è migliore?",
            options: [
              "ETF A (0.07%) - risparmio ~50.000€ in commissioni su 25 anni",
              "ETF B (0.50%) - la differenza è trascurabile",
              "Indifferente - sono praticamente uguali",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Su 25 anni:\n- **ETF A (6.93% netto):** ~261.000€\n- **ETF B (6.50% netto):** ~237.000€\n\nDifferenza: **~24.000€** solo per lo 0.43% di differenza! Scegli sempre il costo più basso a parità di tutto il resto.",
            wrongExplanation: "La differenza NON è trascurabile.\n\n**Su 25 anni con 50.000€:**\n- 0.07% di costo → ~261.000€\n- 0.50% di costo → ~237.000€\n\nQuei decimali di differenza = **24.000€** persi. Mai sottovalutare i costi.",
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
        title: "🧠 Quiz finale: l'interesse composto",
        content: "Hai imparato la forza dell'interesse composto, la regola del 72, e i nemici da evitare.\n\n**Concetti chiave da ricordare:**\n- I guadagni generano altri guadagni (crescita esponenziale)\n- Il tempo è il moltiplicatore più potente\n- Iniziare presto batte iniziare con più soldi\n- Commissioni, tasse e impazienza sono i nemici\n\nOra verifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Usando la regola del 72, in quanto tempo raddoppia un investimento al 9%?",
        pollAreas: [
          {
            id: "quiz-q1-10",
            prompt: "Calcola il tempo di raddoppio",
            options: [
              "8 anni (72 ÷ 9)",
              "9 anni",
              "12 anni",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **72 ÷ 9 = 8 anni**. La regola del 72 è uno strumento rapido e affidabile per stimare i tempi del compounding.",
            wrongExplanation: "La formula è: **72 ÷ tasso = anni per raddoppiare**.\n\n72 ÷ 9 = 8 anni.\n\nMemorizza questa regola - la userai spesso per valutare investimenti.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Quale strategia massimizza l'interesse composto?",
        pollAreas: [
          {
            id: "quiz-q2-10",
            prompt: "Seleziona la strategia migliore",
            options: [
              "Iniziare presto, minimizzare costi, reinvestire tutto, non toccare",
              "Aspettare di avere un capitale importante prima di iniziare",
              "Comprare e vendere spesso per approfittare delle oscillazioni",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Tempo + bassi costi + reinvestimento + pazienza** = formula vincente dell'interesse composto.",
            wrongExplanation: "Aspettare costa caro (perdi anni di compounding). Comprare/vendere spesso genera costi e interrompe il compounding.\n\n**La formula vincente:**\n1. Inizia presto (anche con poco)\n2. Minimizza i costi\n3. Reinvesti tutto\n4. Non toccare per decenni",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Qual è il nemico più sottovalutato dell'interesse composto?",
        pollAreas: [
          {
            id: "quiz-q3-10",
            prompt: "Identifica il nemico nascosto",
            options: [
              "Le commissioni - sembrano piccole ma si accumulano enormemente",
              "L'inflazione - erode sempre i rendimenti",
              "La volatilità - i crolli azzerano i guadagni",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Le commissioni sono subdole perché **sembrano piccole** (1%, 0.5%) ma su 30 anni possono costare centinaia di migliaia di euro. Sempre controllare i costi!",
            wrongExplanation: "L'inflazione e la volatilità contano, ma le **commissioni** sono il nemico più sottovalutato.\n\nPerché? Sembrano trascurabili (1% all'anno?), ma si compongono negativamente per decenni. Su 30 anni, possono costarti il 20-30% del capitale finale.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Applico regola del 72", "Verifico i costi", "Confermo strategia"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: l'interesse composto",
        content: "Complimenti! Hai completato una delle lezioni più importanti del percorso.\n\n**I principi fondamentali:**\n\n1. **Crescita esponenziale** - i guadagni generano altri guadagni\n2. **Il tempo è il tuo alleato** - iniziare presto batte iniziare con tanto\n3. **Regola del 72** - 72 ÷ tasso = anni per raddoppiare\n4. **Nemici da evitare** - commissioni alte, tasse evitabili, impazienza\n\nQuesto concetto tornerà in ogni lezione futura: diversificazione, ETF, strategie di investimento.",
      },
      {
        kind: "explain",
        title: "📌 Applicazione pratica immediata",
        content: "Non aspettare. Ecco cosa puoi fare questa settimana:\n\n**1. Calcola il tuo orizzonte temporale**\n- Quanti anni hai fino alla pensione?\n- Quanti raddoppi del capitale sono possibili?\n\n**2. Verifica i costi dei tuoi investimenti attuali**\n- Hai fondi con commissioni > 1%? Considera alternative a basso costo\n- Stai pagando commissioni di trading frequenti?\n\n**3. Imposta un versamento automatico**\n- Anche 50€/mese\n- Prima inizi, più il compounding lavora per te\n\nRicorda il collegamento con il risparmio automatico: l'automatismo + il tempo = crescita esponenziale senza sforzo.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Quale azione farai dopo questa lezione?",
        pollAreas: [
          {
            id: "feedback-action-10",
            prompt: "Scegli il tuo prossimo passo",
            options: [
              "Verifico i costi degli investimenti che ho già",
              "Calcolo in quanti anni raddoppia il mio capitale attuale",
              "Imposto un versamento automatico (anche piccolo)",
            ],
            correctIndex: 2,
            correctExplanation: "Eccellente! Impostare un **versamento automatico** è l'azione più importante. Ogni mese che passa senza investire è un mese di compounding perso.",
            wrongExplanation: "Tutte le opzioni sono valide! Ma la più urgente è **iniziare o aumentare i versamenti automatici**.\n\nOgni mese di ritardo ha un costo. Verificare i costi e fare calcoli è utile, ma partire è fondamentale.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Quanto crescerà il mio capitale con i miei versamenti attuali?",
      "Come riduco i costi dei miei investimenti?",
      "Qual è l'importo ideale da investire ogni mese?",
    ],
  },
};

const lesson10Definition = createStaticLessonDefinition("10", content);

export default lesson10Definition;
