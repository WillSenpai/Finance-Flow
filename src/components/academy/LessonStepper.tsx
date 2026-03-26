import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  Send,
  SkipForward,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { resolveLessonDefinition } from "@/components/academy/lesson-structures";
import type {
  BlockPollArea,
  NodeBlock,
  PollOption,
  StructuredLessonContent,
  StructuredNodeContent,
} from "@/components/academy/lesson-structures/types";

type StepType = string;
type NodeStatus = "locked" | "available" | "completed" | "skipped";

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
  chatMessages: { role: "user" | "assistant"; content: string }[];
  chatInput: string;
  onChatInputChange: (val: string) => void;
  onSendChat: () => void;
  isChatLoading: boolean;
  onNodeViewChange?: (isInsideNode: boolean) => void;
  backToNodesSignal?: number;
  contentOverride?: StructuredLessonContent | null;
};

type PollResponse = {
  selected?: string;
  text?: string;
  isCorrect?: boolean;
  showFeedback?: boolean;
};

function statusLabel(status: NodeStatus) {
  if (status === "completed") return "Completato";
  if (status === "skipped") return "Skippato";
  if (status === "available") return "Disponibile";
  return "Bloccato";
}

function blockIcon(kind: NodeBlock["kind"]) {
  if (kind === "focus") return "🎯";
  if (kind === "explain") return "🧩";
  if (kind === "question") return "❓";
  return "🛠️";
}

function nodeTitleFallback(key: string) {
  return key
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getPollAreas(nodeKey: string, blockIndex: number, block: NodeBlock): BlockPollArea[] {
  if (block.pollAreas && block.pollAreas.length > 0) return block.pollAreas;
  if (block.kind !== "question" && block.kind !== "exercise") return [];

  return [
    {
      id: `${nodeKey}-${blockIndex}-default`,
      prompt: "Qual e il passaggio principale da applicare?",
      options: [
        "Definisco il criterio prima di decidere",
        "Applico il criterio a un caso concreto",
        "Controllo che la scelta sia coerente col mio piano",
      ],
      allowText: true,
    },
  ];
}

function pollKey(nodeKey: string, blockIndex: number, areaId: string) {
  return `${nodeKey}::${blockIndex}::${areaId}`;
}

function hasPollAnswer(entry: PollResponse | undefined) {
  // Una risposta è considerata valida solo dopo che l'utente ha visto il feedback
  return Boolean(entry?.showFeedback || entry?.text?.trim());
}

// ─── Node status dot ────────────────────────────────────────────────────────
function NodeDot({ status, index, isActive, onClick, title }: {
  status: NodeStatus;
  index: number;
  isActive: boolean;
  onClick: () => void;
  title?: string;
}) {
  const isLocked = status === "locked";

  // Background colors based on status
  let bg = "bg-muted/80";
  let borderStyle = "border-2 border-border/40";
  let textColor = "text-muted-foreground/60";
  let shadow = "";

  if (status === "completed") {
    bg = "bg-gradient-to-br from-emerald-400 to-emerald-600";
    borderStyle = "border-2 border-emerald-300/50";
    textColor = "text-white";
    shadow = "shadow-lg shadow-emerald-500/25";
  } else if (status === "available") {
    bg = "bg-gradient-to-br from-primary to-primary/80";
    borderStyle = "border-2 border-primary/30";
    textColor = "text-primary-foreground";
    shadow = "shadow-lg shadow-primary/25";
  } else if (status === "skipped") {
    bg = "bg-gradient-to-br from-amber-400 to-amber-500";
    borderStyle = "border-2 border-amber-300/50";
    textColor = "text-white";
    shadow = "shadow-lg shadow-amber-500/20";
  }

  const activeRing = isActive
    ? "ring-2 ring-offset-2 ring-offset-card ring-primary scale-110"
    : "";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLocked}
      className={`
        relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full
        text-xs font-bold transition-all duration-200 ease-out
        ${bg} ${borderStyle} ${textColor} ${shadow} ${activeRing}
        ${isLocked ? "cursor-not-allowed opacity-60" : "cursor-pointer active:scale-95 hover:scale-105"}
      `}
      style={{ touchAction: "manipulation" }}
      aria-label={`Nodo ${index + 1}: ${title || `Passo ${index + 1}`}`}
      aria-disabled={isLocked}
    >
      {status === "completed" ? (
        <CheckCircle2 size={18} strokeWidth={2.5} />
      ) : (
        <span className="font-semibold">{index + 1}</span>
      )}

      {/* Pulse animation for available node */}
      {status === "available" && !isActive && (
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" style={{ animationDuration: "2s" }} />
      )}
    </button>
  );
}


