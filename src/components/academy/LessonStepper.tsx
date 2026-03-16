import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, Loader2, Send, SkipForward } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { resolveLessonDefinition } from "@/components/academy/lesson-structures";
import type { BlockPollArea, NodeBlock, StructuredNodeContent } from "@/components/academy/lesson-structures/types";

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
};

type PollResponse = {
  selected?: string;
  text?: string;
};

function statusLabel(status: NodeStatus) {
  if (status === "completed") return "Completato";
  if (status === "skipped") return "Skippato";
  if (status === "available") return "Disponibile";
  return "Bloccato";
}

function statusClasses(status: NodeStatus) {
  if (status === "completed") return "border-emerald-400/60 bg-emerald-500/10";
  if (status === "available") return "border-primary/50 bg-primary/10";
  if (status === "skipped") return "border-amber-400/60 bg-amber-500/10";
  return "border-border/60 bg-muted/30";
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

const LessonStepper = ({
  lessonId,
  nodes,
  isLessonCompleted,
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
}: LessonStepperProps) => {
  const lessonDefinition = useMemo(() => resolveLessonDefinition(lessonId), [lessonId]);

  const [current, setCurrent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pollResponses, setPollResponses] = useState<Record<string, PollResponse>>({});
  const lastBackSignalRef = useRef<number | undefined>(backToNodesSignal);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const contentByKey = useMemo(() => {
    const dynamic = lessonDefinition.buildDynamicContent?.() ?? [];
    if (dynamic.length > 0) {
      return Object.fromEntries(dynamic.map((node) => [node.nodeKey, node]));
    }
    return lessonDefinition.buildStructuredContent();
  }, [lessonDefinition]);

  const runtimeFlow = useMemo(() => {
    const sorted = [...nodes].sort((a, b) => a.sort_order - b.sort_order);
    if (sorted.length > 0) return sorted;

    const fallbackKeys = Object.keys(contentByKey);
    return fallbackKeys.map((key, index) => ({
      node_key: key,
      title: nodeTitleFallback(key),
      description: "",
      sort_order: index + 1,
      status: index === 0 ? ("available" as NodeStatus) : ("locked" as NodeStatus),
    }));
  }, [nodes, contentByKey]);

  useEffect(() => {
    onNodeViewChange?.(false);
  }, [onNodeViewChange]);

  useEffect(() => {
    if (backToNodesSignal === undefined) return;
    if (lastBackSignalRef.current === backToNodesSignal) return;
    lastBackSignalRef.current = backToNodesSignal;
    const firstAvailable = runtimeFlow.findIndex((node) => node.status === "available" || node.status === "skipped");
    if (firstAvailable >= 0) setCurrent(firstAvailable);
  }, [backToNodesSignal, runtimeFlow]);

  useEffect(() => {
    const firstAvailable = runtimeFlow.findIndex((node) => node.status === "available" || node.status === "skipped");
    if (firstAvailable === -1) return;
    if (runtimeFlow[current]?.status === "locked") setCurrent(firstAvailable);
  }, [current, runtimeFlow]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const currentNode = runtimeFlow[current];
  if (!currentNode) return null;

  const currentContent: StructuredNodeContent =
    contentByKey[currentNode.node_key] || {
      nodeKey: currentNode.node_key,
      criteria: ["foundational", "application"],
      blocks: [
        {
          kind: "focus",
          title: "Contenuto in preparazione",
          content: "Questo nodo non e ancora stato configurato nel nuovo modello dinamico.",
        },
      ],
    };

  const completedCount = runtimeFlow.filter((node) => node.status === "completed").length;
  const progressPct = runtimeFlow.length > 0 ? Math.round((completedCount / runtimeFlow.length) * 100) : 0;

  const canPrev = current > 0;
  const canNext = current < runtimeFlow.length - 1;

  const areInteractiveBlocksValid = currentContent.blocks.every((block, blockIndex) => {
    const areas = getPollAreas(currentNode.node_key, blockIndex, block);
    if (areas.length === 0) return true;
    return areas.every((area) => hasPollAnswer(pollResponses[pollKey(currentNode.node_key, blockIndex, area.id)]));
  });

  const canComplete =
    currentNode.status !== "locked" &&
    currentNode.status !== "completed" &&
    areInteractiveBlocksValid;

  const submitAdvance = async () => {
    if (!canComplete) return;
    setIsSubmitting(true);
    try {
      const responsePayload = {
        semantic_type: currentContent.semanticType ?? null,
        selected_option: currentContent.options?.[0] ?? null,
        poll_responses: Object.entries(pollResponses)
          .filter(([key]) => key.startsWith(`${currentNode.node_key}::`))
          .map(([key, value]) => ({ key, ...value })),
      };

      await onAdvanceNode(currentNode.node_key, responsePayload);
      if (canNext) setCurrent((value) => value + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitSkip = async () => {
    if (currentNode.status === "locked" || currentNode.status === "completed") return;
    setIsSubmitting(true);
    try {
      await onSkipNode(currentNode.node_key);
      if (canNext) setCurrent((value) => value + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-3 rounded-2xl border border-border/60 bg-card p-3">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Nodo {current + 1} / {runtimeFlow.length}</span>
          <span>{progressPct}% completato</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="max-h-[35vh] overflow-y-auto rounded-2xl border border-border/60 bg-card p-2 lg:max-h-none">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Timeline lezione</p>
          <div className="space-y-2">
            {runtimeFlow.map((node, index) => {
              const isCurrent = index === current;
              const clickable = node.status !== "locked";
              return (
                <button
                  key={node.node_key}
                  type="button"
                  onClick={() => clickable && setCurrent(index)}
                  className={`w-full rounded-xl border p-2 text-left transition ${statusClasses(node.status)} ${
                    isCurrent ? "ring-2 ring-primary/50" : ""
                  } ${clickable ? "cursor-pointer" : "cursor-not-allowed opacity-70"}`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Nodo {index + 1}</p>
                  <p className="text-sm font-medium leading-tight">{node.title || nodeTitleFallback(node.node_key)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{statusLabel(node.status)}</p>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="min-h-0 overflow-y-auto rounded-2xl border border-border/60 bg-card px-3 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-3 sm:px-4">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {currentContent.semanticType ? currentContent.semanticType.replace(/_/g, " ") : "nodo"}
                </p>
                <h2 className="text-xl font-semibold leading-tight">{currentNode.title || nodeTitleFallback(currentNode.node_key)}</h2>
                {currentContent.goal ? (
                  <p className="mt-1 text-sm text-muted-foreground">{currentContent.goal}</p>
                ) : null}
              </div>
              {currentContent.estimatedMinutes ? (
                <div className="inline-flex items-center gap-1 rounded-full border border-border/60 px-2.5 py-1 text-xs text-muted-foreground">
                  <Clock3 size={12} /> ~{currentContent.estimatedMinutes} min
                </div>
              ) : null}
            </div>

            {currentNode.description ? (
              <div className="mb-3 rounded-xl border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
                {currentNode.description}
              </div>
            ) : null}

            <div className="space-y-3">
              {currentContent.blocks.map((block, blockIndex) => {
                const areas = getPollAreas(currentNode.node_key, blockIndex, block);
                return (
                  <article key={`${currentNode.node_key}-${blockIndex}-${block.kind}`} className="rounded-2xl border border-border/60 bg-background/60 p-3 sm:p-4">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-2.5 py-1 text-xs">
                      <span>{blockIcon(block.kind)}</span>
                      <span className="font-medium">{block.title}</span>
                    </div>
                    <div className="prose prose-sm max-w-none whitespace-pre-line dark:prose-invert">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.content}</ReactMarkdown>
                    </div>

                    {areas.length > 0 ? (
                      <div className="mt-3 space-y-3 rounded-xl border border-border/60 bg-card p-3">
                        {areas.map((area, areaIndex) => {
                          const responseKey = pollKey(currentNode.node_key, blockIndex, area.id);
                          const response = pollResponses[responseKey];
                          const options = area.options && area.options.length > 0 ? area.options : ["Si", "No", "Da rivedere"];

                          return (
                            <div key={responseKey} className="space-y-2 rounded-lg border border-border/50 bg-background/50 p-3">
                              <p className="text-sm font-medium">{areaIndex + 1}. {area.prompt}</p>
                              <div className="grid gap-2">
                                {options.map((option) => (
                                  <Button
                                    key={`${responseKey}-${option}`}
                                    type="button"
                                    variant={response?.selected === option ? "default" : "outline"}
                                    className="justify-start rounded-xl text-left"
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
                  </article>
                );
              })}
            </div>

            {currentContent.checkpointPrompt ? (
              <div className="mt-3 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm">
                <p className="font-medium">Checkpoint</p>
                <p className="mt-1 text-muted-foreground">{currentContent.checkpointPrompt}</p>
              </div>
            ) : null}

            {(currentNode.node_key === "action_plan" || current === runtimeFlow.length - 1) ? (
              <div className="mt-3 space-y-3 rounded-2xl border border-border/60 bg-card p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tutor</p>
                {currentContent.suggestedPrompts?.length ? (
                  <div className="grid gap-2">
                    {currentContent.suggestedPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        className="rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-left text-xs text-foreground/90 transition hover:bg-muted/35"
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
                        <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                          {message.role === "assistant" ? (
                            <div className="prose prose-sm max-w-none dark:prose-invert">
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
          </motion.div>
        </section>
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 border-t border-border/70 bg-background/95 px-2 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur">
        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-11 gap-2 rounded-2xl"
            onClick={() => canPrev && setCurrent((value) => value - 1)}
            disabled={!canPrev || isSubmitting}
          >
            <ArrowLeft size={15} /> Indietro
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-11 gap-2 rounded-2xl"
            onClick={submitSkip}
            disabled={isSubmitting || currentNode.status === "locked" || currentNode.status === "completed"}
          >
            <SkipForward size={15} /> {isProUser ? "Skippa" : "Skip Pro"}
          </Button>

          <Button
            type="button"
            className="h-11 gap-2 rounded-2xl"
            onClick={canComplete ? submitAdvance : () => canNext && setCurrent((value) => value + 1)}
            disabled={isSubmitting || (currentNode.status === "locked")}
          >
            {isSubmitting ? "Salvo..." : canComplete ? "Completa" : "Avanti"} <ArrowRight size={15} />
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
