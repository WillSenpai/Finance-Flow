import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Banche centrali: i guardiani della moneta",
        content: "Le **banche centrali** sono le istituzioni più potenti nel mondo finanziario. Controllano la moneta e influenzano l'economia.\n\n**Le principali:**\n- **BCE** (Banca Centrale Europea): 20 paesi, euro\n- **Fed** (Federal Reserve): Stati Uniti, dollaro\n- **BoE** (Bank of England): Regno Unito, sterlina\n- **BoJ** (Bank of Japan): Giappone, yen\n- **PBoC** (People's Bank of China): Cina, yuan\n\n**I loro poteri:**\n- Fissare i tassi d'interesse\n- Stampare moneta\n- Comprare/vendere titoli (QE/QT)\n- Regolare le banche commerciali\n- Intervenire sui cambi\n\n**Il punto chiave:** quando la Fed o la BCE parlano, i mercati ascoltano. Le loro decisioni muovono migliaia di miliardi.",
      },
      {
        kind: "explain",
        title: "📌 Il mandato: stabilità dei prezzi",
        content: "Le banche centrali hanno un **mandato** - un obiettivo principale.\n\n**BCE:**\n- Mandato primario: stabilità dei prezzi (inflazione ~2%)\n- Non ha mandato esplicito sull'occupazione\n\n**Fed:**\n- Mandato duale: stabilità dei prezzi E massima occupazione\n- Bilancia inflazione e lavoro\n\n**Perché 2% e non 0%:**\n- Un po' di inflazione facilita gli aggiustamenti salariali\n- Deflazione è più pericolosa dell'inflazione moderata\n- Il 2% dà margine per tagliare i tassi se necessario\n\n**Indipendenza:**\nLe banche centrali sono indipendenti dai governi. Questo protegge dalla tentazione politica di stampare moneta per finanziare spese.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Qual è l'obiettivo principale della BCE?",
        pollAreas: [
          {
            id: "concept-verify-31",
            prompt: "Seleziona l'obiettivo corretto",
            options: [
              "Mantenere l'inflazione intorno al 2%",
              "Massimizzare la crescita economica",
              "Creare posti di lavoro",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! La BCE ha come mandato primario la **stabilità dei prezzi**, definita come inflazione intorno al 2% nel medio termine.",
            wrongExplanation: "Crescita e lavoro non sono il mandato primario della BCE (diversamente dalla Fed).\n\n**Il mandato BCE:**\n- Obiettivo primario: inflazione ~2%\n- Subordinato: sostenere le politiche economiche EU\n- Indipendenza dai governi",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Gli strumenti: tassi e bilancio",
        content: "Come fanno le banche centrali a raggiungere i loro obiettivi?\n\n**1. Tassi d'interesse:**\n- Lo strumento principale\n- Alzano i tassi per frenare l'inflazione\n- Abbassano i tassi per stimolare l'economia\n\n**2. Operazioni di mercato aperto:**\n- Comprano/vendono titoli di stato\n- Iniettano o drenano liquidità\n\n**3. QE (Quantitative Easing):**\n- Comprare massicciamente obbligazioni\n- Abbassa i tassi a lungo termine\n- Usato quando i tassi sono già a zero\n\n**4. QT (Quantitative Tightening):**\n- Vendere obbligazioni o non rinnovarle\n- Drena liquidità dal sistema\n- Alza i tassi a lungo termine\n\n**5. Forward guidance:**\n- Comunicare le intenzioni future\n- Influenza le aspettative dei mercati",
      },
      {
        kind: "question",
        title: "🧠 Verifica: strumenti",
        content: "La BCE vuole combattere un'inflazione al 8%. Cosa fa probabilmente?",
        pollAreas: [
          {
            id: "concept-solve-31",
            prompt: "Seleziona l'azione appropriata",
            options: [
              "Alza i tassi d'interesse",
              "Abbassa i tassi d'interesse",
              "Stampa più moneta",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Per combattere l'inflazione alta, la BCE **alza i tassi**. Tassi alti rendono il credito più caro, frenano consumi e investimenti, riducendo la pressione sui prezzi.",
            wrongExplanation: "Abbassare i tassi o stampare moneta aumenterebbe l'inflazione.\n\n**Per combattere l'inflazione:**\n- Alzare i tassi\n- QT (drenare liquidità)\n- Comunicazione hawkish",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco le banche centrali", "Conosco gli strumenti", "So come combattono l'inflazione"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Leggere le banche centrali: cosa monitorare",
        content: "Come investitore, devi sapere cosa guardare:\n\n**1. Riunioni di politica monetaria:**\n- BCE: ogni 6 settimane\n- Fed: ogni 6 settimane (FOMC)\n- I mercati si muovono sui comunicati\n\n**2. Conferenze stampa:**\n- Dopo ogni riunione\n- Le parole contano: 'hawkish' vs 'dovish'\n- Hawkish: orientamento restrittivo (tassi su)\n- Dovish: orientamento accomodante (tassi giù)\n\n**3. Dot plot (Fed):**\n- Proiezioni dei tassi dei membri FOMC\n- Indica dove pensano di andare\n\n**4. Proiezioni macroeconomiche:**\n- Inflazione, crescita, disoccupazione attese\n- Aggiornate trimestralmente\n\n**5. Verbali (Minutes):**\n- Pubblicati settimane dopo\n- Dettagli sulle discussioni interne",
      },
      {
        kind: "explain",
        title: "📌 Hawkish vs Dovish: il linguaggio",
        content: "Il tono delle banche centrali guida i mercati:\n\n**Hawkish (falco):**\n- Preoccupato per l'inflazione\n- Orientato a tassi più alti\n- Tono restrittivo\n- Parole chiave: 'vigilante', 'determinato', 'persistente'\n\n**Dovish (colomba):**\n- Preoccupato per la crescita/occupazione\n- Orientato a tassi più bassi\n- Tono accomodante\n- Parole chiave: 'paziente', 'dipendente dai dati', 'rischi bilanciati'\n\n**Come reagiscono i mercati:**\n- Hawkish inatteso: azioni giù, obbligazioni giù, valuta su\n- Dovish inatteso: azioni su, obbligazioni su, valuta giù\n\n**Il punto:** conta la sorpresa rispetto alle aspettative, non il tono assoluto.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "La BCE è più 'hawkish' del previsto. Cosa succede probabilmente?",
        pollAreas: [
          {
            id: "widget-verify-31",
            prompt: "Seleziona la reazione attesa",
            options: [
              "Azioni e obbligazioni scendono, euro sale",
              "Tutto sale",
              "Nessun movimento",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Hawkish inatteso = **tassi attesi più alti**. Le azioni soffrono (valutazioni scendono), le obbligazioni soffrono (prezzi giù), l'euro sale (rendimenti più attraenti).",
            wrongExplanation: "I mercati reagiscono sempre alle sorprese.\n\n**Hawkish inatteso:**\n- Azioni: giù (tassi più alti = valutazioni più basse)\n- Obbligazioni: giù (prezzi vs tassi)\n- Euro: su (rendimenti più attraenti)",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "La Fed dice 'saremo pazienti e dipendenti dai dati'. È hawkish o dovish?",
        pollAreas: [
          {
            id: "widget-scenario-31",
            prompt: "Classifica il tono",
            options: [
              "Dovish - tono accomodante, nessuna urgenza di alzare",
              "Hawkish - tono aggressivo",
              "Neutrale - impossibile interpretare",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! 'Paziente' e 'dipendente dai dati' sono termini **dovish**. Indicano che non hanno fretta di alzare i tassi e osservano come si evolve la situazione.",
            wrongExplanation: "Le parole hanno significati codificati.\n\n**Dizionario banche centrali:**\n- 'Paziente': non abbiamo fretta\n- 'Dipendente dai dati': aspettiamo\n- 'Vigilante': pronti ad agire (hawkish)\n- 'Determinato': agiremo (hawkish)",
            allowText: false,
          },
        ],
      },
    ],
    options: ["So cosa monitorare", "Capisco il linguaggio", "Interpreto i segnali"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ QE e QT: i programmi straordinari",
        content: "Quando i tassi a zero non bastano, le banche centrali usano strumenti straordinari.\n\n**QE (Quantitative Easing):**\n- La banca centrale compra obbligazioni sul mercato\n- Paga con moneta 'stampata' (creata digitalmente)\n- Effetti: tassi lunghi giù, liquidità su, asset prices su\n- Usato dopo 2008 e durante COVID\n\n**QT (Quantitative Tightening):**\n- La banca centrale vende obbligazioni o non le rinnova\n- Drena liquidità dal sistema\n- Effetti: tassi lunghi su, liquidità giù, pressione su asset\n- Usato dal 2022 per combattere inflazione\n\n**Le critiche al QE:**\n- Aumenta le disuguaglianze (chi ha asset guadagna)\n- Può creare bolle\n- Difficile uscirne\n\n**Il punto:** QE e QT sono stati la politica monetaria dominante dell'ultimo decennio.",
      },
      {
        kind: "explain",
        title: "📌 L'effetto sui tuoi investimenti",
        content: "Come le politiche delle banche centrali impattano il tuo portafoglio:\n\n**Durante QE (espansione):**\n- Azioni: tendono a salire (liquidità, tassi bassi)\n- Obbligazioni: prezzi su (acquisti BC)\n- Immobiliare: su (mutui bassi)\n- Oro: dipende (tassi reali negativi: oro su)\n- Crypto: spesso su (ricerca di rendimento)\n\n**Durante QT (restrizione):**\n- Azioni: pressione (liquidità ridotta)\n- Obbligazioni: prezzi giù (vendite BC)\n- Immobiliare: pressione (mutui su)\n- Cash/depositi: più interessanti (tassi su)\n\n**La regola generale:**\n- Politica espansiva: risk-on (asset rischiosi beneficiano)\n- Politica restrittiva: risk-off (cash e sicurezza)\n\n**Attenzione:** i mercati si muovono sulle aspettative, non sulle azioni. Quando tutti si aspettano QT, l'effetto è già nei prezzi.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Durante il QE, perché le azioni tendono a salire?",
        pollAreas: [
          {
            id: "challenge-verify-31",
            prompt: "Seleziona il motivo principale",
            options: [
              "Liquidità abbondante e tassi bassi spingono gli investitori verso asset rischiosi",
              "Le banche centrali comprano azioni",
              "I profitti aziendali aumentano automaticamente",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il QE crea **liquidità** e abbassa i tassi. Gli investitori cercano rendimento e comprano azioni. Non è che i fondamentali migliorino, ma le valutazioni salgono.",
            wrongExplanation: "Le BC non comprano azioni (in Europa). I profitti non c'entrano direttamente.\n\n**Meccanismo:**\n- QE → liquidità abbondante\n- Tassi bassi → obbligazioni non rendono\n- Investitori → cercano rendimento nelle azioni\n- Domanda → prezzi salgono",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "La Fed inizia il QT. Hai un portafoglio 80% azioni tech growth. Cosa consideri?",
        pollAreas: [
          {
            id: "challenge-scenario-31",
            prompt: "Quale riflessione è corretta?",
            options: [
              "Le azioni growth sono sensibili ai tassi - potrei diversificare",
              "Il QT non ha effetto sulle azioni",
              "Dovrei comprare più tech perché scenderà",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Le **azioni growth** sono particolarmente sensibili ai tassi perché i loro utili sono lontani nel tempo. QT = tassi su = valutazioni growth sotto pressione. Diversificare può essere prudente.",
            wrongExplanation: "Il QT ha effetti significativi, specialmente su growth.\n\n**Perché growth soffre:**\n- Utili futuri valgono meno con tassi alti\n- Liquidità ridotta = meno appetito per il rischio\n- Valutazioni elevate più vulnerabili",
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
        title: "🧠 Quiz finale: banche centrali",
        content: "Hai imparato cosa sono le banche centrali, i loro strumenti, il linguaggio e gli effetti sul portafoglio.\n\n**Concetti chiave:**\n- BCE/Fed: controllano tassi e liquidità\n- Mandato BCE: inflazione ~2%\n- Strumenti: tassi, QE, QT, forward guidance\n- Hawkish/Dovish: orientamento restrittivo/accomodante\n- QE: liquidità su, asset su / QT: opposto\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Qual è lo strumento principale delle banche centrali?",
        pollAreas: [
          {
            id: "quiz-q1-31",
            prompt: "Seleziona lo strumento principale",
            options: [
              "I tassi d'interesse",
              "La stampa di banconote",
              "I prestiti alle imprese",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! I **tassi d'interesse** sono lo strumento principale. QE/QT sono strumenti straordinari usati quando i tassi non bastano.",
            wrongExplanation: "Stampare banconote è una conseguenza, non uno strumento diretto. I prestiti alle imprese sono delle banche commerciali.\n\n**Lo strumento chiave: tassi**",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Cosa significa un tono 'hawkish' della BCE?",
        pollAreas: [
          {
            id: "quiz-q2-31",
            prompt: "Seleziona il significato corretto",
            options: [
              "Orientamento verso tassi più alti per combattere l'inflazione",
              "Orientamento verso tassi più bassi",
              "Nessuna preferenza sui tassi",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **Hawkish** = falco = orientamento restrittivo = tassi più alti. Il falco 'attacca' l'inflazione con tassi alti.",
            wrongExplanation: "Hawkish è restrittivo, non accomodante.\n\n**Ricorda:**\n- Hawkish (falco): tassi su\n- Dovish (colomba): tassi giù",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Durante il QE, cosa tende a succedere alle azioni?",
        pollAreas: [
          {
            id: "quiz-q3-31",
            prompt: "Seleziona l'effetto tipico",
            options: [
              "Tendono a salire per la liquidità abbondante",
              "Tendono a scendere",
              "Non c'è correlazione",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il QE crea **liquidità** che cerca rendimento. Con i tassi bassi, le azioni diventano più attraenti e i prezzi salgono.",
            wrongExplanation: "C'è una correlazione forte tra QE e azioni.\n\n**QE → liquidità → azioni su**",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco le banche centrali", "Conosco gli strumenti", "So interpretare le comunicazioni"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: banche centrali",
        content: "Complimenti! Hai completato la lezione sulle banche centrali.\n\n**Principi chiave:**\n\n1. **BCE/Fed**: istituzioni più potenti della finanza\n2. **Mandato**: stabilità dei prezzi (~2% inflazione)\n3. **Strumenti**: tassi, QE/QT, forward guidance\n4. **Linguaggio**: hawkish (restrittivo) vs dovish (accomodante)\n5. **Effetti**: politica monetaria influenza tutti gli asset\n\nCapire le banche centrali ti aiuta a interpretare i movimenti di mercato.",
      },
      {
        kind: "explain",
        title: "📌 Collegamento con la sezione",
        content: "Questa lezione fa parte della sezione **Macroeconomia**.\n\n**Percorso:**\n- Inflazione\n- Tassi d'interesse\n- **Banche centrali** (questa lezione)\n- Cicli economici (prossima)\n- Indicatori economici\n- Geopolitica\n\nLe banche centrali sono al centro di tutto: reagiscono all'inflazione, fissano i tassi, influenzano i cicli.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Cosa farai con questa conoscenza?",
        pollAreas: [
          {
            id: "feedback-action-31",
            prompt: "Indica il tuo prossimo passo",
            options: [
              "Seguo le prossime riunioni BCE/Fed",
              "Rivedo il portafoglio alla luce della politica monetaria",
              "Continuo con la lezione sui cicli economici",
            ],
            correctIndex: 0,
            correctExplanation: "Ottima scelta! **Seguire le riunioni** ti aiuta a capire dove sta andando la politica monetaria. I mercati si muovono su queste comunicazioni.",
            wrongExplanation: "Tutte le scelte sono valide!\n\n- Seguire le riunioni: informazione\n- Rivedere il portafoglio: azione\n- Continuare il corso: approfondimento",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Quando sono le prossime riunioni BCE?",
      "Come interpreto il comunicato della Fed?",
      "Cosa significa 'pivot' della banca centrale?",
    ],
  },
};

const lesson31Definition = createStaticLessonDefinition("31", content);

export default lesson31Definition;