const LessonStepper = ({
  lessonId,
  nodes,
  isProUser,
  onAdvanceNode,
  onSkipNode,
  chatMessages,
  chatInput,
  onChatInputChange,
  onSendChat,
  isChatLoading,
  onNodeViewChange,
  backToNodesSignal,
  contentOverride,
}: LessonStepperProps) => {
  const lessonDefinition = useMemo(() => resolveLessonDefinition(lessonId), [lessonId]);

  // Which node is open (null = none expanded)
  const [activeNodeIndex, setActiveNodeIndex] = useState<number | null>(null);
  // Which block (slide) is shown inside the active node
  const [blockIndex, setBlockIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pollResponses, setPollResponses] = useState<Record<string, PollResponse>>({});
  const lastBackSignalRef = useRef<number | undefined>(backToNodesSignal);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const contentByKey = useMemo(() => {
    if (contentOverride && Object.keys(contentOverride).length > 0) {
      const normalized = Object.fromEntries(
        Object.entries(contentOverride).map(([nodeKey, node]) => [
          nodeKey,
          {
            ...node,
            nodeKey: node.nodeKey || nodeKey,
            blocks: Array.isArray(node.blocks) ? node.blocks : [],
          },
        ]),
      );
      if (Object.keys(normalized).length > 0) {
        return normalized;
      }
    }
    const dynamic = lessonDefinition.buildDynamicContent?.() ?? [];
    if (dynamic.length > 0) return Object.fromEntries(dynamic.map((node) => [node.nodeKey, node]));
    return lessonDefinition.buildStructuredContent();
  }, [lessonDefinition, contentOverride]);

  const runtimeFlow = useMemo(() => {
    const sorted = [...nodes].sort((a, b) => a.sort_order - b.sort_order);
    if (sorted.length > 0) return sorted.filter(n => Boolean(n.node_key));

    const fallbackKeys = Object.keys(contentByKey).filter(Boolean);
    return fallbackKeys.map((key, index) => ({
      node_key: key,
      title: nodeTitleFallback(key),
      description: "",
      sort_order: index + 1,
      status: index === 0 ? ("available" as NodeStatus) : ("locked" as NodeStatus),
    }));
  }, [nodes, contentByKey]);

  // Notify parent about node view state
  useEffect(() => {
    onNodeViewChange?.(activeNodeIndex !== null);
  }, [onNodeViewChange, activeNodeIndex]);

  // Handle back signal from parent
  useEffect(() => {
    if (backToNodesSignal === undefined) return;
    if (lastBackSignalRef.current === backToNodesSignal) return;
    lastBackSignalRef.current = backToNodesSignal;
    setActiveNodeIndex(null);
  }, [backToNodesSignal]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const completedCount = runtimeFlow.filter((n) => n.status === "completed").length;
  const progressPct = runtimeFlow.length > 0 ? Math.round((completedCount / runtimeFlow.length) * 100) : 0;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const openNode = (index: number) => {
    const node = runtimeFlow[index];
    if (!node || node.status === "locked") return;
    setActiveNodeIndex(index);
    setBlockIndex(0);
  };

  const closeNode = () => {
    setActiveNodeIndex(null);
    setBlockIndex(0);
  };

  // ── Derived state for active node ─────────────────────────────────────────
  const activeNode = activeNodeIndex !== null ? runtimeFlow[activeNodeIndex] : null;

  const activeContent: StructuredNodeContent | null = activeNode
    ? contentByKey[activeNode.node_key] || {
        nodeKey: activeNode.node_key,
        criteria: ["foundational", "application"],
        blocks: [
          {
            kind: "focus",
            title: "Contenuto in preparazione",
            content: "Questo nodo non e ancora stato configurato.",
          },
        ],
      }
    : null;

  const blocks = activeContent?.blocks ?? [];
  const totalBlocks = blocks.length;
  const canPrevBlock = blockIndex > 0;
  const canNextBlock = blockIndex < totalBlocks - 1;
  const isLastBlock = blockIndex === totalBlocks - 1;

  const currentBlock = blocks[blockIndex];

  const pollAreasForBlock =
    activeNode && currentBlock
      ? getPollAreas(activeNode.node_key, blockIndex, currentBlock)
      : [];

  const areInteractiveBlocksValid = activeNode
    ? blocks.every((block, bIdx) => {
        const areas = getPollAreas(activeNode.node_key, bIdx, block);
        if (areas.length === 0) return true;
        return areas.every((area) =>
          hasPollAnswer(pollResponses[pollKey(activeNode.node_key, bIdx, area.id)]),
        );
      })
    : false;

  const canComplete =
    activeNode &&
    activeNode.status !== "locked" &&
    activeNode.status !== "completed" &&
    areInteractiveBlocksValid;

  const submitAdvance = async () => {
    if (!activeNode || !canComplete) return;
    if (!activeNode.node_key) {
      console.error("[LessonStepper] submitAdvance aborted: node_key is empty", { activeNodeIndex, activeNode });
      return;
    }
    setIsSubmitting(true);
    try {
      const responsePayload = {
        semantic_type: activeContent?.semanticType ?? null,
        selected_option: activeContent?.options?.[0] ?? null,
        poll_responses: Object.entries(pollResponses)
          .filter(([key]) => key.startsWith(`${activeNode.node_key}::`))
          .map(([key, value]) => ({ key, ...value })),
      };
      await onAdvanceNode(activeNode.node_key, responsePayload);
      // Auto-advance to next available node or close
      const nextIdx = runtimeFlow.findIndex(
        (n, idx) => idx > (activeNodeIndex ?? -1) && (n.status === "available" || n.status === "skipped"),
      );
      if (nextIdx >= 0) {
        setActiveNodeIndex(nextIdx);
        setBlockIndex(0);
      } else {
        setActiveNodeIndex(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitSkip = async () => {
    if (!activeNode || activeNode.status === "locked" || activeNode.status === "completed") return;
    if (!activeNode.node_key) {
      console.error("[LessonStepper] submitSkip aborted: node_key is empty", { activeNodeIndex, activeNode });
      return;
    }
    setIsSubmitting(true);
    try {
      await onSkipNode(activeNode.node_key);
      const nextIdx = runtimeFlow.findIndex(
        (n, idx) => idx > (activeNodeIndex ?? -1) && (n.status === "available" || n.status === "skipped"),
      );
      if (nextIdx >= 0) {
        setActiveNodeIndex(nextIdx);
        setBlockIndex(0);
      } else {
        setActiveNodeIndex(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render helpers ────────────────────────────────────────────────────────

  /** Vertical timeline roadmap */
  const renderVerticalTimeline = () => {
    return (
      <div className="relative">
        {/* Central timeline line */}
        <div
          className="absolute left-6 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-border/60 via-border/40 to-border/20"
          style={{ marginLeft: "-1.5px" }}
        />

        {/* Progress overlay on timeline */}
        <div
          className="absolute left-6 top-0 w-[3px] rounded-full bg-gradient-to-b from-emerald-500 via-emerald-400 to-emerald-300 transition-all duration-500"
          style={{
            marginLeft: "-1.5px",
            height: `${Math.max(0, (completedCount / runtimeFlow.length) * 100)}%`,
          }}
        />

        {/* Nodes */}
        <div className="relative flex flex-col">
          {runtimeFlow.map((node, idx) => {
            const nodeTitle = node.title || nodeTitleFallback(node.node_key);
            const isCompleted = node.status === "completed";
            const isAvailable = node.status === "available";
            const isSkipped = node.status === "skipped";
            const isLocked = node.status === "locked";
            const isActive = activeNodeIndex === idx;
            const isLast = idx === runtimeFlow.length - 1;

            // Status colors for card accent
            let accentColor = "border-l-border/40";
            let statusBadgeBg = "bg-muted/50 text-muted-foreground";
            if (isCompleted) {
              accentColor = "border-l-emerald-500";
              statusBadgeBg = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
            } else if (isAvailable) {
              accentColor = "border-l-primary";
              statusBadgeBg = "bg-primary/10 text-primary";
            } else if (isSkipped) {
              accentColor = "border-l-amber-400";
              statusBadgeBg = "bg-amber-500/10 text-amber-600 dark:text-amber-400";
            }

            return (
              <div
                key={node.node_key}
                className={`relative flex items-start gap-4 ${!isLast ? "pb-4" : ""}`}
              >
                {/* Node dot on timeline */}
                <div className="relative z-10 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => openNode(idx)}
                    disabled={isLocked}
                    className={`
                      relative flex h-12 w-12 items-center justify-center rounded-full
                      text-sm font-bold transition-all duration-200 ease-out
                      ${isLocked ? "cursor-not-allowed" : "cursor-pointer active:scale-95"}
                      ${isActive ? "ring-2 ring-offset-2 ring-offset-card ring-primary scale-110" : "hover:scale-105"}
                      ${isCompleted
                        ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                        : isAvailable
                          ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30"
                          : isSkipped
                            ? "bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-500/25"
                            : "bg-muted/80 text-muted-foreground/60 border-2 border-border/40"
                      }
                    `}
                    style={{ touchAction: "manipulation" }}
                    aria-label={`Nodo ${idx + 1}: ${nodeTitle}`}
                    aria-disabled={isLocked}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={20} strokeWidth={2.5} />
                    ) : (
                      <span className="font-semibold">{idx + 1}</span>
                    )}

                    {/* Pulse animation for available node */}
                    {isAvailable && !isActive && (
                      <span
                        className="absolute inset-0 animate-ping rounded-full bg-primary/30"
                        style={{ animationDuration: "2s" }}
                      />
                    )}
                  </button>
                </div>

                {/* Node content card */}
                <button
                  type="button"
                  onClick={() => !isLocked && openNode(idx)}
                  disabled={isLocked}
                  className={`
                    flex-1 text-left rounded-2xl border bg-card/80 backdrop-blur-sm
                    p-4 transition-all duration-200 border-l-4
                    ${accentColor}
                    ${isLocked
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:bg-card hover:shadow-md active:scale-[0.98]"
                    }
                    ${isActive ? "bg-card shadow-md ring-1 ring-primary/20" : ""}
                  `}
                  style={{ touchAction: "manipulation" }}
                >
                  {/* Status badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${statusBadgeBg}`}>
                      {isCompleted && <CheckCircle2 size={10} />}
                      {statusLabel(node.status)}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60">
                      Passo {idx + 1} di {runtimeFlow.length}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className={`font-semibold leading-tight ${isLocked ? "text-muted-foreground/60" : "text-foreground"}`}>
                    {nodeTitle}
                  </h3>

                  {/* Description preview if available */}
                  {node.description && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {node.description}
                    </p>
                  )}

                  {/* CTA hint for available */}
                  {isAvailable && (
                    <div className="mt-2 flex items-center gap-1 text-xs font-medium text-primary">
                      <span>Inizia ora</span>
                      <ChevronRight size={12} />
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /** Block carousel inside active node */
  const renderBlockCarousel = () => {
    if (!activeNode || !activeContent || !currentBlock) return null;

    return (
      <div className="mt-4 flex flex-col gap-3">
        {/* Node header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Nodo {(activeNodeIndex ?? 0) + 1} · {statusLabel(activeNode.status)}
            </p>
            <h2 className="break-words text-lg font-semibold leading-tight">
              {activeNode.title || nodeTitleFallback(activeNode.node_key)}
            </h2>
          </div>
        </div>

        {/* Block progress dots */}
        <div className="flex items-center justify-center gap-1.5">
          {blocks.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setBlockIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === blockIndex
                  ? "w-5 bg-primary"
                  : "w-1.5 bg-border/60 hover:bg-border"
              }`}
              aria-label={`Sezione ${idx + 1}`}
            />
          ))}
        </div>

        {/* Block card with animation */}
        <AnimatePresence mode="wait">
          <motion.article
            key={`${activeNode.node_key}-block-${blockIndex}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden rounded-2xl border border-border/60 bg-background/60 p-4"
          >
            {/* Block label */}
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-2.5 py-1 text-xs">
              <span>{blockIcon(currentBlock.kind)}</span>
              <span className="font-medium">{currentBlock.title}</span>
              <span className="text-muted-foreground">
                {blockIndex + 1}/{totalBlocks}
              </span>
            </div>

            {/* Content */}
            <div className="prose prose-sm max-w-none overflow-hidden break-words [&_*]:break-words dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentBlock.content}</ReactMarkdown>
            </div>

            {/* Poll areas con feedback branching */}
            {pollAreasForBlock.length > 0 && activeNode ? (
              <div className="mt-3 space-y-3 rounded-xl border border-border/60 bg-card p-3">
                {pollAreasForBlock.map((area, areaIndex) => {
                  const responseKey = pollKey(activeNode.node_key, blockIndex, area.id);
                  const response = pollResponses[responseKey];

                  // Supporto per richOptions (con spiegazioni) o options semplici
                  const richOptions: PollOption[] = area.richOptions ??
                    (area.options?.map((opt, idx) => ({
                      text: opt,
                      isCorrect: area.correctIndex !== undefined ? idx === area.correctIndex : idx === 0,
                      explanation: undefined,
                    })) ?? []);

                  const hasAnswered = response?.showFeedback === true;
                  const selectedOption = richOptions.find(opt => opt.text === response?.selected);
                  const isCorrectAnswer = selectedOption?.isCorrect ?? false;

                  // Determina la spiegazione da mostrare
                  const feedbackExplanation = hasAnswered ? (
                    isCorrectAnswer
                      ? (selectedOption?.explanation || area.correctExplanation || "Esatto! Hai colto il punto chiave.")
                      : (selectedOption?.explanation || area.wrongExplanation || "Non proprio. Vediamo insieme perché...")
                  ) : null;

                  return (
                    <div key={responseKey} className="space-y-3 rounded-lg border border-border/50 bg-background/50 p-3">
                      <p className="break-words text-sm font-medium">
                        {areaIndex + 1}. {area.prompt}
                      </p>

                      {/* Opzioni di risposta */}
                      <div className="grid gap-2">
                        {richOptions.map((option) => {
                          const isSelected = response?.selected === option.text;
                          const showCorrectHighlight = hasAnswered && option.isCorrect;
                          const showWrongHighlight = hasAnswered && isSelected && !option.isCorrect;

                          return (
                            <Button
                              key={`${responseKey}-${option.text}`}
                              type="button"
                              variant={isSelected && !hasAnswered ? "default" : "outline"}
                              className={`justify-start rounded-xl text-left break-words whitespace-normal transition-all ${
                                showCorrectHighlight ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" : ""
                              } ${
                                showWrongHighlight ? "border-red-400 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400" : ""
                              }`}
                              onClick={() => {
                                if (hasAnswered) return; // Non permettere cambio dopo feedback
                                setPollResponses((prev) => ({
                                  ...prev,
                                  [responseKey]: {
                                    ...prev[responseKey],
                                    selected: option.text,
                                    isCorrect: option.isCorrect,
                                    showFeedback: false,
                                  },
                                }));
                              }}
                              disabled={hasAnswered}
                            >
                              {hasAnswered && option.isCorrect && <CheckCircle2 size={14} className="mr-2 text-emerald-500 shrink-0" />}
                              {option.text}
                            </Button>
                          );
                        })}
                      </div>

                      {/* Pulsante Verifica */}
                      {response?.selected && !hasAnswered && (
                        <Button
                          type="button"
                          className="w-full rounded-xl"
                          onClick={() => {
                            setPollResponses((prev) => ({
                              ...prev,
                              [responseKey]: {
                                ...prev[responseKey],
                                showFeedback: true,
                              },
                            }));
                          }}
                        >
                          Verifica risposta
                        </Button>
                      )}

                      {/* Feedback branching */}
                      {hasAnswered && feedbackExplanation && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`rounded-xl p-4 ${
                            isCorrectAnswer
                              ? "bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800"
                              : "bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-800"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`shrink-0 text-lg ${isCorrectAnswer ? "text-emerald-500" : "text-amber-500"}`}>
                              {isCorrectAnswer ? "✓" : "💡"}
                            </div>
                            <div className="space-y-2">
                              <p className={`font-semibold text-sm ${isCorrectAnswer ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}>
                                {isCorrectAnswer ? "Corretto!" : "Vediamo insieme..."}
                              </p>
                              <div className="prose prose-sm max-w-none text-foreground/90">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{feedbackExplanation}</ReactMarkdown>
                              </div>
                              {!isCorrectAnswer && (
                                <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-amber-200 dark:border-amber-800">
                                  Ora che hai capito il concetto, puoi proseguire con la lezione.
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {area.allowText !== false && hasAnswered ? (
                        <Textarea
                          value={response?.text || ""}
                          onChange={(event) =>
                            setPollResponses((prev) => ({
                              ...prev,
                              [responseKey]: { ...prev[responseKey], text: event.target.value },
                            }))
                          }
                          rows={2}
                          className="rounded-xl"
                          placeholder="Scrivi una riflessione personale (opzionale)..."
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </motion.article>
        </AnimatePresence>

        {/* Block navigation */}
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-2xl"
            onClick={() => setBlockIndex((i) => i - 1)}
            disabled={!canPrevBlock || isSubmitting}
          >
            <ChevronLeft size={16} />
          </Button>

          <div className="flex flex-1 gap-2">
            {!isLastBlock ? (
              <Button
                type="button"
                className="h-10 flex-1 gap-1 rounded-2xl"
                onClick={() => setBlockIndex((i) => i + 1)}
                disabled={isSubmitting}
              >
                Avanti <ChevronRight size={14} />
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-2xl"
                  onClick={submitSkip}
                  disabled={
                    isSubmitting ||
                    !activeNode ||
                    activeNode.status === "locked" ||
                    activeNode.status === "completed"
                  }
                >
                  <SkipForward size={14} />
                </Button>
                <Button
                  type="button"
                  className="h-10 flex-1 gap-1 rounded-2xl"
                  onClick={canComplete ? submitAdvance : undefined}
                  disabled={isSubmitting || !canComplete}
                >
                  {isSubmitting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 size={14} /> Completa nodo
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Tutor chat (last node only) */}
        {(activeNode.node_key === "action_plan" ||
          (activeNodeIndex !== null && activeNodeIndex === runtimeFlow.length - 1)) ? (
          <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tutor</p>
            {activeContent.suggestedPrompts?.length ? (
              <div className="grid gap-2">
                {activeContent.suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-left text-xs text-foreground/90 transition hover:bg-muted/35 break-words"
                    onClick={() => onChatInputChange(prompt)}
                    disabled={isChatLoading || isSubmitting}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            ) : null}

            {chatMessages.length > 0 ? (
              <div className="max-h-56 space-y-2 overflow-y-auto rounded-xl border border-border/60 bg-background/60 p-2">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm break-words ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none overflow-hidden break-words [&_*]:break-words dark:prose-invert">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            ) : null}

            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(event) => onChatInputChange(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && onSendChat()}
                placeholder="Chiedi un chiarimento sul piano operativo"
                className="rounded-xl"
                disabled={isChatLoading || isSubmitting}
              />
              <Button
                type="button"
                size="icon"
                className="h-10 w-10 rounded-xl"
                onClick={onSendChat}
                disabled={!chatInput.trim() || isChatLoading || isSubmitting}
              >
                {isChatLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </Button>
            </div>
          </div>
        ) : null}


      </div>
    );
  };

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-6">
      <AnimatePresence mode="wait">
        {activeNodeIndex === null ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col flex-1"
          >
            {/* Progress bar */}
            <div className="mb-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Percorso lezione</span>
                <span>{progressPct}% completato</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary/60">
                <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progressPct}%` }} />
              </div>
            </div>

            {/* Vertical Timeline Roadmap */}
            <div className="flex-1 flex flex-col rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
              {/* Header */}
              <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b border-border/40 px-5 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M12 2v20M2 12h20" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Roadmap</p>
                      <p className="text-[10px] text-muted-foreground">
                        {completedCount}/{runtimeFlow.length} completati
                      </p>
                    </div>
                  </div>
                  {/* Mini progress circle */}
                  <div className="relative h-10 w-10">
                    <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18" cy="18" r="15"
                        fill="none"
                        className="stroke-border/40"
                        strokeWidth="3"
                      />
                      <circle
                        cx="18" cy="18" r="15"
                        fill="none"
                        className="stroke-primary transition-all duration-500"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${progressPct * 0.94} 100`}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
                      {progressPct}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Scrollable vertical timeline - fills available space */}
              <div
                className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4"
                style={{
                  minHeight: "200px",
                  maxHeight: "calc(100vh - 280px)",
                  WebkitOverflowScrolling: "touch",
                  scrollbarWidth: "thin",
                }}
              >
                {renderVerticalTimeline()}
              </div>

              {/* Legend footer */}
              <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm border-t border-border/40 px-4 py-2.5">
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                  {[
                    { color: "bg-emerald-500", label: "Completato" },
                    { color: "bg-primary", label: "Disponibile" },
                    { color: "bg-amber-400", label: "Skippato" },
                    { color: "bg-muted border border-border/60", label: "Bloccato" },
                  ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                      <div className={`h-2 w-2 rounded-full ${color}`} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="node-detail"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col flex-1"
          >
            {renderBlockCarousel()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LessonStepper;
