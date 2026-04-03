import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Landmark,
  Minus,
  Receipt,
  Trash2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import WhatIfSimulator from "@/components/WhatIfSimulator";
import { useUser } from "@/hooks/useUser";
import { usePoints } from "@/contexts/PointsContext";
import type { Passivita } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useSharedWorkspace } from "@/hooks/useSharedWorkspace";
import { cn } from "@/lib/utils";
import { createPassivita } from "@/lib/passivita";
import { maybeRecordSnapshot, loadSnapshots } from "@/lib/patrimonioSnapshots";
import { isAssetStale, loadAssetMetadata } from "@/lib/assetMetadata";

const formatEuro = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
} as const;

const shellSurface = "rounded-[2.25rem] border border-border/60 bg-card shadow-[0_18px_42px_-32px_hsl(var(--foreground)/0.28)]";
const innerSurface = "rounded-[1.85rem]";
const capsule = "rounded-full";

function clampPercentage(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function formatFreshness(date: string | null) {
  if (!date) return "Aggiorna per vedere il quadro reale";

  const d = new Date(date);
  const diffMs = Date.now() - d.getTime();
  const days = Math.max(0, Math.floor(diffMs / 86400000));

  if (days === 0) return "Aggiornato oggi";
  if (days === 1) return "Aggiornato ieri";
  const label = d.toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" });
  return `Aggiornato il ${label}`;
}

/** Differenza patrimonio netto rispetto all'ultimo snapshot di un mese precedente (per hero mockup v2). */
function netWorthDeltaFromSnapshots(
  snapshots: ReturnType<typeof loadSnapshots>,
  currentMonthKey: string,
  currentNetWorth: number,
): { delta: number | null; pct: number | null } {
  const prior = [...snapshots]
    .filter((s) => s.month < currentMonthKey)
    .sort((a, b) => a.month.localeCompare(b.month))
    .pop();
  if (prior === undefined) return { delta: null, pct: null };
  const delta = currentNetWorth - prior.netWorth;
  const base = Math.abs(prior.netWorth);
  const pct = base > 1e-6 ? (delta / base) * 100 : null;
  return { delta, pct };
}

// Category metadata for mockup styling
const CAT_META: Record<string, { subtitle: string; iconBg: string }> = {
  "liquidità":    { subtitle: "Contanti · Conto corrente",     iconBg: "#e8f4e8" },
  "investimenti": { subtitle: "ETF · Azioni · Obbligazioni",   iconBg: "#e8eef8" },
  "immobili":     { subtitle: "Quota appartamento",            iconBg: "#f8f0e8" },
  "crypto":       { subtitle: "Bitcoin · ETH",                 iconBg: "#f0e8f8" },
  "pensione":     { subtitle: "Fondo pensione · TFR",         iconBg: "#f8e8e8" },
  "pensione / tfr": { subtitle: "Fondo pensione · TFR",        iconBg: "#f8e8e8" },
  "beni":         { subtitle: "Oggetti di valore · Auto",      iconBg: "#f8f8e8" },
};

const PASSIVITA_ICONS: Record<string, string> = {
  mutuo: "🏠", finanziamento: "💸", carta: "💳",
};

function WealthHero({
  netWorth,
  totalAssets,
  totalLiabilities,
  freshnessLabel,
  monthlyDelta,
  monthlyDeltaPct,
  onPrimaryAction,
}: {
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  freshnessLabel: string;
  monthlyDelta: number | null;
  monthlyDeltaPct: number | null;
  onPrimaryAction: () => void;
}) {
  const deltaPositive = monthlyDelta === null || monthlyDelta >= 0;
  const pctSuffix =
    monthlyDelta !== null && monthlyDeltaPct !== null && Number.isFinite(monthlyDeltaPct)
      ? ` · ${monthlyDeltaPct >= 0 ? "+" : ""}${monthlyDeltaPct.toLocaleString("it-IT", { maximumFractionDigits: 1, minimumFractionDigits: 1 })}%`
      : "";
  return (
    <motion.div variants={item} className="mx-4 mt-4">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#7a6348] to-[#9e845f] text-white p-6 shadow-2xl">

        {/* Decorative depth */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-36 w-36 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-black/10" />

        {/* Row 1: label + freshness badge */}
        <div className="relative flex items-center justify-between mb-2">
          <p className="text-[11px] uppercase tracking-[0.1em] opacity-60 font-semibold">Patrimonio Netto</p>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            <span className="text-[10px] font-semibold opacity-90">{freshnessLabel}</span>
          </div>
        </div>

        {/* Row 2: net worth value */}
        <p className="relative text-[44px] font-bold leading-none tracking-tight">
          {formatEuro(netWorth)}
        </p>

        {/* Row 3: monthly delta (optional) */}
        {monthlyDelta !== null && (
          <div className="relative mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/12 px-2.5 py-1">
            <span className={cn("text-[12px] font-semibold", deltaPositive ? "text-green-300" : "text-red-300")}>
              {deltaPositive ? "↑" : "↓"} {deltaPositive ? "+" : ""}{formatEuro(monthlyDelta)} questo mese{pctSuffix}
            </span>
          </div>
        )}

        {/* Row 4: stat chips */}
        <div className="relative mt-5 grid grid-cols-2 gap-2.5">
          <div className="rounded-[1rem] bg-white/10 p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-300 opacity-80" />
              <p className="text-[10px] uppercase tracking-[0.06em] opacity-60 font-semibold">Asset totali</p>
            </div>
            <p className="text-[18px] font-bold leading-none">{formatEuro(totalAssets)}</p>
          </div>
          <div className="rounded-[1rem] bg-white/10 p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className={cn(
                "h-1.5 w-1.5 rounded-full opacity-80",
                totalLiabilities > 0 ? "bg-red-300" : "bg-white/40",
              )} />
              <p className="text-[10px] uppercase tracking-[0.06em] opacity-60 font-semibold">Passività</p>
            </div>
            <p
              className="text-[18px] font-bold leading-none"
              style={{ color: totalLiabilities > 0 ? "#ff9999" : "inherit" }}
            >
              {totalLiabilities > 0 ? `–${formatEuro(totalLiabilities)}` : formatEuro(0)}
            </p>
          </div>
        </div>

        {/* Row 5: CTA */}
        <button
          type="button"
          onClick={onPrimaryAction}
          className="relative mt-4 w-full rounded-[0.9rem] border border-white/25 bg-white/20 py-3 text-center text-[13px] font-bold tracking-wide text-white"
        >
          + Aggiungi o aggiorna →
        </button>
      </div>
    </motion.div>
  );
}

