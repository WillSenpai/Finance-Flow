import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Target,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Loader2,
  PiggyBank,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { invokeWithAuth } from "@/lib/invokeWithAuth";
import { cn } from "@/lib/utils";

interface FinancialPlan {
  id: string;
  salvadanaio_id: string;
  goal_amount: number;
  monthly_target: number;
  timeline_months: number;
  checkpoints: Array<{
    month: number;
    targetAmount: number;
    checked: boolean;
    checkedAt: string | null;
  }>;
  status: "active" | "completed" | "abandoned";
  last_checkin_at: string | null;
  created_at: string;
  salvadanai?: {
    nome: string;
    attuale: number;
    obiettivo: number;
  };
}

interface AnalysisResult {
  analisi: string;
  capacitaRisparmio: number;
  suggerimenti: string[];
  pianiConsigliati: Array<{
    nome: string;
    obiettivo: number;
    mesi: number;
    motivazione: string;
  }>;
}

interface CheckinResult {
  progress: number;
  currentAmount: number;
  targetAmount: number;
  isCompleted: boolean;
  feedback: string;
}

interface FinancialPlanCardProps {
  plan?: FinancialPlan;
  showAnalysis?: boolean;
  onPlanCreated?: (plan: FinancialPlan) => void;
  onCheckinComplete?: (result: CheckinResult) => void;
  compact?: boolean;
}

export function FinancialPlanCard({
  plan,
  showAnalysis = false,
  onPlanCreated,
  onCheckinComplete,
  compact = false,
}: FinancialPlanCardProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [checkinResult, setCheckinResult] = useState<CheckinResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await invokeWithAuth<AnalysisResult>("mark-financial-plan", {
        body: { action: "analyze" },
      });
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nell'analisi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckin = async () => {
    if (!plan) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await invokeWithAuth<CheckinResult>("mark-financial-plan", {
        body: { action: "checkin", planId: plan.id },
      });
      setCheckinResult(result);
      onCheckinComplete?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nel check-in");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showAnalysis && !analysis) {
      loadAnalysis();
    }
  }, [showAnalysis]);

  // Calculate plan progress
  const calculateProgress = () => {
    if (!plan?.salvadanai) return 0;
    return Math.min(100, Math.round((plan.salvadanai.attuale / plan.goal_amount) * 100));
  };

  const progress = plan ? calculateProgress() : 0;
  const completedCheckpoints = plan?.checkpoints?.filter((c) => c.checked).length ?? 0;
  const totalCheckpoints = plan?.checkpoints?.length ?? 0;

  // Render analysis view
  if (showAnalysis) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Analisi Finanziaria</CardTitle>
          </div>
          <CardDescription>
            Mark analizza la tua situazione e ti propone un piano
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">Analizzo la tua situazione...</p>
            </div>
          ) : error ? (
            <div className="text-center py-6">
              <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="outline" onClick={loadAnalysis} className="mt-4">
                <RefreshCw className="w-4 h-4 mr-2" />
                Riprova
              </Button>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm">{analysis.analisi}</p>
              </div>

              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <PiggyBank className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Capacità di risparmio stimata</p>
                  <p className="text-2xl font-bold text-primary">
                    €{analysis.capacitaRisparmio.toLocaleString("it-IT")}/mese
                  </p>
                </div>
              </div>

              {analysis.suggerimenti.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Suggerimenti</h4>
                  <ul className="space-y-2">
                    {analysis.suggerimenti.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.pianiConsigliati.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Piani consigliati</h4>
                  <div className="space-y-3">
                    {analysis.pianiConsigliati.map((piano, i) => (
                      <button
                        key={i}
                        onClick={() => navigate("/patrimonio/salvadanai")}
                        className="w-full p-4 border rounded-lg text-left hover:border-primary/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{piano.nome}</p>
                            <p className="text-sm text-muted-foreground">{piano.motivazione}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">
                              €{piano.obiettivo.toLocaleString("it-IT")}
                            </p>
                            <p className="text-xs text-muted-foreground">{piano.mesi} mesi</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  // Render plan card (when a plan is provided)
  if (!plan) return null;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border rounded-lg"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="font-medium">{plan.salvadanai?.nome || "Piano"}</span>
          </div>
          <span className="text-sm font-semibold text-primary">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>€{(plan.salvadanai?.attuale ?? 0).toLocaleString("it-IT")}</span>
          <span>€{plan.goal_amount.toLocaleString("it-IT")}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">{plan.salvadanai?.nome || "Piano Finanziario"}</CardTitle>
          </div>
          {plan.status === "completed" && (
            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
              Completato
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress section */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>€{(plan.salvadanai?.attuale ?? 0).toLocaleString("it-IT")}</span>
            <span>€{plan.goal_amount.toLocaleString("it-IT")}</span>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Durata</p>
              <p className="text-sm font-medium">{plan.timeline_months} mesi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Target mensile</p>
              <p className="text-sm font-medium">€{plan.monthly_target.toLocaleString("it-IT")}</p>
            </div>
          </div>
        </div>

        {/* Checkpoints */}
        {totalCheckpoints > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">
              Checkpoint raggiunti: {completedCheckpoints}/{totalCheckpoints}
            </p>
            <div className="flex gap-1">
              {plan.checkpoints.map((cp, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 h-2 rounded-full",
                    cp.checked ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {/* Check-in result */}
        {checkinResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-3 rounded-lg",
              checkinResult.isCompleted ? "bg-green-50 border border-green-200" : "bg-muted/50"
            )}
          >
            <p className="text-sm">{checkinResult.feedback}</p>
          </motion.div>
        )}

        {/* Actions */}
        {plan.status === "active" && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleCheckin}
              disabled={isLoading}
              className="flex-1"
              variant="outline"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Check-in
                </>
              )}
            </Button>
            <Button
              onClick={() => navigate(`/patrimonio/salvadanai`)}
              variant="default"
              className="flex-1"
            >
              Vai al Salvadanaio
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {error && (
          <p className="text-xs text-destructive text-center">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}

// Hook to fetch active plans
export function useFinancialPlans() {
  const [plans, setPlans] = useState<FinancialPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const result = await invokeWithAuth<{ plans: FinancialPlan[] }>("mark-financial-plan", {
        body: { action: "get_active_plans" },
      });
      setPlans(result.plans);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nel caricamento");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return { plans, isLoading, error, refresh: fetchPlans };
}
