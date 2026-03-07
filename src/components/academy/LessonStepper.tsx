import { useState, useRef } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Step {
  title: string;
  content: string;
}

interface LessonStepperProps {
  markdown: string;
  isCompleted: boolean;
  onComplete: () => void;
  chatMessages: { role: "user" | "assistant"; content: string }[];
  chatInput: string;
  onChatInputChange: (val: string) => void;
  onSendChat: () => void;
  isChatLoading: boolean;
}

function parseSteps(markdown: string): Step[] {
  const sections = markdown.split(/(?=^###\s)/m).filter((s) => s.trim());
  if (sections.length === 0) return [{ title: "Lezione", content: markdown }];

  return sections.map((section) => {
    const match = section.match(/^###\s+(.+)/);
    const title = match ? match[1].trim() : "Sezione";
    const content = match ? section.replace(/^###\s+.+\n?/, "").trim() : section.trim();
    return { title, content };
  });
}

const swipeThreshold = 50;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

const LessonStepper = ({
  markdown,
  isCompleted,
  onComplete,
  chatMessages,
  chatInput,
  onChatInputChange,
  onSendChat,
  isChatLoading,
}: LessonStepperProps) => {
  const steps = parseSteps(markdown);
  const totalSteps = steps.length + 1; // +1 for chat/complete step
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isLastContent = current === steps.length - 1;
  const isChatStep = current === steps.length;

  const go = (next: number) => {
    if (next < 0 || next >= totalSteps) return;
    setDirection(next > current ? 1 : -1);
    setCurrent(next);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -swipeThreshold) go(current + 1);
    else if (info.offset.x > swipeThreshold) go(current - 1);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Progress bar */}
      <div className="flex gap-1.5 mb-5 px-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-colors duration-300"
            style={{
              backgroundColor: i <= current
                ? "hsl(var(--primary))"
                : "hsl(var(--muted))",
            }}
          />
        ))}
      </div>

      {/* Step counter */}
      <p className="text-xs text-muted-foreground mb-3 px-1">
        {current + 1} / {totalSteps}
      </p>

      {/* Card area */}
      <div className="flex-1 min-h-0 relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 overflow-y-auto"
          >
            {isChatStep ? (
              /* ---- Chat & Complete step ---- */
              <div className="bg-card border border-border/50 rounded-2xl p-5 h-full flex flex-col">
                <h2 className="text-lg font-semibold mb-1">💬 Hai domande?</h2>
                <p className="text-xs text-muted-foreground mb-4">
                  Se qualcosa non è chiaro, chiedi e ti verrà spiegato in modo semplice.
                </p>

                {chatMessages.length > 0 && (
                  <div className="space-y-3 mb-4 flex-1 overflow-y-auto">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                          msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}>
                          {msg.role === "assistant" ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                            </div>
                          ) : msg.content}
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                )}

                <div className="flex gap-2 mt-auto">
                  <Input
                    value={chatInput}
                    onChange={(e) => onChatInputChange(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSendChat()}
                    placeholder="Es: Puoi farmi un esempio pratico?"
                    className="flex-1 rounded-xl"
                    disabled={isChatLoading}
                  />
                  <Button
                    size="icon"
                    onClick={onSendChat}
                    disabled={!chatInput.trim() || isChatLoading}
                    className="rounded-xl h-10 w-10 flex-shrink-0"
                  >
                    {isChatLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  </Button>
                </div>

                <motion.div whileTap={{ scale: 0.97 }} className="mt-4">
                  <Button
                    onClick={onComplete}
                    disabled={!!isCompleted}
                    className="w-full rounded-2xl h-12 text-base gap-2"
                    variant={isCompleted ? "secondary" : "default"}
                  >
                    {isCompleted ? <><CheckCircle2 size={20} /> Completata!</> : "Segna come completata ✅"}
                  </Button>
                </motion.div>
              </div>
            ) : (
              /* ---- Content step ---- */
              <div className="bg-card border border-border/50 rounded-2xl p-5 min-h-full">
                <h2 className="text-lg font-semibold mb-4">{steps[current].title}</h2>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{steps[current].content}</ReactMarkdown>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-4 pt-2">
        <Button
          variant="outline"
          onClick={() => go(current - 1)}
          disabled={current === 0}
          className="flex-1 rounded-2xl h-11 gap-2"
        >
          <ArrowLeft size={16} /> Indietro
        </Button>
        <Button
          onClick={() => go(current + 1)}
          disabled={current === totalSteps - 1}
          className="flex-1 rounded-2xl h-11 gap-2"
        >
          Avanti <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default LessonStepper;
