import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Send, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { resolveLessonDefinition, resolveLessonVisualConfig } from "@/components/academy/lesson-structures";

type StepType = string;
type NodeStatus = "locked" | "available" | "completed" | "skipped";
type CriterionKey =
  | "foundational"
  | "integration"
  | "application"
  | "caring"
  | "learning"
  | "human";

type LessonNode = {
  node_key: StepType;
  title: string;
  description: string;
  sort_order: number;
  status: NodeStatus;
};

type LessonStepperProps = {
  lessonId: string;
  nodes: LessonNode[];
  isLessonCompleted: boolean;
  isProUser: boolean;
  onAdvanceNode: (nodeKey: string, payload?: Record<string, unknown>) => Promise<void>;
  onSkipNode: (nodeKey: string) => Promise<void>;
  onSubmitOptionalQuiz: (score: number, passed: boolean) => Promise<void>;
  chatMessages: { role: "user" | "assistant"; content: string }[];
  chatInput: string;
  onChatInputChange: (val: string) => void;
  onSendChat: () => void;
  isChatLoading: boolean;
  onNodeViewChange?: (isInsideNode: boolean) => void;
  backToNodesSignal?: number;
};

type NodeBlock = {
  kind: "focus" | "explain" | "question" | "exercise";
  title: string;
  content: string;
};

type StructuredNodeContent = {
  nodeKey: StepType;
  criteria: CriterionKey[];
  blocks: NodeBlock[];
  explainFlow?: ExplainFlowStep[];
  options?: string[];
  suggestedPrompts?: string[];
};

type ExplainFlowOption = {
  label: string;
  followup: string;
};

type ExplainFlowStep = {
  id: string;
  prompt: string;
  options: ExplainFlowOption[];
  nextHint: string;
};

type SectionData = {
  title: string;
  body: string;
};

type OpenedBlockPage = {
  nodeKey: string;
  index: number;
};

type ExplainProgressEntry = {
  step: number;
  trail: Array<{ question: string; answer: string; followup: string }>;
};
type FinanceContext = {
  topic: string;
  example: string;
  actionCue: string;
  riskCue: string;
};

const fallbackFlow: Array<{ key: string; title: string }> = [
  { key: "concept", title: "Concept" },
  { key: "widget", title: "Widget" },
  { key: "challenge", title: "Challenge" },
  { key: "feedback", title: "Feedback" },
];

const stepOrder: string[] = ["concept", "widget", "challenge", "feedback"];

const criterionMeta: Record<CriterionKey, { title: string; question: string }> = {
  foundational: {
    title: "Foundational Knowledge",
    question: "Se lo dovessi spiegare in 20 secondi a un amico, che diresti?",
  },
  integration: {
    title: "Integration",
    question: "Con quale altra scelta finanziaria che fai ogni giorno lo colleghi?",
  },
  application: {
    title: "Application",
    question: "Qual e la prima mossa concreta che puoi fare oggi?",
  },
  caring: {
    title: "Caring",
    question: "Quale parte di questo tema ti fa sentire piu al sicuro?",
  },
  learning: {
    title: "Learning How to Learn",
    question: "Come trasformi questo concetto in un'abitudine facile?",
  },
  human: {
    title: "Human Dimension",
    question: "Chi nella tua vita beneficia di questa scelta e perche?",
  },
};

const criterionKeywords: Record<CriterionKey, string[]> = {
  foundational: ["base", "principio", "definiz", "funziona", "regola", "fondament"],
  integration: ["collega", "insieme", "impatto", "scenario", "sistema", "relazione"],
  application: ["pratica", "passo", "subito", "azione", "fare", "strumento"],
  caring: ["rischio", "imprevist", "seren", "ansia", "proteg", "respons"],
  learning: ["abitudine", "ripeti", "metodo", "impara", "routine", "check"],
  human: ["famiglia", "persona", "valori", "obiettivo", "fiducia", "relazione"],
};

const anchoredCriteria: Record<StepType, CriterionKey> = {
  concept: "foundational",
  widget: "application",
  challenge: "learning",
  feedback: "human",
};

const fallbackSecondary: Record<StepType, CriterionKey> = {
  concept: "integration",
  widget: "caring",
  challenge: "integration",
  feedback: "caring",
};

