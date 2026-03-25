import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Perché il fondo emergenza è fondamentale",
        content: "Nelle lezioni precedenti hai costruito budget, risparmio automatico, gestione debiti e obiettivi finanziari. Ma tutto questo può crollare se arriva un **imprevisto** e non hai un cuscinetto.\n\nIl fondo emergenza ha uno scopo preciso: **evitare che un imprevisto si trasformi in debito**.\n\n**Esempi concreti:**\n• La lavatrice si rompe (500€) → senza fondo, finisci in finanziamento\n• Perdi il lavoro per 2 mesi → senza fondo, accumuli debiti per vivere\n• Spesa medica improvvisa → senza fondo, usi la carta di credito a rate\n\nCon un fondo emergenza, affronti queste situazioni senza compromettere il tuo piano finanziario. È la **prima linea di difesa** del tuo sistema.",
      },
      {
        kind: "explain",
        title: "📌 Quanto deve essere grande? La strategia a step",
        content: "Il target ideale del fondo emergenza dipende dalla tua situazione, ma una regola pratica funziona per tutti:\n\n**Target iniziale: 1 mese di spese essenziali**\nSe spendi 1.200€/mese per vivere (affitto, bollette, cibo, trasporti), il primo obiettivo è avere 1.200€ sempre disponibili.\n\n**Target intermedio: 3 mesi**\nCopre la maggior parte degli imprevisti: perdita lavoro temporanea, spese mediche, riparazioni grosse.\n\n**Target finale: 6 mesi**\nProtegge anche da eventi più gravi: perdita lavoro prolungata, malattia seria.\n\n**Perché a step?**\nPartire con 'devo mettere da parte 6 mesi' può sembrare impossibile e demotivare. Invece:\n1. Raggiungi il primo step (1 mese) → celebri\n2. Vai al secondo step (3 mesi) → ti senti protetto\n3. Completi con il terzo step (6 mesi) → hai la sicurezza totale\n\nQuesto approccio progressivo è lo stesso del risparmio automatico: obiettivi piccoli e raggiungibili battono obiettivi enormi e paralizzanti.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Perché il fondo deve essere liquido e separato dal conto operativo?",
        pollAreas: [
          {
            id: "concept-verify-6",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Per essere accessibile subito e non confondersi con le spese",
              "Non importa dove sia",
              "Deve essere investito in azioni",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il fondo emergenza deve essere **liquido** (accessibile immediatamente) e **separato** (su un conto dedicato).\n\nSe è insieme ai soldi per le spese quotidiane, è troppo facile 'prenderlo in prestito' per non-emergenze.",
            wrongExplanation: "Il fondo emergenza ha due caratteristiche fondamentali:\n\n**1. Liquidità**: deve essere accessibile immediatamente, senza vincoli o penali\n**2. Separazione**: deve stare su un conto diverso da quello operativo\n\nSe è investito in azioni, potresti dover vendere in perdita quando serve. Se è insieme ai soldi delle spese, lo userai per non-emergenze.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "📊 Perché la crescita a step funziona",
        content: "Costruire il fondo emergenza in **step progressivi** non è solo psicologicamente più facile. È anche più efficace.\n\n**Vantaggi della crescita a step:**\n\n1. **Evita la frustrazione**: guardare uno zero e pensare 'devo arrivare a 7.000€' paralizza. Pensare 'devo arrivare a 1.200€' è gestibile.\n\n2. **Mantiene la routine**: ogni step raggiunto rafforza l'abitudine del risparmio automatico.\n\n3. **Protegge subito**: anche 1 mese di fondo copre la maggior parte degli imprevisti quotidiani.\n\n4. **Crea momentum**: ogni traguardo ti dà energia per il successivo.\n\nRicorda la lezione sul risparmio: la continuità batte il volume. Meglio costruire lentamente ma costantemente.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: calcolo fondo emergenza",
        content:
          "Spese essenziali mensili: 1.250€\n\nTarget livello 1: 1.250€ (1 mese)\nTarget livello 2: 3.750€ (3 mesi)",
        pollAreas: [
          {
            id: "concept-solve-6",
            prompt: "Qual è il vantaggio della crescita a step?",
            options: [
              "Mantiene motivazione e routine costante",
              "Richiede uno sforzo unico enorme all'inizio",
              "Non serve pianificare i tempi",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! La crescita a step mantiene la **motivazione** perché ogni traguardo è raggiungibile, e rafforza la **routine** del risparmio automatico.\n\nPartire con obiettivi enormi paralizza. Partire con obiettivi piccoli crea momentum.",
            wrongExplanation: "La crescita a step funziona perché:\n\n**1. Mantiene la motivazione**: obiettivi piccoli sono raggiungibili e gratificanti\n**2. Rafforza la routine**: ogni step consolidato diventa automatico\n**3. Protegge subito**: anche il primo step (1 mese) copre la maggior parte degli imprevisti\n\nUno sforzo unico è insostenibile e demotivante.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Calcolo spese essenziali", "Definisco target a step", "Scelgo conto dedicato"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Come costruire il fondo: l'automatismo che funziona",
        content: "Hai già imparato nella lezione sul risparmio automatico che l'automatismo batte la motivazione. Per il fondo emergenza vale lo stesso principio, amplificato.\n\n**Perché automatizzare piccoli importi funziona:**\n\n• **Non richiede decisioni mensili**: i soldi si spostano da soli, senza che tu debba pensarci\n• **Costruisce stabilità nel tempo**: 100€/mese per 12 mesi = 1.200€ senza sforzo percepito\n• **Elimina la tentazione**: i soldi 'spariscono' dal conto corrente prima che tu possa spenderli\n\nL'approccio è identico al risparmio automatico, ma con una differenza: il fondo emergenza ha una **destinazione specifica** (liquidità per imprevisti) e deve restare **sempre accessibile**.\n\nNon investire il fondo emergenza in strumenti rischiosi o vincolati. Deve essere lì quando serve, immediatamente.",
      },
      {
        kind: "explain",
        title: "📌 I tre elementi operativi del fondo emergenza",
        content: "Per far funzionare il fondo emergenza, ti servono tre elementi concreti:\n\n**1. Importo fisso (settimanale o mensile)**\nDecidi una cifra sostenibile: 50€ a settimana? 150€ al mese? L'importo deve essere gestibile anche nei mesi difficili. Come nella lezione sul risparmio, definisci anche una 'versione B' per i momenti stretti.\n\n**2. Data fissa**\nIl bonifico automatico parte sempre lo stesso giorno - idealmente il giorno dello stipendio o quello dopo. Zero decisioni, zero dimenticanze.\n\n**3. Nome chiaro del fondo**\nNon 'conto risparmio generico'. Ma 'FONDO EMERGENZA - NON TOCCARE'. Il nome ti ricorda lo scopo e crea una barriera psicologica prima di usarlo per non-emergenze.\n\n**Dove tenere il fondo?**\nConto deposito svincolato (accesso immediato) o conto corrente separato. Mai insieme ai soldi per le spese quotidiane - troppo facile 'prenderli in prestito'.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Quale frequenza di versamento riduce di più il rischio di saltare?",
        pollAreas: [
          {
            id: "widget-verify-6",
            prompt: "Seleziona la frequenza migliore",
            options: [
              "Versamento automatico il giorno dello stipendio",
              "Quando mi ricordo",
              "Una volta all'anno",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il versamento automatico il giorno dello stipendio è il più affidabile.\n\n**Perché funziona:**\n• Zero decisioni da prendere\n• I soldi 'spariscono' prima che tu possa spenderli\n• Diventa routine automatica",
            wrongExplanation: "Il versamento automatico il giorno dello stipendio è il più efficace perché:\n\n**1. Non richiede decisioni**: si attiva da solo\n**2. Precede le spese**: i soldi vengono messi da parte prima che tu possa usarli\n**3. Diventa abitudine**: dopo qualche mese non ci pensi più\n\n'Quando mi ricordo' non funziona mai a lungo termine.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica: piano di accumulo",
        content:
          "Obiettivo: 1.250€ in 10 mesi\n\nQuota media: 125€/mese\nQuota minima nei mesi critici: 90€",
        pollAreas: [
          {
            id: "widget-scenario-6",
            prompt: "Perché è importante avere una quota minima?",
            options: [
              "Permette di continuare anche nei mesi difficili senza interrompere",
              "Non serve, basta saltare i mesi difficili",
              "La quota minima rallenta troppo l'obiettivo",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! La quota minima permette di **non interrompere mai** la routine.\n\nSaltare un mese è l'inizio della fine. Meglio versare 90€ che saltare e perdere l'abitudine.",
            wrongExplanation: "La quota minima serve a mantenere la **continuità** anche nei mesi difficili.\n\n**Il problema di saltare:**\n• Un mese saltato diventa due, poi tre\n• L'abitudine si spezza\n• Ricostruire la routine è più difficile che mantenerla\n\nMeglio 90€ costanti che 125€ intermittenti.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Imposto quota base", "Definisco quota minima", "Attivo check mensile"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Il momento critico: dopo aver usato il fondo",
        content: "Hai costruito il tuo fondo emergenza, tutto funziona... e poi succede: la lavatrice si rompe, la devi usare, il fondo scende.\n\n**Questo è esattamente ciò per cui il fondo esiste.** Usarlo non è un fallimento - è un successo del sistema. Hai evitato un debito.\n\nMa ora arriva il momento critico: **ricostruire**.\n\nIl rischio è pensare 'ok, ora ricomincerò quando posso' e non ricominciare mai. È lo stesso pattern che hai visto nella lezione sul risparmio: i 'quando posso' non arrivano mai.\n\n**La regola**: dopo un prelievo dal fondo emergenza, la priorità immediata è attivare un piano di ricostruzione. Non 'la prossima settimana', non 'quando le cose si calmano'. Subito.\n\nQuesta urgenza della ricostruzione è ciò che distingue chi mantiene il sistema da chi lo abbandona.",
      },
      {
        kind: "explain",
        title: "📌 Il piano di ricostruzione automatico",
        content: "Ogni volta che usi il fondo emergenza, devi attivare **automaticamente** un piano di ricostruzione:\n\n**Step 1: Calcola il gap**\nQuanto hai prelevato? Es: 600€\n\n**Step 2: Definisci il tempo di recupero**\nIn quanto tempo vuoi ricostruire? Es: 6 mesi\n\n**Step 3: Calcola la quota extra**\n600€ ÷ 6 mesi = 100€/mese extra oltre alla quota base\n\n**Step 4: Automatizza**\nAumenta temporaneamente il bonifico automatico (da 150€ a 250€) oppure aggiungi un secondo bonifico dedicato alla ricostruzione.\n\nQuesto approccio è identico a quello che hai visto nella lezione sui debiti: concentri le forze su un obiettivo (ricostruzione) finché non è raggiunto.\n\n**Importante**: la quota base NON si ferma mai. Continui a versare la quota normale + la quota extra di ricostruzione. Altrimenti l'abitudine si spezza.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Quale piano riattivi dopo un prelievo di emergenza?",
        pollAreas: [
          {
            id: "challenge-verify-6",
            prompt: "Seleziona l'approccio corretto",
            options: [
              "Quota extra mensile fino a recupero completo",
              "Aspetto tempi migliori",
              "Non ricostruisco mai",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Dopo un prelievo, attivi subito una **quota extra** temporanea fino al recupero completo.\n\nLa quota base continua invariata + la quota extra accelera la ricostruzione.",
            wrongExplanation: "Dopo un prelievo dal fondo emergenza, la regola è:\n\n**Quota base** (invariata) + **Quota extra** (temporanea fino al recupero)\n\n'Aspetto tempi migliori' non funziona mai. I tempi migliori non arrivano se non li crei tu con un piano concreto.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🛡️ La strategia quota base + quota extra",
        content: "Il segreto per ricostruire il fondo senza interrompere l'abitudine è separare mentalmente due flussi:\n\n**Quota base**: il versamento normale che fai ogni mese (es. 150€). Questo NON cambia mai, qualsiasi cosa succeda. È la tua abitudine consolidata.\n\n**Quota extra**: un versamento aggiuntivo temporaneo per ricostruire (es. +100€/mese per 6 mesi). Quando il fondo torna al target, la quota extra si ferma.\n\n**Perché funziona:**\n• La quota base mantiene attiva la routine (come hai imparato nella lezione sul risparmio)\n• La quota extra accelera la ricostruzione senza stravolgere le abitudini\n• Quando finisce il recupero, torni automaticamente al ritmo normale\n\n**Esempio concreto:**\nFondo target: 3.000€ | Fondo attuale: 2.400€ (hai usato 600€)\nQuota base: 150€/mese | Quota extra: 100€/mese per 6 mesi\nTra 6 mesi: torni a 3.000€ e riduci a sola quota base.\n\nQuesto approccio ti permette di gestire gli imprevisti senza mai perdere il controllo del sistema.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: ricostruzione fondo",
        content:
          "Hai dovuto prelevare 600€ dal fondo emergenza.\n\nDevi pianificare la ricostruzione.",
        pollAreas: [
          {
            id: "challenge-scenario-6",
            prompt: "Qual è il piano corretto di ricostruzione?",
            options: [
              "Obiettivo 6 mesi + quota extra 100€/mese + quota base invariata",
              "Aspettare tempi migliori per ricominciare",
              "Dimezzare la quota base per compensare",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il piano corretto è:\n\n• **Obiettivo**: recuperare 600€ in 6 mesi\n• **Quota extra**: 100€/mese aggiuntivi\n• **Quota base**: rimane invariata (es. 150€)\n\nTotale mensile temporaneo: 250€ fino al recupero, poi torni a 150€.",
            wrongExplanation: "Il piano di ricostruzione corretto prevede:\n\n**1. Non toccare la quota base**: l'abitudine deve continuare\n**2. Aggiungere quota extra temporanea**: 600€ ÷ 6 mesi = 100€/mese\n**3. Automatizzare**: aumenti il bonifico o ne aggiungi uno dedicato\n\n'Aspettare tempi migliori' non funziona. Dimezzare la quota base spezza l'abitudine.",
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
        title: "🧠 Quiz finale: il tuo fondo è progettato per reggere?",
        content: "Hai imparato perché il fondo emergenza è fondamentale, come costruirlo a step, come automatizzarlo, e come ricostruirlo dopo un prelievo.\n\nOra mettiamo tutto insieme con un quiz pratico. Le domande verificano se hai progettato un fondo che regge davvero quando serve.\n\n**Ricorda i principi chiave:**\n• Il fondo evita che imprevisti diventino debiti\n• Crescita a step: 1 mese → 3 mesi → 6 mesi\n• Automatismo: importo fisso, data fissa, nome chiaro\n• Dopo ogni prelievo: piano di ricostruzione immediato\n• Quota base + quota extra = sistema che non si spezza",
      },
      {
        kind: "explain",
        title: "📌 Come rispondere: i quattro pilastri del fondo",
        content: "Quando rispondi alle domande sul fondo emergenza, verifica che la risposta rispetti i **quattro pilastri**:\n\n**1. Liquidità**\nIl fondo deve essere sempre accessibile immediatamente. Niente vincoli, niente investimenti rischiosi.\n\n**2. Separazione**\nI soldi devono stare su un conto separato, non insieme alle spese quotidiane. Questo evita di 'prenderli in prestito' per non-emergenze.\n\n**3. Progressione a step**\nMeglio costruire gradualmente e raggiungere obiettivi intermedi che partire con target impossibili.\n\n**4. Piano di ricostruzione**\nDopo ogni prelievo, deve attivarsi automaticamente un piano per tornare al target.\n\nSe una risposta viola anche solo uno di questi pilastri, è probabilmente sbagliata.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Con spese essenziali 1.400€, qual è un primo target corretto?",
        pollAreas: [
          {
            id: "quiz-q1-6",
            prompt: "Scegli la risposta migliore",
            options: [
              "1.400€ come livello iniziale",
              "50€ simbolici senza piano",
              "10.000€ immediati senza step",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il primo target è **1 mese di spese essenziali** = 1.400€.\n\nÈ un obiettivo raggiungibile che crea momentum per i successivi (3 mesi, 6 mesi).",
            wrongExplanation: "Il primo target corretto è **1 mese di spese essenziali** = 1.400€.\n\n• 50€ simbolici non proteggono da nulla\n• 10.000€ immediati sono un target paralizzante\n\nL'approccio a step (1 mese → 3 mesi → 6 mesi) funziona perché è progressivo e raggiungibile.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Fondo attuale 900€, target 2.800€ in 12 mesi. Qual è il gap?",
        pollAreas: [
          {
            id: "quiz-q2-6",
            prompt: "Qual è il gap corretto da coprire?",
            options: ["1.900€", "2.800€", "900€"],
            correctIndex: 0,
            correctExplanation: "Esatto! Gap = Target - Attuale = 2.800€ - 900€ = **1.900€**\n\nQuota mensile necessaria: 1.900€ ÷ 12 mesi ≈ 158€/mese",
            wrongExplanation: "Il gap è la differenza tra target e attuale:\n\n**Gap** = 2.800€ - 900€ = **1.900€**\n\nQuesto è l'importo che devi accumulare nei prossimi 12 mesi.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica: calcolo del gap",
        content:
          "Fondo attuale: 900€\nTarget: 2.800€ in 12 mesi\n\nGap da coprire: 1.900€\nQuota mensile necessaria: circa 158€/mese",
        pollAreas: [
          {
            id: "quiz-scenario-6",
            prompt: "Cosa devi definire oltre alla quota mensile?",
            options: [
              "Quota minima per i mesi difficili + regola di recupero",
              "Solo la quota mensile è sufficiente",
              "Nessuna regola, decido mese per mese",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Oltre alla quota mensile standard, definisci:\n\n• **Quota minima**: per i mesi difficili (es. 100€)\n• **Regola di recupero**: come compensi se usi il fondo\n\nQuesto rende il sistema robusto anche sotto stress.",
            wrongExplanation: "Un piano completo prevede:\n\n**1. Quota mensile standard**: 158€/mese\n**2. Quota minima**: per i mesi difficili (es. 100€)\n**3. Regola di recupero**: come ricostruisci dopo un prelievo\n\n'Decido mese per mese' non funziona mai a lungo termine.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Verifico target", "Calcolo il gap", "Definisco piano di ricarica"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: il fondo che ti dà lucidità",
        content: "Complimenti! Hai completato la lezione sul fondo emergenza.\n\n**Nelle lezioni precedenti** hai imparato:\n• Budget per controllare i flussi\n• Risparmio automatico per accumulare\n• Gestione debiti per liberare risorse\n• Obiettivi SMART per dare direzione\n\n**In questa lezione** hai aggiunto il **cuscinetto di sicurezza** che protegge tutto il resto.\n\n**Il valore reale del fondo emergenza** non è solo finanziario. È **psicologico**: quando sai di avere 3-6 mesi di spese coperti, affronti gli imprevisti con lucidità invece che con panico.\n\nNella prossima lezione vedrai le assicurazioni essenziali - l'ultimo livello di protezione prima di passare agli investimenti.",
      },
      {
        kind: "explain",
        title: "📌 Affidabilità del sistema, non perfezione",
        content: "Il fondo emergenza perfetto non esiste. Ma un fondo **affidabile** sì.\n\n**Affidabilità significa:**\n• Il versamento automatico parte ogni mese, senza eccezioni\n• Sai sempre quanto hai e quanto manca al target\n• Dopo ogni prelievo, la ricostruzione parte immediatamente\n• Il sistema funziona anche quando sei stanco, stressato o demotivato\n\nNon serve che il fondo sia sempre pieno al 100%. Serve che il **sistema** funzioni mese dopo mese, anno dopo anno.\n\nQuesto principio 'affidabilità > perfezione' è lo stesso di tutto il percorso:\n• Nel budget: un piano sostenibile batte un piano perfetto ma impossibile\n• Nel risparmio: continuità batte volume",
      },
      {
        kind: "question",
        title: "🎯 Il tuo patto",
        content: "Quale importo minimo vuoi vedere sempre disponibile?",
        pollAreas: [
          {
            id: "feedback-rule-6",
            prompt: "Seleziona il tuo obiettivo",
            options: [
              "1 mese di spese essenziali",
              "3 mesi di spese essenziali",
              "Un importo fisso in euro",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica finale: il tuo patto",
        content:
          "Per mantenere il fondo emergenza hai bisogno di un patto con regole chiare.",
        pollAreas: [
          {
            id: "feedback-patto-6",
            prompt: "Quali elementi deve contenere il tuo patto?",
            options: [
              "Target finale + quota base mensile + regola dopo prelievo",
              "Solo l'importo che vuoi raggiungere",
              "Nessuna regola, vedrò come va",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Un patto completo contiene:\n\n• **Target finale**: quanto vuoi raggiungere\n• **Quota base mensile**: quanto versi ogni mese\n• **Regola dopo prelievo**: come ricostruisci\n\nQuesti tre elementi rendono il sistema automatico e affidabile.",
            wrongExplanation: "Un patto efficace contiene tre elementi:\n\n**1. Target finale**: l'obiettivo in euro (es. 3.600€ = 3 mesi)\n**2. Quota base mensile**: quanto versi automaticamente\n**3. Regola dopo prelievo**: come attivi la ricostruzione\n\nSenza regole chiare, il sistema si rompe al primo imprevisto.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Aiutami a calcolare il mio fondo emergenza ideale",
      "Come ricostruisco il fondo dopo un imprevisto?",
      "Qual è una quota mensile realistica per iniziare?",
    ],
  },
};

const lesson6Definition = createStaticLessonDefinition("6", content);

export default lesson6Definition;
