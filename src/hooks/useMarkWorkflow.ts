import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { invokeWithAuth } from "@/lib/invokeWithAuth";
import { useAuth } from "@/contexts/AuthContext";

// Workflow types
export type WorkflowType = "onboarding" | "financial_plan" | "weekly_review";
export type WorkflowStatus = "active" | "completed" | "abandoned";

// State schemas for each workflow type
export interface OnboardingState {
  welcomeCompleted?: boolean;
  goals?: string[];
  patrimonioSetup?: boolean;
  firstSalvadanaio?: { nome: string; obiettivo: number } | null;
  suggestedLesson?: string | null;
}

export interface FinancialPlanState {
  analysisComplete?: boolean;
  currentSituation?: {
    totalePatrimonio: number;
    totaleSpeseMensili: number;
    capacitaRisparmio: number;
  };
  proposedPlan?: {
    goalAmount: number;
    monthlyTarget: number;
    timelineMonths: number;
  };
  salvadanaioPlan?: {
    id: string;
    nome: string;
  } | null;
  checkinsScheduled?: boolean;
}

export interface WeeklyReviewState {
  weekData?: {
    totaleSpese: number;
    mediaSettimana: number;
    anomalie: string[];
    progressoSalvadanai: Array<{ nome: string; percentuale: number }>;
  };
  suggerimenti?: string[];
  reviewComplete?: boolean;
}

export type WorkflowState = OnboardingState | FinancialPlanState | WeeklyReviewState;

export interface MarkWorkflow {
  id: string;
  user_id: string;
  workflow_type: WorkflowType;
  current_step: number;
  total_steps: number;
  state: WorkflowState;
  status: WorkflowStatus;
  created_at: string;
  updated_at: string;
}

// Step definitions for each workflow
export const WORKFLOW_STEPS: Record<WorkflowType, { title: string; description: string }[]> = {
  onboarding: [
    { title: "Benvenuto", description: "Scopri cosa può fare Finance Flow per te" },
    { title: "I tuoi obiettivi", description: "Raccontaci cosa vuoi raggiungere" },
    { title: "Il tuo patrimonio", description: "Imposta le tue categorie di patrimonio" },
    { title: "Primo salvadanaio", description: "Crea il tuo primo obiettivo di risparmio" },
    { title: "Inizia a imparare", description: "Ti suggeriamo la prima lezione" },
  ],
  financial_plan: [
    { title: "Analisi situazione", description: "Analizziamo la tua situazione attuale" },
    { title: "Proposta piano", description: "Ecco il piano personalizzato per te" },
    { title: "Creazione salvadanaio", description: "Creiamo il tuo obiettivo" },
    { title: "Check-in programmati", description: "Imposta i promemoria mensili" },
  ],
  weekly_review: [
    { title: "Riepilogo spese", description: "Le tue spese della settimana" },
    { title: "Anomalie rilevate", description: "Spese fuori dalla norma" },
    { title: "Progresso salvadanai", description: "Come stanno andando i tuoi obiettivi" },
    { title: "Suggerimenti", description: "Cosa puoi migliorare" },
  ],
};

interface UseMarkWorkflowReturn {
  // State
  activeWorkflow: MarkWorkflow | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  startWorkflow: (type: WorkflowType, initialState?: WorkflowState) => Promise<MarkWorkflow | null>;
  advanceStep: (newState?: Partial<WorkflowState>) => Promise<boolean>;
  goToStep: (step: number, newState?: Partial<WorkflowState>) => Promise<boolean>;
  updateState: (updates: Partial<WorkflowState>) => Promise<boolean>;
  completeWorkflow: () => Promise<boolean>;
  abandonWorkflow: () => Promise<boolean>;

  // Queries
  getActiveWorkflow: (type: WorkflowType) => Promise<MarkWorkflow | null>;
  hasCompletedWorkflow: (type: WorkflowType) => Promise<boolean>;

  // Helpers
  getCurrentStepInfo: () => { title: string; description: string } | null;
  getProgress: () => number;
  refresh: () => Promise<void>;
}

