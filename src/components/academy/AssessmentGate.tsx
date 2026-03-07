import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { invokeWithAuth } from "@/lib/invokeWithAuth";

type Question = {
  id: string;
  prompt: string;
  options: string[];
  difficulty: number;
};

type AssessmentGateProps = {
  onCompleted: () => void;
};

const AssessmentGate = ({ onCompleted }: AssessmentGateProps) => {
  const [runId, setRunId] = useState<string | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [step, setStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(12);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progress = useMemo(() => Math.round((step / Math.max(totalSteps, 1)) * 100), [step, totalSteps]);

  const start = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await invokeWithAuth<any>("academy-assessment", { body: { action: "start" } });

      if (data?.assessment_completed) {
        setLoading(false);
        onCompleted();
        return;
      }

      if (!data?.run_id || !data?.question) {
        setError("Assessment non disponibile. Riprova tra poco.");
        setLoading(false);
        return;
      }

      setRunId(data.run_id);
      setStep(Number(data.step ?? 1));
      setTotalSteps(Number(data.total_steps ?? 12));
      setQuestion(data.question as Question);
      setSelectedOption(null);
      setLoading(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore caricamento assessment");
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!runId || !question || selectedOption === null || loading) return;
    setLoading(true);
    setError(null);

    try {
      const data = await invokeWithAuth<any>("academy-assessment", {
        body: {
          action: "answer",
          run_id: runId,
          question_id: question.id,
          selected_option: selectedOption,
        },
      });

      if (data?.done) {
        const completeData = await invokeWithAuth<any>("academy-assessment", {
          body: { action: "complete", run_id: runId },
        });

        if (completeData?.completed) {
          setLoading(false);
          onCompleted();
          return;
        }
      }

      if (!data?.question) {
        setError("Domanda successiva non trovata.");
        setLoading(false);
        return;
      }

      setQuestion(data.question as Question);
      setStep(Number(data.step ?? step + 1));
      setTotalSteps(Number(data.total_steps ?? totalSteps));
      setSelectedOption(null);
      setLoading(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore invio risposta");
      setLoading(false);
    }
  };

  useEffect(() => {
    start();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="px-5 pt-16 pb-6"
    >
      <Card className="border-primary/20 shadow-sm">
        <CardHeader>
          <Badge className="w-fit">Test iniziale obbligatorio</Badge>
          <CardTitle className="text-2xl">Prima di iniziare, facciamo un check rapido</CardTitle>
          <CardDescription>
            12 domande adattive per personalizzare il tuo percorso skill-by-skill.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Progresso assessment</span>
              <span>{step}/{totalSteps}</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {question ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Difficoltà {question.difficulty}/5</p>
              <p className="text-base font-medium leading-snug">{question.prompt}</p>
              <div className="grid gap-2">
                {question.options.map((option, idx) => {
                  const active = selectedOption === idx;
                  return (
                    <button
                      key={`${question.id}-${idx}`}
                      type="button"
                      onClick={() => setSelectedOption(idx)}
                      className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                        active
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border/70 bg-card text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              <Button onClick={submitAnswer} disabled={selectedOption === null || loading} className="w-full rounded-xl">
                {loading ? "Invio..." : "Continua"}
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
              {loading ? "Carico la prima domanda..." : "Sto preparando il test..."}
            </div>
          )}

          {error ? (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AssessmentGate;
