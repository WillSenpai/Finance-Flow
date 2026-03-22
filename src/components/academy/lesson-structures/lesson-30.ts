import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Tassi d'interesse: il prezzo del denaro",
        content: "I **tassi d'interesse** sono il prezzo del denaro - quanto costa prendere in prestito o quanto rende prestare.\n\n**Perché contano per te:**\n- **Mutui**: tassi alti = rate più care\n- **Risparmi**: tassi alti = depositi rendono di più\n- **Obbligazioni**: tassi alti = prezzi obbligazioni scendono\n- **Azioni**: tassi alti = valutazioni tendono a scendere\n- **Immobili**: tassi alti = mutui più cari = domanda ridotta\n\n**Il punto chiave:** i tassi influenzano quasi tutto nella finanza. Capire come funzionano ti aiuta a prendere decisioni migliori su mutui, investimenti e pianificazione.",
      },
      {
        kind: "explain",
        title: "📌 Chi decide i tassi: le banche centrali",
        content: "I tassi sono principalmente determinati dalle **banche centrali**.\n\n**Le banche centrali principali:**\n- **BCE** (Banca Centrale Europea): zona euro\n- **Fed** (Federal Reserve): Stati Uniti\n- **BoE** (Bank of England): Regno Unito\n- **BoJ** (Bank of Japan): Giappone\n\n**Il tasso di riferimento:**\n- La BCE fissa il 'tasso di rifinanziamento'\n- È il tasso a cui le banche commerciali si finanziano\n- Tutti gli altri tassi (mutui, depositi) derivano da questo\n\n**Come funziona:**\n1. BCE alza il tasso di riferimento (es. 0% → 4%)\n2. Le banche pagano di più per finanziarsi\n3. Le banche alzano i tassi ai clienti\n4. Mutui più cari, depositi rendono di più\n\n**Il mandato:**\nLe banche centrali hanno un obiettivo: mantenere l'inflazione stabile (di solito ~2%).",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Se la BCE alza i tassi, cosa succede ai mutui a tasso variabile?",
        pollAreas: [
          {
            id: "concept-verify-30",
            prompt: "Seleziona l'effetto corretto",
            options: [
              "Le rate aumentano - il mutuo costa di più",
              "Le rate diminuiscono - diventa più conveniente",
              "Nessun effetto sui mutui",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Se la BCE alza i tassi, i **mutui variabili** diventano più cari. Le rate aumentano perché il tasso Euribor (a cui sono legati) sale.",
            wrongExplanation: "I mutui variabili sono direttamente collegati ai tassi BCE.\n\n**L'effetto:**\n- BCE alza tassi → Euribor sale\n- Euribor + spread = tasso mutuo\n- Tasso mutuo sale → rata aumenta",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Tassi e obbligazioni: relazione inversa",
        content: "C'è una relazione fondamentale che devi capire:\n\n**Quando i tassi salgono, i prezzi delle obbligazioni scendono.**\n\n**Perché:**\n- Hai un'obbligazione che paga 2% fisso\n- Nuove obbligazioni ora pagano 4%\n- Chi vuole la tua al 2%? Nessuno\n- Per venderla devi abbassare il prezzo\n\n**Esempio numerico:**\nObbligazione: 1.000€, cedola 2% (20€/anno)\n- Se tassi salgono al 4%, per avere rendimento 4%:\n- Prezzo deve scendere a ~500€ (20/500 = 4%)\n- Hai perso 50% del capitale!\n\n**La regola:**\n- Tassi salgono → prezzi obbligazioni scendono\n- Tassi scendono → prezzi obbligazioni salgono\n\n**Duration:** più lunga è la scadenza, più il prezzo oscilla quando i tassi cambiano.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: obbligazioni e tassi",
        content: "I tassi di mercato passano dal 2% al 5%. Cosa succede al prezzo di un BTP a 10 anni?",
        pollAreas: [
          {
            id: "concept-solve-30",
            prompt: "Seleziona l'effetto sul prezzo",
            options: [
              "Il prezzo scende significativamente",
              "Il prezzo sale",
              "Il prezzo resta invariato",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Con tassi che salgono dal 2% al 5%, un BTP a 10 anni può perdere il 20-30% del valore. Più lunga la durata, più forte l'effetto.",
            wrongExplanation: "Il prezzo non può restare invariato né salire.\n\n**La relazione:**\n- Tassi salgono → prezzi obbligazioni scendono\n- BTP 10 anni: alta duration = alta sensibilità\n- +3% tassi ≈ -25/30% prezzo (stima)",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco i tassi", "So chi li decide", "Conosco l'effetto sulle obbligazioni"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Tassi reali vs nominali",
        content: "Una distinzione fondamentale:\n\n**Tasso nominale:** quello che vedi (es. 4%)\n**Tasso reale:** nominale - inflazione\n\n**Esempio:**\n- Deposito paga 3% (nominale)\n- Inflazione è 5%\n- Tasso reale: 3% - 5% = **-2%**\n- Stai perdendo potere d'acquisto!\n\n**Perché conta:**\n- I tassi reali positivi premiano il risparmio\n- I tassi reali negativi penalizzano il risparmio\n- Gli investitori guardano ai tassi reali, non nominali\n\n**Schema:**\n- Tassi reali positivi → oro soffre, obbligazioni attraenti\n- Tassi reali negativi → oro beneficia, obbligazioni perdono valore reale\n\n**Oggi:**\nSe l'inflazione è 3% e i tassi sono 4%, hai tassi reali +1%. Il risparmio è premiato.",
      },
      {
        kind: "explain",
        title: "📌 Cosa monitorare: Euribor e curve",
        content: "**Euribor:** il tasso interbancario europeo\n- Base per mutui variabili\n- Esistono diverse scadenze: 1m, 3m, 6m, 12m\n- Mutui tipicamente legati a Euribor 3m o 6m\n\n**Curva dei rendimenti:**\nGrafico che mostra i tassi per ogni scadenza (3m, 1y, 5y, 10y, 30y)\n\n**Curva normale:** tassi crescenti con la scadenza\n- Scadenze lunghe pagano di più (più rischio)\n\n**Curva invertita:** tassi brevi > tassi lunghi\n- Segnale classico di recessione imminente\n- Gli investitori si aspettano che i tassi scenderanno\n\n**Perché monitorare:**\n- Euribor: capire quanto costerà il mutuo\n- Curva: capire le aspettative del mercato",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Il tuo deposito rende 2% e l'inflazione è 4%. Qual è il tuo rendimento reale?",
        pollAreas: [
          {
            id: "widget-verify-30",
            prompt: "Calcola il rendimento reale",
            options: [
              "-2% - stai perdendo potere d'acquisto",
              "+2% - stai guadagnando",
              "0% - sei in pari",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Rendimento reale = 2% - 4% = **-2%**. Nonostante il tuo deposito 'renda' il 2%, il tuo potere d'acquisto sta calando del 2% l'anno.",
            wrongExplanation: "Il rendimento nominale non è quello che conta.\n\n**Calcolo:**\n- Rendimento nominale: 2%\n- Inflazione: 4%\n- Reale: 2% - 4% = -2%\n- Il potere d'acquisto cala",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Stai valutando un mutuo. Euribor 3m è al 3.5%. La banca offre spread 1.2%. Qual è il tuo tasso?",
        pollAreas: [
          {
            id: "widget-scenario-30",
            prompt: "Calcola il tasso totale",
            options: [
              "4.7% (Euribor + spread)",
              "3.5% (solo Euribor)",
              "1.2% (solo spread)",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Il tasso del mutuo = **Euribor + spread** = 3.5% + 1.2% = **4.7%**. Lo spread è fisso, l'Euribor varia.",
            wrongExplanation: "Il tasso finale è sempre la somma.\n\n**Calcolo:**\n- Euribor 3m: 3.5%\n- Spread: 1.2%\n- Tasso totale: 4.7%\n- Se Euribor sale a 4.5%, tasso diventa 5.7%",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco tassi reali/nominali", "So cosa monitorare", "So calcolare il mio tasso"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ I cicli dei tassi: storia recente",
        content: "I tassi si muovono in cicli guidati dall'economia:\n\n**2008-2021: era dei tassi zero**\n- Crisi 2008: Fed e BCE tagliano a zero\n- QE: banche centrali comprano obbligazioni\n- Tassi negativi in Europa\n- Mutui a <1%, obbligazioni negative\n\n**2022-2024: rialzo più veloce della storia**\n- Inflazione post-COVID: 8-10%\n- BCE: da -0.5% a 4% in 18 mesi\n- Mutui variabili: rate raddoppiate\n- Obbligazioni: crollo prezzi\n\n**Le lezioni:**\n1. I tassi possono restare bassi per decenni\n2. Ma possono salire molto velocemente\n3. Chi aveva mutui variabili senza margine ha sofferto\n4. Chi aveva obbligazioni lunghe ha perso tanto\n\n**Il futuro:** i tassi torneranno a zero? Forse, ma quando non lo sa nessuno.",
      },
      {
        kind: "explain",
        title: "📌 Prepararsi ai cambi di ciclo",
        content: "Come proteggersi dai cicli dei tassi:\n\n**Per il mutuo:**\n- Considera tasso fisso se i tassi sono bassi\n- Se variabile, calcola la rata con +2-3% di tassi\n- Puoi sostenere quella rata? Se no, ripensa\n\n**Per gli investimenti:**\n- Duration corta riduce la sensibilità ai tassi\n- Diversifica le scadenze\n- Non concentrare su obbligazioni lunghe\n\n**Quando i tassi salgono:**\n- Obbligazioni brevi soffrono meno\n- Depositi e BOT diventano interessanti\n- REITs e azioni growth soffrono\n\n**Quando i tassi scendono:**\n- Obbligazioni lunghe guadagnano\n- Azioni growth beneficiano\n- L'oro può salire (tassi reali scendono)\n\n**Il principio:** non cercare di prevedere i tassi, ma costruisci un portafoglio resiliente.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Cosa succede al tuo portafoglio di BTP a 20 anni se la BCE alza i tassi di 2%?",
        pollAreas: [
          {
            id: "challenge-verify-30",
            prompt: "Seleziona l'effetto atteso",
            options: [
              "Perde valore significativo - alta duration amplifica la perdita",
              "Guadagna valore",
              "Nessun effetto",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! BTP a 20 anni ha **alta duration** (~15). Un rialzo di 2% può causare perdite del 25-30%. Più lunga la durata, più amplificato l'effetto.",
            wrongExplanation: "Le obbligazioni lunghe sono molto sensibili ai tassi.\n\n**La regola:**\n- Duration ≈ sensibilità ai tassi\n- BTP 20y con duration 15: +1% tassi ≈ -15% prezzo\n- +2% tassi ≈ -30% prezzo",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "Hai un mutuo variabile. L'Euribor è salito da 0% a 4%. La tua rata è passata da 600€ a 1.000€. Cosa fai?",
        pollAreas: [
          {
            id: "challenge-scenario-30",
            prompt: "Quale azione è prioritaria?",
            options: [
              "Valuto surroga a tasso fisso se la mia situazione lo permette",
              "Niente - i tassi torneranno a zero",
              "Vendo la casa immediatamente",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **Valutare una surroga** a tasso fisso può proteggere da ulteriori rialzi. Non è detto che convenga sempre, ma è da analizzare. I tassi non torneranno necessariamente a zero.",
            wrongExplanation: "Aspettare che i tassi tornino a zero è rischioso. Vendere la casa è estremo.\n\n**Opzioni da considerare:**\n- Surroga a tasso fisso\n- Rinegoziazione con la banca\n- Aumento della durata\n- Budget familiare rivisto",
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
        title: "🧠 Quiz finale: tassi d'interesse",
        content: "Hai imparato cosa sono i tassi, chi li decide, l'effetto sulle obbligazioni e come monitorarli.\n\n**Concetti chiave:**\n- Tassi: prezzo del denaro, fissato dalle banche centrali\n- Obbligazioni: relazione inversa con i tassi\n- Tassi reali: nominali - inflazione\n- Euribor: base per mutui variabili\n- Duration: sensibilità ai tassi\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Chi decide i tassi di riferimento nell'area euro?",
        pollAreas: [
          {
            id: "quiz-q1-30",
            prompt: "Seleziona la risposta corretta",
            options: [
              "La BCE (Banca Centrale Europea)",
              "Il governo italiano",
              "Le banche commerciali",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! La **BCE** fissa i tassi di riferimento per l'area euro. Le banche commerciali poi li applicano ai clienti.",
            wrongExplanation: "I governi non controllano i tassi. Le banche li applicano, non li decidono.\n\n**La BCE:**\n- Fissa i tassi di riferimento\n- Obiettivo: inflazione ~2%\n- Indipendente dai governi",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Tassi salgono dal 2% al 5%. Cosa succede ai prezzi delle obbligazioni?",
        pollAreas: [
          {
            id: "quiz-q2-30",
            prompt: "Seleziona l'effetto corretto",
            options: [
              "I prezzi scendono",
              "I prezzi salgono",
              "Nessun effetto",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Tassi su = prezzi obbligazioni giù. È la **relazione inversa** fondamentale.",
            wrongExplanation: "C'è sempre un effetto, ed è sempre inverso.\n\n**La regola:**\n- Tassi salgono → prezzi scendono\n- Tassi scendono → prezzi salgono",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Tasso nominale 3%, inflazione 5%. Qual è il tasso reale?",
        pollAreas: [
          {
            id: "quiz-q3-30",
            prompt: "Calcola il tasso reale",
            options: [
              "-2%",
              "+2%",
              "+8%",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Tasso reale = 3% - 5% = **-2%**. Stai perdendo potere d'acquisto.",
            wrongExplanation: "Il calcolo è semplice: nominale - inflazione.\n\n**3% - 5% = -2%**\n\nIl segno negativo indica perdita di potere d'acquisto.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco i tassi", "Conosco gli effetti", "So calcolare tassi reali"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: tassi d'interesse",
        content: "Complimenti! Hai completato la lezione sui tassi.\n\n**Principi chiave:**\n\n1. **Tassi**: prezzo del denaro, decisi dalle banche centrali\n2. **Effetto mutui**: tassi alti = rate più care\n3. **Effetto obbligazioni**: relazione inversa con i prezzi\n4. **Tassi reali**: nominali - inflazione\n5. **Duration**: sensibilità ai tassi\n\nI tassi sono la variabile macro più importante. Influenzano tutto.",
      },
      {
        kind: "explain",
        title: "📌 Collegamento con la sezione",
        content: "Questa lezione fa parte della sezione **Macroeconomia**.\n\n**Percorso:**\n- Inflazione (lezione precedente)\n- **Tassi d'interesse** (questa lezione)\n- Banche centrali e politica monetaria (prossima)\n- Cicli economici\n- Indicatori economici\n- Geopolitica\n\n**Il filo conduttore:**\nCapire il contesto macro ti aiuta a interpretare cosa succede ai tuoi investimenti e a prendere decisioni più informate.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Cosa farai con questa conoscenza?",
        pollAreas: [
          {
            id: "feedback-action-30",
            prompt: "Indica il tuo prossimo passo",
            options: [
              "Verifico il mio mutuo e calcolo l'impatto di tassi più alti",
              "Controllo la duration del mio portafoglio obbligazionario",
              "Continuo con la lezione sulle banche centrali",
            ],
            correctIndex: 0,
            correctExplanation: "Ottima scelta! **Verificare il mutuo** è prioritario se ne hai uno variabile. Calcola la rata con +2% di tassi e verifica se è sostenibile.",
            wrongExplanation: "Tutte le scelte sono valide!\n\n- Verificare il mutuo: priorità se hai variabile\n- Controllare duration: importante per obbligazioni\n- Continuare il corso: per visione completa",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Come calcolo l'impatto dei tassi sul mio mutuo?",
      "Conviene surrogare da variabile a fisso?",
      "Come riduco la duration del portafoglio?",
    ],
  },
};

const lesson30Definition = createStaticLessonDefinition("30", content);

export default lesson30Definition;
