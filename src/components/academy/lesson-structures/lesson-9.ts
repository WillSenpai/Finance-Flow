import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Rischio e rendimento: la coppia inseparabile",
        content: "Nella lezione precedente hai capito la differenza tra investire e speculare. Ora affrontiamo il cuore di ogni decisione d'investimento: la **relazione tra rischio e rendimento**.\n\nQuesto principio è semplice ma spesso frainteso: non esiste rendimento senza rischio. Chi ti promette 'guadagni sicuri' sta mentendo o nascondendo qualcosa.\n\n**Il punto chiave:** il rischio non è il nemico da evitare, ma il prezzo da pagare per ottenere rendimenti. La domanda giusta non è 'come evito il rischio?' ma 'quale rischio sono disposto ad accettare?'",
      },
      {
        kind: "explain",
        title: "📌 Volatilità vs rischio reale",
        content: "Molti confondono **volatilità** con **rischio**. Sono collegati ma diversi.\n\n**Volatilità** = quanto oscillano i prezzi nel breve periodo. Un'azione può salire del 5% lunedì e scendere del 7% martedì.\n\n**Rischio reale** = la probabilità di perdere capitale in modo permanente. Questo dipende da cosa compri, a che prezzo, e per quanto tempo tieni.\n\n**Esempio pratico:**\n- Un ETF azionario globale ha alta volatilità (oscilla molto) ma basso rischio su 20 anni\n- Un'obbligazione di un'azienda in difficoltà ha bassa volatilità ma alto rischio di default\n\nL'investitore disciplinato impara a tollerare la volatilità per catturare i rendimenti di lungo periodo.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Qual è la differenza fondamentale tra volatilità e rischio?",
        pollAreas: [
          {
            id: "concept-verify-9",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Volatilità = oscillazioni di prezzo; Rischio = perdita permanente di capitale",
              "Sono la stessa cosa con nomi diversi",
              "La volatilità è sempre negativa, il rischio può essere positivo",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! La **volatilità** è il movimento dei prezzi nel breve termine - fa parte del gioco. Il **rischio reale** è perdere soldi in modo permanente, che dipende da cosa compri e quando vendi.",
            wrongExplanation: "Volatilità e rischio non sono la stessa cosa.\n\n**Volatilità** = oscillazioni di prezzo (temporanee)\n**Rischio** = perdita permanente di capitale\n\nUn investimento può essere volatile ma sicuro nel lungo termine (es. azioni globali), o stabile ma rischioso (es. obbligazioni di aziende deboli).",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Il premio al rischio",
        content: "Perché le azioni rendono più delle obbligazioni nel lungo periodo? Perché comportano più rischio.\n\nQuesto si chiama **premio al rischio**: il rendimento extra che ottieni per aver accettato l'incertezza.\n\n**Rendimenti storici medi (approssimativi):**\n- Conti deposito: 0-2% annuo → rischio quasi zero\n- Obbligazioni governative: 2-4% annuo → rischio basso\n- Azioni globali: 7-10% annuo → rischio medio-alto\n\n**La lezione:** se vuoi rendimenti più alti, devi accettare più volatilità. Non ci sono scorciatoie. Chi cerca rendimenti alti senza rischio finisce vittima di truffe o speculazioni.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: premio al rischio",
        content: "Un amico ti propone un investimento che promette il 15% annuo garantito senza rischio. Cosa pensi?",
        pollAreas: [
          {
            id: "concept-solve-9",
            prompt: "Qual è la tua reazione?",
            options: [
              "È troppo bello per essere vero - probabilmente una truffa o rischio nascosto",
              "Ottimo affare, investo subito",
              "Dipende da chi me lo propone",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **15% garantito senza rischio non esiste.** Le azioni globali rendono 7-10% con alta volatilità. Chiunque prometta di più senza rischio sta nascondendo qualcosa o è una truffa (schema Ponzi, crypto scam, ecc.).",
            wrongExplanation: "Attenzione! Non esistono rendimenti alti senza rischio.\n\n**Regola d'oro:** se sembra troppo bello per essere vero, probabilmente lo è.\n\n15% annuo garantito supera di gran lunga i rendimenti delle azioni globali (7-10% con alta volatilità). Chiunque prometta questo sta:\n- Nascondendo il rischio reale\n- Gestendo uno schema Ponzi\n- Mentendo",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco il premio al rischio", "Distinguo volatilità da rischio", "Riconosco le promesse false"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Come misurare il tuo rischio personale",
        content: "Sapere cos'è il rischio in teoria è utile. Ma la domanda pratica è: **quanto rischio puoi permetterti TU?**\n\nIl rischio che puoi sostenere dipende da tre fattori:\n\n**1. Capacità finanziaria**: quanto puoi perdere senza compromettere la tua vita quotidiana? Se hai un fondo emergenza solido e reddito stabile, puoi permetterti più rischio.\n\n**2. Orizzonte temporale**: quanto tempo puoi lasciare investiti i soldi? Più lungo l'orizzonte, più rischio puoi accettare.\n\n**3. Tolleranza emotiva**: riesci a dormire la notte se il tuo portafoglio perde il 30%? Questa è la componente psicologica, spesso sottovalutata.",
      },
      {
        kind: "explain",
        title: "📌 Il test del -30%",
        content: "Ecco un test pratico per capire la tua tolleranza al rischio.\n\n**Immagina questo scenario:**\nHai investito 10.000€. Dopo 6 mesi, il mercato crolla e il tuo portafoglio vale 7.000€ (-30%).\n\n**Come reagisci?**\n\n- **A) Panico - vendo tutto** → La tua tolleranza è bassa. Meglio un portafoglio più conservativo.\n- **B) Preoccupato ma aspetto** → Tolleranza media. Mix bilanciato azioni/obbligazioni.\n- **C) Opportunità - compro di più** → Tolleranza alta. Puoi gestire portafogli aggressivi.\n\nNon c'è risposta giusta o sbagliata. La risposta onesta ti aiuta a scegliere un portafoglio che non ti farà prendere decisioni emotive.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Perché è importante conoscere la propria tolleranza al rischio PRIMA di investire?",
        pollAreas: [
          {
            id: "widget-verify-9",
            prompt: "Seleziona la motivazione corretta",
            options: [
              "Per evitare decisioni emotive durante i crolli di mercato",
              "Per calcolare esattamente quanto guadagnerò",
              "Non è importante, si impara facendo",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Se non conosci la tua tolleranza, quando arriva un crollo del 30% potresti vendere nel panico - realizzando perdite che sarebbero state temporanee. **Conoscersi prima** evita errori costosi.",
            wrongExplanation: "Conoscere la propria tolleranza è fondamentale.\n\n**Il problema:** durante i crolli, le emozioni prendono il sopravvento. Chi non si conosce vende nel panico e realizza perdite.\n\n**La soluzione:** scegliere PRIMA un portafoglio adatto alla propria tolleranza. Così quando arriva il crollo, hai già accettato quella possibilità.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Marco, 28 anni, stipendio stabile, fondo emergenza di 6 mesi, obiettivo pensione tra 35 anni. Quale profilo di rischio è più adatto?",
        pollAreas: [
          {
            id: "widget-scenario-9",
            prompt: "Quale profilo suggeriresti?",
            options: [
              "Alto rischio (80-90% azioni) - ha tempo per recuperare eventuali crolli",
              "Basso rischio (20-30% azioni) - meglio essere prudenti",
              "Rischio medio (50% azioni) - un compromesso sempre valido",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Con 35 anni davanti, fondo emergenza solido e reddito stabile, Marco ha **alta capacità di rischio**. I crolli temporanei hanno decenni per recuperare. La componente azionaria può essere alta.",
            wrongExplanation: "Con 35 anni di orizzonte, fondo emergenza solido e reddito stabile, Marco ha tutte le condizioni per un profilo **alto rischio**.\n\n**Perché:**\n- Ha tempo per recuperare i crolli\n- Non ha bisogno di quei soldi nel breve\n- Il fondo emergenza lo protegge dagli imprevisti\n\nEssere troppo conservativi a 28 anni significa rinunciare a rendimenti importanti.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Conosco la mia tolleranza", "Faccio il test del -30%", "Valuto capacità + orizzonte"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Il momento della verità: il crollo di mercato",
        content: "Hai imparato la teoria. Hai fatto il test della tolleranza. Ma la vera sfida arriva quando il mercato crolla davvero.\n\n**Marzo 2020:** COVID colpisce, i mercati crollano del 35% in tre settimane. I titoli dei giornali urlano catastrofe.\n\n**Cosa fanno gli investitori?**\n- Chi non si conosceva ha venduto nel panico (perdendo il 35%)\n- Chi conosceva la propria tolleranza ha tenuto (recuperando tutto in 6 mesi)\n- Chi aveva liquidità extra ha comprato (guadagnando il 70% in un anno)\n\n**La lezione:** la tolleranza al rischio non si misura quando tutto va bene. Si misura quando tutto sembra andare male.",
      },
      {
        kind: "explain",
        title: "📌 La regola del sonno",
        content: "C'è un test ancora più semplice del -30%. Si chiama la **regola del sonno**.\n\n**Domanda:** riesci a dormire la notte pensando ai tuoi investimenti?\n\n- **No, mi sveglio preoccupato** → Hai troppo rischio. Riduci la componente azionaria.\n- **Sì, ma controllo ogni giorno** → Rischio borderline. Considera di ridurre leggermente.\n- **Sì, non ci penso quasi mai** → Il tuo portafoglio è calibrato bene.\n\nL'obiettivo non è massimizzare i rendimenti a tutti i costi. È costruire un sistema che funziona **senza consumarti emotivamente**.\n\nCome per il risparmio automatico, anche qui la sostenibilità batte l'aggressività.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Durante un crollo di mercato del 25%, cosa dovrebbe fare un investitore disciplinato?",
        pollAreas: [
          {
            id: "challenge-verify-9",
            prompt: "Seleziona l'approccio corretto",
            options: [
              "Niente di straordinario - continua con il piano stabilito",
              "Vendere subito per limitare le perdite",
              "Comprare aggressivamente per 'approfittare'",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Non fare niente di straordinario** è spesso la cosa giusta. Se il portafoglio era calibrato sulla tua tolleranza, il crollo era già 'previsto' come possibilità. Continua con il piano.",
            wrongExplanation: "Vendere durante un crollo cristallizza le perdite. Comprare aggressivamente può essere rischioso se non hai liquidità extra.\n\n**L'approccio disciplinato:**\n- Se hai calibrato bene il rischio, il crollo era previsto\n- Continua con i versamenti regolari (DCA)\n- Non prendere decisioni emotive\n\nLa disciplina batte l'istinto.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🛡️ Il piano anti-panico",
        content: "Prima che arrivi il prossimo crollo, prepara un **piano anti-panico**. Scrivilo quando sei lucido, così quando le emozioni prendono il sopravvento hai una guida.\n\n**Il mio piano anti-panico:**\n\n1. **Non controllo il portafoglio più di una volta al mese** (riduce l'ansia)\n2. **Non vendo durante i crolli** (le perdite sono solo su carta finché non vendi)\n3. **Continuo i versamenti automatici** (compro di più quando i prezzi sono bassi)\n4. **Parlo con qualcuno prima di agire** (un amico, consulente, o anche me stesso tra 24 ore)\n\nQuesto piano funziona come le regole del budget: decidi in anticipo, quando sei lucido, così le emozioni non possono sabotarti.",
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "Il mercato è crollato del 40%. Il tuo portafoglio di 20.000€ vale ora 12.000€. I giornali parlano di recessione imminente. Cosa fai?",
        pollAreas: [
          {
            id: "challenge-scenario-9",
            prompt: "Qual è la tua azione?",
            options: [
              "Seguo il piano anti-panico: non vendo, continuo i versamenti, aspetto",
              "Vendo tutto - meglio salvare i 12.000€ rimasti",
              "Compro altri 10.000€ di azioni - è un'opportunità",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **Segui il piano**. I crolli del 40% sono successi e si sono sempre ripresi. Vendere ora cristallizza la perdita. Comprare extra è ok SOLO se hai liquidità che non ti serve. La cosa più saggia è continuare con il piano.",
            wrongExplanation: "Vendere dopo un crollo del 40% è l'errore più costoso.\n\n**Perché:**\n- Realizzi una perdita che era solo su carta\n- Storicamente, i mercati si sono SEMPRE ripresi\n- Compreresti alto e venderesti basso (l'opposto di ciò che funziona)\n\nComprare extra va bene SOLO se hai liquidità che non ti serve. Altrimenti, segui il piano e aspetta.",
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
        title: "🧠 Quiz finale: rischio e rendimento",
        content: "Hai imparato la relazione tra rischio e rendimento, la differenza tra volatilità e rischio reale, e come calibrare il rischio sulla tua situazione personale.\n\nOra verifichiamo se hai interiorizzato i concetti chiave.\n\n**Ricorda:**\n- Non esiste rendimento senza rischio\n- Volatilità ≠ rischio reale\n- Il tuo profilo dipende da capacità, orizzonte e tolleranza emotiva\n- Il piano anti-panico si prepara PRIMA del crollo",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Un investimento che promette il 20% annuo garantito senza rischio è:",
        pollAreas: [
          {
            id: "quiz-q1-9",
            prompt: "Seleziona la risposta",
            options: [
              "Quasi certamente una truffa o con rischio nascosto",
              "Possibile se gestito da professionisti",
              "Normale per investimenti sofisticati",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **20% garantito senza rischio non esiste.** È matematicamente impossibile. Chiunque lo prometta sta mentendo o gestendo uno schema Ponzi.",
            wrongExplanation: "Non esistono rendimenti garantiti sopra il tasso privo di rischio (titoli di stato a breve).\n\n**La regola:** più alto il rendimento promesso, più alto il rischio nascosto. 20% garantito è un segnale d'allarme chiaro.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Giulia, 55 anni, vuole andare in pensione tra 5 anni. Ha 100.000€ da investire. Quale profilo di rischio è più adatto?",
        pollAreas: [
          {
            id: "quiz-q2-9",
            prompt: "Quale profilo?",
            options: [
              "Basso rischio (20-30% azioni) - orizzonte breve, non può permettersi crolli",
              "Alto rischio (80-90% azioni) - per massimizzare i rendimenti",
              "Rischio medio (50% azioni) - sempre un buon compromesso",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Con solo 5 anni davanti e la pensione in vista, Giulia **non può permettersi un crollo del 30%** proprio quando avrà bisogno dei soldi. Profilo conservativo.",
            wrongExplanation: "Con 5 anni di orizzonte e la pensione in arrivo, Giulia non ha tempo per recuperare un crollo.\n\n**Regola:** più si avvicina il momento in cui servono i soldi, più basso deve essere il rischio. Un crollo del 30% a 54 anni sarebbe devastante.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Cosa distingue un investitore disciplinato durante un crollo di mercato?",
        pollAreas: [
          {
            id: "quiz-q3-9",
            prompt: "Qual è il comportamento chiave?",
            options: [
              "Ha un piano preparato in anticipo e lo segue",
              "Riesce a prevedere il momento giusto per vendere",
              "Ha informazioni che gli altri non hanno",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! L'investitore disciplinato **prepara il piano quando è lucido** e lo segue quando le emozioni sono forti. Non cerca di prevedere il mercato.",
            wrongExplanation: "Nessuno può prevedere il mercato con costanza. Le informazioni privilegiate sono illegali.\n\n**Il vantaggio dell'investitore disciplinato:** ha un piano scritto, preparato in anticipo, che segue anche quando le emozioni spingono a fare altro.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Verifico comprensione rischio", "Controllo profilo", "Confermo piano anti-panico"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: rischio e rendimento",
        content: "Complimenti! Hai completato la lezione su rischio e rendimento.\n\n**Concetti chiave:**\n\n1. **Rischio e rendimento sono inseparabili** - non puoi avere uno senza l'altro\n2. **Volatilità ≠ rischio** - le oscillazioni di breve termine non sono perdite permanenti\n3. **Il tuo profilo di rischio** dipende da capacità finanziaria + orizzonte temporale + tolleranza emotiva\n4. **Il piano anti-panico** si prepara prima, non durante il crollo\n\nQuesti principi li ritroverai in tutte le prossime lezioni su diversificazione, asset allocation e strategie d'investimento.",
      },
      {
        kind: "explain",
        title: "📌 Collegamento con le lezioni precedenti",
        content: "Nota come i principi si collegano:\n\n- **Budget**: pianifichi le spese PRIMA che arrivino\n- **Risparmio automatico**: decidi PRIMA di avere i soldi in mano\n- **Rischio**: prepari il piano PRIMA del crollo\n\nIl pattern è sempre lo stesso: **decisioni in anticipo, quando sei lucido**, non nel momento caldo quando le emozioni comandano.\n\nQuesta è la base della disciplina finanziaria. Nelle prossime lezioni vedrai come applicare questo principio alla diversificazione e all'interesse composto.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Quale azione concreta farai dopo questa lezione?",
        pollAreas: [
          {
            id: "feedback-action-9",
            prompt: "Scegli il tuo prossimo passo",
            options: [
              "Scrivo il mio piano anti-panico",
              "Faccio il test del -30% per capire la mia tolleranza",
              "Verifico se il mio portafoglio attuale è adatto al mio profilo",
            ],
            correctIndex: 0,
            correctExplanation: "Ottima scelta! Scrivere il piano anti-panico **adesso**, quando sei lucido, ti proteggerà dal prendere decisioni emotive durante il prossimo crollo.",
            wrongExplanation: "Tutte le opzioni sono valide! L'importante è fare almeno un passo concreto.\n\nSe non hai ancora un piano anti-panico, inizia da lì. È la protezione più efficace contro le decisioni emotive.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Aiutami a scrivere il mio piano anti-panico",
      "Come capisco se il mio portafoglio è troppo rischioso?",
      "Qual è il rischio giusto per la mia situazione?",
    ],
  },
};

const lesson9Definition = createStaticLessonDefinition("9", content);

export default lesson9Definition;
