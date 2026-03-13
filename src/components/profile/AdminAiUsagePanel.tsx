import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, BarChart3, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { invokeWithAuth } from "@/lib/invokeWithAuth";

type AdminUsageResponse = {
  period_start: string;
  totals: {
    credits_consumed_this_month: number;
  };
  breakdown: {
    by_plan: {
      free: number;
      pro: number;
    };
    by_feature: Array<{ feature: string; tokens: number }>;
  };
  users: Array<{
    user_id: string;
    name: string | null;
    email: string | null;
    plan_type: "free" | "pro";
    monthly_token_limit: number;
    tokens_used_this_month: number;
    credits_available: number;
  }>;
};

const numberFmt = new Intl.NumberFormat("it-IT");

export default function AdminAiUsagePanel() {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-ai-usage", user?.id],
    enabled: !!user,
    queryFn: () => invokeWithAuth<AdminUsageResponse>("ai-usage-admin", { body: {} }),
  });

  const topUsers = useMemo(() => (data?.users ?? []).slice(0, 20), [data?.users]);

  return (
    <section className="mb-6 rounded-3xl border border-primary/30 bg-primary/[0.03] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Admin · Consumo AI App</p>
          <p className="text-xs text-muted-foreground">Mese corrente, per controllo costi e pricing</p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          <ShieldCheck size={13} />
          Admin
        </div>
      </div>

      {isLoading ? <p className="text-xs text-muted-foreground">Caricamento KPI...</p> : null}
      {error ? <p className="text-xs text-destructive">Impossibile caricare KPI admin.</p> : null}

      {data ? (
        <>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-background/60 p-3">
              <p className="text-[11px] text-muted-foreground">Crediti consumati (mese)</p>
              <p className="text-lg font-semibold">{numberFmt.format(data.totals.credits_consumed_this_month)}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/60 p-3">
              <p className="text-[11px] text-muted-foreground">Consumo piano FREE</p>
              <p className="text-lg font-semibold">{numberFmt.format(data.breakdown.by_plan.free)}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/60 p-3">
              <p className="text-[11px] text-muted-foreground">Consumo piano PRO</p>
              <p className="text-lg font-semibold">{numberFmt.format(data.breakdown.by_plan.pro)}</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-border/60 bg-background/60 p-3">
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold"><BarChart3 size={14} /> Consumo per feature</p>
            <div className="space-y-1.5 text-xs">
              {data.breakdown.by_feature.slice(0, 8).map((item) => (
                <div key={item.feature} className="flex items-center justify-between">
                  <span>{item.feature}</span>
                  <span className="font-medium">{numberFmt.format(item.tokens)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-border/60 bg-background/60 p-3">
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold"><Users size={14} /> Crediti disponibili per utente</p>
            <div className="max-h-64 space-y-1.5 overflow-auto pr-1 text-xs">
              {topUsers.map((row) => (
                <div key={row.user_id} className="grid grid-cols-[1.3fr_52px_90px_90px] items-center gap-2 rounded-lg border border-border/50 bg-card/60 px-2 py-1.5">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{row.name || row.email || row.user_id}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{row.email || row.user_id}</p>
                  </div>
                  <span className="text-center uppercase text-[10px] font-semibold">{row.plan_type}</span>
                  <span className="text-right">{numberFmt.format(row.tokens_used_this_month)}</span>
                  <span className="text-right font-semibold text-primary">{numberFmt.format(row.credits_available)}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
