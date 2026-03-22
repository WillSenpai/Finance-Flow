import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Orizzonte temporale: il tempo cambia tutto",
        content: "Nelle lezioni precedenti hai visto come il tempo sia l'alleato dell'interesse composto e del rischio. Ora approfondiamo: come l'**orizzonte temporale** deve guidare ogni tua decisione d'investimento.\n\n**Il principio:** più è lontano il momento in cui ti serviranno i soldi, più rischio puoi permetterti.\n\n- **Soldi che ti servono tra 1 anno** → rischio quasi zero (conto deposito)\n- **Soldi per la pensione tra 30 anni** → puoi accettare alta volatilità\n\nL'orizzonte temporale non è un dettaglio: è LA variabile che determina come dovresti investire.",
      },
      {
        kind: "explain",
        title: "📌 Perché il tempo riduce il rischio",
        content: "I mercati azionari sono volatili nel breve periodo ma tendenzialmente crescenti nel lungo.\n\n**Statistiche storiche S&P 500:**\n- Su 1 anno: probabilità di perdita ~26%\n- Su 5 anni: probabilità di perdita ~12%\n- Su 10 anni: probabilità di perdita ~5%\n- Su 20 anni: probabilità di perdita ~0% (storicamente)\n\n**Cosa significa:** se puoi aspettare 20 anni, i crolli temporanei non ti riguardano. Diventeranno 'rumore' nel grafico della tua crescita.\n\nMa se ti servono i soldi tra 2 anni, un crollo del 30% potrebbe costringerti a vendere in perdita. Ecco perché l'orizzonte temporale è fondamentale.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Perché un orizzonte lungo riduce il rischio effettivo?",
        pollAreas: [
          {
            id: "concept-verify-12",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Hai tempo per recuperare i crolli temporanei",
              "I rendimenti aumentano con il tempo",
              "Le commissioni diminuiscono",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Con più tempo, i **crolli diventano temporanei** invece che permanenti. Storicamente, chi ha aspettato 10-20 anni non ha mai perso soldi nei mercati globali.",
            wrongExplanation: "I rendimenti non aumentano automaticamente con il tempo, e le commissioni restano uguali.\n\n**Il vero motivo:** con un orizzonte lungo, hai tempo per recuperare i crolli. Un -30% oggi, con 20 anni davanti, è solo un momento nel grafico. Ma con 1 anno davanti, potrebbe significare vendere in perdita.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Associare obiettivi e orizzonti",
        content: "Ogni obiettivo finanziario ha un suo orizzonte. Identificarli ti permette di investire correttamente.\n\n**Obiettivi a breve termine (1-3 anni):**\n- Fondo emergenza, vacanze, acquisti importanti\n- Strumenti: conti deposito, BOT, obbligazioni brevi\n- Rischio: quasi zero\n\n**Obiettivi a medio termine (3-10 anni):**\n- Anticipo casa, auto, matrimonio\n- Strumenti: mix obbligazioni + azioni moderate\n- Rischio: moderato\n\n**Obiettivi a lungo termine (10+ anni):**\n- Pensione, libertà finanziaria, eredità\n- Strumenti: prevalenza azioni (ETF globali)\n- Rischio: alto (ma compensato dal tempo)",
      },
      {
        kind: "question",
        title: "🧠 Verifica: abbinamento obiettivo-strumento",
        content: "Laura, 30 anni, vuole comprare casa tra 5 anni. Come dovrebbe investire l'anticipo che sta accumulando?",
        pollAreas: [
          {
            id: "concept-solve-12",
            prompt: "Quale strategia è corretta?",
            options: [
              "Mix conservativo: 70% obbligazioni, 30% azioni",
              "Aggressivo: 90% azioni per massimizzare",
              "Tutto in conto deposito - zero rischi",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Con 5 anni di orizzonte, Laura può permettersi un po' di rischio, ma non troppo. Un **mix 70/30 obbligazioni-azioni** bilancia crescita e protezione.",
            wrongExplanation: "Con 5 anni di orizzonte, un portafoglio aggressivo è rischioso (un crollo potrebbe non recuperare in tempo). Ma il conto deposito spreca il potenziale di crescita.\n\n**La soluzione:** mix conservativo che permette crescita moderata proteggendo il capitale.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Identifico il mio orizzonte", "Abbino obiettivi e rischio", "Pianifico per scadenze"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Costruire portafogli per orizzonte",
        content: "Ecco una guida pratica per costruire portafogli basati sull'orizzonte temporale.\n\n**Formula semplificata per la % di azioni:**\n100 - età = % in azioni\n\n- 25 anni → 75% azioni\n- 40 anni → 60% azioni\n- 60 anni → 40% azioni\n\n**Versione più moderna (vita più lunga):**\n110 - età = % in azioni\n\nQueste sono regole generiche. Devi sempre considerare:\n- Il tuo orizzonte specifico per ogni obiettivo\n- La tua tolleranza emotiva al rischio\n- La tua situazione finanziaria complessiva",
      },
      {
        kind: "explain",
        title: "📌 Il glide path: ridurre il rischio nel tempo",
        content: "Man mano che ti avvicini all'obiettivo, dovresti **ridurre gradualmente il rischio**. Questo si chiama 'glide path'.\n\n**Esempio: pensione a 65 anni**\n\n| Età | Anni alla pensione | % Azioni | % Obbligazioni |\n|-----|-------------------|----------|----------------|\n| 30 | 35 | 80% | 20% |\n| 40 | 25 | 70% | 30% |\n| 50 | 15 | 55% | 45% |\n| 60 | 5 | 35% | 65% |\n| 65 | 0 | 25% | 75% |\n\n**Perché:** man mano che ti avvicini all'obiettivo, hai meno tempo per recuperare eventuali crolli. Riduci il rischio gradualmente per proteggere quello che hai accumulato.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Cos'è il 'glide path' negli investimenti?",
        pollAreas: [
          {
            id: "widget-verify-12",
            prompt: "Seleziona la definizione corretta",
            options: [
              "La riduzione graduale del rischio avvicinandosi all'obiettivo",
              "L'aumento del rischio per massimizzare i rendimenti",
              "Il percorso che segue il prezzo delle azioni",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il glide path è la **riduzione progressiva del rischio** man mano che ti avvicini alla data in cui ti serviranno i soldi.",
            wrongExplanation: "Il glide path non riguarda il prezzo delle azioni o l'aumento del rischio.\n\n**Definizione:** ridurre gradualmente la percentuale di azioni nel portafoglio avvicinandosi all'obiettivo. Così proteggi i guadagni accumulati da crolli dell'ultimo momento.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Marco, 55 anni, andrà in pensione a 65. Ha un portafoglio 80% azioni. È corretto?",
        pollAreas: [
          {
            id: "widget-scenario-12",
            prompt: "Valuta il portafoglio",
            options: [
              "No - troppo aggressivo, dovrebbe iniziare a ridurre le azioni",
              "Sì - le azioni rendono di più",
              "Dipende - se ha altri redditi può mantenerlo",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Con 10 anni alla pensione e 80% azioni, Marco è **troppo esposto**. Un crollo del 40% a 60 anni potrebbe devastare i suoi piani. Dovrebbe iniziare il glide path.",
            wrongExplanation: "A 10 anni dalla pensione, 80% azioni è molto aggressivo.\n\n**Il rischio:** un crollo del 40% a 60 anni dimezzerebbe il capitale proprio quando Marco ne ha più bisogno. Con meno tempo per recuperare, deve iniziare a ridurre il rischio.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Applico formula età", "Costruisco glide path", "Bilancio portafoglio"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Quando l'orizzonte cambia improvvisamente",
        content: "La vita non segue i piani. A volte l'orizzonte temporale cambia improvvisamente.\n\n**Scenari comuni:**\n- Perdita del lavoro → servono soldi prima\n- Opportunità inattesa (casa in offerta) → anticipi l'acquisto\n- Problemi di salute → cambiano le priorità\n- Eredità inattesa → l'obiettivo arriva prima\n\n**Il problema:** se il tuo portafoglio non è allineato con il nuovo orizzonte, potresti trovarti a vendere nel momento sbagliato.\n\n**La protezione:** il fondo emergenza che hai costruito nelle prime lezioni. Ti permette di non toccare gli investimenti in caso di imprevisti.",
      },
      {
        kind: "explain",
        title: "📌 Il bucket approach: sicurezza a strati",
        content: "Un metodo avanzato per gestire orizzonti multipli: il **bucket approach** (approccio a secchi).\n\n**Come funziona:**\n\n**Bucket 1 - Breve termine (0-3 anni)**\n- Cosa: fondo emergenza + spese previste\n- Dove: conto deposito, BOT\n- Quanto: 1-3 anni di spese\n\n**Bucket 2 - Medio termine (3-10 anni)**\n- Cosa: obiettivi a media scadenza\n- Dove: mix obbligazioni + azioni moderate\n- Quanto: secondo gli obiettivi\n\n**Bucket 3 - Lungo termine (10+ anni)**\n- Cosa: pensione, crescita del patrimonio\n- Dove: prevalenza azioni/ETF globali\n- Quanto: il resto\n\n**Il vantaggio:** se il mercato crolla, usi il Bucket 1 senza toccare gli investimenti.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Qual è il vantaggio principale del bucket approach?",
        pollAreas: [
          {
            id: "challenge-verify-12",
            prompt: "Seleziona il vantaggio chiave",
            options: [
              "Puoi affrontare imprevisti senza vendere investimenti in perdita",
              "Rende di più rispetto ad altri approcci",
              "Elimina completamente il rischio",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Con i 'secchi' separati, gli **imprevisti vengono coperti dal Bucket 1** (liquidità). Non sei costretto a vendere azioni in perdita durante un crollo.",
            wrongExplanation: "Il bucket approach non rende necessariamente di più e non elimina il rischio.\n\n**Il vero vantaggio:** protezione dagli imprevisti. Se perdi il lavoro durante un crollo di mercato, usi la liquidità del Bucket 1 invece di vendere azioni in perdita.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "Sara, 45 anni, ha investito l'80% del patrimonio in azioni. Il mercato crolla del 35% proprio quando perde il lavoro. Cosa succede?",
        pollAreas: [
          {
            id: "challenge-scenario-12",
            prompt: "Quale problema affronta Sara?",
            options: [
              "Deve vendere azioni in perdita per pagare le spese correnti",
              "Nessun problema - aspetta che recuperino",
              "Può chiedere un prestito usando le azioni come garanzia",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Sara deve **vendere in perdita** per vivere. Se avesse avuto un fondo emergenza separato (Bucket 1), avrebbe potuto aspettare il recupero senza toccare gli investimenti.",
            wrongExplanation: "Sara non può 'aspettare' perché deve pagare bollette, affitto, cibo. Senza liquidità di emergenza, è costretta a vendere azioni nel momento peggiore.\n\n**La lezione:** prima il fondo emergenza (Bucket 1), poi gli investimenti (Bucket 2 e 3).",
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
        title: "🧠 Quiz finale: orizzonte temporale e obiettivi",
        content: "Hai imparato come l'orizzonte temporale determina la strategia d'investimento, il concetto di glide path, e il bucket approach.\n\n**Concetti chiave:**\n- L'orizzonte temporale è LA variabile principale\n- Più tempo = più rischio sostenibile\n- Riduci il rischio avvicinandoti all'obiettivo (glide path)\n- Separa i soldi per orizzonte (bucket approach)\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Una persona di 25 anni che investe per la pensione dovrebbe avere:",
        pollAreas: [
          {
            id: "quiz-q1-12",
            prompt: "Quale allocazione è corretta?",
            options: [
              "Alta percentuale di azioni (70-90%)",
              "Mix equilibrato 50-50",
              "Prevalenza obbligazioni per sicurezza",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Con 40 anni davanti, può permettersi **alta volatilità**. I crolli temporanei avranno decenni per recuperare. Formula: 100 - 25 = 75% azioni.",
            wrongExplanation: "A 25 anni con obiettivo pensione, essere troppo conservativi è uno spreco.\n\n**Perché azioni:** con 40 anni davanti, hai tutto il tempo per recuperare i crolli. Essere conservativi a 25 anni significa rinunciare a rendimenti significativi.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Cosa significa 'glide path' nella gestione del portafoglio?",
        pollAreas: [
          {
            id: "quiz-q2-12",
            prompt: "Seleziona la definizione",
            options: [
              "Ridurre gradualmente il rischio avvicinandosi all'obiettivo",
              "Aumentare gli investimenti nel tempo",
              "Seguire il trend di mercato",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Il glide path è la **progressiva riduzione delle azioni** man mano che ti avvicini alla data dell'obiettivo, per proteggere i guadagni accumulati.",
            wrongExplanation: "Il glide path non riguarda quanto investi o seguire i trend.\n\n**Definizione:** riduzione graduale del rischio (% azioni) avvicinandosi all'obiettivo. Così un crollo dell'ultimo momento non distrugge decenni di risparmio.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Quale situazione è più rischiosa?",
        pollAreas: [
          {
            id: "quiz-q3-12",
            prompt: "Identifica il rischio maggiore",
            options: [
              "70% azioni con obiettivo tra 2 anni",
              "70% azioni con obiettivo tra 20 anni",
              "30% azioni con obiettivo tra 5 anni",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **70% azioni con 2 anni di orizzonte** è molto rischioso. Un crollo del 30% non avrebbe tempo per recuperare. L'allocazione non è allineata con l'orizzonte.",
            wrongExplanation: "Il rischio dipende dalla combinazione allocazione + orizzonte.\n\n**70% azioni + 2 anni** = altamente rischioso (non c'è tempo per recuperare)\n**70% azioni + 20 anni** = adeguato (tempo per recuperare)\n**30% azioni + 5 anni** = conservativo ma appropriato",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Verifico allineamento", "Controllo glide path", "Confermo bucket approach"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: orizzonte temporale e obiettivi",
        content: "Complimenti! Hai completato la lezione sull'orizzonte temporale.\n\n**Principi fondamentali:**\n\n1. **L'orizzonte determina il rischio** - più tempo = più rischio sostenibile\n2. **Associa ogni obiettivo al suo orizzonte** - non tutti i soldi hanno la stessa destinazione\n3. **Glide path** - riduci il rischio avvicinandoti all'obiettivo\n4. **Bucket approach** - separa i soldi per orizzonte, proteggi dagli imprevisti\n\nQuesto concetto unifica tutto ciò che hai imparato: fondo emergenza (breve), obiettivi intermedi (medio), pensione (lungo).",
      },
      {
        kind: "explain",
        title: "📌 Applicazione pratica",
        content: "Ecco come applicare questi concetti:\n\n**Passo 1: Lista i tuoi obiettivi finanziari**\n- Quando ti serviranno i soldi? (1, 5, 10, 30 anni?)\n\n**Passo 2: Assegna un 'bucket' a ogni obiettivo**\n- Breve: liquidità\n- Medio: mix conservativo\n- Lungo: prevalenza azioni\n\n**Passo 3: Verifica l'allineamento**\n- I soldi per la casa tra 3 anni sono in azioni aggressive? → Problema!\n- I soldi per la pensione tra 30 anni sono in conto deposito? → Spreco!\n\n**Passo 4: Pianifica il glide path**\n- Come ridurrai il rischio avvicinandoti a ogni obiettivo?",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Quale azione farai dopo questa lezione?",
        pollAreas: [
          {
            id: "feedback-action-12",
            prompt: "Scegli il tuo prossimo passo",
            options: [
              "Faccio la lista dei miei obiettivi con gli orizzonti temporali",
              "Verifico se i miei investimenti attuali sono allineati",
              "Imposto un sistema di bucket per i miei soldi",
            ],
            correctIndex: 0,
            correctExplanation: "Ottima scelta! Partire dalla **lista degli obiettivi** è il primo passo. Senza sapere dove vuoi arrivare e quando, non puoi allineare gli investimenti.",
            wrongExplanation: "Tutte le opzioni sono valide! Ma il punto di partenza logico è la **lista degli obiettivi con orizzonti**. Solo dopo puoi verificare l'allineamento e impostare i bucket.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Aiutami a creare la lista dei miei obiettivi finanziari",
      "I miei investimenti sono allineati con i miei orizzonti?",
      "Come imposto un bucket approach per la mia situazione?",
    ],
  },
};

const lesson12Definition = createStaticLessonDefinition("12", content);

export default lesson12Definition;
