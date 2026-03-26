import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
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
  return Boolean(entry?.selected || entry?.text?.trim());
}

// ─── Node status dot ────────────────────────────────────────────────────────
function NodeDot({ status, index, isActive, onClick }: {
  status: NodeStatus;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const baseRing = isActive ? "ring-2 ring-offset-1 ring-primary" : "";
  let bg = "bg-muted border border-border/60";
  if (status === "completed") bg = "bg-emerald-500 border-transparent";
  else if (status === "available") bg = "bg-primary border-transparent";
  else if (status === "skipped") bg = "bg-amber-400 border-transparent";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white transition-all ${bg} ${baseRing}`}
      style={{ touchAction: "manipulation" }}
      aria-label={`Nodo ${index + 1}`}
    >
      {status === "completed" ? <CheckCircle2 size={14} /> : index + 1}
    </button>
  );
}

// ─── Serpentine path connector ───────────────────────────────────────────────
function Connector({ isCompleted, isLast }: { isCompleted: boolean; isLast: boolean }) {
  if (isLast) return null;
  return (
    <div className={`mx-1 h-0.5 w-5 shrink-0 rounded-full transition-all ${isCompleted ? "bg-emerald-500" : "bg-border/50"}`} />
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

  /** Serpentine node path rendered inline */
  const renderSnakePath = () => {
    // 3 items per row per una visione più ariosa e meno schiacciata
    const COLS = 3;
    const rows: LessonNode[][] = [];
    for (let i = 0; i < runtimeFlow.length; i += COLS) {
      rows.push(runtimeFlow.slice(i, i + COLS));
    }

    return (
      <div className="flex flex-col gap-6 py-4">
        {rows.map((row, rowIdx) => {
          const reversed = rowIdx % 2 === 1;
          const displayRow = reversed ? [...row].reverse() : row;
          return (
            <div key={rowIdx} className="flex items-start justify-center">
              {displayRow.map((node, colIdx) => {
                const globalIdx = reversed
                  ? rowIdx * COLS + (row.length - 1 - colIdx)
                  : rowIdx * COLS + colIdx;
                
                return (
                  <div key={node.node_key} className="flex items-start">
                    <div className="flex flex-col items-center gap-2 w-[5.6rem]">
                      <NodeDot
                        status={node.status}
                        index={globalIdx}
                        isActive={activeNodeIndex === globalIdx}
                        onClick={() => openNode(globalIdx)}
                      />
                      <span
                        className="px-1 text-center text-[10.5px] font-medium leading-tight text-muted-foreground line-clamp-2"
                        title={node.title || nodeTitleFallback(node.node_key)}
                      >
                        {node.title || nodeTitleFallback(node.node_key)}
                      </span>
                    </div>
                    {colIdx < displayRow.length - 1 && (
                      <div className={`mt-[18px] h-0.5 w-[2rem] shrink-0 rounded-full transition-all ${node.status === "completed" ? "bg-emerald-500" : "bg-border/60"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
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

            {/* Poll areas */}
            {pollAreasForBlock.length > 0 && activeNode ? (
              <div className="mt-3 space-y-3 rounded-xl border border-border/60 bg-card p-3">
                {pollAreasForBlock.map((area, areaIndex) => {
                  const responseKey = pollKey(activeNode.node_key, blockIndex, area.id);
                  const response = pollResponses[responseKey];
                  const options =
                    area.options && area.options.length > 0 ? area.options : ["Si", "No", "Da rivedere"];

                  return (
                    <div key={responseKey} className="space-y-2 rounded-lg border border-border/50 bg-background/50 p-3">
                      <p className="break-words text-sm font-medium">
                        {areaIndex + 1}. {area.prompt}
                      </p>
                      <div className="grid gap-2">
                        {options.map((option) => (
                          <Button
                            key={`${responseKey}-${option}`}
                            type="button"
                            variant={response?.selected === option ? "default" : "outline"}
                            className="justify-start rounded-xl text-left break-words whitespace-normal"
                            onClick={() =>
                              setPollResponses((prev) => ({
                                ...prev,
                                [responseKey]: { ...prev[responseKey], selected: option },
                              }))
                            }
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                      {area.allowText !== false ? (
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
                          placeholder="Scrivi il tuo ragionamento in breve..."
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

            {/* Snake path */}
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">
                Mappa
              </p>
              {renderSnakePath()}

              {/* Legend */}
              <div className="mt-6 flex flex-wrap justify-center gap-4 border-t border-border/40 pt-4">
                {[
                  { color: "bg-emerald-500", label: "Completato" },
                  { color: "bg-primary", label: "Disponibile" },
                  { color: "bg-amber-400", label: "Skippato" },
                  { color: "bg-muted border border-border/60", label: "Bloccato" },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                    <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
                    {label}
                  </div>
                ))}
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
