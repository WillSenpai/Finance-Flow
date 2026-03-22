import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Gli errori comuni: impara dagli altri",
        content: "Questa è l'ultima lezione del corso. Riassumiamo gli **errori più comuni** che gli investitori commettono.\n\n**Perché studiare gli errori:**\n- È più facile evitare errori che generare alpha\n- Gli errori si ripetono da generazioni\n- Imparare dagli errori altrui costa meno\n\n**Charlie Munger (socio di Buffett):**\n'All I want to know is where I'm going to die, so I'll never go there.'\n\n**Traduzione:**\nConoscendo cosa NON fare, eviti le trappole più pericolose. Il successo viene spesso dall'evitare le sconfitte, non dal cercare le vittorie.\n\n**In questa lezione:**\nI 10 errori più comuni e come evitarli.",
      },
      {
        kind: "explain",
        title: "📌 Errori 1-3: Emotività",
        content: "**Errore 1: Comprare quando sale, vendere quando scende**\n- Il classico 'compra alto, vendi basso'\n- Seguire le emozioni invece del valore\n- Soluzione: regole scritte, PAC automatico\n\n**Errore 2: Panico durante le crisi**\n- Vendere al minimo\n- Perdere il rimbalzo\n- Soluzione: fondo emergenza, piano pre-definito\n\n**Errore 3: FOMO (Fear Of Missing Out)**\n- Comprare perché 'sta salendo'\n- Inseguire i trend\n- Soluzione: nessun investimento senza analisi\n\n**Il filo comune:**\nTutti questi errori vengono dalle **emozioni**. Il PAC e le regole scritte eliminano le decisioni emotive.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Qual è l'antidoto principale agli errori emotivi?",
        pollAreas: [
          {
            id: "concept-verify-40",
            prompt: "Seleziona l'antidoto",
            options: [
              "Regole scritte e automatizzazione (PAC)",
              "Seguire più notizie",
              "Più esperienza di trading",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Regole e automatizzazione** rimuovono le decisioni emotive. Il PAC compra automaticamente, senza che tu debba decidere durante la volatilità.",
            wrongExplanation: "Più notizie possono aumentare l'emotività. L'esperienza di trading non è necessaria.\n\n**La soluzione:**\n- Regole scritte in anticipo\n- PAC automatico\n- Ribilanciamento periodico",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Errori 4-6: Struttura",
        content: "**Errore 4: Nessuna diversificazione**\n- Tutto in un'azione, settore o paese\n- Un singolo evento può distruggere il portafoglio\n- Soluzione: ETF ampi, diversificazione geografica\n\n**Errore 5: Ignorare i costi**\n- Fondi con costi del 2-3% all'anno\n- Trading frequente = commissioni\n- Soluzione: ETF a basso costo, buy-and-hold\n\n**Errore 6: Nessun fondo emergenza**\n- Devi vendere investimenti quando servono soldi\n- Vendi al momento peggiore\n- Soluzione: 3-6 mesi di spese prima di investire\n\n**Il filo comune:**\nQuesti errori riguardano la **struttura** del portafoglio. Si risolvono all'inizio, non durante.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: struttura",
        content: "Perché il fondo emergenza è essenziale prima di investire?",
        pollAreas: [
          {
            id: "concept-solve-40",
            prompt: "Seleziona il motivo principale",
            options: [
              "Evita di dover vendere investimenti nel momento peggiore",
              "Rende di più degli investimenti",
              "È obbligatorio per legge",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il fondo emergenza **ti permette di restare investito** durante le crisi. Senza, devi vendere per necessità, spesso al minimo.",
            wrongExplanation: "Non rende di più né è obbligatorio per legge.\n\n**La funzione:**\n- Copre le emergenze\n- Non devi vendere investimenti\n- Puoi aspettare il recupero",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Conosco gli errori emotivi", "Capisco gli errori strutturali", "So come evitarli"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Errori 7-10: Comportamento",
        content: "**Errore 7: Market timing**\n- Cercare di prevedere i top e bottom\n- 'Aspetto il crollo per comprare'\n- Soluzione: investi regolarmente, ignora il timing\n\n**Errore 8: Overtrading**\n- Comprare e vendere continuamente\n- Costi + tasse + errori\n- Soluzione: buy-and-hold, ribilanciamento annuale\n\n**Errore 9: Inseguire i rendimenti passati**\n- Il fondo che è andato meglio l'anno scorso\n- Mean reversion: spesso underperforma dopo\n- Soluzione: focus su costi e diversificazione\n\n**Errore 10: Non avere un piano**\n- Decidere caso per caso\n- Inconsistenza\n- Soluzione: Investment Policy Statement scritto",
      },
      {
        kind: "explain",
        title: "📌 La checklist anti-errori",
        content: "**Prima di investire:**\n□ Ho il fondo emergenza (3-6 mesi)?\n□ Ho debiti ad alto interesse da pagare?\n□ Conosco il mio orizzonte temporale?\n□ Ho un piano scritto?\n\n**Per ogni investimento:**\n□ È diversificato o concentrato?\n□ Quali sono i costi totali?\n□ Perché sto comprando (analisi, non emozione)?\n□ A che prezzo venderei?\n\n**Durante la volatilità:**\n□ Il mio piano prevedeva questo?\n□ Ho bisogno di questi soldi presto?\n□ Il valore è cambiato o solo il prezzo?\n□ Sto seguendo le emozioni?\n\n**Periodicamente:**\n□ Il portafoglio è bilanciato?\n□ I miei obiettivi sono cambiati?\n□ Ho imparato dagli errori passati?",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Perché il market timing è un errore?",
        pollAreas: [
          {
            id: "widget-verify-40",
            prompt: "Seleziona il motivo principale",
            options: [
              "È impossibile prevedere costantemente i movimenti di mercato",
              "È illegale",
              "Funziona ma costa troppo",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Nessuno può prevedere costantemente** i top e bottom. Anche i professionisti sbagliano. Investire regolarmente (PAC) batte il timing nel lungo termine.",
            wrongExplanation: "Non è illegale e non è che funzioni ma costa.\n\n**Il problema:**\n- Impossibile essere precisi\n- Perdi i giorni migliori aspettando\n- Lo stress non vale la pena",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Un amico ti dice 'ho trovato un fondo che ha fatto +40% l'anno scorso!'. Cosa rispondi?",
        pollAreas: [
          {
            id: "widget-scenario-40",
            prompt: "Quale risposta è più appropriata?",
            options: [
              "I rendimenti passati non garantiscono quelli futuri - verifica i costi",
              "Investi tutto - 40% è incredibile",
              "Aspetta che faccia +50%",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **I rendimenti passati non garantiscono quelli futuri**. Spesso i fondi top performer underperformano dopo. Meglio verificare i costi e la strategia.",
            wrongExplanation: "Inseguire i rendimenti passati è l'errore #9.\n\n**La realtà:**\n- Mean reversion: i top spesso tornano alla media\n- I costi sono certi, i rendimenti no\n- Diversificazione > concentrazione sul 'vincente'",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Conosco gli errori comportamentali", "Ho la checklist", "Evito il market timing"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Il costo degli errori: numeri reali",
        content: "Gli errori costano caro. Ecco alcuni numeri:\n\n**DALBAR Study (ricorrente):**\n- Rendimento S&P 500: ~10% annuo (lungo termine)\n- Rendimento medio investitore: ~4-6%\n- Gap: 4-6% perso per errori comportamentali\n\n**Il gap viene da:**\n- Comprare dopo i rialzi\n- Vendere dopo i crolli\n- Cambiare continuamente strategia\n\n**Costi dei fondi attivi:**\n- Fondo attivo medio: 1.5-2% all'anno\n- ETF indicizzato: 0.1-0.3%\n- Differenza su 30 anni: centinaia di migliaia di euro\n\n**Market timing:**\n- Perdere i 10 giorni migliori in 20 anni: rendimento dimezzato\n- I giorni migliori spesso seguono i peggiori\n- Chi vende nel panico li perde\n\n**La conclusione:**\nEvitare gli errori vale più che cercare l'investimento perfetto.",
      },
      {
        kind: "explain",
        title: "📌 Cosa fare invece: i principi finali",
        content: "**Cosa fare:**\n\n**1. Inizia presto**\n- Il tempo è il tuo migliore alleato\n- Anche piccole somme crescono\n\n**2. Automatizza**\n- PAC mensile\n- Elimina le decisioni emotive\n\n**3. Diversifica**\n- ETF globali a basso costo\n- Non concentrare\n\n**4. Mantieni i costi bassi**\n- ETF vs fondi attivi\n- Poco trading\n\n**5. Ignora il rumore**\n- Le notizie sono intrattenimento\n- Il tuo piano conta\n\n**6. Resta investito**\n- Il tempo nel mercato > timing del mercato\n- Non vendere nel panico\n\n**7. Rivedi periodicamente**\n- Ribilancia una volta l'anno\n- Aggiusta per cambiamenti di vita\n\n**Il messaggio finale:**\nInvestire con successo non richiede genio. Richiede disciplina, pazienza e l'evitare gli errori più comuni.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Qual è il fattore più importante per il successo negli investimenti?",
        pollAreas: [
          {
            id: "challenge-verify-40",
            prompt: "Seleziona il fattore chiave",
            options: [
              "Disciplina e pazienza nel lungo termine",
              "Trovare le azioni che saliranno di più",
              "Avere informazioni prima degli altri",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Disciplina e pazienza** battono l'intelligenza e le informazioni. Il comportamento determina i risultati più della selezione titoli.",
            wrongExplanation: "Stock picking e informazioni non sono determinanti.\n\n**Quello che conta:**\n- Restare investiti\n- Evitare gli errori\n- Tempo nel mercato\n- Disciplina nel piano",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario finale",
        content: "Hai completato il corso. Qual è la prima cosa che farai?",
        pollAreas: [
          {
            id: "challenge-scenario-40",
            prompt: "Quale azione è prioritaria?",
            options: [
              "Scrivo il mio piano di investimento (IPS)",
              "Cerco l'azione perfetta",
              "Aspetto il momento perfetto per iniziare",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **Scrivere il piano** è la prima azione. Senza piano, finirai per fare tutti gli errori che hai studiato. Il piano ti guida quando le emozioni arrivano.",
            wrongExplanation: "L'azione perfetta non esiste. Il momento perfetto nemmeno.\n\n**La prima azione:**\n- Scrivi il tuo piano\n- Definisci gli obiettivi\n- Scegli l'asset allocation\n- Inizia con il PAC",
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
        title: "🧠 Quiz finale: errori comuni",
        content: "Hai imparato i 10 errori più comuni e come evitarli.\n\n**Recap:**\n- Errori emotivi: FOMO, panico, seguire il gregge\n- Errori strutturali: no diversificazione, costi alti, no fondo emergenza\n- Errori comportamentali: market timing, overtrading, inseguire rendimenti\n\n**La soluzione comune:**\nPiano scritto, PAC automatico, costi bassi, pazienza.\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Qual è l'errore più comune degli investitori retail?",
        pollAreas: [
          {
            id: "quiz-q1-40",
            prompt: "Seleziona l'errore più comune",
            options: [
              "Comprare quando sale, vendere quando scende",
              "Diversificare troppo",
              "Avere troppo cash",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Comprare alto, vendere basso** è l'errore più comune. È guidato dalle emozioni: euforia quando sale, panico quando scende.",
            wrongExplanation: "Diversificare troppo e troppo cash sono rari.\n\n**L'errore classico:**\n- FOMO: compra quando sale\n- Panico: vende quando scende\n- Risultato: rendimenti sotto la media",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Perché il fondo emergenza è prioritario prima di investire?",
        pollAreas: [
          {
            id: "quiz-q2-40",
            prompt: "Seleziona il motivo principale",
            options: [
              "Evita di dover vendere investimenti durante le crisi",
              "Rende più degli investimenti",
              "È obbligatorio",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Il fondo emergenza **ti permette di restare investito**. Senza, potresti dover vendere al momento peggiore per coprire emergenze.",
            wrongExplanation: "Non rende di più né è obbligatorio.\n\n**La funzione:**\n- Copre emergenze\n- Non devi vendere investimenti\n- Mantieni il piano",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Qual è il miglior antidoto agli errori emotivi?",
        pollAreas: [
          {
            id: "quiz-q3-40",
            prompt: "Seleziona l'antidoto",
            options: [
              "Piano scritto e PAC automatico",
              "Più informazioni e notizie",
              "Consultare amici e social",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Piano scritto e PAC** eliminano le decisioni emotive. Compri automaticamente, senza dover decidere durante la volatilità.",
            wrongExplanation: "Più notizie e social possono peggiorare l'emotività.\n\n**La soluzione:**\n- Piano pre-definito\n- PAC automatico\n- Ignora il rumore",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Conosco gli errori", "So come evitarli", "Ho un piano"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "🎉 Congratulazioni! Hai completato il corso",
        content: "Complimenti! Hai completato tutte le 40 lezioni dell'Academy.\n\n**Il percorso che hai fatto:**\n- **Fondamenti**: budget, risparmio, debiti, fondo emergenza\n- **Investimenti base**: rischio, interesse composto, diversificazione\n- **Strumenti**: azioni, obbligazioni, ETF, fondi\n- **Asset alternativi**: crypto, commodities, real estate\n- **Macroeconomia**: inflazione, tassi, cicli, geopolitica\n- **Strategie**: asset allocation, value investing, psicologia\n\n**Ora hai le basi per:**\n- Costruire un budget solido\n- Investire con consapevolezza\n- Evitare gli errori comuni\n- Prendere decisioni informate\n\n**Il prossimo passo è agire.**",
      },
      {
        kind: "explain",
        title: "📌 I principi chiave da portare con te",
        content: "**1. Inizia dalle fondamenta**\n- Budget → Risparmio → Fondo emergenza → Investimenti\n\n**2. Investi per il lungo termine**\n- Il tempo è il tuo migliore alleato\n- Il mercato premia la pazienza\n\n**3. Diversifica e mantieni bassi i costi**\n- ETF globali a basso costo\n- Non concentrare, non fare overtrading\n\n**4. Automatizza e ignora il rumore**\n- PAC mensile\n- Le notizie sono intrattenimento\n\n**5. Il tuo nemico sei tu**\n- Regole scritte\n- Disciplina nelle emozioni\n- Evita gli errori comuni\n\n**6. Il margine di sicurezza sempre**\n- In ogni decisione finanziaria\n- Protezione dagli errori\n\n**Questi principi ti accompagneranno per sempre.**",
      },
      {
        kind: "question",
        title: "🎯 Il tuo primo passo dopo il corso",
        content: "Cosa farai ora?",
        pollAreas: [
          {
            id: "feedback-action-40",
            prompt: "Indica la tua prima azione",
            options: [
              "Scrivo il mio Investment Policy Statement",
              "Rivedo il mio budget con nuovi occhi",
              "Inizio un PAC su ETF globale",
            ],
            correctIndex: 0,
            correctExplanation: "Ottima scelta! L'**IPS** è il documento che ti guiderà. Scrivi obiettivi, asset allocation, regole. Poi il PAC e tutto il resto saranno conseguenze naturali.",
            wrongExplanation: "Tutte le scelte sono ottime!\n\n- IPS: il piano guida\n- Budget: le fondamenta\n- PAC: l'azione\n\nL'importante è AGIRE.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Aiutami a scrivere il mio Investment Policy Statement",
      "Qual è l'ETF globale migliore per iniziare?",
      "Come imposto un PAC automatico?",
    ],
  },
};

const lesson40Definition = createStaticLessonDefinition("40", content);

export default lesson40Definition;
