import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Send, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type StepType = "concept" | "widget" | "challenge" | "feedback";
type NodeStatus = "locked" | "available" | "completed" | "skipped";

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

const fallbackFlow: Array<{ key: StepType; title: string }> = [
  { key: "concept", title: "Concept" },
  { key: "widget", title: "Widget" },
  { key: "challenge", title: "Challenge" },
  { key: "feedback", title: "Feedback" },
];

function toWordLimitedText(markdown: string, maxWords: number): string {
  const raw = markdown
    .replace(/^###\s+/gm, "")
    .replace(/[#>*_`-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = raw.split(" ");
  if (words.length <= maxWords) return words.join(" ");
  return `${words.slice(0, maxWords).join(" ")}...`;
}

function pickSection(markdown: string, index: number): string {
  const sections = markdown.split(/(?=^###\s)/m).filter((s) => s.trim());
  if (sections[index]) return sections[index].replace(/^###\s+.+\n?/, "").trim();
  return markdown.trim();
}

function pickSectionTitle(markdown: string, index: number): string {
  const sections = markdown.split(/(?=^###\s)/m).filter((s) => s.trim());
  const heading = sections[index]?.match(/^###\s+(.+)$/m)?.[1]?.trim();
  return heading || "Focus del nodo";
}

function statusLabel(status: NodeStatus) {
  if (status === "completed") return "Completato";
  if (status === "skipped") return "Skippato";
  if (status === "available") return "Disponibile";
  return "Bloccato";
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
  const chatEndRef = useRef<HTMLDivElement>(null);

  const conceptTitle = useMemo(() => pickSectionTitle(markdown, 0), [markdown]);
  const widgetTitle = useMemo(() => pickSectionTitle(markdown, 1), [markdown]);
  const challengeTitle = useMemo(() => pickSectionTitle(markdown, 2), [markdown]);
  const conceptText = useMemo(() => toWordLimitedText(pickSection(markdown, 0), 55), [markdown]);
  const widgetText = useMemo(() => toWordLimitedText(pickSection(markdown, 1), 45), [markdown]);
  const challengeText = useMemo(() => toWordLimitedText(pickSection(markdown, 2), 45), [markdown]);

  const runtimeFlow = useMemo(() => {
    if (nodes.length > 0) {
      return [...nodes].sort((a, b) => a.sort_order - b.sort_order);
    }

    return fallbackFlow.map((item, idx) => ({
      node_key: item.key,
      title: item.title,
      description: "",
      sort_order: idx + 1,
      status: idx === 0 ? "available" as NodeStatus : "locked" as NodeStatus,
    }));
  }, [nodes]);

  const currentNode = runtimeFlow[current];
  const canPrev = current > 0;
  const canNext = current < runtimeFlow.length - 1;

  useEffect(() => {
    if (!currentNode) return;
    if (currentNode.status !== "locked") return;
    const firstAvailable = runtimeFlow.findIndex((node) => node.status === "available" || node.status === "skipped");
    if (firstAvailable >= 0) setCurrent(firstAvailable);
  }, [currentNode, runtimeFlow]);

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

  if (!currentNode) return null;

  const canAutoProceed = currentNode.status === "completed" || currentNode.status === "skipped";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-5 flex gap-1.5 px-1">
        {runtimeFlow.map((step) => (
          <div
            key={step.node_key}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{
              backgroundColor:
                step.status === "completed" ? "hsl(var(--primary))"
                : step.status === "skipped" ? "hsl(var(--primary) / 0.45)"
                : step.status === "available" ? "hsl(var(--muted-foreground) / 0.5)"
                : "hsl(var(--muted))",
            }}
          />
        ))}
      </div>

      <div className="mb-3 flex items-center justify-between px-1 text-xs text-muted-foreground">
        <span>{current + 1} / {runtimeFlow.length} · {currentNode.title}</span>
        <span>{statusLabel(currentNode.status)}</span>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-border/60 bg-card p-5">
        {currentNode.node_key === "concept" ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Nodo 1 · Capisci</p>
              <h2 className="mt-1 text-base font-semibold">{conceptTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{conceptText}</p>
            </div>
            <Button
              onClick={() => submitAdvance("concept", {}, 1)}
              disabled={tracking || currentNode.status === "completed" || currentNode.status === "locked"}
              className="rounded-xl"
            >
              {currentNode.status === "completed" ? "Nodo completato" : tracking ? "Salvo..." : "Ho capito, continua"}
            </Button>
          </div>
        ) : null}

        {currentNode.node_key === "widget" ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Nodo 2 · Applica</p>
              <h2 className="mt-1 text-base font-semibold">{widgetTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{widgetText}</p>
            </div>
            <Button
              onClick={() => submitAdvance("widget", {}, 2)}
              disabled={tracking || currentNode.status === "completed" || currentNode.status === "locked"}
              className="rounded-xl"
            >
              {currentNode.status === "completed" ? "Nodo completato" : tracking ? "Salvo..." : "Widget completato"}
            </Button>
          </div>
        ) : null}

        {currentNode.node_key === "challenge" ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Nodo 3 · Verifica</p>
              <h2 className="mt-1 text-base font-semibold">{challengeTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{challengeText}</p>
            </div>
            <p className="text-sm text-muted-foreground">Valuta in modo rapido come e andata.</p>
            <div className="grid gap-2 md:grid-cols-3">
              <Button variant="outline" className="rounded-xl" disabled={tracking || currentNode.status === "completed" || currentNode.status === "locked"} onClick={() => submitChallenge("weak")}>Faticoso</Button>
              <Button variant="outline" className="rounded-xl" disabled={tracking || currentNode.status === "completed" || currentNode.status === "locked"} onClick={() => submitChallenge("good")}>Buono</Button>
              <Button className="rounded-xl" disabled={tracking || currentNode.status === "completed" || currentNode.status === "locked"} onClick={() => submitChallenge("perfect")}>Ottimo</Button>
            </div>
            {challengeResult && <p className="text-xs text-muted-foreground">Risultato registrato: {challengeResult}</p>}
          </div>
        ) : null}

        {currentNode.node_key === "feedback" ? (
          <div className="flex h-full flex-col">
            <h2 className="mb-1 text-lg font-semibold">Feedback + tutor</h2>
            <p className="mb-4 text-xs text-muted-foreground">La lezione si completa solo quando tutti i nodi sono completati.</p>

            {chatMessages.length > 0 ? (
              <div className="mb-4 flex-1 space-y-3 overflow-y-auto">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
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
                Chiedi un esempio pratico o un chiarimento prima di chiudere il nodo feedback.
              </div>
            )}

            <div className="mt-auto space-y-3">
              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => onChatInputChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSendChat()}
                  placeholder="Es: fammi un esempio concreto"
                  disabled={isChatLoading || tracking}
                  className="rounded-xl"
                />
                <Button size="icon" onClick={onSendChat} disabled={!chatInput.trim() || isChatLoading || tracking} className="h-10 w-10 rounded-xl">
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

      <div className="mt-4 grid gap-3 pt-2 md:grid-cols-3">
        <Button variant="outline" onClick={() => canPrev && setCurrent(current - 1)} disabled={!canPrev || tracking} className="h-11 rounded-2xl gap-2">
          <ArrowLeft size={16} /> Indietro
        </Button>

        <Button
          variant="outline"
          onClick={submitSkip}
          disabled={tracking || currentNode.status === "locked" || currentNode.status === "completed"}
          className="h-11 rounded-2xl gap-2"
        >
          <SkipForward size={16} />
          {isProUser ? "Skippa nodo" : "Skip (solo Pro)"}
        </Button>

        <Button onClick={() => canNext && setCurrent(current + 1)} disabled={!canNext || tracking || !canAutoProceed} className="h-11 rounded-2xl gap-2">
          Avanti <ArrowRight size={16} />
        </Button>
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
