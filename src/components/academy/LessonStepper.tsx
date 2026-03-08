import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Send, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type StepType = "concept" | "widget" | "challenge" | "feedback";
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
  markdown: string;
  nodes: LessonNode[];
  isLessonCompleted: boolean;
  isProUser: boolean;
  onAdvanceNode: (nodeKey: StepType, payload?: Record<string, unknown>) => Promise<void>;
  onSkipNode: (nodeKey: StepType) => Promise<void>;
  onSubmitOptionalQuiz: (score: number, passed: boolean) => Promise<void>;
  chatMessages: { role: "user" | "assistant"; content: string }[];
  chatInput: string;
  onChatInputChange: (val: string) => void;
  onSendChat: () => void;
  isChatLoading: boolean;
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
  options?: string[];
  suggestedPrompts?: string[];
};

type SectionData = {
  title: string;
  body: string;
};
type FinanceContext = {
  topic: string;
  example: string;
  actionCue: string;
  riskCue: string;
};

const fallbackFlow: Array<{ key: StepType; title: string }> = [
  { key: "concept", title: "Concept" },
  { key: "widget", title: "Widget" },
  { key: "challenge", title: "Challenge" },
  { key: "feedback", title: "Feedback" },
];

const stepOrder: StepType[] = ["concept", "widget", "challenge", "feedback"];

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

  const blocks: NodeBlock[] = [
    {
      kind: "focus",
      title: "Focus",
      content: `${focusLine}. Qui puntiamo a capire il pezzo chiave senza giri lunghi.`,
    },
    {
      kind: "explain",
      title: "Spiegazione rapida",
      content: `${naturalText} ${finance.example}`,
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

function conceptPromptFor(block: NodeBlock): string {
  if (block.kind === "focus") return "Se ignori questo principio, dove paghi il prezzo gia questa settimana?";
  if (block.kind === "explain") return "Qual e il punto che stai sottovalutando nelle tue scelte di oggi?";
  if (block.kind === "question") return "Se lo spiegassi in 20 secondi, su cosa ti bloccheresti davvero?";
  return "Qual e la micro-mossa che puoi fare oggi senza rimandare?";
}

const LessonStepper = ({
  markdown,
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
}: LessonStepperProps) => {
  const [current, setCurrent] = useState(0);
  const [tracking, setTracking] = useState(false);
  const [challengeResult, setChallengeResult] = useState<"perfect" | "good" | "weak" | null>(null);
  const [reviewOutcome, setReviewOutcome] = useState<"ok" | "ko" | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [conceptChoice, setConceptChoice] = useState<string | null>(null);
  const [widgetChoice, setWidgetChoice] = useState<string | null>(null);
  const [activeConceptBlock, setActiveConceptBlock] = useState<number | null>(null);
  const [isNodeOpen, setIsNodeOpen] = useState<Record<StepType, boolean>>({
    concept: false,
    widget: false,
    challenge: false,
    feedback: false,
  });
  const chatEndRef = useRef<HTMLDivElement>(null);

  const runtimeFlow = useMemo(() => {
    if (nodes.length > 0) {
      return [...nodes].sort((a, b) => a.sort_order - b.sort_order);
    }

    return fallbackFlow.map((item, idx) => ({
      node_key: item.key,
      title: item.title,
      description: "",
      sort_order: idx + 1,
      status: idx === 0 ? ("available" as NodeStatus) : ("locked" as NodeStatus),
    }));
  }, [nodes]);

  const structuredContent = useMemo(() => {
    const sections = splitSections(markdown);
    const byNode: Record<StepType, SectionData> = {
      concept: sections[0] || sections[sections.length - 1] || { title: "Concept", body: markdown },
      widget: sections[1] || sections[0] || { title: "Widget", body: markdown },
      challenge: sections[2] || sections[1] || sections[0] || { title: "Challenge", body: markdown },
      feedback: sections[3] || sections[2] || sections[0] || { title: "Feedback", body: markdown },
    };

    const criteriaByNode = assignCriteriaByNode(byNode);

    return {
      concept: buildStructuredNode("concept", byNode.concept, criteriaByNode.concept),
      widget: buildStructuredNode("widget", byNode.widget, criteriaByNode.widget),
      challenge: buildStructuredNode("challenge", byNode.challenge, criteriaByNode.challenge),
      feedback: buildStructuredNode("feedback", byNode.feedback, criteriaByNode.feedback),
    };
  }, [markdown]);

  const currentNode = runtimeFlow[current];
  const canPrev = current > 0;
  const canNext = current < runtimeFlow.length - 1;

  useEffect(() => {
    if (!currentNode) return;
    if (currentNode.status !== "locked") return;
    const firstAvailable = runtimeFlow.findIndex((node) => node.status === "available" || node.status === "skipped");
    if (firstAvailable >= 0) setCurrent(firstAvailable);
  }, [currentNode, runtimeFlow]);

  useEffect(() => {
    if (!currentNode) return;
    setIsNodeOpen((prev) => ({
      ...prev,
      [currentNode.node_key]: prev[currentNode.node_key] ?? false,
    }));
  }, [currentNode]);

  const submitAdvance = async (nodeKey: StepType, payload?: Record<string, unknown>, nextIndex?: number) => {
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

  const submitChallenge = async (value: "perfect" | "good" | "weak") => {
    setChallengeResult(value);
    await submitAdvance("challenge", { challenge_result: value }, 3);
  };

  const submitReview = async (success: boolean) => {
    setReviewOutcome(success ? "ok" : "ko");
  };

  const finishFeedback = async () => {
    if (!reviewOutcome) return;
    await submitAdvance("feedback", { review_success: reviewOutcome === "ok" });
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

  const openNode = (nodeKey: StepType) => {
    setIsNodeOpen((prev) => ({
      ...prev,
      [nodeKey]: true,
    }));
  };

  const renderNodeBlocks = (content: StructuredNodeContent) => {
    const opened = isNodeOpen[content.nodeKey] ?? false;

    if (!opened) {
      return (
        <div className="rounded-xl border border-dashed border-border/70 bg-muted/15 p-2.5">
          <Button variant="ghost" className="h-9 w-full rounded-lg text-sm" onClick={() => openNode(content.nodeKey)}>
            Apri nodo
          </Button>
        </div>
      );
    }

    if (content.nodeKey === "concept") {
      const selected = activeConceptBlock;
      const activeBlock = selected !== null ? content.blocks[selected] : null;

      return (
        <div className="relative space-y-3">
          <div className="pointer-events-none absolute left-[7px] top-2 bottom-2 w-px bg-border/60" />

          <div className="space-y-2 pl-6">
            {content.blocks.map((block, index) => (
              <div key={`concept-prompt-${block.kind}-${index}`} className="relative">
                <div className="pointer-events-none absolute -left-[19px] top-3 h-3.5 w-3.5 rounded-full border border-border/70 bg-background" />
                <Button
                  variant={selected === index ? "default" : "outline"}
                  className="h-auto min-h-9 w-full justify-start whitespace-normal rounded-lg px-2.5 py-2 text-left text-[12px] leading-snug md:rounded-xl md:px-3 md:py-2.5 md:text-sm"
                  onClick={() => setActiveConceptBlock((prev) => (prev === index ? null : index))}
                >
                  {conceptPromptFor(block)}
                </Button>
              </div>
            ))}

            {activeBlock ? (
              <motion.div
                key={`concept-block-${activeBlock.kind}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="rounded-xl border border-primary/30 bg-primary/5 p-3.5"
              >
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{activeBlock.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/95">{activeBlock.content}</p>
              </motion.div>
            ) : null}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="space-y-3">
          {content.blocks.map((block, index) => {
            const isLeft = index % 2 === 0;

            return (
              <div key={`${content.nodeKey}-${block.kind}`} className="relative">
                {index < content.blocks.length - 1 ? (
                  <div className="pointer-events-none absolute left-1/2 top-8 h-[calc(100%+0.75rem)] w-px -translate-x-1/2 bg-border/60" />
                ) : null}

                <div className={`flex ${isLeft ? "justify-start" : "justify-end"} items-start`}>
                  <div className="pointer-events-none absolute left-1/2 top-4 h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-border/70 bg-background" />

                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="w-[84%] rounded-xl border border-primary/30 bg-primary/5 p-3.5"
                  >
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{block.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground/95">{block.content}</p>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!currentNode) return null;

  const canAutoProceed = currentNode.status === "completed" || currentNode.status === "skipped";

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
        {currentNode.node_key === "concept" ? (
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Nodo 1 · Capisci</p>
            {renderNodeBlocks(structuredContent.concept)}
            <div className="grid gap-2">
              {structuredContent.concept.options?.map((option) => (
                <Button
                  key={option}
                  variant={conceptChoice === option ? "default" : "outline"}
                  className="justify-start rounded-xl text-left"
                  disabled={tracking || currentNode.status === "completed" || currentNode.status === "locked"}
                  onClick={() => setConceptChoice(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
            <Button
              onClick={() => submitAdvance("concept", { selected_option: conceptChoice }, 1)}
              disabled={
                tracking ||
                currentNode.status === "completed" ||
                currentNode.status === "locked" ||
                !conceptChoice ||
                !isNodeOpen.concept ||
                activeConceptBlock === null
              }
              className="rounded-xl"
            >
              {currentNode.status === "completed" ? "Nodo completato" : tracking ? "Salvo..." : "Ho capito, continua"}
            </Button>
          </div>
        ) : null}

        {currentNode.node_key === "widget" ? (
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Nodo 2 · Applica</p>
            {renderNodeBlocks(structuredContent.widget)}
            <div className="grid gap-2">
              {structuredContent.widget.options?.map((option) => (
                <Button
                  key={option}
                  variant={widgetChoice === option ? "default" : "outline"}
                  className="justify-start rounded-xl text-left"
                  disabled={tracking || currentNode.status === "completed" || currentNode.status === "locked"}
                  onClick={() => setWidgetChoice(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
            <Button
              onClick={() => submitAdvance("widget", { selected_option: widgetChoice }, 2)}
              disabled={
                tracking ||
                currentNode.status === "completed" ||
                currentNode.status === "locked" ||
                !widgetChoice ||
                !isNodeOpen.widget
              }
              className="rounded-xl"
            >
              {currentNode.status === "completed" ? "Nodo completato" : tracking ? "Salvo..." : "Widget completato"}
            </Button>
          </div>
        ) : null}

        {currentNode.node_key === "challenge" ? (
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Nodo 3 · Verifica</p>
            {renderNodeBlocks(structuredContent.challenge)}
            <p className="text-sm text-muted-foreground">Come e andata davvero? Scegli senza pensarci troppo.</p>
            <div className="grid gap-2 md:grid-cols-3">
              <Button
                variant="outline"
                className="rounded-xl"
                disabled={tracking || currentNode.status === "completed" || currentNode.status === "locked"}
                onClick={() => submitChallenge("weak")}
              >
                Faticoso
              </Button>
              <Button
                variant="outline"
                className="rounded-xl"
                disabled={tracking || currentNode.status === "completed" || currentNode.status === "locked"}
                onClick={() => submitChallenge("good")}
              >
                Buono
              </Button>
              <Button
                className="rounded-xl"
                disabled={tracking || currentNode.status === "completed" || currentNode.status === "locked"}
                onClick={() => submitChallenge("perfect")}
              >
                Ottimo
              </Button>
            </div>
            {challengeResult && <p className="text-xs text-muted-foreground">Risultato registrato: {challengeResult}</p>}
          </div>
        ) : null}

        {currentNode.node_key === "feedback" ? (
          <div className="flex h-full flex-col">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Nodo 4 · Chiudi il cerchio</p>
            <h2 className="mb-1 mt-1 text-lg font-semibold">Feedback + tutor</h2>
            <p className="mb-4 text-xs text-muted-foreground">La lezione si completa solo quando tutti i nodi sono completati.</p>

            <div className="mb-4 grid gap-2">
              {structuredContent.feedback.suggestedPrompts?.map((prompt) => (
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
                onClick={finishFeedback}
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
        ) : null}

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
