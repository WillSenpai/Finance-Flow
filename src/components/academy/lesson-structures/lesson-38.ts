import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Margin of Safety: il principio più importante",
        content: "Il **Margin of Safety** (margine di sicurezza) è il principio centrale di Graham, applicabile a ogni investimento.\n\n**L'idea:**\nComprare sempre con un 'cuscinetto' tra il prezzo pagato e il valore stimato. Così, anche se la tua analisi è sbagliata, hai protezione.\n\n**Come un ingegnere costruisce un ponte:**\n- Il ponte deve reggere 10 tonnellate\n- Lo progetta per reggere 20 tonnellate\n- Il margine protegge da errori di calcolo, materiali difettosi, carichi imprevisti\n\n**Negli investimenti:**\n- Stimi che un'azione vale 100€\n- Compri solo se costa 60-70€\n- Il margine protegge da errori di valutazione, eventi imprevisti, ottimismo eccessivo\n\n**Graham diceva:** 'The function of the margin of safety is to render unnecessary an accurate estimate of the future.'",
      },
      {
        kind: "explain",
        title: "📌 Perché il margine è necessario",
        content: "Non importa quanto sei bravo: l'incertezza è inevitabile.\n\n**Le fonti di errore:**\n1. **La tua analisi può essere sbagliata**\n   - Dati imprecisi\n   - Assunzioni troppo ottimistiche\n   - Fattori non considerati\n\n2. **Il futuro è imprevedibile**\n   - Concorrenti inattesi\n   - Cambiamenti tecnologici\n   - Crisi economiche\n\n3. **Il timing è impossibile**\n   - Non sai quando il mercato riconoscerà il valore\n   - Potrebbe volerci più tempo del previsto\n\n**Il margine di sicurezza:**\n- Non elimina gli errori\n- Ma riduce le conseguenze degli errori\n- Ti permette di avere ragione in media, non sempre\n\n**Il principio:** meglio essere approssimativamente corretti che precisamente sbagliati.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "A cosa serve il margine di sicurezza?",
        pollAreas: [
          {
            id: "concept-verify-38",
            prompt: "Seleziona la funzione principale",
            options: [
              "Proteggere dagli errori di valutazione e dall'incertezza",
              "Garantire rendimenti del 100%",
              "Eliminare tutti i rischi",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il margine **protegge** dagli errori e dall'incertezza. Non garantisce profitti né elimina i rischi, ma riduce le conseguenze degli sbagli.",
            wrongExplanation: "Non garantisce nulla e non elimina i rischi.\n\n**La funzione:**\n- Cuscinetto contro gli errori\n- Protezione dall'incertezza\n- Riduce le conseguenze degli sbagli",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Quanto margine serve?",
        content: "Non esiste un numero magico, ma alcune linee guida:\n\n**Graham suggeriva:**\n- Almeno 33% di sconto (pagare 67€ per 100€ di valore)\n- Per situazioni più rischiose: 50%+\n\n**Dipende da:**\n\n**1. La qualità del business:**\n- Azienda stabile, prevedibile: margine 20-30%\n- Azienda ciclica, incerta: margine 40-50%\n\n**2. La certezza della tua analisi:**\n- Settore che conosci bene: margine minore\n- Settore nuovo per te: margine maggiore\n\n**3. La tipologia di asset:**\n- Obbligazioni investment grade: margine basso\n- Small cap speculative: margine alto\n\n**Il principio:**\nPiù incertezza = più margine richiesto. Se non riesci a ottenere abbastanza margine, non comprare.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: calcolo margine",
        content: "Un'azione vale (secondo te) 80€. A che prezzo compreresti con 25% di margine?",
        pollAreas: [
          {
            id: "concept-solve-38",
            prompt: "Calcola il prezzo massimo",
            options: [
              "60€ (75% di 80€)",
              "80€",
              "100€",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! 25% di margine significa pagare il 75% del valore: **80€ × 0.75 = 60€**. Compri solo se il prezzo scende a 60€ o meno.",
            wrongExplanation: "Il margine è lo sconto rispetto al valore.\n\n**Calcolo:**\n- Valore: 80€\n- Margine: 25%\n- Prezzo max: 80€ × (1 - 0.25) = 60€",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco il margine di sicurezza", "So perché serve", "So calcolarlo"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Applicare il margine di sicurezza",
        content: "Il margine di sicurezza si applica ovunque:\n\n**Nelle azioni:**\n- Stima il valore intrinseco\n- Compra solo con sconto sufficiente\n- Se non c'è margine, aspetta\n\n**Nelle obbligazioni:**\n- Rating adeguato (BBB+ o superiore)\n- Duration appropriata\n- Spread vs risk-free\n\n**Nel budget personale:**\n- Non spendere il 100% del reddito\n- Mantieni un cuscinetto (fondo emergenza)\n- Non indebitarti al massimo\n\n**Nei mutui:**\n- La rata non deve essere il massimo sostenibile\n- Prevedi aumenti dei tassi\n- Mantieni margine per imprevisti\n\n**Il principio:** in ogni decisione finanziaria, chiediti 'qual è il mio margine di errore?'",
      },
      {
        kind: "explain",
        title: "📌 Il margine nella diversificazione",
        content: "La **diversificazione** stessa è una forma di margine di sicurezza.\n\n**Come funziona:**\n- Non sai quale azione performerà meglio\n- Diversificando, riduci l'impatto degli errori\n- Alcune sbagliate + alcune giuste = risultato accettabile\n\n**Graham diceva:**\n'The margin of safety is always dependent on the price paid. It will be large at one price, small at some higher price, nonexistent at some still higher price.'\n\n**Traduzione:**\n- A 50€ hai grande margine\n- A 80€ hai poco margine\n- A 120€ non hai margine (anzi, rischi)\n\n**Il punto pratico:**\nSe non riesci a trovare opportunità con margine adeguato, è meglio aspettare in cash che forzare investimenti senza protezione.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Come la diversificazione si collega al margine di sicurezza?",
        pollAreas: [
          {
            id: "widget-verify-38",
            prompt: "Seleziona il collegamento",
            options: [
              "La diversificazione riduce l'impatto degli errori sui singoli asset",
              "Sono concetti opposti",
              "La diversificazione elimina la necessità del margine",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! La diversificazione è **un'altra forma di margine**: riduce l'impatto quando sbagli su un singolo investimento.",
            wrongExplanation: "Non sono opposti e la diversificazione non elimina il bisogno di margine sui singoli.\n\n**Il collegamento:**\n- Margine: protezione su singolo investimento\n- Diversificazione: protezione a livello di portafoglio\n- Entrambi riducono le conseguenze degli errori",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Trovi un'azione che ti piace, ma il prezzo è esattamente pari al tuo valore stimato. Cosa fai?",
        pollAreas: [
          {
            id: "widget-scenario-38",
            prompt: "Quale decisione prendi?",
            options: [
              "Non compro - nessun margine di sicurezza",
              "Compro - è al fair value",
              "Compro tutto - è un affare",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **Senza margine, non comprare**. Al fair value non hai protezione. Se la tua stima è sbagliata (probabile), perderai. Aspetta uno sconto.",
            wrongExplanation: "Al fair value non c'è protezione.\n\n**Il principio:**\n- Fair value = rischio 50/50\n- Senza margine = nessuna protezione\n- Meglio aspettare uno sconto\n- O cercare altrove",
            allowText: false,
          },
        ],
      },
    ],
    options: ["So applicare il margine", "Capisco il ruolo della diversificazione", "Ho disciplina"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Il margine nelle decisioni di vita",
        content: "Il margine di sicurezza va oltre gli investimenti:\n\n**Carriera:**\n- Non dipendere da un solo reddito\n- Sviluppa competenze trasferibili\n- Network come backup\n\n**Salute:**\n- Non vivere al limite delle tue energie\n- Mantieni riserve (sonno, riposo)\n- Prevenzione > cura\n\n**Tempo:**\n- Non pianificare al 100%\n- Lascia spazio per imprevisti\n- Buffer negli appuntamenti\n\n**Relazioni:**\n- Non dipendere da una sola persona\n- Mantieni diverse relazioni\n- Comunica i problemi prima che esplodano\n\n**Il principio universale:**\n'Murphy's Law' - tutto ciò che può andare storto, andrà storto. Il margine di sicurezza è la risposta razionale a questa realtà.",
      },
      {
        kind: "explain",
        title: "📌 Quando NON c'è margine sufficiente",
        content: "A volte devi ammettere che non c'è margine:\n\n**Segnali di assenza di margine:**\n- Il prezzo è già al fair value o sopra\n- Il successo richiede che tutto vada bene\n- Non c'è spazio per errori\n- La tesi si basa su un singolo catalizzatore\n\n**Cosa fare:**\n1. **Aspetta**: le opportunità torneranno\n2. **Cerca altrove**: altri asset, altri settori\n3. **Accetta di perdere l'opportunità**: meglio che perdere soldi\n4. **Mantieni liquidità**: per quando ci sarà margine\n\n**Il costo dell'attesa:**\n- Sì, perdi rendimento potenziale\n- Ma eviti perdite potenziali\n- La pazienza è un vantaggio competitivo\n\n**Buffett:** 'The stock market is a device for transferring money from the impatient to the patient.'",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Cosa fai quando non trovi investimenti con margine adeguato?",
        pollAreas: [
          {
            id: "challenge-verify-38",
            prompt: "Seleziona l'approccio corretto",
            options: [
              "Aspetto in liquidità - le opportunità torneranno",
              "Compro comunque - devo investire tutto",
              "Abbasso i miei standard di margine",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Aspettare in liquidità** è meglio che forzare investimenti senza protezione. La pazienza è parte della strategia.",
            wrongExplanation: "Non devi investire tutto e non dovresti abbassare gli standard.\n\n**L'approccio:**\n- La pazienza è una virtù\n- Le opportunità torneranno\n- Meglio niente che perdere",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "Un'azione 'calda' che tutti comprano è sopra ogni valutazione ragionevole. Un amico dice 'salirà ancora'. Cosa fai?",
        pollAreas: [
          {
            id: "challenge-scenario-38",
            prompt: "Quale decisione prendi?",
            options: [
              "Non compro - nessun margine, anzi rischio di perdita",
              "Compro - non voglio perdere il treno",
              "Aspetto che salga ancora poi compro",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **Sopra valutazione = margine negativo**. Il rischio di perdita supera il potenziale guadagno. Lascia che altri giochino a questo gioco.",
            wrongExplanation: "'Non perdere il treno' è FOMO, non strategia. Aspettare che salga ancora è peggiorare la situazione.\n\n**Il ragionamento:**\n- Sopra il valore = margine negativo\n- Stai pagando più di quanto vale\n- Il rischio è tutto dalla tua parte",
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
        title: "🧠 Quiz finale: margin of safety",
        content: "Hai imparato il principio del margine di sicurezza e come applicarlo.\n\n**Concetti chiave:**\n- Margine: cuscinetto tra prezzo e valore\n- Protegge da errori e incertezza\n- Più incertezza = più margine\n- Si applica ovunque (investimenti, budget, vita)\n- Senza margine adeguato: aspetta\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Qual è la funzione principale del margine di sicurezza?",
        pollAreas: [
          {
            id: "quiz-q1-38",
            prompt: "Seleziona la funzione",
            options: [
              "Proteggere dagli errori di valutazione",
              "Garantire profitti",
              "Eliminare ogni rischio",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il margine **protegge dagli errori**. Non garantisce profitti né elimina rischi, ma riduce le conseguenze degli sbagli.",
            wrongExplanation: "Non è una garanzia né elimina i rischi.\n\n**La funzione:**\n- Cuscinetto contro l'incertezza\n- Protezione dagli errori\n- Riduzione conseguenze sbagli",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Se un'azione vale 100€, con 30% di margine a quanto compri?",
        pollAreas: [
          {
            id: "quiz-q2-38",
            prompt: "Calcola il prezzo massimo",
            options: [
              "70€ o meno",
              "100€",
              "130€",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! 30% di margine = paghi 70% del valore: **100€ × 0.70 = 70€**.",
            wrongExplanation: "Il calcolo è: valore × (1 - margine%).\n\n**100€ × (1 - 0.30) = 70€**",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Cosa fai se non trovi investimenti con margine adeguato?",
        pollAreas: [
          {
            id: "quiz-q3-38",
            prompt: "Seleziona l'azione corretta",
            options: [
              "Aspetto in liquidità",
              "Compro comunque",
              "Abbasso gli standard",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Aspettare** è meglio che forzare. La pazienza è parte della strategia. Le opportunità torneranno.",
            wrongExplanation: "Non forzare e non abbassare gli standard.\n\n**La disciplina:**\n- Aspetta le opportunità\n- Non inseguire\n- La pazienza paga",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco il margine", "So calcolarlo", "Ho disciplina"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: margin of safety",
        content: "Complimenti! Hai completato la lezione sul margine di sicurezza.\n\n**Principi chiave:**\n\n1. **Margine**: cuscinetto tra prezzo e valore\n2. **Funzione**: protezione da errori e incertezza\n3. **Calcolo**: valore × (1 - margine%)\n4. **Applicazione**: investimenti, budget, vita\n5. **Disciplina**: senza margine, aspetta\n\nIl margine di sicurezza è il principio più importante che puoi applicare.",
      },
      {
        kind: "explain",
        title: "📌 Collegamento con la sezione",
        content: "Questa lezione fa parte della sezione **Strategie di Investimento**.\n\n**Percorso:**\n- Asset allocation\n- Dollar Cost Averaging\n- Value investing\n- **Margin of safety** (questa lezione)\n- Mr. Market e psicologia (prossima)\n- Errori comuni\n\nIl margine di sicurezza è il concetto che lega tutto: protegge sempre.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Cosa farai con questa conoscenza?",
        pollAreas: [
          {
            id: "feedback-action-38",
            prompt: "Indica il tuo prossimo passo",
            options: [
              "Rivedo le mie posizioni: ho margine sufficiente?",
              "Applico il concetto al mio budget",
              "Continuo con Mr. Market",
            ],
            correctIndex: 0,
            correctExplanation: "Ottima scelta! **Rivedere le posizioni** con l'ottica del margine ti aiuta a capire dove sei protetto e dove no.",
            wrongExplanation: "Tutte le scelte sono valide!\n\n- Rivedere posizioni: azione pratica\n- Budget: applicazione quotidiana\n- Continuare: per completare la sezione",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Come calcolo il margine di sicurezza per le mie posizioni?",
      "Quanto margine serve per investimenti sicuri vs rischiosi?",
      "Come applico il margine al mio fondo emergenza?",
    ],
  },
};

const lesson38Definition = createStaticLessonDefinition("38", content);

export default lesson38Definition;
