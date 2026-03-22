import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Due tipi di investitore: difensivo vs intraprendente",
        content: "Nelle lezioni precedenti hai imparato rischio, rendimento, diversificazione e orizzonte temporale. Ora la domanda chiave: **che tipo di investitore sei tu?**\n\nBenjamin Graham, il padre del value investing, identificava due profili:\n\n**Investitore difensivo:** vuole semplicità, sicurezza e tempo minimo dedicato agli investimenti. Punta a rendimenti 'nella media' con il minimo sforzo.\n\n**Investitore intraprendente:** è disposto a dedicare tempo e studio per cercare di battere il mercato. Accetta più complessità per potenziali rendimenti superiori.\n\nNon esiste un profilo 'migliore'. Esiste quello giusto per te.",
      },
      {
        kind: "explain",
        title: "📌 Il profilo difensivo: la semplicità che funziona",
        content: "L'investitore difensivo segue una strategia semplice e quasi automatica.\n\n**Caratteristiche:**\n- Compra ETF globali a basso costo\n- Diversifica ampiamente\n- Non cerca di battere il mercato\n- Versamenti automatici regolari (DCA)\n- Dedica meno di 1 ora al mese agli investimenti\n\n**Rendimenti attesi:** quelli del mercato (7-10% storico azionario globale)\n\n**Per chi è adatto:**\n- Chi ha poco tempo\n- Chi non vuole studiare la finanza nel dettaglio\n- Chi preferisce la tranquillità alla ricerca di rendimenti extra\n- Chi riconosce che battere il mercato è molto difficile\n\n**Il 90% degli investitori dovrebbe essere difensivo.** È una strategia che funziona.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Qual è l'obiettivo principale dell'investitore difensivo?",
        pollAreas: [
          {
            id: "concept-verify-13",
            prompt: "Seleziona l'obiettivo corretto",
            options: [
              "Ottenere i rendimenti del mercato con il minimo sforzo e rischio",
              "Battere il mercato ogni anno",
              "Trovare le azioni sottovalutate prima degli altri",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! L'investitore difensivo punta ai **rendimenti medi del mercato** (che storicamente sono ottimi) senza stress, senza tempo perso, senza cercare di essere più furbo degli altri.",
            wrongExplanation: "Battere il mercato e trovare azioni sottovalutate sono obiettivi dell'investitore intraprendente.\n\n**L'investitore difensivo:** accetta i rendimenti del mercato, usa ETF globali, automatizza, e dedica il suo tempo ad altro.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Il profilo intraprendente: impegno per rendimenti extra",
        content: "L'investitore intraprendente dedica tempo e studio per cercare opportunità migliori del mercato.\n\n**Caratteristiche:**\n- Analizza singole aziende (bilanci, business, management)\n- Cerca titoli sottovalutati\n- Gestisce attivamente il portafoglio\n- Dedica diverse ore a settimana agli investimenti\n- Accetta di sbagliare e imparare\n\n**Rendimenti attesi:** potenzialmente superiori al mercato, ma con alta variabilità\n\n**Per chi è adatto:**\n- Chi ha tempo e passione per la finanza\n- Chi ha disciplina emotiva eccezionale\n- Chi è disposto a studiare per anni\n- Chi accetta che potrebbe fare peggio del mercato\n\n**Attenzione:** la maggior parte dei professionisti non batte il mercato nel lungo termine. Essere intraprendenti richiede umiltà.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: quale profilo?",
        content: "Marco lavora 50 ore a settimana, non ha interesse per la finanza, e vuole solo far crescere i suoi risparmi senza pensieri. Quale profilo è adatto?",
        pollAreas: [
          {
            id: "concept-solve-13",
            prompt: "Quale profilo consiglieresti?",
            options: [
              "Difensivo - ETF globali e versamenti automatici",
              "Intraprendente - deve impegnarsi per rendimenti migliori",
              "Nessuno - meglio non investire",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Marco è il candidato perfetto per l'approccio **difensivo**: ETF globale, versamento automatico mensile, zero stress. Otterrà rendimenti di mercato senza sacrificare tempo o serenità.",
            wrongExplanation: "Con poco tempo e nessun interesse specifico per la finanza, l'approccio intraprendente sarebbe frustrante e probabilmente controproducente.\n\n**Difensivo è la scelta giusta:** semplice, efficace, richiede minuti al mese invece di ore.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Identifico il mio profilo", "Capisco i trade-off", "Scelgo consapevolmente"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Il portafoglio dell'investitore difensivo",
        content: "Se ti riconosci nel profilo difensivo, ecco una strategia concreta.\n\n**Portafoglio base (semplicissimo):**\n- 80% ETF azionario globale (MSCI World o FTSE All-World)\n- 20% ETF obbligazionario (titoli di stato area euro o globali)\n\n**Variante per chi vuole diversificare di più:**\n- 60% Azioni mercati sviluppati\n- 15% Azioni mercati emergenti\n- 20% Obbligazioni\n- 5% Oro (opzionale)\n\n**Operatività:**\n1. Scegli 1-3 ETF a basso costo\n2. Imposta versamento automatico mensile\n3. Ribilancia una volta l'anno\n4. Ignora le notizie finanziarie quotidiane\n\nQuesto portafoglio ha battuto il 90% dei fondi gestiti professionalmente negli ultimi 20 anni.",
      },
      {
        kind: "explain",
        title: "📌 Il ribilanciamento annuale",
        content: "L'unica attività dell'investitore difensivo: il **ribilanciamento annuale**.\n\n**Cosa significa:**\nSe parti con 80% azioni e 20% obbligazioni, dopo un anno le percentuali saranno cambiate (es. 85%-15% se le azioni sono salite di più).\n\n**Cosa fare:**\nRiporti alle percentuali originali vendendo ciò che è cresciuto troppo e comprando ciò che è cresciuto meno.\n\n**Esempio:**\n- Portafoglio 100.000€: obiettivo 80-20\n- Dopo 1 anno: 85.000€ azioni, 15.000€ obbligazioni\n- Ribilanci: vendi 5.000€ di azioni, compri 5.000€ obbligazioni\n- Risultato: 80.000€ azioni, 20.000€ obbligazioni\n\n**Perché funziona:** forza a 'comprare basso, vendere alto' automaticamente.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Quanto tempo richiede mensilmente la gestione di un portafoglio difensivo?",
        pollAreas: [
          {
            id: "widget-verify-13",
            prompt: "Seleziona la stima corretta",
            options: [
              "15-30 minuti (solo verifica versamento automatico)",
              "5-10 ore (analisi mercati e aggiustamenti)",
              "Zero - una volta impostato si gestisce da solo",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il portafoglio difensivo richiede **minuti al mese**: verifichi che il versamento automatico sia andato a buon fine. Una volta l'anno dedichi 1-2 ore al ribilanciamento.",
            wrongExplanation: "Il portafoglio difensivo non si gestisce completamente da solo (serve il ribilanciamento annuale), ma non richiede ore di lavoro.\n\n**Impegno reale:**\n- Mensile: 15-30 minuti (verifica versamento)\n- Annuale: 1-2 ore (ribilanciamento)",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Il tuo portafoglio difensivo 70-30 è diventato 80-20 dopo un anno positivo per le azioni. Cosa fai?",
        pollAreas: [
          {
            id: "widget-scenario-13",
            prompt: "Quale azione è corretta?",
            options: [
              "Ribilancio: vendo un po' di azioni, compro obbligazioni",
              "Non faccio nulla - le azioni stanno andando bene",
              "Aumento le azioni visto che salgono",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Il **ribilanciamento** riporta al 70-30 originale. Questo ti forza a 'vendere alto' (azioni che sono salite) e 'comprare basso' (obbligazioni rimaste indietro).",
            wrongExplanation: "Non fare nulla o aumentare le azioni significa seguire il trend invece di mantenere la disciplina.\n\n**Il ribilanciamento:**\n1. Mantiene il livello di rischio che hai scelto\n2. Forza a vendere alto e comprare basso\n3. È automatico e senza emozioni",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Scelgo i miei ETF", "Imposto versamenti automatici", "Pianifico ribilanciamento"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Il richiamo dell'investitore intraprendente",
        content: "Anche chi ha scelto un approccio difensivo può essere tentato dall'intraprendenza.\n\n**Segnali di tentazione:**\n- 'Quell'azione è chiaramente sottovalutata, ne compro un po''\n- 'Questo ETF settoriale sta andando fortissimo'\n- 'Ho letto un'analisi convincente su questa azienda'\n- 'Il mio amico ha guadagnato il 200% su crypto/meme stock'\n\n**Il problema:** queste deviazioni spesso costano caro. Studi mostrano che gli investitori retail che cercano di battere il mercato ottengono rendimenti inferiori del 2-3% annuo rispetto a chi resta disciplinato.\n\n**La regola:** se vuoi essere intraprendente, fallo con una piccola parte del portafoglio (max 10-20%), mai con tutto.",
      },
      {
        kind: "explain",
        title: "📌 La regola del portafoglio satellite",
        content: "Se proprio vuoi 'giocare', usa la strategia **core-satellite**.\n\n**Core (80-90% del portafoglio):**\n- ETF globali, approccio difensivo\n- Mai toccare per ragioni emotive\n- Versamenti automatici\n\n**Satellite (10-20% del portafoglio):**\n- Singole azioni, settori, temi che ti interessano\n- Puoi 'giocare' con questi soldi\n- Accetti che potresti perderli\n\n**Perché funziona:**\n- Soddisfa la voglia di 'fare qualcosa'\n- Limita i danni se sbagli\n- Protegge il grosso del patrimonio\n\nQuesto è un compromesso psicologico: permette di sentirti attivo senza rischiare tutto.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Perché la strategia core-satellite può essere utile?",
        pollAreas: [
          {
            id: "challenge-verify-13",
            prompt: "Seleziona il beneficio principale",
            options: [
              "Soddisfa la voglia di 'fare' limitando i danni potenziali",
              "Garantisce rendimenti superiori",
              "Elimina il bisogno di ribilanciare",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il satellite permette di **canalizzare l'istinto** a fare trading/stock picking in una piccola porzione, proteggendo il grosso del patrimonio (core) dagli errori emotivi.",
            wrongExplanation: "La strategia core-satellite non garantisce rendimenti superiori e non elimina il ribilanciamento.\n\n**Il beneficio reale:** soddisfa il bisogno psicologico di 'fare qualcosa' senza mettere a rischio tutto il patrimonio.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "Un amico ti racconta di aver guadagnato il 300% su un'azione in 3 mesi. Ti viene voglia di investire una parte significativa del tuo portafoglio. Cosa fai?",
        pollAreas: [
          {
            id: "challenge-scenario-13",
            prompt: "Qual è la reazione corretta?",
            options: [
              "Resto disciplinato - uso al massimo il satellite (10-20%)",
              "Investo il 50% - il mio amico ha dimostrato che funziona",
              "Ignoro completamente - queste opportunità non esistono",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! La **disciplina prevale**. Se proprio vuoi provare, usa solo la parte satellite. Il tuo amico potrebbe aver avuto fortuna (o potrebbe aver perso il 300% su un'altra operazione che non ti ha raccontato).",
            wrongExplanation: "I rendimenti del 300% in 3 mesi non sono investimenti, sono scommesse. Il tuo amico ha avuto fortuna (questa volta).\n\n**L'errore comune:** sentire i successi degli altri e ignorare i fallimenti. Per ogni storia di +300%, ci sono molte storie di -80% che nessuno racconta.\n\nMantieni la disciplina, usa al massimo il satellite.",
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
        title: "🧠 Quiz finale: il tuo profilo di investitore",
        content: "Hai imparato la differenza tra approccio difensivo e intraprendente, come costruire un portafoglio difensivo, e la strategia core-satellite.\n\n**Concetti chiave:**\n- Difensivo: semplicità, ETF globali, rendimenti di mercato\n- Intraprendente: studio, tempo, ricerca di rendimenti extra\n- Il 90% delle persone dovrebbe essere difensivo\n- Core-satellite per chi vuole un compromesso\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Quale affermazione descrive meglio l'investitore difensivo?",
        pollAreas: [
          {
            id: "quiz-q1-13",
            prompt: "Seleziona la descrizione corretta",
            options: [
              "Accetta i rendimenti del mercato in cambio di semplicità e tempo libero",
              "Dedica ore a cercare le migliori opportunità",
              "Cambia strategia in base alle notizie economiche",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! L'investitore difensivo fa un **trade-off consapevole**: rinuncia alla possibilità di battere il mercato in cambio di semplicità, tempo e tranquillità.",
            wrongExplanation: "Dedicare ore alle analisi e cambiare strategia sono caratteristiche dell'investitore intraprendente (o peggio, dell'investitore emotivo).\n\n**L'investitore difensivo:** ETF, automatismo, ribilanciamento annuale, fine.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Perché il ribilanciamento annuale è importante?",
        pollAreas: [
          {
            id: "quiz-q2-13",
            prompt: "Seleziona il motivo principale",
            options: [
              "Mantiene il livello di rischio desiderato e forza a vendere alto/comprare basso",
              "Aumenta i rendimenti del 5% annuo",
              "È richiesto dalla legge per motivi fiscali",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il ribilanciamento **mantiene il rischio al livello scelto** e automaticamente ti fa vendere ciò che è salito troppo (vendere alto) e comprare ciò che è sceso (comprare basso).",
            wrongExplanation: "Il ribilanciamento non aumenta i rendimenti del 5% e non è richiesto dalla legge.\n\n**Benefici reali:**\n1. Mantiene il profilo di rischio stabile\n2. Forza disciplina: vendi alto, compri basso\n3. Rimuove le emozioni dalle decisioni",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "La strategia core-satellite è utile per:",
        pollAreas: [
          {
            id: "quiz-q3-13",
            prompt: "Seleziona l'uso corretto",
            options: [
              "Soddisfare la voglia di trading senza rischiare tutto il portafoglio",
              "Massimizzare i rendimenti in modo garantito",
              "Evitare completamente il ribilanciamento",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Core-satellite è un **compromesso psicologico**: protegge il grosso (core difensivo) permettendo di 'giocare' con una piccola parte (satellite).",
            wrongExplanation: "Core-satellite non garantisce rendimenti superiori e non elimina il bisogno di ribilanciare il core.\n\n**Lo scopo:** canalizzare l'istinto a fare trading in una piccola parte del portafoglio, proteggendo il resto dagli errori emotivi.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Confermo il mio profilo", "Definisco il core", "Stabilisco regole satellite"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: il tuo profilo di investitore",
        content: "Complimenti! Hai completato la lezione sui profili di investitore.\n\n**Principi fondamentali:**\n\n1. **Difensivo vs Intraprendente** - due approcci validi con trade-off diversi\n2. **Il 90% dovrebbe essere difensivo** - semplicità ed efficacia\n3. **Portafoglio difensivo** - ETF globali + ribilanciamento annuale\n4. **Core-satellite** - compromesso per chi vuole 'fare' senza rischiare tutto\n\nOra hai tutti gli elementi per decidere consapevolmente che tipo di investitore vuoi essere.",
      },
      {
        kind: "explain",
        title: "📌 Prossimi passi",
        content: "Ecco cosa fare dopo questa lezione:\n\n**Se hai scelto il profilo difensivo:**\n1. Scegli 1-3 ETF globali a basso costo\n2. Decidi l'allocazione azioni/obbligazioni (usa la formula 100-età)\n3. Imposta versamento automatico mensile\n4. Metti in calendario il ribilanciamento annuale\n5. Smetti di guardare le notizie finanziarie\n\n**Se hai scelto il profilo intraprendente:**\n1. Definisci quanto tempo dedicherai (minimo 5-10 ore/settimana)\n2. Inizia a studiare analisi fondamentale\n3. Mantieni comunque un core difensivo (almeno 50%)\n4. Tieni traccia dei tuoi rendimenti per verificare se batti il mercato\n\n**Se sei indeciso:** inizia difensivo. Puoi sempre aggiungere un satellite dopo.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Quale profilo scegli?",
        pollAreas: [
          {
            id: "feedback-action-13",
            prompt: "Indica la tua scelta",
            options: [
              "Difensivo - semplicità e rendimenti di mercato",
              "Core-satellite - difensivo con una piccola parte attiva",
              "Intraprendente - sono disposto a studiare e dedicare tempo",
            ],
            correctIndex: 0,
            correctExplanation: "Ottima scelta! L'approccio **difensivo** è la scelta più saggia per la maggior parte delle persone. Funziona, richiede poco tempo, e ti permette di concentrarti sulla vita.",
            wrongExplanation: "Qualsiasi scelta tu faccia, l'importante è essere **consapevole dei trade-off**.\n\n- Difensivo: semplicità, rendimenti di mercato\n- Core-satellite: compromesso flessibile\n- Intraprendente: tempo e studio richiesti, rendimenti incerti\n\nScegli quello che si adatta alla tua vita.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Quali ETF sono adatti per un portafoglio difensivo?",
      "Come imposto un versamento automatico per investire?",
      "Quanto del mio portafoglio dovrebbe essere satellite?",
    ],
  },
};

const lesson13Definition = createStaticLessonDefinition("13", content);

export default lesson13Definition;
