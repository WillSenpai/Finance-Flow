import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Users, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { invokeWithAuth } from "@/lib/invokeWithAuth";
import { toast } from "sonner";

type AdminUsageResponse = {
  period: {
    date_from: string;
    date_to: string;
    timezone: string;
  };
  summary: {
    tokens_total: number;
    requests_total: number;
    active_users: number;
    avg_tokens_per_request: number;
  };
  breakdown_detailed: {
    by_plan: Array<{ plan_type: "free" | "pro"; tokens: number; requests: number }>;
    by_feature: Array<{ feature: string; tokens: number; requests: number }>;
    by_model: Array<{ model: string; tokens: number; requests: number }>;
  };
  timeseries_daily: Array<{
    date: string;
    tokens: number;
    requests: number;
    active_users: number;
  }>;
  top_users: Array<{
    user_id: string;
    name: string | null;
    email: string | null;
    plan_type: "free" | "pro";
    tokens_in_range: number;
    requests_in_range: number;
    credits_available: number;
  }>;
};

const numberFmt = new Intl.NumberFormat("it-IT");

const PLAN_COLORS: Record<string, string> = {
  free: "#6b7280",
  pro: "#10b981",
};

function dateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysBetween(from: string, to: string): number {
  const fromDate = new Date(`${from}T00:00:00.000Z`);
  const toDate = new Date(`${to}T00:00:00.000Z`);
  const diff = toDate.getTime() - fromDate.getTime();
  return Math.floor(diff / 86_400_000) + 1;
}

function getPresetRange(days: number) {
  const to = new Date();
  const from = new Date(to);
  from.setDate(to.getDate() - (days - 1));
  return {
    from: dateInputValue(from),
    to: dateInputValue(to),
  };
}

const AdminAiAnalytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const defaultRange = useMemo(() => getPresetRange(30), []);
  const [dateFrom, setDateFrom] = useState(defaultRange.from);
  const [dateTo, setDateTo] = useState(defaultRange.to);

  const timezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Rome", []);

  const { data: isAdmin, isLoading: isLoadingAdmin } = useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      return Boolean(data);
    },
  });

  useEffect(() => {
    if (!isLoadingAdmin && isAdmin === false) {
      toast.error("Accesso riservato agli admin.");
      navigate("/profilo", { replace: true });
    }
  }, [isAdmin, isLoadingAdmin, navigate]);

  const rangeDays = useMemo(() => {
    if (!dateFrom || !dateTo) return 0;
    return daysBetween(dateFrom, dateTo);
  }, [dateFrom, dateTo]);

  const isRangeValid = dateFrom <= dateTo && rangeDays >= 1 && rangeDays <= 365;

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["admin-ai-analytics", dateFrom, dateTo, timezone],
    enabled: Boolean(isAdmin) && isRangeValid,
    queryFn: () =>
      invokeWithAuth<AdminUsageResponse>("ai-usage-admin", {
        body: {
          date_from: dateFrom,
          date_to: dateTo,
          timezone,
        },
      }),
  });

  const topFeatures = useMemo(() => data?.breakdown_detailed.by_feature.slice(0, 10) ?? [], [data]);
  const topModels = useMemo(() => data?.breakdown_detailed.by_model.slice(0, 10) ?? [], [data]);
  const topUsers = useMemo(() => data?.top_users.slice(0, 12) ?? [], [data]);

  const planPieData = useMemo(
    () =>
      (data?.breakdown_detailed.by_plan ?? []).map((item) => ({
        name: item.plan_type.toUpperCase(),
        value: item.tokens,
        plan_type: item.plan_type,
      })),
    [data],
  );

  const applyPreset = (days: number) => {
    const preset = getPresetRange(days);
    setDateFrom(preset.from);
    setDateTo(preset.to);
  };

  if (isLoadingAdmin || (isAdmin === false && !data)) {
    return <div className="px-5 pt-14 pb-6 text-sm text-muted-foreground">Verifica accesso admin...</div>;
  }

  return (
    <div className="px-5 pt-14 pb-8">
      <div className="mb-4 flex items-center gap-2">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate("/profilo")} className="rounded-xl p-2 hover:bg-muted">
          <ArrowLeft size={18} />
        </motion.button>
        <div>
          <h1 className="text-lg font-semibold">Analytics AI Admin</h1>
          <p className="text-xs text-muted-foreground">Consumi, richieste e utilizzo per feature/modello</p>
        </div>
      </div>

      <section className="mb-4 rounded-2xl border border-border/60 bg-card p-3">
        <p className="mb-2 text-xs font-semibold">Periodo</p>
        <div className="mb-3 flex flex-wrap gap-2">
          <button onClick={() => applyPreset(7)} className="rounded-lg border px-2.5 py-1 text-xs">7g</button>
          <button onClick={() => applyPreset(30)} className="rounded-lg border px-2.5 py-1 text-xs">30g</button>
          <button onClick={() => applyPreset(90)} className="rounded-lg border px-2.5 py-1 text-xs">90g</button>
          <button onClick={() => applyPreset(365)} className="rounded-lg border px-2.5 py-1 text-xs">365g</button>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <label className="text-xs">
            <span className="mb-1 block text-muted-foreground">Da</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full rounded-lg border bg-background px-2 py-1.5"
            />
          </label>
          <label className="text-xs">
            <span className="mb-1 block text-muted-foreground">A</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full rounded-lg border bg-background px-2 py-1.5"
            />
          </label>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground">Timezone: {timezone}</p>
          {!isRangeValid ? <p className="text-[11px] text-destructive">Range non valido (max 365 giorni).</p> : null}
        </div>
      </section>

      {isLoading || isFetching ? <p className="mb-4 text-xs text-muted-foreground">Caricamento analytics...</p> : null}
      {error ? (
        <div className="mb-4 rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
          Errore nel caricamento dati.
          <button className="ml-2 underline" onClick={() => void refetch()}>Riprova</button>
        </div>
      ) : null}

      {data ? (
        <>
          <section className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-2xl border border-border/60 bg-card p-3">
              <p className="text-[11px] text-muted-foreground">Token Totali</p>
              <p className="text-base font-semibold">{numberFmt.format(data.summary.tokens_total)}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-3">
              <p className="text-[11px] text-muted-foreground">Richieste</p>
              <p className="text-base font-semibold">{numberFmt.format(data.summary.requests_total)}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-3">
              <p className="text-[11px] text-muted-foreground">Utenti Attivi</p>
              <p className="text-base font-semibold">{numberFmt.format(data.summary.active_users)}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-3">
              <p className="text-[11px] text-muted-foreground">Token medi/richiesta</p>
              <p className="text-base font-semibold">{numberFmt.format(data.summary.avg_tokens_per_request)}</p>
            </div>
          </section>

          <section className="mb-4 rounded-2xl border border-border/60 bg-card p-3">
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold"><LineChartIcon size={14} /> Trend giornaliero</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.timeseries_daily} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="tokens" stroke="#2563eb" strokeWidth={2} dot={false} name="Tokens" />
                  <Line yAxisId="right" type="monotone" dataKey="requests" stroke="#10b981" strokeWidth={2} dot={false} name="Richieste" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-card p-3">
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold"><BarChart3 size={14} /> Consumi per feature</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topFeatures} margin={{ top: 8, right: 8, left: 0, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="feature" angle={-25} textAnchor="end" interval={0} height={70} tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="tokens" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-3">
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold"><PieChartIcon size={14} /> Free vs Pro</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={planPieData} dataKey="value" nameKey="name" outerRadius={90} label>
                      {planPieData.map((entry) => (
                        <Cell key={entry.name} fill={PLAN_COLORS[entry.plan_type] ?? "#94a3b8"} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-card p-3">
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold"><Cpu size={14} /> Utilizzo per modello</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topModels} margin={{ top: 8, right: 8, left: 0, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="model" angle={-25} textAnchor="end" interval={0} height={70} tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="tokens" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-3">
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold"><Users size={14} /> Top utenti</p>
              <div className="space-y-1.5 text-xs">
                {topUsers.map((u) => (
                  <div key={u.user_id} className="grid grid-cols-[1.5fr_64px_92px_70px] items-center gap-2 rounded-lg border border-border/50 bg-background/60 px-2 py-1.5">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{u.name || u.email || u.user_id}</p>
                      <p className="truncate text-[10px] text-muted-foreground">{u.email || u.user_id}</p>
                    </div>
                    <span className="text-center text-[10px] font-semibold uppercase">{u.plan_type}</span>
                    <span className="text-right">{numberFmt.format(u.tokens_in_range)}</span>
                    <span className="text-right text-muted-foreground">{numberFmt.format(u.requests_in_range)}</span>
                  </div>
                ))}
                {topUsers.length === 0 ? <p className="text-muted-foreground">Nessun dato nel range selezionato.</p> : null}
              </div>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
};

export default AdminAiAnalytics;
