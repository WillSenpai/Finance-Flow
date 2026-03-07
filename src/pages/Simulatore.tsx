import { useState, useMemo } from "react";
import { ArrowLeft, Calculator } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const formatEuro = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } } as const;
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } } } as const;

function buildProjection(attuale: number, obiettivo: number, monthlyExtra: number, months: number) {
  const data: { mese: number; label: string; attuale: number; extra: number }[] = [];
  const now = new Date();
  for (let i = 0; i <= months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i);
    const label = d.toLocaleDateString("it-IT", { month: "short", year: "2-digit" });
    data.push({
      mese: i,
      label,
      attuale: Math.min(attuale + i * 100, obiettivo), // assume 100€/month base savings
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

const Simulatore = () => {
  const navigate = useNavigate();
  const { salvadanai } = useUser();
  const [selectedIdx, setSelectedIdx] = useState("0");
  const [extraMonthly, setExtraMonthly] = useState(0);

  const salvadanaio = salvadanai[parseInt(selectedIdx)] || salvadanai[0];

  const baseMonthly = 100; // assumed base monthly saving
  const monthsBase = useMemo(() => estimateMonths(salvadanaio?.attuale || 0, salvadanaio?.obiettivo || 1, baseMonthly), [salvadanaio]);
  const monthsExtra = useMemo(() => estimateMonths(salvadanaio?.attuale || 0, salvadanaio?.obiettivo || 1, baseMonthly + extraMonthly), [salvadanaio, extraMonthly]);

  const projectionMonths = Math.min(Math.max(monthsBase, monthsExtra, 6) + 3, 60);
  const chartData = useMemo(
    () => salvadanaio ? buildProjection(salvadanaio.attuale, salvadanaio.obiettivo, extraMonthly, projectionMonths) : [],
    [salvadanaio, extraMonthly, projectionMonths]
  );

  if (salvadanai.length === 0) {
    return (
      <motion.div className="px-5 pt-14 pb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <ArrowLeft size={18} /> Indietro
        </button>
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔮</p>
          <p className="text-sm text-muted-foreground">Crea un salvadanaio per usare il simulatore</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="px-5 pt-14 pb-4" variants={container} initial="hidden" animate="show">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft size={18} /> Indietro
      </button>

      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Calculator size={24} className="text-primary" /> Simulatore What If
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Scopri quanto prima raggiungerai il tuo obiettivo</p>
      </motion.div>

      {/* Salvadanaio selector */}
      <motion.div variants={item} className="mt-6">
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

      {/* Info card */}
      <motion.div variants={item} className="mt-4 bg-card border border-border/50 rounded-2xl p-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Attuale</span>
          <span className="font-semibold">{formatEuro(salvadanaio.attuale)}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-muted-foreground">Obiettivo</span>
          <span className="font-semibold">{formatEuro(salvadanaio.obiettivo)}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-muted-foreground">Da risparmiare</span>
          <span className="font-semibold text-primary">{formatEuro(salvadanaio.obiettivo - salvadanaio.attuale)}</span>
        </div>
      </motion.div>

      {/* Slider */}
      <motion.div variants={item} className="mt-6">
        <label className="text-xs text-muted-foreground uppercase tracking-widest mb-3 block">
          Risparmio mensile extra
        </label>
        <div className="flex items-center gap-4">
          <Slider
            value={[extraMonthly]}
            onValueChange={([v]) => setExtraMonthly(v)}
            min={0}
            max={1000}
            step={25}
            className="flex-1"
          />
          <span className="text-lg font-bold min-w-[80px] text-right">+{formatEuro(extraMonthly)}</span>
        </div>
      </motion.div>

      {/* Comparison */}
      <motion.div variants={item} className="mt-6 grid grid-cols-2 gap-3">
        <div className="bg-card border border-border/50 rounded-2xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Senza extra</p>
          <p className="text-lg font-bold">{monthsBase === Infinity ? "∞" : `${monthsBase} mesi`}</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 text-center">
          <p className="text-xs text-primary mb-1">Con +{formatEuro(extraMonthly)}/mese</p>
          <p className="text-lg font-bold text-primary">{monthsExtra === Infinity ? "∞" : `${monthsExtra} mesi`}</p>
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div variants={item} className="mt-6">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Proiezione nel tempo</p>
        <div className="bg-card border border-border/50 rounded-2xl p-4">
          <ResponsiveContainer width="100%" height={220}>
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

      {extraMonthly > 0 && monthsBase !== Infinity && monthsExtra < monthsBase && (
        <motion.div variants={item} className="mt-4 bg-primary/10 border border-primary/20 rounded-2xl p-4 text-center">
          <p className="text-sm font-medium text-primary">
            🚀 Risparmi {monthsBase - monthsExtra} {monthsBase - monthsExtra === 1 ? "mese" : "mesi"} in meno!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Simulatore;
