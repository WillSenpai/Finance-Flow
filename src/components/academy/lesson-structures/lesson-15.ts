import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Analisi fondamentale: capire il valore di un'azienda",
        content: "L'**analisi fondamentale** è il processo di valutare un'azienda studiando i suoi numeri e il suo business. L'obiettivo: capire se il prezzo attuale è giustificato dal valore reale.\n\n**Il principio di base:**\nIl prezzo di un'azione oscilla ogni giorno, ma il valore intrinseco dell'azienda cambia lentamente. Se compri a un prezzo inferiore al valore, nel lungo termine dovresti guadagnare.\n\n**Cosa guardi:**\n- Quanto guadagna l'azienda (utili)\n- Quanto debito ha\n- Come cresce nel tempo\n- La solidità del business\n\nQuesto approccio richiede studio, ma ti rende un investitore consapevole.",
      },
      {
        kind: "explain",
        title: "📌 I tre numeri fondamentali",
        content: "Per iniziare l'analisi fondamentale, concentrati su tre numeri chiave:\n\n**1. Utile netto (Net Income)**\nQuanto guadagna l'azienda dopo tutte le spese e tasse.\n- Positivo = l'azienda è profittevole\n- In crescita = buon segno\n- Negativo = sta perdendo soldi\n\n**2. Flusso di cassa (Free Cash Flow)**\nI soldi veri che l'azienda genera. Più affidabile dell'utile perché più difficile da manipolare.\n- FCF positivo = l'azienda genera liquidità\n- FCF > Utile = qualità alta degli utili\n\n**3. Debito netto (Net Debt)**\nDebito totale meno la cassa disponibile.\n- Debito basso = solidità\n- Debito alto = rischio se le cose vanno male",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Perché il flusso di cassa è più affidabile dell'utile netto?",
        pollAreas: [
          {
            id: "concept-verify-15",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Rappresenta soldi veri ed è più difficile da manipolare contabilmente",
              "È sempre più alto dell'utile",
              "Le tasse non si applicano al flusso di cassa",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il flusso di cassa rappresenta **soldi veri** che entrano ed escono. L'utile può essere influenzato da scelte contabili (ammortamenti, accantonamenti). Il cash è più difficile da 'abbellire'.",
            wrongExplanation: "Il flusso di cassa non è sempre più alto dell'utile, e le tasse ci sono comunque.\n\n**Il punto chiave:** l'utile può essere manipolato con scelte contabili. Il flusso di cassa rappresenta soldi veri - o ce l'hai o non ce l'hai.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 I multipli di valutazione",
        content: "Per capire se un'azione è cara o economica, si usano i **multipli**.\n\n**P/E (Price to Earnings)**\nPrezzo ÷ Utile per azione\n- P/E 15 = paghi 15€ per ogni 1€ di utile\n- P/E basso = potenzialmente economica\n- P/E alto = costosa o in forte crescita\n- Media storica S&P 500: ~15-17\n\n**P/FCF (Price to Free Cash Flow)**\nPrezzo ÷ Flusso di cassa per azione\n- Simile al P/E ma usa il cash flow\n- Più affidabile per confronti\n\n**P/B (Price to Book)**\nPrezzo ÷ Valore contabile\n- Utile per aziende con molti asset fisici\n- P/B < 1 = paghi meno del valore contabile",
      },
      {
        kind: "question",
        title: "🧠 Verifica: multipli",
        content: "Un'azienda ha P/E di 8 mentre la media del settore è 15. Cosa potrebbe significare?",
        pollAreas: [
          {
            id: "concept-solve-15",
            prompt: "Interpreta il dato",
            options: [
              "Potrebbe essere sottovalutata, oppure ha problemi che giustificano lo sconto",
              "È sicuramente un affare da comprare subito",
              "Il P/E non significa nulla",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Un P/E basso **potrebbe** indicare sottovalutazione, ma potrebbe anche riflettere problemi reali (utili in calo, debito alto, settore in difficoltà). Serve approfondire.",
            wrongExplanation: "Un P/E basso non è automaticamente un affare.\n\n**Possibili spiegazioni:**\n- Sottovalutazione reale (opportunità)\n- Utili destinati a calare\n- Problemi specifici dell'azienda\n- Settore in declino\n\nServe sempre capire il PERCHÉ del multiplo basso.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Leggo i bilanci", "Calcolo i multipli", "Valuto la qualità"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Dove trovare i dati",
        content: "Per fare analisi fondamentale servono dati affidabili. Ecco dove trovarli:\n\n**Fonti gratuite:**\n- Yahoo Finance: dati base, bilanci semplificati\n- Google Finance: quotazioni e news\n- Morningstar: analisi e rating\n- Simply Wall St: visualizzazioni intuitive\n\n**Fonti a pagamento (più complete):**\n- Seeking Alpha Premium\n- Morningstar Premium\n- Bloomberg (professionale)\n\n**Documenti ufficiali:**\n- Bilanci annuali (Annual Report / 10-K)\n- Bilanci trimestrali (Quarterly Report / 10-Q)\n- Presentazioni agli investitori\n\nPer iniziare, Yahoo Finance e Morningstar gratuito sono più che sufficienti.",
      },
      {
        kind: "explain",
        title: "📌 Check-list rapida di qualità",
        content: "Prima di investire in un'azione, usa questa check-list:\n\n**✅ Profittabilità**\n- Utile netto positivo? (almeno 3 degli ultimi 5 anni)\n- Margini stabili o in crescita?\n\n**✅ Solidità finanziaria**\n- Debito/Equity < 1? (dipende dal settore)\n- Interest coverage > 3? (utili coprono interessi)\n\n**✅ Crescita**\n- Fatturato in crescita negli ultimi 5 anni?\n- Utili in crescita?\n\n**✅ Valutazione**\n- P/E ragionevole vs settore e storia?\n- Non eccessivamente cara?\n\n**✅ Comprensibilità**\n- Capisci cosa fa l'azienda?\n- Capisci come guadagna?\n\nSe la risposta a molte domande è 'no' o 'non so', meglio approfondire o passare oltre.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Quale elemento della check-list è spesso trascurato ma fondamentale?",
        pollAreas: [
          {
            id: "widget-verify-15",
            prompt: "Seleziona l'elemento chiave",
            options: [
              "Comprensibilità - devi capire cosa fa l'azienda e come guadagna",
              "Il prezzo attuale dell'azione",
              "Quante persone ne parlano sui social",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Warren Buffett dice: 'Non investire mai in un business che non capisci.' Se non sai spiegare come l'azienda fa soldi, non dovresti possederla.",
            wrongExplanation: "Il prezzo conta, ma senza capire il business non sai se quel prezzo è giusto. I social sono rumore.\n\n**La regola d'oro:** se non puoi spiegare in 2 minuti cosa fa l'azienda e come guadagna, non investirci.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Un'azienda ha:\n- Utili in crescita del 20% annuo\n- P/E di 50 (media settore: 25)\n- Debito quasi zero\n\nÈ un buon investimento?",
        pollAreas: [
          {
            id: "widget-scenario-15",
            prompt: "Valuta la situazione",
            options: [
              "Dipende - crescita alta giustifica P/E alto, ma è sostenibile?",
              "Sì - crescita del 20% è fantastica",
              "No - P/E troppo alto",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Dipende dalla sostenibilità della crescita.** Un P/E di 50 con crescita del 20% potrebbe essere giustificato SE quella crescita continua. Ma se rallenta, il multiplo potrebbe crollare.",
            wrongExplanation: "Non c'è una risposta semplice sì/no.\n\n**L'analisi corretta:**\n- Crescita 20% giustifica multiplo alto\n- Ma: quella crescita è sostenibile per 5+ anni?\n- Debito zero è positivo\n- Serve capire il business e la competizione\n\nI multipli alti sono rischiosi se la crescita delude.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Uso le fonti gratuite", "Applico la check-list", "Valuto crescita vs multiplo"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Le trappole dell'analisi fondamentale",
        content: "L'analisi fondamentale ha limiti e trappole da conoscere:\n\n**Trappola #1: I numeri del passato**\nI bilanci mostrano il passato, ma tu investi nel futuro. Un'azienda profittevole oggi potrebbe non esserlo domani.\n\n**Trappola #2: Value trap**\nUn'azione 'economica' (P/E basso) potrebbe restare economica per sempre se il business è in declino.\n\n**Trappola #3: Overconfidence**\nDopo aver analizzato un'azienda, potresti sentirti troppo sicuro. Ma i mercati sono imprevedibili.\n\n**Trappola #4: Analisi paralisi**\nTroppi dati possono bloccarti. Non esiste l'analisi 'perfetta'.\n\nL'analisi fondamentale è uno strumento, non una garanzia.",
      },
      {
        kind: "explain",
        title: "📌 Il margin of safety",
        content: "Per proteggerti dagli errori di valutazione, usa il **margin of safety** (margine di sicurezza).\n\n**Il concetto:**\nSe stimi che un'azione vale 100€, non comprarla a 95€. Comprala a 70€ o meno.\n\n**Perché serve:**\n- Le tue stime potrebbero essere sbagliate\n- Potrebbero emergere problemi nascosti\n- Il mercato potrebbe restare irrazionale a lungo\n\n**Come applicarlo:**\n1. Stima un valore 'fair' dell'azienda\n2. Applica uno sconto del 20-30% (o più per aziende rischiose)\n3. Compra solo se il prezzo è sotto quella soglia\n\nBenjamin Graham: 'Il margin of safety è il segreto dell'investimento solido.'",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Cos'è una 'value trap'?",
        pollAreas: [
          {
            id: "challenge-verify-15",
            prompt: "Seleziona la definizione corretta",
            options: [
              "Un'azione economica che resta economica perché il business è in declino",
              "Un'azienda sottovalutata che alla fine viene riconosciuta dal mercato",
              "Una strategia per comprare azioni a sconto",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Una **value trap** sembra economica ma lo resta per sempre. Il P/E è basso perché gli utili stanno calando o il settore sta morendo. Non tutti i P/E bassi sono opportunità.",
            wrongExplanation: "La value trap è l'opposto di un'opportunità.\n\n**Esempio:** un'azienda di videocassette nel 2010 poteva sembrare 'economica' con P/E 5. Ma il business stava morendo - non era sottovalutata, era in declino.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "Hai analizzato un'azienda e sei convinto che valga 50€. Oggi quota 48€. Cosa fai?",
        pollAreas: [
          {
            id: "challenge-scenario-15",
            prompt: "Qual è l'azione corretta?",
            options: [
              "Aspetto - senza margin of safety è troppo rischiosa",
              "Compro - è sotto il mio valore stimato",
              "Non compro mai singole azioni",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Un margine del 4% (48€ vs 50€) è **troppo piccolo**. Se la tua stima è sbagliata anche solo del 10%, sei già in perdita. Aspetta un prezzo di 35-40€ per avere margin of safety.",
            wrongExplanation: "Comprare a 48€ quando stimi 50€ non lascia margine di errore.\n\n**Il margin of safety:**\nSe stimi 50€, dovresti comprare a 35-40€ (sconto 20-30%). Così anche se sbagli la valutazione, hai un cuscinetto.",
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
        title: "🧠 Quiz finale: analisi fondamentale",
        content: "Hai imparato le basi dell'analisi fondamentale: i tre numeri chiave, i multipli di valutazione, le fonti dati, e le trappole da evitare.\n\n**Concetti chiave:**\n- Utili, cash flow, debito sono i fondamentali\n- P/E e altri multipli aiutano a valutare\n- Comprensibilità del business è essenziale\n- Margin of safety protegge dagli errori\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Quali sono i tre numeri fondamentali da guardare?",
        pollAreas: [
          {
            id: "quiz-q1-15",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Utile netto, flusso di cassa, debito netto",
              "Prezzo, volume, capitalizzazione",
              "P/E, P/B, dividendo",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **Utile, cash flow e debito** ti dicono se l'azienda guadagna, genera soldi veri, ed è solida finanziariamente.",
            wrongExplanation: "Prezzo/volume sono dati di mercato, non fondamentali. P/E e P/B sono multipli derivati.\n\n**I tre fondamentali:**\n1. Utile netto (profittabilità)\n2. Free cash flow (soldi veri)\n3. Debito netto (solidità)",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Il margin of safety serve a:",
        pollAreas: [
          {
            id: "quiz-q2-15",
            prompt: "Completa la frase",
            options: [
              "Proteggerti dagli errori di valutazione comprando con uno sconto",
              "Garantire che non perderai mai soldi",
              "Calcolare il prezzo esatto di un'azione",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il margin of safety è un **cuscinetto** contro gli errori. Se stimi male o emergono problemi, lo sconto ti protegge.",
            wrongExplanation: "Niente garantisce di non perdere mai. E il prezzo 'esatto' non esiste.\n\n**Il margin of safety:** compri a un prezzo significativamente inferiore al valore stimato, così anche se sbagli hai un margine.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Prima di investire in un'azienda, la domanda più importante è:",
        pollAreas: [
          {
            id: "quiz-q3-15",
            prompt: "Seleziona la domanda chiave",
            options: [
              "Capisco cosa fa l'azienda e come guadagna?",
              "Quanto è salita l'azione nell'ultimo anno?",
              "Quanti analisti la raccomandano?",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **Comprensibilità** è fondamentale. Se non capisci il business, non puoi valutarlo correttamente e non saprai reagire quando le cose cambiano.",
            wrongExplanation: "I rendimenti passati non garantiscono quelli futuri. Le raccomandazioni degli analisti sono spesso sbagliate.\n\n**La domanda chiave:** capisci cosa fa l'azienda? Se non puoi spiegarlo in 2 minuti, non dovresti possederla.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Applico i fondamentali", "Uso il margin of safety", "Investo solo in ciò che capisco"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: analisi fondamentale",
        content: "Complimenti! Hai completato la lezione sull'analisi fondamentale.\n\n**Principi chiave:**\n\n1. **Tre numeri fondamentali:** utile, cash flow, debito\n2. **Multipli:** P/E, P/FCF, P/B per valutare se è cara o economica\n3. **Comprensibilità:** investi solo in ciò che capisci\n4. **Margin of safety:** compra con uno sconto per proteggerti\n5. **Trappole:** value trap, overconfidence, analisi paralisi\n\nL'analisi fondamentale è per chi vuole fare l'investitore intraprendente. Per i difensivi, gli ETF restano la scelta migliore.",
      },
      {
        kind: "explain",
        title: "📌 Questo ti serve davvero?",
        content: "Domanda onesta: hai bisogno dell'analisi fondamentale?\n\n**Se sei investitore difensivo:** probabilmente no. Gli ETF ti danno diversificazione senza dover analizzare singole aziende.\n\n**Se vuoi fare stock picking:** sì, è essenziale. Ma ricorda:\n- Richiede ore di studio\n- La maggior parte dei professionisti non batte il mercato\n- Anche con analisi perfetta, puoi sbagliare\n\n**Un compromesso:** usa queste conoscenze per capire meglio come funzionano le aziende, anche se investi tramite ETF. Ti renderà un investitore più consapevole.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Come userai l'analisi fondamentale?",
        pollAreas: [
          {
            id: "feedback-action-15",
            prompt: "Indica il tuo approccio",
            options: [
              "Per cultura generale - resto con gli ETF",
              "Per analizzare alcune aziende satellite",
              "Voglio approfondire e fare stock picking serio",
            ],
            correctIndex: 0,
            correctExplanation: "Scelta saggia! Conoscere i fondamentali ti rende un investitore migliore, anche se investi solo in ETF. Capisci meglio cosa possiedi.",
            wrongExplanation: "Qualsiasi scelta è valida se consapevole!\n\nL'importante è sapere che l'analisi fondamentale richiede tempo e non garantisce di battere il mercato. Usa queste conoscenze nel modo che ha più senso per te.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Come analizzo velocemente un'azienda prima di investire?",
      "Quali sono i segnali d'allarme nei bilanci?",
      "Come calcolo il fair value di un'azione?",
    ],
  },
};

const lesson15Definition = createStaticLessonDefinition("15", content);

export default lesson15Definition;
