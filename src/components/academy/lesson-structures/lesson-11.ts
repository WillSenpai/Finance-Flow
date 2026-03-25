import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 La diversificazione: non mettere tutte le uova nello stesso paniere",
        content: "Hai mai sentito il detto 'non mettere tutte le uova nello stesso paniere'? Questo è il principio della **diversificazione** in una frase.\n\nDiversificare significa distribuire i tuoi investimenti su **asset diversi e non correlati**, così che se uno va male, gli altri possano compensare.\n\n**Perché funziona:**\nNessuno può prevedere il futuro. L'azienda migliore oggi potrebbe fallire domani. Il settore più caldo potrebbe crollare. La diversificazione ti protegge dalla tua incapacità di prevedere cosa andrà bene e cosa andrà male.",
      },
      {
        kind: "explain",
        title: "📌 Rischio specifico vs rischio sistematico",
        content: "Esistono due tipi di rischio negli investimenti:\n\n**Rischio specifico** (eliminabile con diversificazione):\n- Una singola azienda fallisce\n- Un settore va in crisi\n- Un paese ha problemi politici\n\n**Rischio sistematico** (non eliminabile):\n- L'intero mercato globale crolla (es. crisi 2008, COVID 2020)\n- Recessione mondiale\n\n**La buona notizia:** il rischio specifico può essere quasi azzerato con una buona diversificazione. Bastano 30-50 titoli diversi, o meglio ancora, un ETF globale.\n\n**La realtà:** il rischio sistematico resta, ma storicamente i mercati globali si sono sempre ripresi.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Quale rischio puoi eliminare con la diversificazione?",
        pollAreas: [
          {
            id: "concept-verify-11",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Il rischio specifico (singola azienda, settore, paese)",
              "Il rischio sistematico (crollo di tutto il mercato)",
              "Tutti i rischi - la diversificazione elimina il rischio",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! La diversificazione elimina il **rischio specifico**: se un'azienda fallisce, le altre compensano. Ma non può eliminare i crolli globali che colpiscono tutto.",
            wrongExplanation: "La diversificazione non elimina TUTTI i rischi.\n\n**Elimina:** rischio specifico (singoli titoli, settori, paesi)\n**Non elimina:** rischio sistematico (crolli globali)\n\nEcco perché serve anche gestire il rischio con l'orizzonte temporale e la tolleranza personale.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 I livelli della diversificazione",
        content: "Una buona diversificazione opera su più livelli:\n\n**1. Tra titoli** (molte aziende invece di poche)\n- ❌ Tutto in 3 azioni\n- ✅ ETF con centinaia di aziende\n\n**2. Tra settori** (tecnologia, sanità, finanza, energia...)\n- ❌ Solo tech\n- ✅ Tutti i settori rappresentati\n\n**3. Tra aree geografiche** (USA, Europa, Asia, emergenti)\n- ❌ Solo Italia\n- ✅ Mercati globali\n\n**4. Tra asset class** (azioni, obbligazioni, immobiliare...)\n- ❌ 100% azioni\n- ✅ Mix bilanciato secondo il tuo profilo\n\nPiù livelli copri, più sei protetto.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: diversificazione efficace",
        content: "Marco ha 10.000€ investiti in 5 azioni italiane del settore bancario. È ben diversificato?",
        pollAreas: [
          {
            id: "concept-solve-11",
            prompt: "Valuta la diversificazione",
            options: [
              "No - stesso settore, stesso paese, pochi titoli",
              "Sì - ha 5 aziende diverse",
              "Dipende da quali banche sono",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Marco ha **tripla concentrazione**: pochi titoli (5), stesso settore (banche), stesso paese (Italia). Se il settore bancario italiano va in crisi, perde tutto.",
            wrongExplanation: "Avere 5 aziende non basta se sono tutte nello stesso settore e paese.\n\n**Problemi del portafoglio di Marco:**\n- Solo 5 titoli (poco diversificato)\n- Solo banche (rischio settore)\n- Solo Italia (rischio paese)\n\nUn singolo evento (crisi bancaria italiana) colpirebbe tutto il portafoglio.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco i livelli", "Riconosco i rischi", "Diversifico correttamente"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Come diversificare in pratica",
        content: "La teoria è chiara, ma come si diversifica in pratica con budget limitati?\n\n**Lo strumento perfetto: gli ETF globali**\n\nUn singolo ETF come un 'MSCI World' o 'FTSE All-World' contiene:\n- 1.500+ aziende\n- 20+ paesi sviluppati\n- Tutti i settori\n\n**Costo:** spesso meno di 100€ per una quota.\n\n**Risultato:** con un solo acquisto ottieni una diversificazione che richiederebbe migliaia di euro per essere replicata comprando singole azioni.\n\nQuesto è il motivo per cui gli ETF sono lo strumento preferito dell'investitore disciplinato.",
      },
      {
        kind: "explain",
        title: "📌 Diversificazione geografica: quanto peso dare?",
        content: "Una domanda frequente: quanto investire nei diversi mercati?\n\n**Approccio 1: Per capitalizzazione (più semplice)**\n- USA: ~60%\n- Europa: ~15%\n- Giappone: ~5%\n- Emergenti: ~10%\n- Resto: ~10%\n\nQuesto è quello che fa un ETF 'MSCI ACWI' o 'FTSE All-World'.\n\n**Approccio 2: Sovrappeso Europa (home bias moderato)**\n- USA: ~50%\n- Europa: ~25%\n- Resto: ~25%\n\nPuò avere senso per chi vive in Europa e vuole ridurre il rischio valutario.\n\n**Cosa NON fare:** mettere il 100% in Italia (solo il 0.7% del mercato mondiale).",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Qual è il modo più semplice per diversificare con un budget limitato?",
        pollAreas: [
          {
            id: "widget-verify-11",
            prompt: "Seleziona lo strumento migliore",
            options: [
              "Un ETF globale (MSCI World, FTSE All-World, ecc.)",
              "Comprare 20-30 singole azioni",
              "Affidarsi a un consulente che sceglie i titoli",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Un **ETF globale** dà accesso a migliaia di aziende con un solo acquisto, a costi bassissimi. È lo strumento più efficiente per diversificare.",
            wrongExplanation: "Comprare 20-30 azioni singole richiede molto capitale e tempo. Un consulente costa e spesso non batte gli ETF.\n\n**La soluzione più efficiente:** un ETF globale. Con una sola operazione ottieni diversificazione su 1.500+ titoli a costi dello 0.1-0.3% annuo.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Hai 5.000€ da investire. Quale portafoglio è meglio diversificato?",
        pollAreas: [
          {
            id: "widget-scenario-11",
            prompt: "Scegli il portafoglio migliore",
            options: [
              "Un ETF MSCI World + un ETF obbligazionario",
              "10 azioni italiane scelte tra quelle più famose",
              "100% in un'azione promettente che potrebbe crescere molto",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **ETF World + ETF obbligazioni** = diversificazione su migliaia di titoli + due asset class diverse. È un portafoglio semplice e robusto.",
            wrongExplanation: "10 azioni italiane = concentrazione su un paese minuscolo.\n100% su un titolo = scommessa, non investimento.\n\n**La scelta migliore:**\nETF World (diversificazione azioni globali) + ETF obbligazionario (altra asset class) = protezione a 360°.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Scelgo ETF globali", "Diversifico geograficamente", "Bilancio asset class"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ L'illusione della diversificazione",
        content: "Attenzione: non tutta la diversificazione è uguale. Esiste una **falsa diversificazione** che non ti protegge.\n\n**Esempi di diversificazione apparente:**\n\n- 5 ETF tecnologici diversi → tutti correlati, se la tech crolla perdono tutti\n- Azioni di 10 banche diverse → se il settore bancario crolla, tutti perdono\n- 3 fondi italiani → tutti esposti allo stesso mercato piccolo\n\n**Il test:** durante un crollo, i tuoi investimenti scendono tutti insieme o alcuni tengono?\n\nSe scendono tutti insieme, non sei diversificato. Stai solo moltiplicando la stessa scommessa.",
      },
      {
        kind: "explain",
        title: "📌 Correlazione: la chiave nascosta",
        content: "La vera diversificazione riguarda la **correlazione** tra asset.\n\n**Correlazione alta** (si muovono insieme):\n- Azioni tech USA e azioni tech Europa\n- Azioni bancarie e azioni assicurative\n- Bitcoin e altcoin\n\n**Correlazione bassa** (si muovono indipendentemente):\n- Azioni e obbligazioni governative\n- Azioni USA e oro\n- Mercati sviluppati e alcuni emergenti\n\n**L'obiettivo:** combinare asset con bassa correlazione. Così quando uno scende, l'altro potrebbe salire o almeno restare stabile.\n\nQuesto è il principio dietro i portafogli bilanciati: non è solo 'avere tante cose', è avere cose che si comportano diversamente.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Quale combinazione offre la migliore diversificazione?",
        pollAreas: [
          {
            id: "challenge-verify-11",
            prompt: "Seleziona la combinazione migliore",
            options: [
              "Azioni globali + Obbligazioni governative + Oro",
              "ETF S&P 500 + ETF NASDAQ + ETF Russell 2000",
              "Azioni Tesla + Azioni Apple + Azioni Microsoft",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Azioni + Obbligazioni + Oro** sono asset con bassa correlazione. Quando le azioni crollano, le obbligazioni spesso salgono e l'oro fa da rifugio.",
            wrongExplanation: "Le altre opzioni sono tutte concentrate sulle azioni USA (o peggio, su 3 titoli tech).\n\n**Vera diversificazione = bassa correlazione:**\n- Azioni (crescita)\n- Obbligazioni (stabilità, correlazione negativa con azioni)\n- Oro (rifugio, decorrelato)\n\nQuesti tre asset tendono a muoversi in modo indipendente.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "Il tuo portafoglio:\n- 40% ETF MSCI World\n- 30% ETF obbligazionario globale\n- 20% ETF immobiliare (REIT)\n- 10% Oro\n\nDurante un crollo azionario del 30%, cosa ti aspetti?",
        pollAreas: [
          {
            id: "challenge-scenario-11",
            prompt: "Cosa succede al portafoglio?",
            options: [
              "Perde meno del 30% - le obbligazioni e l'oro attutiscono il colpo",
              "Perde esattamente il 30% come il mercato",
              "Perde più del 30% - gli altri asset amplificano le perdite",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Con 40% azioni, se queste perdono 30%, il contributo negativo è ~12%. Ma le obbligazioni spesso salgono durante i crolli azionari, e l'oro fa da rifugio. **Il portafoglio complessivo perde molto meno.**",
            wrongExplanation: "Un portafoglio diversificato non replica il crollo del mercato azionario.\n\n**Calcolo approssimativo:**\n- Azioni (-30%): 40% × -30% = -12%\n- Obbligazioni (+5%?): 30% × +5% = +1.5%\n- Immobiliare (-15%?): 20% × -15% = -3%\n- Oro (+10%?): 10% × +10% = +1%\n\n**Totale:** circa -12% invece di -30%. Questo è il potere della diversificazione.",
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
        title: "🧠 Quiz finale: la diversificazione",
        content: "Hai imparato cos'è la diversificazione, i livelli su cui opera, e la differenza tra diversificazione vera e apparente.\n\n**Concetti chiave:**\n- Diversificare = distribuire su asset non correlati\n- Elimina il rischio specifico, non quello sistematico\n- Gli ETF globali sono lo strumento più efficiente\n- La correlazione conta più del numero di titoli\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Perché un ETF MSCI World è considerato ben diversificato?",
        pollAreas: [
          {
            id: "quiz-q1-11",
            prompt: "Seleziona la motivazione corretta",
            options: [
              "Contiene 1.500+ titoli di 20+ paesi e tutti i settori",
              "È gestito da professionisti esperti",
              "Ha rendimenti garantiti",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Un MSCI World contiene **migliaia di aziende, decine di paesi, tutti i settori**. Un singolo titolo che fallisce ha impatto quasi zero sul totale.",
            wrongExplanation: "Gli ETF non sono gestiti attivamente (sono passivi) e non hanno rendimenti garantiti.\n\n**Sono diversificati perché:**\n- 1.500+ aziende\n- 20+ paesi sviluppati\n- Tutti i settori economici\n\nSe un'azienda fallisce, pesa meno dello 0.1% del totale.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Quale scenario rappresenta una falsa diversificazione?",
        pollAreas: [
          {
            id: "quiz-q2-11",
            prompt: "Identifica la falsa diversificazione",
            options: [
              "Possedere 10 ETF tutti focalizzati sul settore tecnologico",
              "Possedere un ETF azionario e uno obbligazionario",
              "Possedere un ETF globale e un po' di oro",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **10 ETF tech** = 10 modi diversi di scommettere sulla stessa cosa. Se la tech crolla, perdono tutti insieme. Non è vera diversificazione.",
            wrongExplanation: "Azioni + obbligazioni e azioni + oro sono combinazioni con bassa correlazione = vera diversificazione.\n\n**10 ETF tech invece** sono tutti correlati: se il settore tech scende, scendono tutti. Non importa quanti ETF hai, stai scommettendo su un solo tema.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Un portafoglio ben diversificato durante un crollo azionario del 25%:",
        pollAreas: [
          {
            id: "quiz-q3-11",
            prompt: "Cosa succede?",
            options: [
              "Perde meno del 25% grazie agli asset decorrelati",
              "Perde esattamente il 25%",
              "Non perde nulla - la diversificazione elimina tutte le perdite",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Un portafoglio diversificato **attenua le perdite** perché gli asset decorrelati (obbligazioni, oro) spesso si comportano diversamente dalle azioni.",
            wrongExplanation: "La diversificazione non elimina TUTTE le perdite (quello è impossibile). Ma le attenua.\n\n**Come funziona:**\n- Azioni scendono\n- Obbligazioni spesso salgono (correlazione negativa)\n- Oro spesso sale (bene rifugio)\n\nRisultato: il portafoglio complessivo perde molto meno del mercato azionario.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco la correlazione", "Riconosco false diversificazioni", "Costruisco portafoglio robusto"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: la diversificazione",
        content: "Complimenti! Hai completato la lezione sulla diversificazione.\n\n**Principi fondamentali:**\n\n1. **Diversificare = distribuire su asset non correlati** (non solo 'avere tante cose')\n2. **Elimina il rischio specifico** (singola azienda, settore, paese)\n3. **Gli ETF globali** sono lo strumento più efficiente\n4. **La correlazione conta** - asset che si muovono insieme non diversificano\n\nQuesto principio si collega a tutto ciò che hai imparato: come il fondo emergenza protegge dalle emergenze, la diversificazione protegge dagli imprevisti di mercato.",
      },
      {
        kind: "explain",
        title: "📌 Prossimi passi pratici",
        content: "Ecco come applicare la diversificazione:\n\n**Se non hai ancora investimenti:**\n- Considera un ETF globale come primo acquisto\n- Un solo prodotto = diversificazione immediata\n\n**Se hai già investimenti:**\n- Verifica la concentrazione (troppo in un settore? un paese?)\n- Considera di aggiungere asset decorrelati (obbligazioni? oro?)\n\n**Il check della diversificazione:**\n1. Quante aziende diverse ho in portafoglio?\n2. Quanti settori sono rappresentati?\n3. Quanti paesi?\n4. Ho asset che si muovono in modo indipendente?\n\nSe la risposta a queste domande è 'pochi', hai spazio per migliorare.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Quale azione farai dopo questa lezione?",
        pollAreas: [
          {
            id: "feedback-action-11",
            prompt: "Scegli il tuo prossimo passo",
            options: [
              "Analizzo la diversificazione del mio portafoglio attuale",
              "Cerco un ETF globale adatto alle mie esigenze",
              "Verifico la correlazione tra i miei investimenti",
            ],
            correctIndex: 0,
            correctExplanation: "Ottima scelta! **Analizzare prima** ti permette di capire dove sei e cosa migliorare. Poi potrai agire in modo mirato.",
            wrongExplanation: "Tutte le opzioni sono valide! L'importante è fare un passo concreto.\n\nSe non hai idea di come sei diversificato, inizia dall'analisi. Se sai già che ti manca diversificazione, cerca un ETF globale.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Il mio portafoglio è abbastanza diversificato?",
      "Quali ETF globali sono più adatti per iniziare?",
      "Come aggiungo obbligazioni per bilanciare il rischio?",
    ],
  },
};

const lesson11Definition = createStaticLessonDefinition("11", content);

export default lesson11Definition;
