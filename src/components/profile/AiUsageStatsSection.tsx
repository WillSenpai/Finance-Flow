import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Gauge, WalletCards, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type PlanRow = {
  plan_type?: "free" | "pro" | null;
  plan?: "free" | "pro" | null;
  monthly_token_limit: number | null;
  tokens_used_this_month: number | null;
};

function statValue(value: number) {
  return value.toLocaleString("it-IT");
}

export default function AiUsageStatsSection() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["ai-usage-self", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<PlanRow | null> => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("user_ai_plans" as never)
        .select("plan_type, plan, monthly_token_limit, tokens_used_this_month")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return (data as PlanRow | null) ?? null;
    },
  });

  const stats = useMemo(() => {
    const planType = data?.plan_type === "pro" || data?.plan === "pro" ? "pro" : "free";
    const total = Number(data?.monthly_token_limit ?? (planType === "pro" ? 5_000_000 : 500_000));
    const used = Number(data?.tokens_used_this_month ?? 0);
    const available = Math.max(total - used, 0);
    return { planType, total, used, available };
  }, [data]);

  return (
    <section className="mb-6 rounded-3xl border border-border/60 bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Statistiche Crediti AI</p>
          <p className="text-xs text-muted-foreground">Monitoraggio mensile del tuo piano Coach AI</p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          <Sparkles size={13} />
          {stats.planType.toUpperCase()}
        </div>
      </div>

      {isLoading ? (
        <p className="text-xs text-muted-foreground">Caricamento crediti...</p>
      ) : (
        <div className="grid grid-cols-1 gap-2.5">
          <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/50 px-3 py-2.5">
            <div className="flex items-center gap-2 text-sm">
              <WalletCards size={14} className="text-primary" />
              Crediti totali
            </div>
            <span className="text-sm font-semibold">{statValue(stats.total)}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/50 px-3 py-2.5">
            <div className="flex items-center gap-2 text-sm">
              <Activity size={14} className="text-primary" />
              Crediti usati
            </div>
            <span className="text-sm font-semibold">{statValue(stats.used)}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/5 px-3 py-2.5">
            <div className="flex items-center gap-2 text-sm">
              <Gauge size={14} className="text-primary" />
              Crediti disponibili
            </div>
            <span className="text-sm font-semibold text-primary">{statValue(stats.available)}</span>
          </div>
        </div>
      )}
    </section>
  );
}
