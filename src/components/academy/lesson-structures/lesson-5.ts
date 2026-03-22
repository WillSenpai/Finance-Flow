import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Cos'è un fondo d'investimento?",
        content: "Nella lezione precedente hai imparato le basi dell'investimento: obiettivi, orizzonte temporale, sistema operativo. Ora passiamo agli **strumenti**, partendo dai fondi.\n\nUn fondo d'investimento è come un **contenitore**: raccoglie i soldi di molti investitori e li investe in un paniere diversificato di titoli (azioni, obbligazioni, o entrambi).\n\n**Perché esiste?**\n• Diversificazione automatica: con pochi soldi accedi a decine o centinaia di titoli\n• Gestione professionale: qualcuno decide cosa comprare e vendere\n• Semplicità: non devi analizzare singole aziende\n\n**Attenzione**: il risultato finale dipende da due cose:\n1. Cosa contiene il fondo (la strategia)\n2. Quanto costa mantenerlo (le commissioni)\n\nUn contenitore bello fuori ma costoso o con contenuti scadenti non ti farà guadagnare.",
      },
      {
        kind: "explain",
        title: "📌 L'ordine giusto per valutare un fondo",
        content: "Prima di investire in qualsiasi fondo, segui questo ordine di valutazione:\n\n**1. Capisci la strategia**\nCosa compra questo fondo? Azioni globali? Solo Italia? Obbligazioni? Misto? La strategia deve essere coerente con il TUO obiettivo (come hai imparato nella lezione precedente).\n\n**2. Valuta i rischi**\nQuanto può oscillare? Il fondo può perdere il 30% in un anno difficile? È accettabile per il tuo orizzonte temporale?\n\n**3. Confronta i costi ricorrenti**\nOgni fondo ha commissioni annuali (TER - Total Expense Ratio). Differenze di 1% all'anno sembrano piccole, ma su 20 anni possono costarti decine di migliaia di euro.\n\n**4. Verifica la coerenza con l'obiettivo**\nIl fondo si adatta al tuo piano? Un fondo azionario aggressivo non va bene se ti servono i soldi tra 2 anni.\n\nQuesto ordine (strategia → rischi → costi → coerenza) ti protegge dall'errore di scegliere 'quello che è andato bene l'anno scorso'.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Perché due fondi simili possono dare risultati diversi nel lungo periodo?",
        pollAreas: [
          {
            id: "concept-verify-5",
            prompt: "Seleziona la risposta corretta",
            options: [
              "I costi ricorrenti erodono il rendimento nel tempo",
              "Il nome del fondo determina il risultato",
              "I fondi simili danno sempre lo stesso risultato",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "📊 L'impatto devastante dei costi nel lungo termine",
        content: "I costi sono l'unico elemento degli investimenti che puoi controllare con certezza. Il rendimento futuro non lo conosci, ma le commissioni sì.\n\n**Ecco perché contano tanto:**\n\nImmagina due fondi con la stessa strategia:\n• Fondo A: costo annuo 0,25%\n• Fondo B: costo annuo 1,50%\n\nDifferenza: 1,25% all'anno. Sembra poco?\n\nSu un investimento di 20.000€ per 20 anni (ipotizzando 6% di rendimento lordo):\n• Fondo A: risultato finale circa 58.000€\n• Fondo B: risultato finale circa 46.000€\n\n**12.000€ di differenza, solo per i costi!**\n\nCosti ricorrenti alti si giustificano SOLO se il gestore offre valore aggiunto reale (e statisticamente, la maggior parte non lo fa). Nella prossima lezione sugli ETF vedrai alternative a costi molto bassi.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: impatto dei costi",
        content:
          "Fondo A: costo annuo 0,25%\nFondo B: costo annuo 1,40%\n\nStessa esposizione di mercato.\nCapitale investito: 20.000€ per 10 anni.",
        pollAreas: [
          {
            id: "concept-solve-5",
            prompt: "Qual è la lezione chiave di questo confronto?",
            options: [
              "Costi ricorrenti alti richiedono giustificazione reale",
              "Il fondo più costoso è sempre migliore",
              "I costi non influiscono sul risultato finale",
            ],
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco cosa contiene", "Confronto costi", "Valuto coerenza"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Il metodo pratico: una checklist da applicare sempre",
        content: "Come per il budget hai una struttura (entrate, uscite, risparmio), anche per valutare i fondi ti serve una **checklist minima** da applicare ogni volta.\n\nPerché una checklist? Perché elimina l'emotività dalla decisione. Non scegli 'quello che ti piace' o 'quello che è andato bene l'anno scorso'. Scegli in base a criteri oggettivi.\n\nQuesto è lo stesso approccio che hai usato nella lezione sui debiti: prima di accettare un finanziamento, verifichi costo totale, durata, impatto mensile.\n\nPer i fondi, la checklist è leggermente diversa ma il principio è identico: **criteri definiti in anticipo > decisioni impulsive**.\n\nVediamo i cinque elementi essenziali.",
      },
      {
        kind: "explain",
        title: "📌 I cinque elementi della checklist fondi",
        content: "Prima di investire in QUALSIASI fondo, verifica questi cinque elementi:\n\n**1. Obiettivo del fondo**\nCosa cerca di ottenere? Crescita? Reddito? Protezione? Deve essere coerente con il TUO obiettivo.\n\n**2. Composizione**\nCosa contiene? Azioni di quali aree geografiche? Obbligazioni di che tipo? Quale percentuale per ogni asset?\n\n**3. Costo annuo (TER)**\nQuanto paghi ogni anno in commissioni? Confronta con alternative simili. Sotto l'1% è ragionevole, sotto lo 0,5% è buono.\n\n**4. Volatilità storica**\nQuanto ha oscillato in passato? Qual è stata la perdita massima in un anno difficile? Puoi tollerarla?\n\n**5. Orizzonte consigliato**\nIl fondo è adatto a 3 anni? 10 anni? 20 anni? Deve coincidere con il TUO orizzonte.\n\nSe anche UNO di questi elementi non è chiaro o non è coerente con il tuo piano, cerca un'alternativa.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Quale elemento della checklist evita più errori di acquisto?",
        pollAreas: [
          {
            id: "widget-verify-5",
            prompt: "Seleziona l'elemento chiave",
            options: [
              "Costo annuo confrontato con alternative",
              "Solo il nome del fondo",
              "Solo il rendimento dell'ultimo mese",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica: metodo di confronto",
        content:
          "Devi confrontare 2 fondi bilanciati.\n\nHai bisogno di un metodo sistematico per decidere.",
        pollAreas: [
          {
            id: "widget-scenario-5",
            prompt: "Qual è il metodo corretto per confrontare i fondi?",
            options: [
              "Compilare una scheda con criteri e assegnare un punteggio",
              "Scegliere quello con il nome più conosciuto",
              "Guardare solo il rendimento dell'ultimo mese",
            ],
            allowText: false,
          },
        ],
      },
    ],
    options: ["Uso checklist", "Valuto costo-rischio", "Scelgo per punteggio"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ La trappola del rendimento recente",
        content: "Ecco l'errore più comune nella scelta dei fondi: guardare SOLO il rendimento degli ultimi 12 mesi e scegliere 'quello che è andato meglio'.\n\n**Perché è una trappola:**\n\n1. **Il rendimento passato non prevede il futuro**: un fondo che ha fatto +25% l'anno scorso può fare -15% quest'anno.\n\n2. **Spesso compri al momento peggiore**: i fondi che hanno rendimenti esplosivi attirano molti investitori... proprio quando i prezzi sono già alti.\n\n3. **Ignori tutto il resto**: costi, rischi, coerenza con il tuo obiettivo.\n\nÈ come scegliere un ristorante solo perché 'ieri c'era coda fuori'. Non ti dice nulla sulla qualità del cibo.\n\nNella lezione sul risparmio hai imparato che la continuità batte il volume. Negli investimenti, la **consistenza nel tempo** batte il picco di un singolo anno.",
      },
      {
        kind: "explain",
        title: "📌 Il rendimento va sempre contestualizzato",
        content: "Il rendimento passato di un fondo ha senso SOLO se lo leggi insieme ad altri elementi:\n\n**1. Rischio assunto**\nUn fondo che ha fatto +20% con volatilità altissima (oscillazioni del 30-40%) non è necessariamente migliore di uno che ha fatto +12% con volatilità contenuta.\n\n**2. Costo pagato**\nSe il fondo ha reso +8% ma costa 2% all'anno, il tuo rendimento netto è +6%. Un fondo con +7% e costo 0,3% ti dà +6,7% netto. Chi vince?\n\n**3. Coerenza con l'obiettivo**\nUn fondo azionario emergenti può rendere molto, ma se il tuo obiettivo è tra 3 anni, il rischio è inaccettabile.\n\n**La regola**: prima verifica strategia, rischi, costi e coerenza con il tuo piano. Il rendimento storico è solo un elemento aggiuntivo, mai il criterio principale.\n\nQuesto approccio multi-dimensionale è lo stesso che applichi nel budget: non guardi solo quanto spendi, ma dove, perché, e se è sostenibile.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Quale dato controlli per primo prima di comprare un fondo?",
        pollAreas: [
          {
            id: "challenge-verify-5",
            prompt: "Seleziona la priorità",
            options: [
              "Costi ricorrenti e composizione",
              "Solo il rendimento dell'ultimo anno",
              "Il colore del logo",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🛡️ Privilegia la struttura robusta, non il picco recente",
        content: "Nella scelta di un fondo, devi decidere cosa privilegiare: il **rendimento recente** (che può non ripetersi) o la **struttura robusta** (che lavora per te nel tempo).\n\n**Una struttura robusta significa:**\n\n• **Costi bassi**: ogni anno che passa, risparmi commissioni. Su 20 anni, questo fa un'enorme differenza.\n\n• **Diversificazione ampia**: non dipendi dal successo di pochi titoli. Se uno va male, gli altri compensano.\n\n• **Trasparenza**: sai cosa contiene, come funziona, quali sono i rischi.\n\n• **Coerenza con l'obiettivo**: il fondo è adatto al tuo orizzonte e alla tua tolleranza al rischio.\n\nUn fondo con struttura robusta potrebbe non essere 'il migliore' in un singolo anno. Ma su 10-20 anni, le probabilità di successo sono molto più alte.\n\nÈ lo stesso principio del risparmio automatico: la consistenza nel tempo batte i picchi sporadici.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: rendimento vs costi",
        content:
          "Fondo X: rendimento +18% ultimo anno, costo 1,8%\nFondo Y: rendimento +14% ultimo anno, costo 0,35%\n\nOrizzonte di investimento: 5-10 anni.",
        pollAreas: [
          {
            id: "challenge-scenario-5",
            prompt: "Quale fondo è probabilmente migliore nel lungo periodo?",
            options: [
              "Fondo Y: i costi bassi vincono nel lungo periodo",
              "Fondo X: il rendimento recente conta di più",
              "Sono equivalenti nel lungo periodo",
            ],
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
        title: "🧠 Quiz finale: confrontare fondi con metodo",
        content: "Hai imparato a valutare i fondi con una checklist strutturata, a non farti ingannare dal rendimento recente, e a privilegiare strutture robuste.\n\nOra mettiamo tutto insieme con un quiz pratico. Le domande simulano decisioni reali che dovresti affrontare.\n\n**Ricorda i principi chiave:**\n• Ordine di valutazione: strategia → rischi → costi → coerenza\n• I cinque elementi della checklist\n• Il rendimento va sempre contestualizzato\n• Struttura robusta > picco recente\n\nApplica il metodo, non l'istinto. Se una risposta 'sembra' giusta ma non supera la checklist, probabilmente è sbagliata.",
      },
      {
        kind: "explain",
        title: "📌 Come rispondere: la logica costo-rischio-obiettivo",
        content: "Quando rispondi alle domande sui fondi, applica sempre questa **logica a tre dimensioni**:\n\n**1. Costo**\nLa scelta minimizza i costi nel lungo termine? Ricorda: 1% all'anno di differenza può costarti decine di migliaia di euro su 20 anni.\n\n**2. Rischio**\nLa scelta è coerente con il rischio che puoi tollerare? Un fondo può rendere molto, ma se le oscillazioni ti fanno vendere in panico, non va bene per te.\n\n**3. Obiettivo**\nLa scelta ti avvicina all'obiettivo che hai definito? Un fondo fantastico ma non adatto al tuo orizzonte è comunque sbagliato.\n\nSe una risposta ottimizza solo una dimensione (es. 'il rendimento più alto') ma peggiora le altre, è quasi sempre sbagliata.\n\nQuesto equilibrio multi-dimensionale è lo stesso che applichi nel budget: non cerchi la spesa più bassa in assoluto, ma il miglior equilibrio tra costo, qualità e necessità.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Quale confronto è corretto tra due fondi simili?",
        pollAreas: [
          {
            id: "quiz-q1-5",
            prompt: "Scegli l'opzione migliore",
            options: [
              "Composizione + costo annuo + volatilità + coerenza obiettivo",
              "Solo rendimento ultimi 12 mesi",
              "Solo nome del gestore",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Capitale 30.000€, differenza costo tra due fondi: 1,1%. Quanto costa in euro all'anno?",
        pollAreas: [
          {
            id: "quiz-q2-5",
            prompt: "Quanto pesa la differenza costo annuo in euro?",
            options: ["330€", "33€", "3.300€"],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica: calcolo impatto costi",
        content:
          "Capitale: 30.000€\nDifferenza costo tra due fondi: 1,1%\n\nIn euro all'anno la differenza è 330€.",
        pollAreas: [
          {
            id: "quiz-scenario-5",
            prompt: "Su 10 anni, quanto pesa questa differenza di costo?",
            options: [
              "3.300€ + mancato rendimento composto",
              "Solo 330€ in totale",
              "Il costo non impatta nel lungo periodo",
            ],
            allowText: false,
          },
        ],
      },
    ],
    options: ["Confronto completo", "Calcolo impatto costi", "Scelgo per coerenza"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: dal metodo agli strumenti",
        content: "Complimenti! Hai completato la lezione sui fondi d'investimento. Vediamo il percorso che hai fatto:\n\n**Nelle lezioni precedenti** hai costruito:\n• Budget, risparmio automatico, gestione debiti\n• Le basi dell'investimento: obiettivi, orizzonte, sistema operativo\n\n**In questa lezione** hai aggiunto:\n• Cos'è un fondo e come funziona\n• I cinque elementi della checklist (obiettivo, composizione, costo, volatilità, orizzonte)\n• Perché il rendimento recente è una trappola\n• L'importanza della struttura robusta\n\n**Il principio chiave**: scegliere un fondo bene significa applicare un **processo decisionale**, non seguire una moda o un consiglio casuale. La checklist ti protegge dall'emotività.",
      },
      {
        kind: "explain",
        title: "📌 Il vantaggio di avere una checklist",
        content: "Con una checklist chiara ottieni due benefici importanti:\n\n**1. Riduci gli errori**\nNon dimentichi nessun elemento importante. Non ti fai ingannare dal rendimento recente o dalla pubblicità.\n\n**2. Riduci l'ansia decisionale**\nNon devi 'sentire' se un fondo è giusto. Applichi i criteri e la risposta emerge da sola.\n\nQuesto è lo stesso principio che hai usato nel budget (le tre categorie) e nel risparmio (quota base + quota minima + check mensile).\n\n**Le prossime lezioni** approfondiranno:\n• ETF: fondi quotati a costi molto bassi\n• Rischio e rendimento: come bilanciarli\n• Diversificazione: perché 'non mettere tutte le uova in un paniere'\n\nOgni lezione aggiunge un elemento alla tua cassetta degli attrezzi.",
      },
      {
        kind: "question",
        title: "🎯 La tua checklist",
        content: "Quale criterio non vuoi più saltare quando valuti un fondo?",
        pollAreas: [
          {
            id: "feedback-rule-5",
            prompt: "Seleziona il criterio prioritario",
            options: [
              "Costo annuo reale",
              "Composizione del portafoglio",
              "Coerenza con il mio obiettivo",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica finale: la tua checklist",
        content:
          "Per valutare ogni fondo hai bisogno di una checklist con criteri essenziali.",
        pollAreas: [
          {
            id: "feedback-checklist-5",
            prompt: "Quali sono i criteri essenziali della checklist?",
            options: [
              "Obiettivo + composizione + costo + volatilità + orizzonte",
              "Solo il rendimento dell'ultimo anno",
              "Solo il nome del gestore del fondo",
            ],
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Aiutami a confrontare due fondi con un metodo semplice",
      "Quali costi devo sempre controllare?",
      "Dammi una checklist pronta da riutilizzare",
    ],
  },
};

const lesson5Definition = createStaticLessonDefinition("5", content);

export default lesson5Definition;