export function useMarkWorkflow(): UseMarkWorkflowReturn {
  const { user } = useAuth();
  const [activeWorkflow, setActiveWorkflow] = useState<MarkWorkflow | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch active workflow for current user
  const fetchActiveWorkflow = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("mark_workflows")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) throw fetchError;
      setActiveWorkflow(data as MarkWorkflow | null);
    } catch (err) {
      console.error("Error fetching workflow:", err);
      setError(err instanceof Error ? err.message : "Errore nel caricamento del workflow");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchActiveWorkflow();
  }, [fetchActiveWorkflow]);

  const startWorkflow = useCallback(async (
    type: WorkflowType,
    initialState: WorkflowState = {}
  ): Promise<MarkWorkflow | null> => {
    if (!user?.id) return null;

    setIsLoading(true);
    setError(null);

    try {
      // Abandon any existing active workflow of the same type
      await supabase
        .from("mark_workflows")
        .update({ status: "abandoned" })
        .eq("user_id", user.id)
        .eq("workflow_type", type)
        .eq("status", "active");

      const totalSteps = WORKFLOW_STEPS[type].length;

      const { data, error: insertError } = await supabase
        .from("mark_workflows")
        .insert({
          user_id: user.id,
          workflow_type: type,
          current_step: 0,
          total_steps: totalSteps,
          state: initialState,
          status: "active",
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const workflow = data as MarkWorkflow;
      setActiveWorkflow(workflow);
      return workflow;
    } catch (err) {
      console.error("Error starting workflow:", err);
      setError(err instanceof Error ? err.message : "Errore nell'avvio del workflow");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const advanceStep = useCallback(async (newState?: Partial<WorkflowState>): Promise<boolean> => {
    if (!activeWorkflow) return false;

    const nextStep = activeWorkflow.current_step + 1;

    // If we've reached the end, complete the workflow
    if (nextStep >= activeWorkflow.total_steps) {
      return completeWorkflow();
    }

    return goToStep(nextStep, newState);
  }, [activeWorkflow]);

  const goToStep = useCallback(async (
    step: number,
    newState?: Partial<WorkflowState>
  ): Promise<boolean> => {
    if (!activeWorkflow) return false;

    if (step < 0 || step >= activeWorkflow.total_steps) {
      setError("Step non valido");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedState = newState
        ? { ...activeWorkflow.state, ...newState }
        : activeWorkflow.state;

      const { data, error: updateError } = await supabase
        .from("mark_workflows")
        .update({
          current_step: step,
          state: updatedState,
        })
        .eq("id", activeWorkflow.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setActiveWorkflow(data as MarkWorkflow);
      return true;
    } catch (err) {
      console.error("Error advancing step:", err);
      setError(err instanceof Error ? err.message : "Errore nell'avanzamento");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [activeWorkflow]);

  const updateState = useCallback(async (updates: Partial<WorkflowState>): Promise<boolean> => {
    if (!activeWorkflow) return false;

    setIsLoading(true);
    setError(null);

    try {
      const updatedState = { ...activeWorkflow.state, ...updates };

      const { data, error: updateError } = await supabase
        .from("mark_workflows")
        .update({ state: updatedState })
        .eq("id", activeWorkflow.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setActiveWorkflow(data as MarkWorkflow);
      return true;
    } catch (err) {
      console.error("Error updating state:", err);
      setError(err instanceof Error ? err.message : "Errore nell'aggiornamento");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [activeWorkflow]);

  const completeWorkflow = useCallback(async (): Promise<boolean> => {
    if (!activeWorkflow) return false;

    setIsLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("mark_workflows")
        .update({ status: "completed" })
        .eq("id", activeWorkflow.id);

      if (updateError) throw updateError;

      setActiveWorkflow(null);
      return true;
    } catch (err) {
      console.error("Error completing workflow:", err);
      setError(err instanceof Error ? err.message : "Errore nel completamento");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [activeWorkflow]);

  const abandonWorkflow = useCallback(async (): Promise<boolean> => {
    if (!activeWorkflow) return false;

    setIsLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("mark_workflows")
        .update({ status: "abandoned" })
        .eq("id", activeWorkflow.id);

      if (updateError) throw updateError;

      setActiveWorkflow(null);
      return true;
    } catch (err) {
      console.error("Error abandoning workflow:", err);
      setError(err instanceof Error ? err.message : "Errore nell'abbandono");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [activeWorkflow]);

  const getActiveWorkflow = useCallback(async (type: WorkflowType): Promise<MarkWorkflow | null> => {
    if (!user?.id) return null;

    try {
      const { data, error: fetchError } = await supabase
        .from("mark_workflows")
        .select("*")
        .eq("user_id", user.id)
        .eq("workflow_type", type)
        .eq("status", "active")
        .maybeSingle();

      if (fetchError) throw fetchError;
      return data as MarkWorkflow | null;
    } catch (err) {
      console.error("Error getting workflow:", err);
      return null;
    }
  }, [user?.id]);

  const hasCompletedWorkflow = useCallback(async (type: WorkflowType): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { count, error: countError } = await supabase
        .from("mark_workflows")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("workflow_type", type)
        .eq("status", "completed");

      if (countError) throw countError;
      return (count ?? 0) > 0;
    } catch (err) {
      console.error("Error checking completed workflow:", err);
      return false;
    }
  }, [user?.id]);

  const getCurrentStepInfo = useCallback(() => {
    if (!activeWorkflow) return null;

    const steps = WORKFLOW_STEPS[activeWorkflow.workflow_type];
    return steps[activeWorkflow.current_step] ?? null;
  }, [activeWorkflow]);

  const getProgress = useCallback(() => {
    if (!activeWorkflow) return 0;
    return (activeWorkflow.current_step / activeWorkflow.total_steps) * 100;
  }, [activeWorkflow]);

  const refresh = useCallback(async () => {
    await fetchActiveWorkflow();
  }, [fetchActiveWorkflow]);

  return {
    activeWorkflow,
    isLoading,
    error,
    startWorkflow,
    advanceStep,
    goToStep,
    updateState,
    completeWorkflow,
    abandonWorkflow,
    getActiveWorkflow,
    hasCompletedWorkflow,
    getCurrentStepInfo,
    getProgress,
    refresh,
  };
}