function GuidedInsight({
  isBeginner,
  onOpenLesson,
}: {
  isBeginner: boolean;
  onOpenLesson: () => void;
}) {
  if (!isBeginner) return null;

  return (
    <motion.section variants={item} className={`mt-6 ${shellSurface} p-5`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-11 w-11 items-center justify-center ${innerSurface} bg-accent text-accent-foreground`}>
          <BookOpen size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Passo consigliato</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Se vuoi capire come leggere meglio questa pagina, parti da una lezione breve e torna qui subito dopo.
          </p>
        </div>
      </div>

      <Button variant="outline" className="mt-4 h-11 w-full rounded-[1.2rem]" onClick={onOpenLesson}>
        Apri la lezione base
      </Button>
    </motion.section>
  );
}

function WhatIfModule({
  onOpen,
  hasGoals,
}: {
  onOpen: () => void;
  hasGoals: boolean;
}) {
  return (
    <motion.section variants={item} className="mt-5">
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onOpen}
        className="w-full rounded-[1.5rem] border border-border/50 bg-white p-4 text-left shadow-sm"
      >
        <p className="text-[11px] uppercase tracking-[0.07em] text-muted-foreground font-semibold mb-2">
          Strumenti
        </p>
        <p className="text-[15px] font-bold text-[#2d2416] leading-snug">
          {hasGoals
            ? "E se mettessi qualcosa in più ogni mese? Scopri quando ci arrivi."
            : "Hai qualcosa da mettere da parte? Simula il tuo piano."}
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5">
          <span className="text-[12px] font-bold text-primary">
            {hasGoals ? "Simula il piano →" : "Crea un obiettivo →"}
          </span>
        </div>
      </motion.button>
    </motion.section>
  );
}

const TIPO_LABELS: Record<Passivita["tipo"], string> = {
  mutuo: "Mutuo",
  finanziamento: "Finanziamento",
  carta: "Carta di credito",
};

function AssetCategoriesSection({
  categorie,
  totalAssets,
  onGestisci,
}: {
  categorie: { nome: string; valore: number; colore: string; emoji: string }[];
  totalAssets: number;
  onGestisci: () => void;
}) {
  return (
    <motion.section variants={item} className="px-4 mt-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] uppercase tracking-[0.07em] text-muted-foreground font-semibold">Le tue categorie</span>
        <button type="button" onClick={onGestisci} className="text-[13px] font-semibold text-primary">Gestisci →</button>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {categorie.map((cat) => {
          const share = totalAssets > 0 ? Math.max(0, Math.min(100, Math.round((cat.valore / totalAssets) * 100))) : 0;
          const stale = isAssetStale(cat.nome);
          const meta = CAT_META[cat.nome.toLowerCase()] ?? { subtitle: "", iconBg: "#f4ede3" };
          return (
            <button
              key={cat.nome}
              type="button"
              onClick={onGestisci}
              className="rounded-[1.15rem] bg-white p-4 text-left transition-transform active:scale-[0.97] shadow-sm"
            >
              <div
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-xl mb-2.5"
                style={{ background: meta.iconBg }}
              >
                {stale ? <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-orange-400" /> : null}
                {cat.emoji}
              </div>
              <p className="text-[13px] font-bold text-[#2d2416]">{cat.nome}</p>
              <p className="text-base font-bold text-[#2d2416] mt-0.5">{formatEuro(cat.valore)}</p>
              {meta.subtitle && <p className="text-[11px] text-[#9e8a72] mt-0.5">{meta.subtitle}</p>}
              <div className="mt-2.5 h-[3px] rounded-full bg-[#f0e8dc]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${share}%`, backgroundColor: cat.colore }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </motion.section>
  );
}

