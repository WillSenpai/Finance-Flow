import { useState, useMemo, useRef } from "react";
import { Calculator, TrendingUp, PiggyBank, Clock, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const formatEuro = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } } } as const;
const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } } as const;

function buildProjection(attuale: number, obiettivo: number, monthlyExtra: number, months: number) {
  const data: { mese: number; label: string; attuale: number; extra: number }[] = [];
  const now = new Date();
  for (let i = 0; i <= months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i);
    const label = d.toLocaleDateString("it-IT", { month: "short", year: "2-digit" });
    data.push({
      mese: i,
      label,
      attuale: Math.min(attuale + i * 100, obiettivo),
      extra: Math.min(attuale + i * (100 + monthlyExtra), obiettivo),
    });
  }
  return data;
}

function estimateMonths(attuale: number, obiettivo: number, monthlySaving: number) {
  if (monthlySaving <= 0) return Infinity;
  const remaining = obiettivo - attuale;
  if (remaining <= 0) return 0;
  return Math.ceil(remaining / monthlySaving);
}

function estimateDate(months: number): string {
  if (months === Infinity || months === 0) return "—";
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toLocaleDateString("it-IT", { month: "long", year: "numeric" });
}

const WhatIfSimulator = () => {
  const { salvadanai, spese } = useUser();
  const [selectedIdx, setSelectedIdx] = useState("0");
  const [extraMonthly, setExtraMonthly] = useState(0);

  const salvadanaio = salvadanai[parseInt(selectedIdx)] || salvadanai[0];

  const baseMonthly = 100;
  const monthsBase = useMemo(() => estimateMonths(salvadanaio?.attuale || 0, salvadanaio?.obiettivo || 1, baseMonthly), [salvadanaio]);
  const monthsExtra = useMemo(() => estimateMonths(salvadanaio?.attuale || 0, salvadanaio?.obiettivo || 1, baseMonthly + extraMonthly), [salvadanaio, extraMonthly]);

  const projectionMonths = Math.min(Math.max(monthsBase, monthsExtra, 6) + 3, 60);
  const chartData = useMemo(
    () => salvadanaio ? buildProjection(salvadanaio.attuale, salvadanaio.obiettivo, extraMonthly, projectionMonths) : [],
    [salvadanaio, extraMonthly, projectionMonths]
  );

  // Analytics: monthly spending
  const monthlySpending = useMemo(() => {
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const monthly = spese.filter((s) => s.data.startsWith(thisMonth));
    return monthly.reduce((a, s) => a + s.importo, 0);
  }, [spese]);

  // Savings rate
  const savingsRate = useMemo(() => {
    const totalIncome = monthlySpending + baseMonthly + extraMonthly;
    if (totalIncome <= 0) return 0;
    return Math.round(((baseMonthly + extraMonthly) / totalIncome) * 100);
  }, [monthlySpending, extraMonthly]);

  // Completion percentage
  const completionPerc = salvadanaio ? Math.round((salvadanaio.attuale / salvadanaio.obiettivo) * 100) : 0;

  if (salvadanai.length === 0) {
    return (
      <div className="bg-card border border-border/50 rounded-2xl p-5 text-center">
        <p className="text-2xl mb-2">🔮</p>
        <p className="text-sm text-muted-foreground">Crea un salvadanaio per usare il simulatore</p>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      {/* Header */}
      <motion.div variants={item}>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Calculator size={20} className="text-primary" /> Simulatore What If
        </h2>
        <p className="text-muted-foreground text-xs mt-0.5">Scopri quanto prima raggiungerai il tuo obiettivo</p>
      </motion.div>

      {/* Salvadanaio selector */}
      <motion.div variants={item}>
        <label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Salvadanaio</label>
        <Select value={selectedIdx} onValueChange={setSelectedIdx}>
          <SelectTrigger className="rounded-xl h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {salvadanai.map((s, i) => (
              <SelectItem key={i} value={String(i)}>{s.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Quick stats */}
      <motion.div variants={item} className="grid grid-cols-3 gap-2">
        <div className="bg-card border border-border/50 rounded-2xl p-3 text-center">
          <PiggyBank size={16} className="text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Completato</p>
          <p className="text-sm font-bold">{completionPerc}%</p>
        </div>
        <div className="bg-card border border-border/50 rounded-2xl p-3 text-center">
          <Clock size={16} className="text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Mancano</p>
          <p className="text-sm font-bold">{formatEuro(salvadanaio.obiettivo - salvadanaio.attuale)}</p>
        </div>
        <div className="bg-card border border-border/50 rounded-2xl p-3 text-center">
          <TrendingUp size={16} className="text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Savings rate</p>
          <p className="text-sm font-bold">{savingsRate}%</p>
        </div>
      </motion.div>

      {/* Slider */}
      <motion.div variants={item}>
        <label className="text-xs text-muted-foreground uppercase tracking-widest mb-3 block">
          Risparmio mensile extra
        </label>
        <div className="flex items-center gap-3">
          <Slider
            value={[extraMonthly]}
            onValueChange={([v]) => setExtraMonthly(v)}
            min={0}
            max={1000}
            step={25}
            className="flex-1"
          />
          <div className="relative min-w-[90px]">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">+</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={5000}
              step={25}
              value={extraMonthly}
              onChange={(e) => {
                const val = Math.max(0, Math.min(5000, parseInt(e.target.value) || 0));
                setExtraMonthly(val);
              }}
              className="w-full h-9 rounded-xl border border-border bg-card pl-6 pr-2 text-sm font-bold text-right focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </motion.div>

      {/* Comparison cards */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border/50 rounded-2xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Senza extra</p>
          <p className="text-lg font-bold">{monthsBase === Infinity ? "∞" : `${monthsBase} mesi`}</p>
          <p className="text-[10px] text-muted-foreground mt-1">{estimateDate(monthsBase)}</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 text-center">
          <p className="text-xs text-primary mb-1">Con +{formatEuro(extraMonthly)}/mese</p>
          <p className="text-lg font-bold text-primary">{monthsExtra === Infinity ? "∞" : `${monthsExtra} mesi`}</p>
          <p className="text-[10px] text-primary/70 mt-1">{estimateDate(monthsExtra)}</p>
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div variants={item}>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Proiezione nel tempo</p>
        <div className="bg-card border border-border/50 rounded-2xl p-4">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={Math.max(1, Math.floor(projectionMonths / 6))} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => formatEuro(value)}
              />
              <ReferenceLine y={salvadanaio.obiettivo} stroke="hsl(var(--destructive))" strokeDasharray="5 5" label={{ value: "Obiettivo", fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Line type="monotone" dataKey="attuale" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} name="Attuale" />
              <Line type="monotone" dataKey="extra" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} name="Con extra" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Spending insight */}
      {monthlySpending > 0 && (
        <motion.div variants={item} className="bg-card border border-border/50 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
              <Zap size={18} className="text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Analisi spese</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Questo mese stai spendendo <span className="font-semibold text-foreground">{formatEuro(monthlySpending)}</span>.
                {extraMonthly > 0 && monthlySpending > extraMonthly
                  ? ` Riducendo le spese di ${formatEuro(extraMonthly)} potresti coprire il risparmio extra.`
                  : " Prova ad aumentare il risparmio per accelerare il tuo obiettivo."
                }
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Saved time badge */}
      {extraMonthly > 0 && monthsBase !== Infinity && monthsExtra < monthsBase && (
        <motion.div variants={item} className="bg-primary/10 border border-primary/20 rounded-2xl p-4 text-center">
          <p className="text-sm font-medium text-primary">
            🚀 Risparmi {monthsBase - monthsExtra} {monthsBase - monthsExtra === 1 ? "mese" : "mesi"} in meno!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WhatIfSimulator;
