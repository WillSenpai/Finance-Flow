import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "Cos'e l'asset allocation?",
        content:
          "L'**asset allocation** e la strategia con cui dividi il tuo patrimonio tra diverse classi di attivo: azioni, obbligazioni, liquidita, immobili, materie prime.\n\nNon si tratta di scegliere i singoli titoli migliori. Si tratta di **decidere quanto peso dare a ciascuna categoria**.\n\n**Perche e cosi importante?**\nStudi accademici dimostrano che oltre il 90% della variabilita dei rendimenti di un portafoglio dipende dall'asset allocation, non dalla selezione dei singoli titoli.\n\n**Esempio concreto:**\n- 60% azioni (crescita, rischio alto)\n- 30% obbligazioni (stabilita, rischio medio)\n- 10% liquidita (sicurezza, rendimento minimo)\n\nQuesto mix determina il **profilo rischio-rendimento** del tuo portafoglio piu di qualsiasi altra scelta.",
      },
      {
        kind: "explain",
        title: "I pesi target: la tua bussola",
        content:
          "I **pesi target** sono le percentuali ideali che vuoi mantenere per ogni classe di attivo. Sono la tua bussola strategica.\n\n**Come definire i pesi target:**\n\n1. **Orizzonte temporale**: piu e lungo, piu puoi permetterti rischio (azioni)\n2. **Tolleranza al rischio**: quanto puoi sopportare un calo del 30% senza vendere in panico?\n3. **Obiettivi finanziari**: crescita aggressiva o preservazione del capitale?\n\n**Esempi di profili tipici:**\n\n| Profilo | Azioni | Obbligazioni | Liquidita |\n|---------|--------|--------------|----------|\n| Aggressivo | 80% | 15% | 5% |\n| Bilanciato | 60% | 30% | 10% |\n| Conservativo | 30% | 50% | 20% |\n\nI pesi target non sono fissi per sempre: si aggiornano quando cambiano le tue circostanze di vita.",
      },
      {
        kind: "question",
        title: "Verifica veloce",
        content: "Quale fattore influenza maggiormente la scelta dei pesi target?",
        pollAreas: [
          {
            id: "concept-verify-35",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Orizzonte temporale, tolleranza al rischio e obiettivi",
              "Solo il rendimento storico delle azioni",
              "Il consiglio dell'amico esperto",
            ],
            correctIndex: 0,
            correctExplanation:
              "Esatto! I pesi target dipendono da fattori personali: quanto tempo hai, quanto rischio tolleri, cosa vuoi ottenere.",
            wrongExplanation:
              "I pesi target devono riflettere la TUA situazione: orizzonte temporale, tolleranza al rischio e obiettivi. Non esistono pesi universalmente migliori.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "Perche il portafoglio si sbilancia",
        content:
          "Col tempo il tuo portafoglio si **sbilancia naturalmente**. Perche?\n\nPerche le diverse asset class hanno rendimenti diversi.\n\n**Esempio:**\nInizi con 60% azioni, 40% obbligazioni.\nDopo un anno di mercato azionario forte:\n- Le azioni sono salite del 20%\n- Le obbligazioni sono salite del 3%\n\n**Risultato:** ora hai circa 65% azioni, 35% obbligazioni.\n\nIl tuo portafoglio e diventato **piu rischioso** di quanto avevi pianificato.\n\n**Questo sbilanciamento e normale** - succede sempre. Il problema e quando non te ne accorgi e lasci che il portafoglio devii troppo dalla tua strategia originale.\n\nEcco perche serve il **ribilanciamento**.",
      },
      {
        kind: "question",
        title: "Verifica: sbilanciamento",
        content:
          "Hai un portafoglio 60/40 (azioni/obbligazioni). Dopo un anno le azioni sono salite molto piu delle obbligazioni. Cosa e successo ai pesi?",
        pollAreas: [
          {
            id: "concept-solve-35",
            prompt: "Seleziona cosa e accaduto",
            options: [
              "Il peso delle azioni e aumentato oltre il 60% target",
              "Il portafoglio e rimasto perfettamente bilanciato",
              "Il peso delle obbligazioni e aumentato",
            ],
            correctIndex: 0,
            correctExplanation:
              "Corretto! Quando una asset class performa meglio delle altre, il suo peso nel portafoglio aumenta automaticamente.",
            wrongExplanation:
              "Quando le azioni salgono piu delle obbligazioni, il loro peso aumenta. Il portafoglio si sbilancia verso il rischio.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Definisco i pesi target", "Capisco lo sbilanciamento", "Preparo il ribilanciamento"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "Il ribilanciamento: tornare ai pesi target",
        content:
          "Il **ribilanciamento** e l'operazione con cui riporti il portafoglio ai pesi target originali.\n\n**Come funziona in pratica:**\n\nSe il tuo target e 60% azioni / 40% obbligazioni, ma ora hai 70% / 30%:\n1. **Vendi** parte delle azioni (la asset class che e cresciuta troppo)\n2. **Compra** obbligazioni (la asset class che e rimasta indietro)\n3. Torni al 60% / 40%\n\n**Perche e controintuitivo ma efficace:**\nStai vendendo cio che e salito e comprando cio che e sceso. E l'opposto di seguire il momentum - ma e esattamente quello che serve per **mantenere il tuo profilo di rischio costante**.\n\n**Risultato:** eviti di trovarti con un portafoglio troppo rischioso proprio quando i mercati sono ai massimi (e piu vulnerabili).",
      },
      {
        kind: "explain",
        title: "Le soglie di ribilanciamento",
        content:
          "Non devi ribilanciare ogni giorno. Sarebbe costoso e inefficiente.\n\nEsistono due approcci principali:\n\n**1. Ribilanciamento a calendario**\n- Ogni 6 mesi o ogni anno controlli i pesi e ribilanci se necessario\n- Semplice da implementare\n- Potrebbe ribilanciare quando non serve\n\n**2. Ribilanciamento a soglia (consigliato)**\n- Ribilanci solo quando un peso si discosta oltre una soglia dal target\n- Soglia tipica: 5% o 10% di scostamento\n- Piu efficiente: agisci solo quando serve davvero\n\n**Esempio con soglia 5%:**\n- Target azioni: 60%\n- Soglia: 55% - 65%\n- Se le azioni vanno a 66%, ribilanci\n- Se restano a 63%, non fai nulla\n\nQuesto approccio bilancia **disciplina** (hai regole chiare) e **efficienza** (non paghi costi inutili).",
      },
      {
        kind: "question",
        title: "Verifica veloce",
        content: "Quando conviene ribilanciare con l'approccio a soglia?",
        pollAreas: [
          {
            id: "widget-verify-35",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Quando un peso supera la soglia definita rispetto al target",
              "Ogni volta che il mercato si muove",
              "Mai, il ribilanciamento e inutile",
            ],
            correctIndex: 0,
            correctExplanation:
              "Esatto! Con l'approccio a soglia ribilanci solo quando lo scostamento supera un limite predefinito (es. 5%).",
            wrongExplanation:
              "L'approccio a soglia prevede di ribilanciare solo quando lo scostamento dal target supera una percentuale predefinita. Questo evita costi inutili.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "Scenario pratico",
        content:
          "Target: 60% azioni. Soglia: +/- 5%. Peso attuale azioni: 63%. Cosa fai?",
        pollAreas: [
          {
            id: "widget-scenario-35",
            prompt: "Seleziona l'azione corretta",
            options: [
              "Non faccio nulla, sono ancora dentro la soglia (55%-65%)",
              "Ribilancio subito vendendo azioni",
              "Aspetto che le azioni salgano ancora",
            ],
            correctIndex: 0,
            correctExplanation:
              "Corretto! 63% e dentro la fascia 55%-65%, quindi non c'e bisogno di intervenire. Ribilancerai solo se si supera il 65%.",
            wrongExplanation:
              "Con soglia +/- 5% su un target del 60%, la fascia accettabile e 55%-65%. Il 63% e dentro questa fascia, quindi non serve ribilanciare.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Definisco le soglie", "Imposto un calendario", "Preparo le regole operative"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "Errore tipico: ribilanciare troppo spesso",
        content:
          "Un errore comune e ribilanciare troppo frequentemente, inseguendo ogni piccolo movimento di mercato.\n\n**Perche e un problema:**\n\n1. **Costi di transazione**: ogni compravendita ha un costo\n2. **Tasse sulle plusvalenze**: vendere significa realizzare guadagni (e pagare tasse)\n3. **Tempo e stress**: monitorare costantemente e controproducente\n\n**La trappola dell'iperattivita:**\nPiu guardi il portafoglio, piu sei tentato di fare qualcosa. Ma nel ribilanciamento, fare meno e spesso meglio.\n\n**Regola pratica:**\nSe ribilanci piu di 2-3 volte l'anno, probabilmente stai esagerando. Le soglie servono proprio a darti **permesso di non agire** finche non e davvero necessario.",
      },
      {
        kind: "explain",
        title: "Altro errore: non ribilanciare mai",
        content:
          "L'errore opposto e altrettanto pericoloso: non ribilanciare mai.\n\n**Cosa succede se non ribilanci:**\n\nIn un mercato rialzista prolungato:\n- Le azioni crescono molto\n- Il loro peso aumenta sempre piu\n- Il portafoglio diventa sempre piu rischioso\n\nPoi arriva una correzione:\n- Sei molto piu esposto di quanto avevi pianificato\n- Le perdite sono maggiori del previsto\n- Vai in panico e vendi tutto\n\n**Il ribilanciamento ti protegge da te stesso:**\nTi obbliga a vendere un po' quando le cose vanno bene (riducendo il rischio) e a comprare quando le cose vanno male (approfittando dei prezzi bassi).\n\nE una forma di **disciplina automatica** che contrasta i bias comportamentali.",
      },
      {
        kind: "question",
        title: "Verifica comprensione",
        content: "Qual e il rischio principale di non ribilanciare mai?",
        pollAreas: [
          {
            id: "challenge-verify-35",
            prompt: "Seleziona il rischio principale",
            options: [
              "Il portafoglio diventa sempre piu rischioso nei mercati rialzisti",
              "Il portafoglio cresce troppo",
              "Si risparmiano troppe commissioni",
            ],
            correctIndex: 0,
            correctExplanation:
              "Esatto! Senza ribilanciamento, nei mercati rialzisti le azioni pesano sempre di piu, aumentando il rischio oltre i tuoi piani.",
            wrongExplanation:
              "Il problema del non ribilanciare e che il portafoglio diventa progressivamente piu rischioso man mano che le azioni crescono, superando la tua tolleranza al rischio.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "Metodo pratico: il ribilanciamento con nuovi apporti",
        content:
          "Esiste un modo ancora piu efficiente di ribilanciare: **usare i nuovi apporti**.\n\n**Come funziona:**\nInvece di vendere la asset class cresciuta e comprare quella scesa, semplicemente **dirigi i nuovi investimenti verso la asset class sottopeso**.\n\n**Esempio:**\n- Target: 60% azioni, 40% obbligazioni\n- Situazione attuale: 65% azioni, 35% obbligazioni\n- Nuovo apporto: 500 euro\n\n**Invece di:** vendere 50 euro di azioni e comprare obbligazioni\n**Fai:** investi tutti i 500 euro in obbligazioni\n\n**Vantaggi:**\n1. Zero costi di vendita\n2. Zero tasse sulle plusvalenze\n3. Ribilanciamento graduale e naturale\n\nQuesto metodo e perfetto per chi investe regolarmente (come in un PAC).",
      },
      {
        kind: "question",
        title: "Verifica: ribilanciamento con apporti",
        content:
          "Hai un portafoglio sbilanciato con troppo peso sulle azioni. Ricevi il tuo stipendio e vuoi investire 300 euro.",
        pollAreas: [
          {
            id: "challenge-scenario-35",
            prompt: "Qual e il modo piu efficiente per ribilanciare?",
            options: [
              "Investire i 300 euro nella asset class sottopeso (obbligazioni)",
              "Vendere azioni e comprare obbligazioni, poi investire i 300 euro",
              "Investire tutto in azioni perche vanno bene",
            ],
            correctIndex: 0,
            correctExplanation:
              "Corretto! Usando i nuovi apporti per comprare la asset class sottopeso, ribilanci senza vendere e senza pagare tasse sulle plusvalenze.",
            wrongExplanation:
              "Il modo piu efficiente e dirigere i nuovi apporti verso la asset class sottopeso. Cosi ribilanci senza costi di vendita e senza realizzare plusvalenze tassabili.",
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
        title: "Quiz finale: asset allocation e ribilanciamento",
        content:
          "Hai imparato cos'e l'asset allocation, come definire i pesi target, perche il portafoglio si sbilancia e come ribilanciare in modo efficiente.\n\n**Concetti chiave da applicare:**\n- I pesi target riflettono il tuo profilo rischio-rendimento\n- Lo sbilanciamento e naturale e va gestito\n- Le soglie di ribilanciamento evitano interventi inutili\n- I nuovi apporti sono il modo piu efficiente per ribilanciare\n\nApplica questi principi alle domande seguenti.",
      },
      {
        kind: "explain",
        title: "Come rispondere",
        content:
          "Per ogni domanda:\n\n1. Identifica il **principio** rilevante (pesi target, soglie, ribilanciamento)\n2. Applica la **regola operativa** corrispondente\n3. Verifica che la risposta sia **coerente** con l'obiettivo di mantenere il profilo di rischio\n\nRicorda: l'asset allocation non riguarda massimizzare il rendimento, ma **gestire il rischio in modo consapevole**.",
      },
      {
        kind: "question",
        title: "Domanda 1",
        content: "Quale percentuale della variabilita dei rendimenti dipende dall'asset allocation?",
        pollAreas: [
          {
            id: "quiz-q1-35",
            prompt: "Seleziona la risposta corretta",
            options: ["Oltre il 90%", "Circa il 50%", "Meno del 20%"],
            correctIndex: 0,
            correctExplanation:
              "Corretto! Gli studi dimostrano che oltre il 90% della variabilita dei rendimenti dipende dall'asset allocation strategica.",
            wrongExplanation:
              "Gli studi accademici mostrano che oltre il 90% della variabilita dei rendimenti di un portafoglio dipende dall'asset allocation, non dalla selezione dei singoli titoli.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "Domanda 2",
        content:
          "Target: 70% azioni, 30% obbligazioni. Soglia: +/-5%. Attuale: 74% azioni, 26% obbligazioni. Cosa fai?",
        pollAreas: [
          {
            id: "quiz-q2-35",
            prompt: "Seleziona l'azione corretta",
            options: [
              "Non faccio nulla, sono dentro la soglia (65%-75%)",
              "Ribilancio subito",
              "Aumento ancora le azioni",
            ],
            correctIndex: 0,
            correctExplanation:
              "Esatto! 74% e dentro la fascia accettabile (65%-75%), quindi non serve ribilanciare.",
            wrongExplanation:
              "Con target 70% e soglia +/-5%, la fascia accettabile e 65%-75%. Il 74% e dentro questa fascia, quindi non e necessario intervenire.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "Domanda 3",
        content: "Qual e il vantaggio principale del ribilanciamento con nuovi apporti?",
        pollAreas: [
          {
            id: "quiz-q3-35",
            prompt: "Seleziona il vantaggio principale",
            options: [
              "Evita costi di transazione e tasse su plusvalenze",
              "Permette di investire sempre in azioni",
              "Elimina completamente il rischio",
            ],
            correctIndex: 0,
            correctExplanation:
              "Corretto! Usando i nuovi apporti per ribilanciare, eviti di vendere (e quindi costi e tasse sulle plusvalenze).",
            wrongExplanation:
              "Il ribilanciamento con nuovi apporti evita di dover vendere, eliminando costi di transazione e tasse sulle plusvalenze realizzate.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Rivedo i pesi target", "Controllo le soglie", "Pianifico il ribilanciamento"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "Cosa hai imparato: il pilastro dell'allocazione",
        content:
          "Complimenti! Hai completato la lezione sull'asset allocation e ribilanciamento.\n\n**I punti chiave:**\n\n1. **Asset allocation strategica**: i pesi target definiscono il tuo profilo rischio-rendimento\n2. **Sbilanciamento naturale**: il portafoglio devia dai target - e normale\n3. **Soglie di ribilanciamento**: evitano interventi troppo frequenti o assenti\n4. **Ribilanciamento efficiente**: usa i nuovi apporti quando possibile\n\n**Il ribilanciamento e una forma di disciplina:**\nTi obbliga a vendere alto e comprare basso, contrastando i tuoi istinti emotivi.\n\nQuesto approccio sistematico e uno dei pilastri della gestione patrimoniale di lungo periodo.",
      },
      {
        kind: "explain",
        title: "Definisci i tuoi pesi target",
        content:
          "Ora e il momento di applicare questi concetti alla tua situazione.\n\n**Azione pratica:**\n\n1. **Rifletti** sul tuo orizzonte temporale e tolleranza al rischio\n2. **Definisci** i tuoi pesi target iniziali (es. 60/30/10)\n3. **Imposta** una soglia di ribilanciamento (es. +/- 5%)\n4. **Scegli** la frequenza di controllo (es. trimestrale)\n\n**Template base:**\n- Azioni: ___% (target: __% - __%)\n- Obbligazioni: ___% (target: __% - __%)\n- Liquidita: ___% (target: __% - __%)\n\nNon esiste l'allocazione perfetta - esiste quella **coerente con te**.",
      },
      {
        kind: "question",
        title: "Il tuo profilo",
        content: "Quale profilo di rischio ti sembra piu adatto alla tua situazione attuale?",
        pollAreas: [
          {
            id: "feedback-profile-35",
            prompt: "Seleziona il profilo piu vicino a te",
            options: [
              "Aggressivo (70-80% azioni)",
              "Bilanciato (50-60% azioni)",
              "Conservativo (30-40% azioni)",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "La tua soglia di ribilanciamento",
        content: "Quale soglia di ribilanciamento intendi adottare?",
        pollAreas: [
          {
            id: "feedback-threshold-35",
            prompt: "Seleziona la soglia",
            options: [
              "+/- 5% (controllo piu frequente)",
              "+/- 10% (controllo meno frequente)",
              "Ribilanciamento annuale fisso",
            ],
            allowText: true,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Aiutami a definire i pesi target per il mio profilo",
      "Come calcolo se devo ribilanciare?",
      "Qual e la differenza tra ribilanciamento a soglia e a calendario?",
    ],
  },
};

const lesson35Definition = createStaticLessonDefinition("35", content);

export default lesson35Definition;
