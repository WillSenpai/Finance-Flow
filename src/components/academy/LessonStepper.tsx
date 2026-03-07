import { useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type StepType = "concept" | "widget" | "challenge" | "feedback";

type LessonStepperProps = {
  markdown: string;
  isCompleted: boolean;
  onComplete: () => Promise<void> | void;
  onTrackEvent: (eventType: StepType | "review", extra?: Record<string, unknown>) => Promise<void>;
  chatMessages: { role: "user" | "assistant"; content: string }[];
  chatInput: string;
  onChatInputChange: (val: string) => void;
  onSendChat: () => void;
  isChatLoading: boolean;
};

const flow: Array<{ key: StepType; title: string }> = [
  { key: "concept", title: "Concept" },
  { key: "widget", title: "Widget" },
  { key: "challenge", title: "Challenge" },
  { key: "feedback", title: "Feedback" },
];

function toWordLimitedConcept(markdown: string, maxWords: number): string {
  const raw = markdown
    .replace(/^###\s+/gm, "")
    .replace(/[#>*_`\-]/g, " ")
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

const LessonStepper = ({
  markdown,
  isCompleted,
  onComplete,
  onTrackEvent,
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
  const chatEndRef = useRef<HTMLDivElement>(null);

  const conceptText = useMemo(() => toWordLimitedConcept(markdown, 200), [markdown]);
  const widgetText = useMemo(() => pickSection(markdown, 1), [markdown]);
  const challengeText = useMemo(() => pickSection(markdown, 2), [markdown]);

  const canPrev = current > 0;
  const canNext = current < flow.length - 1;

  const trackAndGo = async (eventType: StepType | "review", extra?: Record<string, unknown>, nextIndex?: number) => {
    setTracking(true);
    try {
      await onTrackEvent(eventType, extra);
      if (typeof nextIndex === "number") setCurrent(nextIndex);
    } finally {
      setTracking(false);
    }
  };

  const submitChallenge = async (value: "perfect" | "good" | "weak") => {
    setChallengeResult(value);
    await trackAndGo("challenge", { challenge_result: value }, 3);
  };

  const submitReview = async (success: boolean) => {
    setReviewOutcome(success ? "ok" : "ko");
    await trackAndGo("review", { review_success: success });
  };

  const finish = async () => {
    if (!challengeResult || !reviewOutcome) return;
    setTracking(true);
    try {
      await onTrackEvent("feedback");
      await onComplete();
    } finally {
      setTracking(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-5 flex gap-1.5 px-1">
        {flow.map((step, i) => (
          <div
            key={step.key}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{ backgroundColor: i <= current ? "hsl(var(--primary))" : "hsl(var(--muted))" }}
          />
        ))}
      </div>

      <p className="mb-3 px-1 text-xs text-muted-foreground">{current + 1} / {flow.length} · {flow[current].title}</p>

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-border/60 bg-card p-5">
        {flow[current].key === "concept" ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Capisci il concetto in meno di 200 parole</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{conceptText}</p>
            <Button onClick={() => trackAndGo("concept", {}, 1)} disabled={tracking} className="rounded-xl">
              {tracking ? "Salvo..." : "Ho capito, continua"}
            </Button>
          </div>
        ) : null}

        {flow[current].key === "widget" ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Applica subito (Widget)</h2>
            <div className="rounded-xl border border-border/60 bg-muted/40 p-4 text-sm leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{widgetText}</ReactMarkdown>
            </div>
            <Button onClick={() => trackAndGo("widget", {}, 2)} disabled={tracking} className="rounded-xl">
              {tracking ? "Salvo..." : "Widget completato"}
            </Button>
          </div>
        ) : null}

        {flow[current].key === "challenge" ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Challenge</h2>
            <div className="rounded-xl border border-border/60 bg-muted/40 p-4 text-sm leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{challengeText}</ReactMarkdown>
            </div>
            <p className="text-sm text-muted-foreground">Come valuti il tuo risultato?</p>
            <div className="grid gap-2 md:grid-cols-3">
              <Button variant="outline" className="rounded-xl" disabled={tracking} onClick={() => submitChallenge("weak")}>Faticoso</Button>
              <Button variant="outline" className="rounded-xl" disabled={tracking} onClick={() => submitChallenge("good")}>Buono</Button>
              <Button className="rounded-xl" disabled={tracking} onClick={() => submitChallenge("perfect")}>Ottimo</Button>
            </div>
          </div>
        ) : null}

        {flow[current].key === "feedback" ? (
          <div className="flex h-full flex-col">
            <h2 className="mb-1 text-lg font-semibold">Feedback + tutor</h2>
            <p className="mb-4 text-xs text-muted-foreground">Chiudi la skill solo dopo il feedback finale.</p>

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
                Chiedi un esempio pratico o un chiarimento prima di chiudere la skill.
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
                onClick={finish}
                disabled={isCompleted || tracking || !challengeResult || !reviewOutcome}
                className="w-full rounded-xl"
                variant={isCompleted ? "secondary" : "default"}
              >
                {isCompleted ? <><CheckCircle2 size={18} className="mr-2" /> Già completata</> : "Chiudi skill"}
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex gap-3 pt-2">
        <Button variant="outline" onClick={() => canPrev && setCurrent(current - 1)} disabled={!canPrev || tracking} className="h-11 flex-1 rounded-2xl gap-2">
          <ArrowLeft size={16} /> Indietro
        </Button>
        <Button onClick={() => canNext && setCurrent(current + 1)} disabled={!canNext || tracking} className="h-11 flex-1 rounded-2xl gap-2">
          Avanti <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default LessonStepper;