function PassivitaSection({
  passivita,
  onAdd,
  onDelete,
}: {
  passivita: Passivita[];
  onAdd: (p: Omit<Passivita, "id">) => void;
  onDelete: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<Passivita["tipo"]>("finanziamento");
  const [importoResiduo, setImportoResiduo] = useState("");
  const [rataMensile, setRataMensile] = useState("");
  const [dataFine, setDataFine] = useState("");

  const handleSubmit = () => {
    const nome_ = nome.trim();
    if (!nome_) return;
    const importo = parseFloat(importoResiduo) || 0;
    if (importo <= 0) return;
    onAdd({ nome: nome_, tipo, importoResiduo: importo, rataMensile: parseFloat(rataMensile) || 0, dataFine });
    setNome(""); setImportoResiduo(""); setRataMensile(""); setDataFine("");
    setShowForm(false);
  };

  return (
    <motion.section variants={item} className="px-4 mt-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] uppercase tracking-[0.07em] text-muted-foreground font-semibold">Passività</span>
        <button type="button" onClick={() => setShowForm(true)} className="text-[13px] font-semibold text-primary">
          + Aggiungi →
        </button>
      </div>

      <div className="rounded-[1.25rem] bg-white overflow-hidden shadow-sm">
        {passivita.length === 0 && !showForm && (
          <div className="px-4 py-5 text-center text-sm text-muted-foreground">
            Nessuna passività registrata.
          </div>
        )}
        {passivita.map((p, idx) => (
          <div key={p.id} className={cn("flex items-center gap-3 px-4 py-3", idx < passivita.length - 1 || showForm ? "border-b border-[#f0e8dc]" : "")}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#fff0f0] text-base">
              {PASSIVITA_ICONS[p.tipo] ?? "💸"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-[#2d2416]">{p.nome}</p>
              <p className="text-[11px] text-[#9e8a72]">
                {TIPO_LABELS[p.tipo]}
                {p.rataMensile > 0 && ` · –${formatEuro(p.rataMensile)}/mese`}
                {p.dataFine && ` · Scade ${new Date(p.dataFine).toLocaleDateString("it-IT", { month: "short", year: "numeric" })}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-[#c0392b]">–{formatEuro(p.importoResiduo)}</span>
              <button type="button" onClick={() => onDelete(p.id)} className="text-muted-foreground/40 hover:text-destructive p-0.5">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}

        <AnimatePresence initial={false}>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden p-4 space-y-3 border-t border-[#f0e8dc]"
            >
              <Input placeholder="Nome (es. Mutuo casa)" value={nome} onChange={(e) => setNome(e.target.value)} className="rounded-xl bg-background" />
              <div className="grid grid-cols-3 gap-2">
                {(["mutuo", "finanziamento", "carta"] as Passivita["tipo"][]).map((t) => (
                  <button key={t} type="button" onClick={() => setTipo(t)}
                    className={cn("rounded-full px-3 py-2 text-xs font-medium border transition-colors",
                      tipo === t ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground"
                    )}>
                    {TIPO_LABELS[t]}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                  <Input type="number" placeholder="Importo residuo" value={importoResiduo} onChange={(e) => setImportoResiduo(e.target.value)} className="pl-7 rounded-xl bg-background" />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                  <Input type="number" placeholder="Rata mensile" value={rataMensile} onChange={(e) => setRataMensile(e.target.value)} className="pl-7 rounded-xl bg-background" />
                </div>
              </div>
              <Input type="date" value={dataFine} onChange={(e) => setDataFine(e.target.value)} className="rounded-xl bg-background" />
              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1 rounded-xl h-10">Aggiungi</Button>
                <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-xl h-10"><Minus size={14} /></Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

type TrendPeriod = "1M" | "3M" | "6M" | "1A";

function TrendChart({ snapshots }: { snapshots: ReturnType<typeof loadSnapshots> }) {
  const [period, setPeriod] = useState<TrendPeriod>("6M");
  const periodMonths: Record<TrendPeriod, number> = { "1M": 1, "3M": 3, "6M": 6, "1A": 12 };

  const filteredSnapshots = snapshots.slice(-periodMonths[period]);

  if (filteredSnapshots.length < 2) {
    const singleValue = snapshots[0]?.netWorth;
    return (
      <motion.section variants={item} className="px-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] uppercase tracking-[0.07em] text-muted-foreground font-semibold">Andamento</span>
        </div>
        <div className="rounded-[1.25rem] bg-white p-5 shadow-sm text-center">
          <p className="text-sm text-muted-foreground">
            {singleValue !== undefined
              ? `Primo valore: ${formatEuro(singleValue)}. Il grafico apparirà dal mese prossimo.`
              : "Il grafico si costruisce automaticamente mese per mese."}
          </p>
        </div>
      </motion.section>
    );
  }

  const data = filteredSnapshots.map((s) => {
    const [year, month] = s.month.split("-");
    const label = new Date(Number(year), Number(month) - 1).toLocaleDateString("it-IT", { month: "short", year: "2-digit" });
    return { label, valore: s.netWorth };
  });

  const minValue = Math.min(...data.map((d) => d.valore));
  const maxValue = Math.max(...data.map((d) => d.valore));

  const firstVal = data[0].valore;
  const lastVal = data[data.length - 1].valore;

  return (
    <motion.section variants={item} className="px-4 mt-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] uppercase tracking-[0.07em] text-muted-foreground font-semibold">Andamento</span>
        <span className="text-[13px] font-semibold text-primary">Storico →</span>
      </div>
      <div className="rounded-[1.25rem] bg-white p-5 shadow-sm">
        <div className="flex gap-1 mb-4">
          {(["1M", "3M", "6M", "1A"] as TrendPeriod[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={cn(
                "flex-1 rounded-[10px] py-1.5 text-xs font-semibold text-center transition-colors",
                period === p ? "bg-[#8b7355] text-white" : "text-[#9e8a72]"
              )}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="h-[100px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b7355" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#8b7355" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e8dc" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#9e8a72" }} axisLine={false} tickLine={false} />
              <YAxis domain={[minValue * 0.95, maxValue * 1.05]} tick={{ fontSize: 10, fill: "#9e8a72" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} width={28} />
              <Tooltip formatter={(v: number) => [formatEuro(v), "Patrimonio netto"]} contentStyle={{ borderRadius: "1rem", border: "1px solid #f0e8dc", background: "white", fontSize: 12 }} />
              <Area type="monotone" dataKey="valore" stroke="#8b7355" strokeWidth={2.5} fill="url(#trendGrad)" dot={false} activeDot={{ r: 4, fill: "#8b7355" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[11px] text-[#9e8a72] text-right mt-2">
          {data[0].label}: {formatEuro(firstVal)} → {data[data.length-1].label}: {formatEuro(lastVal)}
        </p>
      </div>
    </motion.section>
  );
}

function CondivisoSummary({
  hasActiveWorkspace,
  members,
  sharedSpese,
  sharedPatrimonioTotale,
  assetCondivisiCount,
  onOpen,
  onSetup,
}: {
  hasActiveWorkspace: boolean;
  members: { userId: string; name: string; status: string }[];
  sharedSpese: Array<{ data: string; importo: number }>;
  /** Totale asset nello spazio condiviso (categorie + investimenti), come nel mockup. */
  sharedPatrimonioTotale: number;
  assetCondivisiCount: number;
  onOpen: () => void;
  onSetup: () => void;
}) {
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const speseThisMonth = sharedSpese
    .filter((s) => s.data.startsWith(thisMonth))
    .reduce((acc, s) => acc + s.importo, 0);

  const activeMembers = members.filter((m) => m.status === "active");

  return (
    <motion.section variants={item} className="px-4 mt-5 mb-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] uppercase tracking-[0.07em] text-muted-foreground font-semibold">Condiviso</span>
        <button type="button" onClick={hasActiveWorkspace ? onOpen : onSetup} className="text-[13px] font-semibold text-primary">
          Vai →
        </button>
      </div>

      <button
        type="button"
        onClick={hasActiveWorkspace ? onOpen : onSetup}
        className="w-full text-left rounded-[1.25rem] overflow-hidden shadow-sm"
        style={{ background: "linear-gradient(135deg, #2d5016, #4a7c2a)" }}
      >
        <div className="p-4 text-white">
          {hasActiveWorkspace ? (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] opacity-70">Patrimonio di coppia</p>
                  <p className="text-[28px] font-bold mt-1 leading-none">
                    {formatEuro(sharedPatrimonioTotale)}
                  </p>
                </div>
                <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px]">
                  {activeMembers.length} {activeMembers.length === 1 ? "membro" : "membri"}
                </span>
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                {activeMembers.slice(0, 3).map((m, i) => (
                  <div key={m.userId} className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1.5 text-xs">
                    <span className="h-2 w-2 rounded-full" style={{ background: i === 0 ? "#7fff7f" : "#ffcc7f" }} />
                    {m.name}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2.5 mt-3">
                <div className="rounded-xl bg-white/12 p-2.5">
                  <p className="text-[10px] opacity-70">Asset condivisi</p>
                  <p className="text-base font-bold mt-0.5">{assetCondivisiCount}</p>
                </div>
                <div className="rounded-xl bg-white/12 p-2.5">
                  <p className="text-[10px] opacity-70">Spese mese</p>
                  <p className="text-base font-bold mt-0.5">{speseThisMonth > 0 ? formatEuro(speseThisMonth) : "0 €"}</p>
                </div>
                <div className="rounded-xl bg-white/12 p-2.5">
                  <p className="text-[10px] opacity-70">Bilancio</p>
                  <p className="text-base font-bold mt-0.5" style={{ color: "#7fff7f" }}>In pari</p>
                </div>
              </div>
            </>
          ) : (
            <div className="py-2">
              <p className="text-[11px] opacity-70">Nessuno spazio attivo</p>
              <p className="text-base font-semibold mt-1">Configura il patrimonio condiviso →</p>
            </div>
          )}
        </div>
      </button>
    </motion.section>
  );
}

function ActionPickerDrawer({
  open,
  onClose,
  onAsset,
  onSpesa,
}: {
  open: boolean;
  onClose: () => void;
  onAsset: () => void;
  onSpesa: () => void;
}) {
  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent className="rounded-t-[2rem]">
        <div className="px-5 pb-10 pt-2">
          <DrawerHeader className="px-0 pb-5">
            <DrawerTitle className="text-[17px] font-semibold text-left">Cosa vuoi fare?</DrawerTitle>
          </DrawerHeader>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onAsset}
              className="flex flex-col items-center gap-3 rounded-[1.5rem] border border-border/60 bg-card p-5 text-center shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[#f4ede3]">
                <Landmark size={22} className="text-[#7a6348]" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#2d2416]">Aggiorna asset</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">Modifica il valore di un asset patrimoniale</p>
              </div>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onSpesa}
              className="flex flex-col items-center gap-3 rounded-[1.5rem] border border-border/60 bg-card p-5 text-center shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[#f0e8f8]">
                <Receipt size={22} className="text-[#7a4a9e]" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#2d2416]">Aggiungi spesa</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">Registra una nuova uscita economica</p>
              </div>
            </motion.button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

// Solo queste categorie contano come asset patrimoniali (evita voci reddito tipo "Stipendio").
const ASSET_CATEGORY_NAMES = new Set([
  "liquidità", "investimenti", "immobili", "crypto", "pensione", "tfr", "pensione / tfr",
  "beni", "liquidita", "soldi al lavoro", "cose di valore",
]);

function isAssetCategory(nome: string): boolean {
  return ASSET_CATEGORY_NAMES.has(nome.toLowerCase());
}

const Patrimonio = () => {
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [actionPickerOpen, setActionPickerOpen] = useState(false);
  const { userData, categorie, salvadanai, investimenti, lastPatrimonioUpdate, passivita, setPassivita, loadingData } =
    useUser();
  const { awardPoints } = usePoints();
  const navigate = useNavigate();
  const {
    hasActiveWorkspace,
    members: sharedMembers,
    spese: sharedSpese,
    categorie: sharedPatrimonioCategorie,
    investimenti: sharedPatrimonioInvestimenti,
  } = useSharedWorkspace();

  const sharedPatrimonioTotale = useMemo(
    () =>
      sharedPatrimonioCategorie.reduce((acc, c) => acc + c.valore, 0) +
      sharedPatrimonioInvestimenti.reduce((acc, i) => acc + i.valore, 0),
    [sharedPatrimonioCategorie, sharedPatrimonioInvestimenti],
  );

  const assetCondivisiCount = useMemo(() => {
    const metaMap = loadAssetMetadata();
    return categorie.filter((c) => {
      const meta = metaMap[c.nome.toLowerCase()];
      return meta?.coProprietà?.attivo === true;
    }).length;
  }, [categorie]);
  const isBeginner = userData.level === "beginner";

  // Snapshot storico: riletto a ogni render così l'hero vede subito il nuovo punto dopo maybeRecordSnapshot.
  const snapshots = loadSnapshots();

  useEffect(() => {
    awardPoints("review_patrimonio");
  }, [awardPoints]);

  // Asset totals — use only known asset categories to avoid income entries (fix "Stipendio" bug)
  const totalCategories = categorie
    .filter((c) => isAssetCategory(c.nome))
    .reduce((acc, c) => acc + c.valore, 0);
  const totalInvestments = investimenti.reduce((acc, i) => acc + i.valore, 0);
  const totalAssets = totalCategories + totalInvestments;
  const totalLiabilities = passivita.reduce((acc, p) => acc + p.importoResiduo, 0);
  const netWorth = totalAssets - totalLiabilities;

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  // Record monthly snapshot after assets are computed
  useEffect(() => {
    if (totalAssets > 0 || totalLiabilities > 0) {
      maybeRecordSnapshot(totalAssets, totalLiabilities);
    }
  }, [totalAssets, totalLiabilities]);

  const freshnessLabel = formatFreshness(lastPatrimonioUpdate);
  const { delta: netWorthDelta, pct: netWorthDeltaPct } = netWorthDeltaFromSnapshots(snapshots, thisMonth, netWorth);

  if (loadingData) return null;

  const handleAddPassivita = (data: Omit<Passivita, "id">) => {
    setPassivita([...passivita, createPassivita(data)]);
  };
  const handleDeletePassivita = (id: string) => {
    setPassivita(passivita.filter((p) => p.id !== id));
  };

  return (
    <motion.div className="px-5 pt-14 pb-4" variants={container} initial="hidden" animate="show">

      <WealthHero
        netWorth={netWorth}
        totalAssets={totalAssets}
        totalLiabilities={totalLiabilities}
        freshnessLabel={freshnessLabel}
        monthlyDelta={netWorthDelta}
        monthlyDeltaPct={netWorthDeltaPct}
        onPrimaryAction={() => setActionPickerOpen(true)}
      />

      <TrendChart snapshots={snapshots} />

      <AssetCategoriesSection
        categorie={categorie.filter((c) => isAssetCategory(c.nome))}
        totalAssets={totalAssets}
        onGestisci={() => navigate("/patrimonio/gestisci")}
      />

      <PassivitaSection
        passivita={passivita}
        onAdd={handleAddPassivita}
        onDelete={handleDeletePassivita}
      />

      <CondivisoSummary
        hasActiveWorkspace={hasActiveWorkspace}
        members={sharedMembers}
        sharedSpese={sharedSpese}
        sharedPatrimonioTotale={sharedPatrimonioTotale}
        assetCondivisiCount={assetCondivisiCount}
        onOpen={() => navigate("/patrimonio/condiviso")}
        onSetup={() => navigate("/patrimonio/condivisione")}
      />

      <GuidedInsight isBeginner={isBeginner} onOpenLesson={() => navigate("/lezione/1")} />

      <WhatIfModule hasGoals={salvadanai.length > 0} onOpen={() => setSimulatorOpen(true)} />

      <Drawer open={simulatorOpen} onOpenChange={setSimulatorOpen}>
        <DrawerContent className="max-h-[90vh] rounded-t-[2rem]">
          <div className="overflow-y-auto px-5 pb-6 pt-2">
            <DrawerHeader className="px-0">
              <DrawerTitle className="text-base text-left">Simulatore What If</DrawerTitle>
            </DrawerHeader>
            <WhatIfSimulator />
          </div>
        </DrawerContent>
      </Drawer>

      <ActionPickerDrawer
        open={actionPickerOpen}
        onClose={() => setActionPickerOpen(false)}
        onAsset={() => { setActionPickerOpen(false); navigate("/patrimonio/gestisci"); }}
        onSpesa={() => { setActionPickerOpen(false); navigate("/patrimonio/spese"); }}
      />
    </motion.div>
  );
};

export default Patrimonio;