function splitSections(markdown: string): SectionData[] {
  const firstHeadingIndex = markdown.search(/^###\s/m);
  const source = firstHeadingIndex >= 0 ? markdown.slice(firstHeadingIndex) : markdown;
  const sections = source.split(/(?=^###\s)/m).filter((s) => s.trim());
  if (sections.length === 0) return [{ title: "Focus", body: markdown.trim() }];

  return sections.map((section, index) => {
    const heading = section.match(/^###\s+(.+)$/m)?.[1]?.trim() || `Sezione ${index + 1}`;
    const body = section.replace(/^###\s+.+\n?/, "").trim();
    return { title: heading, body };
  });
}

function cleanText(text: string): string {
  return text
    .replace(/[#>*_`-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function shortText(text: string, maxWords: number): string {
  const words = cleanText(text).split(" ").filter(Boolean);
  if (words.length <= maxWords) return words.join(" ");
  return `${words.slice(0, maxWords).join(" ")}...`;
}

function toColloquial(text: string): string {
  return text
    .replace(/\bIn sostanza\b/gi, "In pratica")
    .replace(/\bE' fondamentale\b/gi, "Conta davvero")
    .replace(/\bE' importante\b/gi, "Ti aiuta tanto")
    .replace(/\bbisogna\b/gi, "conviene")
    .replace(/\boccorre\b/gi, "serve")
    .replace(/\s+/g, " ")
    .trim();
}

function removeRepeatedOpening(text: string, reference: string): string {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (sentences.length <= 1) return text;

  const firstSentence = cleanText(sentences[0]).toLowerCase();
  const referenceText = cleanText(reference).toLowerCase();
  if (!firstSentence || !referenceText) return text;

  const isRepeatedStart =
    firstSentence === referenceText ||
    firstSentence.includes(referenceText) ||
    referenceText.includes(firstSentence);

  return isRepeatedStart ? sentences.slice(1).join(" ") : text;
}

function detectFinanceContext(text: string): FinanceContext {
  const source = text.toLowerCase();
  if (source.includes("debito") || source.includes("prestito") || source.includes("rata")) {
    return {
      topic: "debito",
      example: "Esempio: rata da 220 euro, obiettivo di ridurla o estinguerla prima.",
      actionCue: "Scegli una mossa che abbassa la pressione mensile.",
      riskCue: "Occhio a interessi e costi nascosti: sono quelli che pesano di piu.",
    };
  }
  if (source.includes("invest") || source.includes("etf") || source.includes("btp")) {
    return {
      topic: "investimenti",
      example: "Esempio: 100 euro al mese su uno strumento semplice e costante.",
      actionCue: "Definisci importo, frequenza e regola di continuita.",
      riskCue: "Valuta rischio e orizzonte: niente scelte impulsive.",
    };
  }
  if (source.includes("budget") || source.includes("spese") || source.includes("uscite")) {
    return {
      topic: "budget",
      example: "Esempio: tetto spesa settimanale da 70 euro con check ogni domenica.",
      actionCue: "Taglia una micro-voce e rialloca quei soldi dove conta.",
      riskCue: "Se non tracci le uscite piccole, perdi controllo in fretta.",
    };
  }
  if (source.includes("fondo") || source.includes("emergenza")) {
    return {
      topic: "fondo emergenza",
      example: "Esempio: metti via 30 euro a settimana finche copri 3 mesi di spese.",
      actionCue: "Automatizza un piccolo trasferimento ricorrente.",
      riskCue: "Senza cuscinetto, ogni imprevisto diventa debito.",
    };
  }
  return {
    topic: "risparmio",
    example: "Esempio: 50 euro al mese in automatico, sempre lo stesso giorno.",
    actionCue: "Parti piccolo ma fallo con continuita.",
    riskCue: "Rimandare sempre significa non vedere risultati concreti.",
  };
}

function scoreCriterion(text: string, criterion: CriterionKey): number {
  const source = text.toLowerCase();
  const keywords = criterionKeywords[criterion];
  return keywords.reduce((acc, keyword) => (source.includes(keyword) ? acc + 1 : acc), 0);
}

function pickSecondaryCriterion(step: StepType, text: string, used: Set<CriterionKey>): CriterionKey {
  const ranked = (Object.keys(criterionMeta) as CriterionKey[])
    .filter((key) => key !== anchoredCriteria[step])
    .map((key) => ({ key, score: scoreCriterion(text, key) }))
    .sort((a, b) => b.score - a.score);

  const neverUsed = ranked.find((item) => !used.has(item.key));
  if (neverUsed && neverUsed.score > 0) return neverUsed.key;

  const bestScored = ranked.find((item) => item.score > 0);
  if (bestScored) return bestScored.key;

  const fallback = fallbackSecondary[step];
  if (!used.has(fallback)) return fallback;

  return ranked[0]?.key || fallback;
}

function assignCriteriaByNode(sectionsByNode: Record<StepType, SectionData>) {
  const used = new Set<CriterionKey>();
  const perNode: Record<StepType, CriterionKey[]> = {
    concept: [],
    widget: [],
    challenge: [],
    feedback: [],
  };

  for (const step of stepOrder) {
    const first = anchoredCriteria[step];
    used.add(first);
    const second = pickSecondaryCriterion(step, sectionsByNode[step].body, used);
    used.add(second);
    perNode[step] = [first, second];
  }

  const missing = (Object.keys(criterionMeta) as CriterionKey[]).filter((key) => !used.has(key));
  if (missing.length === 0) return perNode;

  const replacementOrder: StepType[] = ["feedback", "challenge", "widget", "concept"];
  for (const missingCriterion of missing) {
    const target = replacementOrder.find((step) => !perNode[step].includes(missingCriterion)) || "feedback";
    perNode[target] = [perNode[target][0], missingCriterion];
  }

  return perNode;
}

function buildExerciseOptions(step: StepType, criteria: CriterionKey[]): string[] {
  if (step === "concept") {
    return [
      "Lo spiego con parole mie in 1 frase",
      "Faccio un esempio reale della mia settimana",
      "Segno il punto che non mi e chiaro",
    ];
  }

  if (step === "widget") {
    return [
      "Attivo una micro-azione da fare oggi",
      "Imposto un promemoria per domani",
      "Scelgo una versione super semplice",
    ];
  }

  if (step === "challenge") {
    return [
      "Ho fatto fatica ma ho capito il meccanismo",
      "Ci sono quasi: mi serve solo un altro giro",
      "Mi sento sicuro: posso applicarlo subito",
    ];
  }

  return [
    `Chiedo un chiarimento su ${criterionMeta[criteria[0]].title}`,
    `Chiedo un esempio pratico su ${criterionMeta[criteria[1]].title}`,
    "Condivido cosa cambio da oggi",
  ];
}

function buildExplainFlow(section: SectionData, finance: FinanceContext): ExplainFlowStep[] {
  const anchor = shortText(section.body || section.title, 16);
  return [
    {
      id: "start",
      prompt: "Prima di partire, a cosa ti fermeresti a pensare per non andare alla cieca?",
      options: [
        {
          label: "A dove voglio arrivare",
          followup: `Perfetto: senza meta chiara, ogni scelta sembra urgente ma non fa avanzare.`,
        },
        {
          label: "Quanto posso sostenere ogni mese",
          followup: "Ottimo punto: la regola deve reggere nei mesi normali, non solo quando va tutto bene.",
        },
        {
          label: "Quale rischio non voglio correre",
          followup: "Scelta matura: chiarire il rischio evita decisioni impulsive quando arriva pressione.",
        },
      ],
      nextHint: "Adesso trasformiamo questa idea in un criterio pratico da usare subito.",
    },
    {
      id: "criteria",
      prompt: "Quale criterio semplice useresti per decidere in modo coerente ogni settimana?",
      options: [
        {
          label: "Regola fissa e ripetibile",
          followup: "Coerenza vince sul talento: una regola chiara riduce errori e stress decisionale.",
        },
        {
          label: "Soglia minima di sicurezza",
          followup: "Benissimo: prima metti al sicuro la base, poi spingi sulla crescita.",
        },
        {
          label: "Check rapido domenicale",
          followup: "Scelta concreta: pochi minuti di revisione tengono il percorso sotto controllo.",
        },
      ],
      nextHint: "Ultimo passo: portiamo tutto su un'azione concreta nel tuo contesto.",
    },
    {
      id: "action",
      prompt: "Se dovessi fare una sola mossa oggi, quale scegli per iniziare davvero?",
      options: [
        {
          label: "Imposto una mini azione automatica",
          followup: "Ottimo: l'automatismo elimina attrito e protegge la costanza.",
        },
        {
          label: "Taglio una voce poco utile",
          followup: "Scelta pragmatica: liberare margine adesso rende possibili le prossime mosse.",
        },
        {
          label: "Definisco il mio limite massimo",
          followup: "Perfetto: un limite esplicito ti aiuta a dire no nel momento giusto.",
        },
      ],
      nextHint: `${finance.example} ${anchor ? `Riferimento chiave: ${anchor}.` : ""}`,
    },
  ];
}

function buildStructuredNode(
  step: StepType,
  section: SectionData,
  criteria: CriterionKey[],
): StructuredNodeContent {
  const clipped = shortText(section.body || section.title, step === "concept" ? 58 : 48);
  const finance = detectFinanceContext(`${section.title} ${section.body}`);
  const naturalText = toColloquial(clipped || "Partiamo da una versione semplice e concreta di questo tema.");
  const options = buildExerciseOptions(step, criteria);

  const focusLine = `${criterionMeta[criteria[0]].title} + ${criterionMeta[criteria[1]].title}`;
  const questionLine = `${criterionMeta[criteria[0]].question} ${criterionMeta[criteria[1]].question} Come lo applichi al tuo tema: ${finance.topic}?`;
  const explainFlow = buildExplainFlow(section, finance);
  const focusCore = shortText(section.body || section.title, 22);
  const explainText = removeRepeatedOpening(naturalText, focusCore);

  const blocks: NodeBlock[] = [
    {
      kind: "focus",
      title: "Focus",
      content: `Partiamo da un'idea semplice: ${focusCore}. Il punto non e memorizzare teoria, ma capire il meccanismo che guida la scelta. ${focusLine} diventano la bussola per decidere con piu lucidita, anche quando hai poco tempo.`,
    },
    {
      kind: "explain",
      title: "Spiegazione rapida",
      content: `${explainText} ${finance.example} Procedi con le domande qui sotto e costruisci la tua versione pratica.`,
    },
    {
      kind: "question",
      title: "Domanda guida",
      content: questionLine,
    },
    {
      kind: "exercise",
      title: "Micro-azione",
      content: `${finance.actionCue} ${finance.riskCue}`,
    },
  ];

  const suggestedPrompts = [
    `Fammi un esempio concreto su ${criterionMeta[criteria[0]].title.toLowerCase()}`,
    `Come lo applico oggi in modo semplice?`,
    `Dammi un mini check per capire se lo sto facendo bene`,
  ];

  return {
    nodeKey: step,
    criteria,
    blocks,
    explainFlow,
    options,
    suggestedPrompts,
  };
}

function statusLabel(status: NodeStatus) {
  if (status === "completed") return "Completato";
  if (status === "skipped") return "Skippato";
  if (status === "available") return "Disponibile";
  return "Bloccato";
}

function conceptTitleFor(block: NodeBlock): string {
  if (block.kind === "focus") return "Il principio";
  if (block.kind === "explain") return "Come funziona";
  if (block.kind === "question") return "Verifica rapida";
  return "Azione immediata";
}

function blockLabel(nodeKey: string, kind: NodeBlock["kind"]): { emoji: string; title: string; subtitle: string } {
  const labels: Record<string, Record<NodeBlock["kind"], { emoji: string; title: string; subtitle: string }>> = {
    concept: {
      focus: { emoji: "🧭", title: "Idea chiave", subtitle: "Capisci la logica di base" },
      explain: { emoji: "🧩", title: "Passaggio pratico", subtitle: "Mettila subito in pratica" },
      question: { emoji: "🧠", title: "Controllo veloce", subtitle: "Verifica se è chiaro" },
      exercise: { emoji: "⚡", title: "Mossa concreta", subtitle: "Scegli cosa fare ora" },
    },
    widget: {
      focus: { emoji: "🛠️", title: "Strumento utile", subtitle: "A cosa ti serve davvero" },
      explain: { emoji: "📌", title: "Uso guidato", subtitle: "Come usarlo passo dopo passo" },
      question: { emoji: "🔍", title: "Controllo pratico", subtitle: "Cosa guardare per non sbagliare" },
      exercise: { emoji: "✅", title: "Applicazione", subtitle: "Fai la prova sul tuo caso" },
    },
    challenge: {
      focus: { emoji: "🎯", title: "Scenario reale", subtitle: "Dove si gioca la decisione" },
      explain: { emoji: "🧪", title: "Test rapido", subtitle: "Prova la tua scelta sul campo" },
      question: { emoji: "⚖️", title: "Scelta migliore", subtitle: "Valuta pro e contro in fretta" },
      exercise: { emoji: "🔁", title: "Correzione", subtitle: "Aggiusta subito la strategia" },
    },
    feedback: {
      focus: { emoji: "🪞", title: "Sintesi personale", subtitle: "Cosa ti porti via davvero" },
      explain: { emoji: "💬", title: "Confronto", subtitle: "Chiarisci i dubbi con il tutor" },
      question: { emoji: "📝", title: "Punto aperto", subtitle: "Segna ciò che vuoi rivedere" },
      exercise: { emoji: "📅", title: "Piano prossimo", subtitle: "Definisci il prossimo passo" },
    },
  };

  return (labels[nodeKey] || labels.concept)[kind];
}

const LessonStepper = ({
  lessonId,
  nodes,
  isLessonCompleted,
  isProUser,
  onAdvanceNode,
  onSkipNode,
  onSubmitOptionalQuiz,
  chatMessages,
  chatInput,
  onChatInputChange,
  onSendChat,
  isChatLoading,
  onNodeViewChange,
  backToNodesSignal,
}: LessonStepperProps) => {
  const [current, setCurrent] = useState(0);
  const [tracking, setTracking] = useState(false);
  const [challengeResult, setChallengeResult] = useState<"perfect" | "good" | "weak" | null>(null);
  const [reviewOutcome, setReviewOutcome] = useState<"ok" | "ko" | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [finalChoice, setFinalChoice] = useState<string | null>(null);
  const [openedBlockPage, setOpenedBlockPage] = useState<OpenedBlockPage | null>(null);
  const [explainProgress, setExplainProgress] = useState<Record<string, ExplainProgressEntry>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  const lessonDefinition = useMemo(() => resolveLessonDefinition(lessonId), [lessonId]);
  const visualConfig = useMemo(() => resolveLessonVisualConfig(lessonDefinition), [lessonDefinition]);

  const structuredContent = useMemo(() => {
    return lessonDefinition.buildStructuredContent();
  }, [lessonDefinition]);

  const structuredKeys = useMemo(() => Object.keys(structuredContent), [structuredContent]);

  const runtimeFlow = useMemo(() => {
    if (nodes.length > 0) {
      return [...nodes].sort((a, b) => a.sort_order - b.sort_order);
    }

    const fallbackKeys = structuredKeys.length > 0 ? structuredKeys : fallbackFlow.map((item) => item.key);
    return fallbackKeys.map((key, idx) => ({
      node_key: key,
      title: key.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
      description: "",
      sort_order: idx + 1,
      status: idx === 0 ? ("available" as NodeStatus) : ("locked" as NodeStatus),
    }));
  }, [nodes, structuredKeys]);

  const getNodeContent = (nodeKey: string): StructuredNodeContent => {
    return (
      structuredContent[nodeKey] ||
      structuredContent.concept ||
      structuredContent[structuredKeys[0] || ""] || {
        nodeKey,
        criteria: ["foundational", "integration"],
        blocks: [
          { kind: "focus", title: "Focus", content: "Contenuto non configurato per questo nodo." },
          { kind: "explain", title: "Spiegazione rapida", content: "Aggiungi i contenuti dal file lezione o da Admin." },
          { kind: "question", title: "Domanda guida", content: "Quale punto vuoi chiarire in questo nodo?" },
          { kind: "exercise", title: "Micro-azione", content: "Definisci un'azione concreta per proseguire." },
        ],
      }
    );
  };

  const getBlockLabel = (nodeKey: string, kind: NodeBlock["kind"]) => {
    const fromVisual = visualConfig.blockLabels[nodeKey]?.[kind];
    if (fromVisual) return fromVisual;
    const fallbackVisual = visualConfig.blockLabels.concept?.[kind];
    if (fallbackVisual) return fallbackVisual;
    return blockLabel(nodeKey, kind);
  };

  const currentNode = runtimeFlow[current];
  const canPrev = current > 0;
  const canNext = current < runtimeFlow.length - 1;

  useEffect(() => {
    if (!currentNode) return;
    if (currentNode.status !== "locked") return;
    const firstAvailable = runtimeFlow.findIndex((node) => node.status === "available" || node.status === "skipped");
    if (firstAvailable >= 0) setCurrent(firstAvailable);
  }, [currentNode, runtimeFlow]);

  const submitAdvance = async (nodeKey: string, payload?: Record<string, unknown>, nextIndex?: number) => {
    setTracking(true);
    try {
      await onAdvanceNode(nodeKey, payload);
      if (typeof nextIndex === "number") setCurrent(nextIndex);
    } catch {
      // Error feedback is handled by page-level toast handlers.
    } finally {
      setTracking(false);
    }
  };

  const submitSkip = async () => {
    if (!currentNode || currentNode.status === "completed" || currentNode.status === "locked") return;
    setTracking(true);
    try {
      await onSkipNode(currentNode.node_key);
      if (canNext) setCurrent((value) => value + 1);
    } catch {
      // Error feedback is handled by page-level toast handlers.
    } finally {
      setTracking(false);
    }
  };

  const submitChallenge = async (nodeKey: string, value: "perfect" | "good" | "weak", nextIndex?: number) => {
    setChallengeResult(value);
    await submitAdvance(nodeKey, { challenge_result: value }, nextIndex);
  };

  const submitReview = async (success: boolean) => {
    setReviewOutcome(success ? "ok" : "ko");
  };

  const submitOptionalQuiz = async (score: number, passed: boolean) => {
    setTracking(true);
    try {
      await onSubmitOptionalQuiz(score, passed);
      setQuizSubmitted(true);
    } catch {
      // Error feedback is handled by page-level toast handlers.
    } finally {
      setTracking(false);
    }
  };

  const renderNodeBlocks = (content: StructuredNodeContent) => {
    const activeIndex = openedBlockPage?.nodeKey === content.nodeKey ? openedBlockPage.index : -1;
    return (
      <div className="relative space-y-3 py-1">
        <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-border/60" />
        <div className="space-y-2">
          {content.blocks.map((block, index) => (
            <div key={`${content.nodeKey}-${block.kind}`} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
              {index % 2 === 0 ? (
                <div className="flex justify-end">
                  <Button
                    variant={activeIndex === index ? "default" : "outline"}
                    aria-pressed={activeIndex === index}
                    className="aspect-square h-[106px] w-[106px] whitespace-normal rounded-xl p-2 text-center text-[11px] leading-tight sm:h-[118px] sm:w-[118px] sm:text-xs"
                    onClick={() => setOpenedBlockPage({ nodeKey: content.nodeKey, index })}
                  >
                    <span className="flex h-full w-full flex-col items-center justify-center">
                      <span className="text-base leading-none">{getBlockLabel(content.nodeKey, block.kind).emoji}</span>
                      <span className="mt-1 text-[11px] font-semibold leading-tight sm:text-xs">
                        {getBlockLabel(content.nodeKey, block.kind).title}
                      </span>
                    </span>
                  </Button>
                </div>
              ) : (
                <div />
              )}

              <div className="pointer-events-none h-3.5 w-3.5 rounded-full border border-border/70 bg-background" />

              {index % 2 !== 0 ? (
                <div className="flex justify-start">
                  <Button
                    variant={activeIndex === index ? "default" : "outline"}
                    aria-pressed={activeIndex === index}
                    className="aspect-square h-[106px] w-[106px] whitespace-normal rounded-xl p-2 text-center text-[11px] leading-tight sm:h-[118px] sm:w-[118px] sm:text-xs"
                    onClick={() => setOpenedBlockPage({ nodeKey: content.nodeKey, index })}
                  >
                    <span className="flex h-full w-full flex-col items-center justify-center">
                      <span className="text-base leading-none">{getBlockLabel(content.nodeKey, block.kind).emoji}</span>
                      <span className="mt-1 text-[11px] font-semibold leading-tight sm:text-xs">
                        {getBlockLabel(content.nodeKey, block.kind).title}
                      </span>
                    </span>
                  </Button>
                </div>
              ) : (
                <div />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const openedContent = openedBlockPage ? structuredContent[openedBlockPage.nodeKey] : null;
  const openedBlock = openedContent?.blocks?.[openedBlockPage?.index ?? -1];
  const openedKey = openedBlockPage ? `${openedBlockPage.nodeKey}-${openedBlockPage.index}` : "";
  const interactive = openedKey ? explainProgress[openedKey] : undefined;

  useEffect(() => {
    onNodeViewChange?.(Boolean(openedBlockPage));
  }, [onNodeViewChange, openedBlockPage]);

  useEffect(() => {
    if (backToNodesSignal === undefined) return;
    if (!openedBlockPage) return;
    setOpenedBlockPage(null);
  }, [backToNodesSignal, openedBlockPage]);

  useEffect(() => {
    if (!openedBlockPage || !openedContent || !openedBlock) return;
    if (openedBlock.kind !== "explain") return;
    if (!openedContent.explainFlow || openedContent.explainFlow.length === 0) return;
    setExplainProgress((prev) => {
      if (prev[openedKey]) return prev;
      return { ...prev, [openedKey]: { step: 0, trail: [] } };
    });
  }, [openedBlockPage, openedBlock, openedContent, openedKey]);

  const handleExplainAnswer = (option: ExplainFlowOption) => {
    if (!openedBlockPage || !openedContent || !openedBlock) return;
    if (openedBlock.kind !== "explain" || !openedContent.explainFlow) return;

    setExplainProgress((prev) => {
      const key = `${openedBlockPage.nodeKey}-${openedBlockPage.index}`;
      const current = prev[key] ?? { step: 0, trail: [] };
      const stepDef = openedContent.explainFlow?.[current.step];
      if (!stepDef) return prev;

      const nextStep = Math.min(current.step + 1, openedContent.explainFlow.length);
      return {
        ...prev,
        [key]: {
          step: nextStep,
          trail: [
            ...current.trail,
            {
              question: stepDef.prompt,
              answer: option.label,
              followup: option.followup,
            },
          ],
        },
      };
    });
  };

  const goBackInOpenedBlock = () => {
    if (!openedBlockPage) return;
    if (openedBlockPage.index === 0) {
      setOpenedBlockPage(null);
      return;
    }
    setOpenedBlockPage({ nodeKey: openedBlockPage.nodeKey, index: openedBlockPage.index - 1 });
  };

  const goNextInOpenedBlock = () => {
    if (!openedBlockPage || !openedContent) return;
    const nextIndex = openedBlockPage.index + 1;
    if (nextIndex >= openedContent.blocks.length) {
      setOpenedBlockPage(null);
      return;
    }
    setOpenedBlockPage({ nodeKey: openedBlockPage.nodeKey, index: nextIndex });
  };

  if (!currentNode) return null;

  if (openedBlockPage && openedContent && openedBlock) {
    const meta = getBlockLabel(openedBlockPage.nodeKey, openedBlock.kind);
    const explainFlow = openedContent.explainFlow ?? [];
    const currentExplainStep = interactive ? explainFlow[interactive.step] : undefined;
    const explainDone = interactive ? interactive.step >= explainFlow.length : false;
    const explainAnchors =
      openedBlock.kind === "explain"
        ? openedBlock.content
            .split(/(?<=[.!?])\s+/)
            .map((chunk) => chunk.trim())
            .filter(Boolean)
        : [];

    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto px-2">
          <p className="text-lg font-semibold">
            {meta.emoji} {meta.title}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{meta.subtitle}</p>

          {openedBlock.kind === "explain" ? (
            <div className="mt-4 space-y-4">
              <div className="prose prose-sm max-w-none whitespace-pre-line text-foreground/95 dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{openedBlock.content}</ReactMarkdown>
              </div>

              {explainFlow.map((step, idx) => {
                const answered = interactive?.trail?.[idx];
                const isUnlocked = idx <= (interactive?.step ?? 0);
                const isCurrentQuestion = !answered && idx === (interactive?.step ?? 0) && !explainDone;
                const anchorText =
                  explainAnchors[idx] ??
                  (idx === 0 ? openedBlock.content : explainAnchors[explainAnchors.length - 1] ?? "");

                if (!isUnlocked) return null;

                return (
                  <div key={`${openedKey}-${step.id}`} className="space-y-2 border-b border-border/40 py-3">
                    <p className="text-xs font-medium text-muted-foreground">Passo {idx + 1}</p>
                    {anchorText ? (
                      <div className="prose prose-sm max-w-none whitespace-pre-line text-foreground/90 dark:prose-invert">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{anchorText}</ReactMarkdown>
                      </div>
                    ) : null}
                    <p className="text-sm font-semibold text-foreground">{step.prompt}</p>

                    {answered ? (
                      <>
                        <p className="text-xs text-muted-foreground">Hai scelto</p>
                        <p className="text-sm text-foreground">{answered.answer}</p>
                        <p className="text-sm text-foreground/90">{answered.followup}</p>
                        {idx < explainFlow.length - 1 ? (
                          <p className="whitespace-pre-line text-xs text-muted-foreground">{step.nextHint}</p>
                        ) : null}
                      </>
                    ) : null}

                    {isCurrentQuestion ? (
                      <div className="grid gap-2">
                        {step.options.map((option) => (
                          <Button
                            key={`${openedKey}-${step.id}-${option.label}`}
                            variant="outline"
                            className="justify-start rounded-xl text-left"
                            onClick={() => handleExplainAnswer(option)}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}

              {explainDone ? (
                <div className="border-l-2 border-emerald-500/60 pl-3">
                  <p className="text-sm font-semibold text-foreground">✅ Passaggio pratico completato</p>
                  <p className="mt-1 text-sm text-foreground/90">Hai completato il percorso guidato. Ora puoi passare al prossimo blocco.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 rounded-lg"
                    onClick={() =>
                      setExplainProgress((prev) => ({
                        ...prev,
                        [openedKey]: { step: 0, trail: [] },
                      }))
                    }
                  >
                    Ricomincia il passaggio
                  </Button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="prose prose-sm mt-4 max-w-none whitespace-pre-line text-foreground/95 dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{openedBlock.content}</ReactMarkdown>
            </div>
          )}
        </div>
        <div className="mt-auto border-t border-border/70 px-1 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={goBackInOpenedBlock} className="h-11 gap-2 rounded-2xl">
              <ArrowLeft size={16} /> Indietro
            </Button>
            <Button
              onClick={goNextInOpenedBlock}
              disabled={openedBlock.kind === "explain" && explainFlow.length > 0 && !explainDone}
              className="h-11 gap-2 rounded-2xl"
            >
              Avanti <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const canAutoProceed = currentNode.status === "completed" || currentNode.status === "skipped";
  const currentNodeKey = currentNode.node_key;
  const currentNodeContent = getNodeContent(currentNodeKey);
  const isFeedbackNode = currentNodeKey === "feedback" || current === runtimeFlow.length - 1;
  const isChallengeNode = currentNodeKey === "challenge";
  const reflectionSourceNodeKey = runtimeFlow[0]?.node_key;
  const reflectionOptions = reflectionSourceNodeKey ? getNodeContent(reflectionSourceNodeKey).options || [] : [];

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-5 flex gap-1.5 px-1">
        {runtimeFlow.map((step) => (
          <div
            key={step.node_key}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{
              backgroundColor:
                step.status === "completed"
                  ? "hsl(var(--primary))"
                  : step.status === "skipped"
                    ? "hsl(var(--primary) / 0.45)"
                    : step.status === "available"
                      ? "hsl(var(--muted-foreground) / 0.5)"
                      : "hsl(var(--muted))",
            }}
          />
        ))}
      </div>

      <div className="mb-3 flex items-center justify-between px-1 text-xs text-muted-foreground">
        <span>
          {current + 1} / {runtimeFlow.length} · {currentNode.title}
        </span>
        <span>{statusLabel(currentNode.status)}</span>
      </div>

      <div className="relative min-h-0 flex-1 overflow-y-auto pr-1">
        {isFeedbackNode ? (
          <div className="flex h-full flex-col">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {visualConfig.nodeBadgeTitles[currentNodeKey] || `Nodo · ${currentNodeKey}`}
            </p>
            <h2 className="mb-1 mt-1 text-lg font-semibold">Feedback + tutor</h2>
            <p className="mb-4 text-xs text-muted-foreground">La lezione si completa solo quando tutti i nodi sono completati.</p>

            <div className="mb-4 grid gap-2">
              {currentNodeContent.suggestedPrompts?.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-left text-xs text-foreground/90 transition hover:bg-muted/40"
                  onClick={() => onChatInputChange(prompt)}
                  disabled={isChatLoading || tracking}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {chatMessages.length > 0 ? (
              <div className="mb-4 flex-1 space-y-3 overflow-y-auto">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            ) : (
              <div className="mb-4 rounded-xl border border-dashed p-3 text-sm text-muted-foreground">
                Apri con una domanda guida e poi chiudi il nodo quando ti senti davvero pronto.
              </div>
            )}

            <div className="mt-auto space-y-3">
              {reflectionOptions.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Riflessione finale</p>
                  <div className="grid gap-2">
                    {reflectionOptions.map((option) => (
                      <Button
                        key={option}
                        variant={finalChoice === option ? "default" : "outline"}
                        className="justify-start rounded-xl text-left"
                        disabled={tracking || currentNode.status === "locked"}
                        onClick={() => setFinalChoice(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => onChatInputChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSendChat()}
                  placeholder="Es: dammi un esempio sulla mia situazione"
                  disabled={isChatLoading || tracking}
                  className="rounded-xl"
                />
                <Button
                  size="icon"
                  onClick={onSendChat}
                  disabled={!chatInput.trim() || isChatLoading || tracking}
                  className="h-10 w-10 rounded-xl"
                >
                  {isChatLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </Button>
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <Button variant="outline" className="rounded-xl" disabled={tracking} onClick={() => submitReview(false)}>
                  Ripasso necessario
                </Button>
                <Button variant="outline" className="rounded-xl" disabled={tracking} onClick={() => submitReview(true)}>
                  Ho consolidato
                </Button>
              </div>

              <Button
                onClick={() => {
                  void submitAdvance(currentNodeKey, {
                    review_success: reviewOutcome === "ok",
                    selected_option: finalChoice,
                  });
                }}
                disabled={currentNode.status === "completed" || tracking || !reviewOutcome || currentNode.status === "locked"}
                className="w-full rounded-xl"
              >
                {currentNode.status === "completed" ? "Nodo completato" : "Completa feedback"}
              </Button>

              <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Quiz finale facoltativo</p>
                <div className="grid gap-2 md:grid-cols-2">
                  <Button variant="outline" className="rounded-xl" disabled={tracking || quizSubmitted} onClick={() => submitOptionalQuiz(45, false)}>
                    Quiz da ripassare
                  </Button>
                  <Button variant="outline" className="rounded-xl" disabled={tracking || quizSubmitted} onClick={() => submitOptionalQuiz(85, true)}>
                    Quiz superato
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {visualConfig.nodeBadgeTitles[currentNodeKey] || `Nodo · ${currentNodeKey}`}
            </p>
            {renderNodeBlocks(currentNodeContent)}

            {isChallengeNode ? (
              <>
                <p className="text-sm text-muted-foreground">Come e andata davvero? Scegli senza pensarci troppo.</p>
                <div className="grid gap-2 md:grid-cols-3">
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    disabled={tracking || currentNode.status === "completed" || currentNode.status === "locked"}
                    onClick={() => submitChallenge(currentNodeKey, "weak", canNext ? current + 1 : undefined)}
                  >
                    Faticoso
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    disabled={tracking || currentNode.status === "completed" || currentNode.status === "locked"}
                    onClick={() => submitChallenge(currentNodeKey, "good", canNext ? current + 1 : undefined)}
                  >
                    Buono
                  </Button>
                  <Button
                    className="rounded-xl"
                    disabled={tracking || currentNode.status === "completed" || currentNode.status === "locked"}
                    onClick={() => submitChallenge(currentNodeKey, "perfect", canNext ? current + 1 : undefined)}
                  >
                    Ottimo
                  </Button>
                </div>
                {challengeResult && <p className="text-xs text-muted-foreground">Risultato registrato: {challengeResult}</p>}
              </>
            ) : (
              <Button
                onClick={() =>
                  submitAdvance(
                    currentNodeKey,
                    { selected_option: currentNodeContent.options?.[0] ?? null },
                    canNext ? current + 1 : undefined,
                  )
                }
                disabled={tracking || currentNode.status === "completed" || currentNode.status === "locked"}
                className="rounded-xl"
              >
                {currentNode.status === "completed" ? "Nodo completato" : tracking ? "Salvo..." : "Completa nodo"}
              </Button>
            )}
          </div>
        )}

        {currentNode.status === "skipped" ? (
          <div className="mt-4 rounded-xl border border-amber-300/40 bg-amber-100/30 p-3 text-xs text-amber-900">
            Nodo skippato: devi comunque completarlo per segnare la lezione come conclusa.
          </div>
        ) : null}
      </div>

      <div className="mt-auto border-t border-border/70 px-1 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3">
        <div className="grid gap-3 md:grid-cols-3">
          <Button
            variant="outline"
            onClick={() => canPrev && setCurrent(current - 1)}
            disabled={!canPrev || tracking}
            className="h-11 gap-2 rounded-2xl"
          >
            <ArrowLeft size={16} /> Indietro
          </Button>

          <Button
            variant="outline"
            onClick={submitSkip}
            disabled={tracking || currentNode.status === "locked" || currentNode.status === "completed"}
            className="h-11 gap-2 rounded-2xl"
          >
            <SkipForward size={16} />
            {isProUser ? "Skippa nodo" : "Skip (solo Pro)"}
          </Button>

          <Button
            onClick={() => canNext && setCurrent(current + 1)}
            disabled={!canNext || tracking || !canAutoProceed}
            className="h-11 gap-2 rounded-2xl"
          >
            Avanti <ArrowRight size={16} />
          </Button>
        </div>
      </div>

      {isLessonCompleted ? (
        <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
          <CheckCircle2 size={16} /> Lezione completata
        </div>
      ) : null}
    </div>
  );
};

export default LessonStepper;
