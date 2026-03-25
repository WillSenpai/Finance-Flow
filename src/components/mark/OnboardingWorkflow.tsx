import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, X, Loader2, Target, Wallet, PiggyBank, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useMarkWorkflow, WORKFLOW_STEPS, type OnboardingState } from "@/hooks/useMarkWorkflow";
import { invokeWithAuth } from "@/lib/invokeWithAuth";
import { cn } from "@/lib/utils";

interface OnboardingWorkflowProps {
  onComplete?: () => void;
  onDismiss?: () => void;
}

interface GoalOption {
  id: string;
  label: string;
  emoji: string;
}

interface SalvadanaioSuggestion {
  nome: string;
  obiettivo: number;
  motivo: string;
}

interface LessonSuggestion {
  lessonId: string;
  lessonTitle: string;
  reason: string;
}

export function OnboardingWorkflow({ onComplete, onDismiss }: OnboardingWorkflowProps) {
  const navigate = useNavigate();
  const {
    activeWorkflow,
    isLoading,
    startWorkflow,
    advanceStep,
    updateState,
    completeWorkflow,
  } = useMarkWorkflow();

  const [welcomeMessage, setWelcomeMessage] = useState<string>("");
  const [goals, setGoals] = useState<GoalOption[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [salvadanaiSuggestions, setSalvadanaiSuggestions] = useState<SalvadanaioSuggestion[]>([]);
  const [selectedSalvadanaio, setSelectedSalvadanaio] = useState<SalvadanaioSuggestion | null>(null);
  const [customSalvadanaioName, setCustomSalvadanaioName] = useState("");
  const [customSalvadanaioGoal, setCustomSalvadanaioGoal] = useState<number>(1000);
  const [useCustomSalvadanaio, setUseCustomSalvadanaio] = useState(false);
  const [lessonSuggestion, setLessonSuggestion] = useState<LessonSuggestion | null>(null);
  const [stepLoading, setStepLoading] = useState(false);

  const state = (activeWorkflow?.state as OnboardingState) || {};
  const currentStep = activeWorkflow?.current_step ?? 0;
  const totalSteps = activeWorkflow?.total_steps ?? 5;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Initialize onboarding
  useEffect(() => {
    const init = async () => {
      if (!activeWorkflow) {
        await startWorkflow("onboarding");
      }
    };
    init();
  }, []);

  // Load data for current step
  useEffect(() => {
    const loadStepData = async () => {
      if (currentStep === 0 && !welcomeMessage) {
        setStepLoading(true);
        try {
          const result = await invokeWithAuth<{ message: string }>("mark-onboarding", {
            body: { action: "generate_welcome" },
          });
          setWelcomeMessage(result.message);
        } catch (err) {
          console.error("Error loading welcome:", err);
          setWelcomeMessage("Ciao! Sono Mark, il tuo coach finanziario. Iniziamo insieme questo percorso!");
        } finally {
          setStepLoading(false);
        }
      }

      if (currentStep === 1 && goals.length === 0) {
        setStepLoading(true);
        try {
          const result = await invokeWithAuth<{ goals: GoalOption[] }>("mark-onboarding", {
            body: { action: "generate_goals_suggestions" },
          });
          setGoals(result.goals);
        } catch (err) {
          console.error("Error loading goals:", err);
        } finally {
          setStepLoading(false);
        }
      }

      if (currentStep === 3 && salvadanaiSuggestions.length === 0) {
        setStepLoading(true);
        try {
          const result = await invokeWithAuth<{ suggestions: SalvadanaioSuggestion[] }>("mark-onboarding", {
            body: { action: "generate_salvadanaio_suggestion", goals: state.goals },
          });
          setSalvadanaiSuggestions(result.suggestions);
          if (result.suggestions.length > 0) {
            setSelectedSalvadanaio(result.suggestions[0]);
          }
        } catch (err) {
          console.error("Error loading salvadanaio suggestions:", err);
        } finally {
          setStepLoading(false);
        }
      }

      if (currentStep === 4 && !lessonSuggestion) {
        setStepLoading(true);
        try {
          const result = await invokeWithAuth<LessonSuggestion>("mark-onboarding", {
            body: { action: "generate_lesson_suggestion", goals: state.goals },
          });
          setLessonSuggestion(result);
        } catch (err) {
          console.error("Error loading lesson suggestion:", err);
        } finally {
          setStepLoading(false);
        }
      }
    };

    loadStepData();
  }, [currentStep, activeWorkflow]);

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId) ? prev.filter((g) => g !== goalId) : [...prev, goalId]
    );
  };

  const handleNextStep = async () => {
    setStepLoading(true);
    try {
      switch (currentStep) {
        case 0:
          await advanceStep({ welcomeCompleted: true });
          break;
        case 1:
          await advanceStep({ goals: selectedGoals });
          break;
        case 2:
          await advanceStep({ patrimonioSetup: true });
          break;
        case 3:
          if (useCustomSalvadanaio) {
            await advanceStep({
              firstSalvadanaio: {
                nome: customSalvadanaioName || "Obiettivo Risparmio",
                obiettivo: customSalvadanaioGoal,
              },
            });
          } else if (selectedSalvadanaio) {
            await advanceStep({
              firstSalvadanaio: {
                nome: selectedSalvadanaio.nome,
                obiettivo: selectedSalvadanaio.obiettivo,
              },
            });
          } else {
            await advanceStep({ firstSalvadanaio: null });
          }
          break;
        case 4:
          await completeWorkflow();
          onComplete?.();
          break;
      }
    } catch (err) {
      console.error("Error advancing step:", err);
    } finally {
      setStepLoading(false);
    }
  };

  const handleSkipSalvadanaio = async () => {
    setStepLoading(true);
    try {
      await advanceStep({ firstSalvadanaio: null });
    } finally {
      setStepLoading(false);
    }
  };

  const handleGoToPatrimonio = () => {
    navigate("/patrimonio/gestisci");
  };

  const handleGoToLesson = () => {
    if (lessonSuggestion) {
      navigate(`/accademia`);
    }
  };

  const stepInfo = WORKFLOW_STEPS.onboarding[currentStep];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-4xl">👋</span>
              </div>
            </div>
            {stepLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <p className="text-center text-lg leading-relaxed">{welcomeMessage}</p>
            )}
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center mb-4">
              <Target className="w-12 h-12 text-primary" />
            </div>
            <p className="text-center text-muted-foreground mb-4">
              Seleziona gli obiettivi che vuoi raggiungere
            </p>
            {stepLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => handleGoalToggle(goal.id)}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-all",
                      selectedGoals.includes(goal.id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <span className="text-xl mr-2">{goal.emoji}</span>
                    <span className="text-sm">{goal.label}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center">
              <Wallet className="w-12 h-12 text-primary" />
            </div>
            <p className="text-center text-muted-foreground">
              Ora configuriamo il tuo patrimonio iniziale. Potrai sempre modificarlo in seguito.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="font-medium">Il patrimonio si divide in:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>💵 <strong>Liquidità</strong> - Conti correnti, contanti</li>
                <li>📈 <strong>Soldi al Lavoro</strong> - Investimenti</li>
                <li>🏠 <strong>Cose di Valore</strong> - Auto, casa, oggetti</li>
              </ul>
            </div>
            <Button onClick={handleGoToPatrimonio} className="w-full" variant="outline">
              <Wallet className="w-4 h-4 mr-2" />
              Vai a Gestisci Patrimonio
            </Button>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center mb-2">
              <PiggyBank className="w-12 h-12 text-primary" />
            </div>
            <p className="text-center text-muted-foreground mb-4">
              Crea il tuo primo obiettivo di risparmio
            </p>

            {stepLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {!useCustomSalvadanaio && salvadanaiSuggestions.length > 0 && (
                  <div className="space-y-3">
                    {salvadanaiSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSalvadanaio(suggestion)}
                        className={cn(
                          "w-full p-4 rounded-lg border text-left transition-all",
                          selectedSalvadanaio === suggestion
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{suggestion.nome}</p>
                            <p className="text-sm text-muted-foreground">{suggestion.motivo}</p>
                          </div>
                          <p className="text-primary font-semibold">
                            €{suggestion.obiettivo.toLocaleString("it-IT")}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {useCustomSalvadanaio && (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <div>
                      <label className="text-sm font-medium">Nome obiettivo</label>
                      <Input
                        value={customSalvadanaioName}
                        onChange={(e) => setCustomSalvadanaioName(e.target.value)}
                        placeholder="Es. Fondo Emergenza"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Obiettivo (€)</label>
                      <Input
                        type="number"
                        value={customSalvadanaioGoal}
                        onChange={(e) => setCustomSalvadanaioGoal(Number(e.target.value))}
                        min={1}
                      />
                    </div>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUseCustomSalvadanaio(!useCustomSalvadanaio)}
                  className="w-full"
                >
                  {useCustomSalvadanaio ? "Usa un suggerimento" : "Crea obiettivo personalizzato"}
                </Button>
              </>
            )}
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-primary" />
            </div>

            {stepLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : lessonSuggestion ? (
              <>
                <div className="text-center">
                  <p className="text-lg font-medium mb-2">Ti consiglio di iniziare con:</p>
                  <Card className="border-primary/30">
                    <CardContent className="p-4">
                      <p className="font-semibold text-primary">{lessonSuggestion.lessonTitle}</p>
                      <p className="text-sm text-muted-foreground mt-1">{lessonSuggestion.reason}</p>
                    </CardContent>
                  </Card>
                </div>
                <Button onClick={handleGoToLesson} variant="outline" className="w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Vai all'Accademia
                </Button>
              </>
            ) : (
              <p className="text-center text-muted-foreground">
                Ottimo! Sei pronto per iniziare ad usare Finance Flow!
              </p>
            )}

            <div className="flex items-center justify-center pt-4">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <p className="text-center font-medium">Configurazione completata!</p>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (!activeWorkflow && !isLoading) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <CardHeader className="relative pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <CardTitle className="text-lg">Mark</CardTitle>
          </div>
          {onDismiss && (
            <Button variant="ghost" size="icon" onClick={onDismiss} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <CardDescription>{stepInfo?.title}</CardDescription>
        <div className="pt-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {currentStep + 1} di {totalSteps}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pb-6">
        <AnimatePresence mode="wait">
          <div key={currentStep} className="min-h-[280px]">
            {renderStepContent()}
          </div>
        </AnimatePresence>

        <div className="flex gap-3 mt-6">
          {currentStep === 3 && (
            <Button
              variant="outline"
              onClick={handleSkipSalvadanaio}
              disabled={stepLoading}
              className="flex-1"
            >
              Salta
            </Button>
          )}
          <Button
            onClick={handleNextStep}
            disabled={stepLoading || (currentStep === 1 && selectedGoals.length === 0)}
            className="flex-1"
          >
            {stepLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : currentStep === totalSteps - 1 ? (
              "Completa"
            ) : (
              <>
                Continua
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
