import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Ellipsis,
  Mail,
  Minus,
  PiggyBank,
  Plus,
  Receipt,
  Sparkles,
  Trash2,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Sector, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import WhatIfSimulator from "@/components/WhatIfSimulator";
import { useUser } from "@/hooks/useUser";
import { usePoints } from "@/contexts/PointsContext";
import { useAuth } from "@/contexts/AuthContext";
import type { CategoriaSpesa, Passivita, Salvadanaio, Spesa } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useSharedWorkspace } from "@/hooks/useSharedWorkspace";
import { cn } from "@/lib/utils";
import { AnalyticsEvents, trackEvent } from "@/lib/posthog";
import { createPassivita } from "@/lib/passivita";
import { maybeRecordSnapshot, loadSnapshots } from "@/lib/patrimonioSnapshots";
import { isAssetStale } from "@/lib/assetMetadata";
import {
  getPatrimonioSectionPreference,
  setPatrimonioSectionPreference,
  type PatrimonioSection,
} from "@/lib/patrimonioSectionPreference";

const formatEuro = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const formatExpenseEuro = (n: number) => (n === 0 ? formatEuro(0) : formatEuro(-Math.abs(n)));

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

const sectionMeta: Record<PatrimonioSection, { title: string; description: string; emptyEmoji: string }> = {
  salvadanai: {
    title: "Salvadanai in primo piano",
    description: "Tieni vicini i tuoi obiettivi e usa il simulatore per capire come arrivarci prima.",
    emptyEmoji: "🐷",
  },
  spese: {
    title: "Spese in primo piano",
    description: "Controlla subito dove stai spendendo e apri il dettaglio solo quando serve.",
    emptyEmoji: "💸",
  },
};

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

function formatMonthLabel() {
  return new Date().toLocaleDateString("it-IT", { month: "long" });
}

function AllocationTooltip({
  active,
  payload,
  total,
}: {
  active?: boolean;
  payload?: Array<{ payload: { nome: string; valore: number; colore: string } }>;
  total: number;
}) {
  if (!active || !payload?.length) return null;

  const entry = payload[0]?.payload;
  if (!entry) return null;

  const share = total > 0 ? clampPercentage((entry.valore / total) * 100) : 0;

  return (
    <div className="rounded-[1.1rem] border border-border/70 bg-card px-3 py-2.5 shadow-[0_18px_34px_-24px_hsl(var(--foreground)/0.35)]">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.colore }} />
        <span className="text-xs font-semibold text-foreground">{entry.nome}</span>
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-foreground">{formatEuro(entry.valore)}</span>
        <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{share}%</span>
      </div>
    </div>
  );
}

type ActiveAllocationShapeProps = {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload?: { nome?: string; valore?: number };
};

function renderActiveAllocationShape(props: ActiveAllocationShapeProps) {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
  } = props;

  return (
    <g>
      <circle cx={cx} cy={cy} r={outerRadius + 8} fill={fill} opacity={0.12} />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 4}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="hsl(var(--card))"
        strokeWidth={4}
        cornerRadius={12}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 8}
        outerRadius={outerRadius + 11}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.85}
        cornerRadius={12}
      />
      <title>{`${payload?.nome ?? "Categoria"}: ${formatEuro(payload?.valore ?? 0)}`}</title>
    </g>
  );
}

function WealthHero({
  netWorth,
  totalAssets,
  totalLiabilities,
  freshnessLabel,
  heroTitle,
  actionLabel,
  onPrimaryAction,
  monthlySpending,
  activeGoals,
  activeAssets,
  primaryActionHint,
}: {
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  freshnessLabel: string;
  heroTitle: string;
  actionLabel: string;
  onPrimaryAction: () => void;
  monthlySpending: number;
  activeGoals: number;
  activeAssets: number;
  primaryActionHint: string;
}) {
  return (
    <div className="mt-2">
      <p className="mb-2 text-[18px] font-semibold uppercase tracking-[0.24em] text-primary/75">Gestisci le Tue Finanze</p>

      <motion.section
        variants={item}
        className="relative overflow-hidden rounded-[2.7rem] bg-primary text-primary-foreground shadow-[0_28px_80px_-38px_hsl(var(--foreground)/0.56)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsla(0,0%,100%,0.24),transparent_34%),radial-gradient(circle_at_bottom_left,hsla(0,0%,100%,0.16),transparent_30%)]" />
        <div className="absolute -right-10 top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-6 top-28 h-20 w-20 rounded-full bg-black/10 blur-2xl" />
        <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,hsla(0,0%,100%,0.08),transparent)]" />

        <div className="relative p-5 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.22em] text-primary-foreground/60">Patrimonio Netto</p>
                <div className="mt-2 flex items-end gap-3">
                  <h1 className="text-[2.85rem] font-semibold leading-none tracking-[-0.05em] sm:text-[3.4rem]">
                    {formatEuro(netWorth)}
                  </h1>
                  <span className="mb-1 hidden rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/72 sm:inline-flex">
                    Snapshot
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3 text-[12px] text-primary-foreground/75">
                  <span>Asset: <span className="font-semibold text-primary-foreground">{formatEuro(totalAssets)}</span></span>
                  <span className="opacity-40">|</span>
                  <span>Passività: <span className="font-semibold text-primary-foreground/85">{totalLiabilities > 0 ? `−${formatEuro(totalLiabilities)}` : formatEuro(0)}</span></span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/10 px-3.5 py-2 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-white/80" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/85">
                  {freshnessLabel}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              <div className="rounded-[1.7rem] border border-white/12 bg-white/10 p-3.5 backdrop-blur-md">
                <p className="text-[10px] uppercase tracking-[0.18em] text-primary-foreground/60">Spese mese</p>
                <p className="mt-2 text-lg font-semibold tracking-tight">{formatExpenseEuro(monthlySpending)}</p>
              </div>
              <div className="rounded-[1.7rem] border border-white/12 bg-white/10 p-3.5 backdrop-blur-md">
                <p className="text-[10px] uppercase tracking-[0.18em] text-primary-foreground/60">Obiettivi</p>
                <p className="mt-2 text-lg font-semibold tracking-tight">{activeGoals}</p>
              </div>
              <div className="col-span-2 rounded-[1.7rem] border border-white/12 bg-white/10 p-3.5 backdrop-blur-md sm:col-span-1">
                <p className="text-[10px] uppercase tracking-[0.18em] text-primary-foreground/60">Asset attivi</p>
                <p className="mt-2 text-lg font-semibold tracking-tight">{activeAssets}</p>
              </div>
            </div>

            <div className="rounded-[2rem] bg-card/96 p-3.5 text-card-foreground shadow-[inset_0_1px_0_hsla(0,0%,100%,0.4)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Prossimo passo</p>
                  <p className="mt-1 text-sm font-semibold leading-6">{primaryActionHint}</p>
                </div>
                <Button className="h-12 rounded-[1.35rem] px-5 text-sm shadow-[0_14px_30px_-22px_hsl(var(--primary)/0.75)]" onClick={onPrimaryAction}>
                  {actionLabel} <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

function ActionCluster({
  activeSection,
  onSectionChange,
  onOpenSalvadanai,
  onOpenInvestimenti,
  onOpenSpese,
  onOpenPatrimonio,
  onOpenWhatIf,
  hasGoals,
}: {
  activeSection: PatrimonioSection;
  onSectionChange: (section: PatrimonioSection) => void;
  onOpenSalvadanai: () => void;
  onOpenInvestimenti: () => void;
  onOpenSpese: () => void;
  onOpenPatrimonio: () => void;
  onOpenWhatIf: () => void;
  hasGoals: boolean;
}) {
  const shortcuts = [
    {
      label: "Salvadanai",
      icon: PiggyBank,
      eyebrow: activeSection === "salvadanai" ? "Focus attivo" : "Risparmio",
      primaryAction: onOpenSalvadanai,
      primaryLabel: "Apri salvadanai",
      items: [
        { label: "Apri salvadanai", action: onOpenSalvadanai, shortcut: "Vai" },
        ...(activeSection !== "salvadanai"
          ? [{ label: "Metti in vista rapida", action: () => onSectionChange("salvadanai"), shortcut: "Focus" }]
          : []),
        ...(hasGoals ? [{ label: "Apri What If", action: onOpenWhatIf, shortcut: "Sim" }] : []),
      ],
    },
    {
      label: "Investimenti",
      icon: TrendingUp,
      eyebrow: "Mercati",
      primaryAction: onOpenInvestimenti,
      primaryLabel: "Apri investimenti",
      items: [
        { label: "Apri investimenti", action: onOpenInvestimenti, shortcut: "Vai" },
        { label: "Aggiorna patrimonio", action: onOpenPatrimonio, shortcut: "Sync" },
      ],
    },
    {
      label: "Spese",
      icon: Receipt,
      eyebrow: activeSection === "spese" ? "Focus attivo" : "Controllo",
      primaryAction: onOpenSpese,
      primaryLabel: "Apri spese",
      items: [
        { label: "Apri spese", action: onOpenSpese, shortcut: "Vai" },
        ...(activeSection !== "spese"
          ? [{ label: "Metti in vista rapida", action: () => onSectionChange("spese"), shortcut: "Focus" }]
          : []),
      ],
    },
  ];

  return (
    <motion.section variants={item} className="mt-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {shortcuts.map(({ label, icon: Icon, eyebrow, items, primaryAction, primaryLabel }) => (
          <motion.div
            key={label}
            variants={item}
            className={`flex items-center gap-2.5 ${innerSurface} border border-border/60 bg-card p-2.5 shadow-[0_12px_28px_-24px_hsl(var(--foreground)/0.32)]`}
          >
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={primaryAction}
              className="flex min-w-0 flex-1 items-center gap-3 rounded-[1.5rem] px-2 py-1.5 text-left transition-colors hover:bg-muted/55"
              aria-label={primaryLabel}
            >
              <div className={`flex h-10 w-10 items-center justify-center ${innerSurface} bg-muted text-foreground`}>
                <Icon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-[11px] text-muted-foreground">{eyebrow}</p>
              </div>
            </motion.button>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0 rounded-[1.1rem] border-border/70 bg-background/80 text-muted-foreground hover:bg-accent hover:text-foreground"
                  aria-label={`Apri menu ${label}`}
                >
                  <Ellipsis size={16} />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" sideOffset={10} className="w-64 rounded-[1.35rem] border-border/60 p-2">
                <DropdownMenuLabel className="px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {label}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {items.map((itemConfig) => (
                  <DropdownMenuItem
                    key={`${label}-${itemConfig.label}`}
                    onClick={itemConfig.action}
                    className="rounded-[1rem] px-3 py-2.5"
                  >
                    {itemConfig.label}
                    <DropdownMenuShortcut>{itemConfig.shortcut}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

type AllocationEntry = { nome: string; valore: number; colore: string };

function AllocationSnapshot({
  total,
  chartData,
  topCategoryName,
  topCategoryValue,
  isEmpty,
  hiddenBucketsCount,
  hiddenBucketsValue,
}: {
  total: number;
  chartData: AllocationEntry[];
  topCategoryName: string;
  topCategoryValue: number;
  isEmpty: boolean;
  hiddenBucketsCount: number;
  hiddenBucketsValue: number;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setSelectedIndex(0);
    setHoveredIndex(null);
  }, [chartData]);

  const activeIndex = hoveredIndex ?? selectedIndex;
  const activeEntry = chartData[activeIndex] ?? chartData[0];
  const activeShare = activeEntry && total > 0 ? clampPercentage((activeEntry.valore / total) * 100) : 0;
  const calloutLabel = isEmpty ? topCategoryName : activeEntry?.nome ?? topCategoryName;

  return (
    <motion.section variants={item} className={`mt-6 ${shellSurface} p-5`}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Distribuzione</p>
          <h2 className="mt-1 text-lg font-semibold">Dove vive il tuo patrimonio</h2>
        </div>
        <div className={`${capsule} bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground`}>
          Totale {formatEuro(total)}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-5 sm:grid sm:grid-cols-[14.5rem_1fr] sm:items-center">
        <div className="relative flex min-h-[12rem] items-center justify-center px-2 py-2 sm:px-0">
          <div className="relative h-40 w-40">
            <div className="pointer-events-none absolute inset-[14%] rounded-full bg-[radial-gradient(circle,hsla(0,0%,100%,0.5),transparent_68%)]" />
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="valore"
                  nameKey="nome"
                  cx="50%"
                  cy="50%"
                  innerRadius={44}
                  outerRadius={66}
                  paddingAngle={2}
                  cornerRadius={10}
                  activeIndex={activeIndex}
                  activeShape={renderActiveAllocationShape}
                  onMouseEnter={(_, index) => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={(_, index) => setSelectedIndex(index)}
                  stroke="hsl(var(--card))"
                  strokeWidth={4}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.nome} fill={entry.colore} />
                  ))}
                </Pie>
                <Tooltip
                  cursor={false}
                  allowEscapeViewBox={{ x: true, y: true }}
                  wrapperStyle={{ zIndex: 30, pointerEvents: "none" }}
                  content={<AllocationTooltip total={total} />}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {isEmpty ? "Nessun dato" : "Focus"}
              </span>
              <span className="mt-1 max-w-[6.5rem] text-center text-sm font-semibold leading-4">
                {calloutLabel}
              </span>
              {!isEmpty ? (
                <span className="mt-2 rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {activeShare}% quota
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {chartData.map((entry, index) => {
            const share = total > 0 ? clampPercentage((entry.valore / total) * 100) : 0;
            const isActive = activeEntry?.nome === entry.nome;

            return (
              <button
                key={entry.nome}
                type="button"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(index)}
                onBlur={() => setHoveredIndex(null)}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  `${innerSurface} w-full bg-background/80 px-3.5 py-3 text-left transition-all`,
                  isActive
                    ? "border border-border/70 shadow-[0_16px_34px_-28px_hsl(var(--foreground)/0.34)]"
                    : "border border-transparent hover:border-border/50",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.colore, boxShadow: `0 0 0 4px ${entry.colore}22` }} />
                    <span className="text-sm font-medium">{entry.nome}</span>
                  </div>
                  <span className="text-xs font-semibold">{formatEuro(entry.valore)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
                  <span>{share}% del totale</span>
                  <span>{entry.nome === topCategoryName ? "Quota principale" : isActive ? "In evidenza" : "Tocca per evidenziare"}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${share}%`, backgroundColor: entry.colore }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className={`mt-4 ${innerSurface} bg-muted/70 px-4 py-3`}>
        {isEmpty ? (
          <p className="text-xs text-muted-foreground">
            Non hai ancora asset valorizzati. Inizia da liquidita, beni o investimenti e questa vista si aggiornera da sola.
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              La quota piu pesante oggi è <span className="font-semibold text-foreground">{topCategoryName}</span> con{" "}
              <span className="font-semibold text-foreground">{formatEuro(topCategoryValue)}</span>.
            </p>
            {hiddenBucketsCount > 0 ? (
              <p className="text-xs text-muted-foreground">
                Questa vista mostra i primi 4 bucket. Gli altri {hiddenBucketsCount} valgono in totale{" "}
                <span className="font-semibold text-foreground">{formatEuro(hiddenBucketsValue)}</span>.
              </p>
            ) : null}
          </div>
        )}
      </div>
    </motion.section>
  );
}

function SalvadanaiSectionContent({
  salvadanai,
  onOpenManager,
}: {
  salvadanai: Salvadanaio[];
  onOpenManager: () => void;
}) {
  if (salvadanai.length === 0) {
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onOpenManager}
        className={`w-full ${innerSurface} border border-dashed border-border bg-background/70 p-5 text-left`}
      >
        <p className="text-2xl">🐷</p>
        <p className="mt-3 text-sm font-semibold">Crea il tuo primo salvadanaio</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Imposta un obiettivo concreto e usa il simulatore per capire quanto ti serve ogni mese.
        </p>
      </motion.button>
    );
  }

  const topSavings = [...salvadanai]
    .map((item) => ({
      ...item,
      percentage: clampPercentage((item.attuale / Math.max(item.obiettivo, 1)) * 100),
    }))
    .sort((a, b) => b.attuale - a.attuale)
    .slice(0, 3);

  return (
    <div className="space-y-3">
      {topSavings.map((saving) => (
        <motion.div
          key={saving.nome}
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={`${innerSurface} border border-border/60 bg-background/80 p-4`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{saving.nome}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatEuro(saving.attuale)} di {formatEuro(saving.obiettivo)}
              </p>
            </div>
            <span className={`${capsule} bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground`}>
              In evidenza
            </span>
          </div>

          <Progress value={saving.percentage} className="mt-4 h-2.5 rounded-full" />

          <div className="mt-3 flex items-center justify-between gap-3 text-[11px]">
            <span className="text-muted-foreground">{saving.percentage}% completato</span>
            <span className="font-semibold text-foreground">
              Mancano {formatEuro(Math.max(0, saving.obiettivo - saving.attuale))}
            </span>
          </div>
        </motion.div>
      ))}

      <Button variant="outline" className="h-11 w-full rounded-[1.2rem]" onClick={onOpenManager}>
        Gestisci tutti i salvadanai
      </Button>
    </div>
  );
}

function SpeseSectionContent({
  spese,
  categorieSpese,
  onOpenManager,
}: {
  spese: Spesa[];
  categorieSpese: CategoriaSpesa[];
  onOpenManager: () => void;
}) {
  if (spese.length === 0) {
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onOpenManager}
        className={`w-full ${innerSurface} border border-dashed border-border bg-background/70 p-5 text-left`}
      >
        <p className="text-2xl">💸</p>
        <p className="mt-3 text-sm font-semibold">Traccia la prima spesa</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Parti da una categoria semplice e lascia che questa vista ti mostri subito il peso del mese.
        </p>
      </motion.button>
    );
  }

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthly = spese.filter((expense) => expense.data.startsWith(thisMonth));
  const total = monthly.reduce((sum, expense) => sum + expense.importo, 0);
  const byCategory = monthly.reduce<Record<string, number>>((acc, expense) => {
    acc[expense.categoriaId] = (acc[expense.categoriaId] || 0) + expense.importo;
    return acc;
  }, {});

  const topCategories = Object.entries(byCategory)
    .map(([categoryId, value]) => ({
      categoryId,
      value,
      category: categorieSpese.find((item) => item.id === categoryId),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  if (monthly.length === 0) {
    return (
      <div className="space-y-3">
        <div className={`${innerSurface} border border-border/60 bg-background/80 p-4`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Spese di {formatMonthLabel()}</p>
              <p className="mt-1 text-xs text-muted-foreground">Questo mese non hai ancora registrato movimenti.</p>
            </div>
            <span className="text-lg font-semibold">{formatEuro(0)}</span>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onOpenManager}
          className={`w-full ${innerSurface} border border-dashed border-border bg-background/70 p-5 text-left`}
        >
          <p className="text-2xl">🧾</p>
          <p className="mt-3 text-sm font-semibold">Aggiungi la prima spesa del mese</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Hai gia uno storico, ma il mese corrente e ancora vuoto. Registra una spesa per riattivare questa vista rapida.
          </p>
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className={`${innerSurface} border border-border/60 bg-background/80 p-4`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Spese di {formatMonthLabel()}</p>
            <p className="mt-1 text-xs text-muted-foreground">Le categorie piu pesanti entrano qui prima di tutto.</p>
          </div>
          <span className="text-lg font-semibold text-destructive">{formatExpenseEuro(total)}</span>
        </div>
      </div>

      {topCategories.map(({ categoryId, value, category }) => {
        const percentage = total > 0 ? clampPercentage((value / total) * 100) : 0;

        return (
          <div key={categoryId} className={`${innerSurface} border border-border/60 bg-background/80 p-4`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center ${innerSurface} border text-base`}
                  style={{ borderColor: category?.colore ?? "hsl(var(--border))" }}
                >
                  {category?.emoji ?? "📦"}
                </div>
                <div>
                  <p className="text-sm font-semibold">{category?.nome ?? "Altro"}</p>
                  <p className="text-[11px] text-muted-foreground">{percentage}% del mese</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-destructive">{formatExpenseEuro(value)}</span>
            </div>
          </div>
        );
      })}

      <Button variant="outline" className="h-11 w-full rounded-[1.2rem]" onClick={onOpenManager}>
        Apri tutte le spese
      </Button>
    </div>
  );
}

function FocusSection({
  activeSection,
  onSectionChange,
  salvadanai,
  spese,
  categorieSpese,
  onOpenSalvadanai,
  onOpenSpese,
}: {
  activeSection: PatrimonioSection;
  onSectionChange: (section: PatrimonioSection) => void;
  salvadanai: Salvadanaio[];
  spese: Spesa[];
  categorieSpese: CategoriaSpesa[];
  onOpenSalvadanai: () => void;
  onOpenSpese: () => void;
}) {
  const meta = sectionMeta[activeSection];

  return (
    <motion.section
      variants={item}
      className={`mt-6 ${shellSurface} p-5`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Vista rapida</p>
          <h2 className="mt-1 text-lg font-semibold">{meta.title}</h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{meta.description}</p>
        </div>
        <span className="text-2xl">{meta.emptyEmoji}</span>
      </div>

      <div className={`mt-4 inline-flex ${capsule} border border-border bg-muted/70 p-1`}>
        {(["salvadanai", "spese"] as PatrimonioSection[]).map((section) => (
          <button
            key={section}
            onClick={() => onSectionChange(section)}
            className={cn(
              `${capsule} px-4 py-2 text-sm font-medium transition-colors`,
              activeSection === section ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
            )}
          >
            {section === "salvadanai" ? "Salvadanai" : "Spese"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="mt-4"
        >
          {activeSection === "salvadanai" ? (
            <SalvadanaiSectionContent
              salvadanai={salvadanai}
              onOpenManager={onOpenSalvadanai}
            />
          ) : (
            <SpeseSectionContent spese={spese} categorieSpese={categorieSpese} onOpenManager={onOpenSpese} />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.section>
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
    <motion.section variants={item} className="mt-6">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onOpen}
        className={`w-full rounded-[2.15rem] border border-primary/20 bg-primary/10 p-5 text-left shadow-[0_16px_36px_-30px_hsl(var(--primary)/0.65)]`}
      >
        <div className="flex items-start gap-3">
          <div className={`flex h-12 w-12 items-center justify-center ${innerSurface} bg-primary text-primary-foreground`}>
            <Calculator size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">Simulatore What If</p>
              <span className={`${capsule} bg-background px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary`}>
                {hasGoals ? "Pronto" : "Prima crea un obiettivo"}
              </span>
            </div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {hasGoals
                ? "Vedi come cambia il tempo necessario per raggiungere i tuoi obiettivi se sposti ogni mese una quota diversa."
                : "Attiva almeno un salvadanaio e poi usa il simulatore per confrontare scenari diversi."}
            </p>
          </div>
          <ArrowRight size={16} className="mt-1 text-primary" />
        </div>
      </motion.button>
    </motion.section>
  );
}

function SharedWealthModule({
  hasActiveWorkspace,
  pendingInvites,
  activeMembers,
  sharedSpese,
  onOpenSharing,
  onOpenShared,
  onOpenInvites,
  onOpenQuickAdd,
}: {
  hasActiveWorkspace: boolean;
  pendingInvites: number;
  activeMembers: number;
  sharedSpese: Array<{ data: string; importo: number }>;
  onOpenSharing: () => void;
  onOpenShared: () => void;
  onOpenInvites: () => void;
  onOpenQuickAdd: () => void;
}) {
  const now = Date.now();
  const oneWeekMs = 7 * 86400000;

  const lastSharedExpenseAt = useMemo(() => {
    const timestamps = sharedSpese
      .map((expense) => new Date(expense.data).getTime())
      .filter((timestamp) => Number.isFinite(timestamp));
    if (!timestamps.length) return null;
    return Math.max(...timestamps);
  }, [sharedSpese]);

  const monthlySharedSpend = useMemo(() => {
    const current = new Date();
    const thisMonth = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`;
    return sharedSpese
      .filter((expense) => expense.data.startsWith(thisMonth))
      .reduce((acc, expense) => acc + expense.importo, 0);
  }, [sharedSpese]);

  const weeklySharedSpend = useMemo(
    () =>
      sharedSpese
        .filter((expense) => {
          const timestamp = new Date(expense.data).getTime();
          return Number.isFinite(timestamp) && now - timestamp <= oneWeekMs;
        })
        .reduce((acc, expense) => acc + expense.importo, 0),
    [sharedSpese, now, oneWeekMs],
  );

  const hasRecentActivity = lastSharedExpenseAt ? now - lastSharedExpenseAt < oneWeekMs : false;
  const inactivityDays = lastSharedExpenseAt ? Math.floor((now - lastSharedExpenseAt) / 86400000) : null;

  type SharedModuleState = "no_workspace" | "pending_invites" | "inactive" | "active";
  const moduleState: SharedModuleState = !hasActiveWorkspace
    ? pendingInvites > 0
      ? "pending_invites"
      : "no_workspace"
    : hasRecentActivity
      ? "active"
      : "inactive";

  const badgeLabel =
    moduleState === "active" ? "Attivo" : moduleState === "pending_invites" ? "Inviti in attesa" : "Da configurare";
  const badgeTone =
    moduleState === "active"
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
      : moduleState === "pending_invites"
        ? "bg-primary/15 text-primary"
        : "bg-muted text-muted-foreground";

  const stateLabel =
    !hasActiveWorkspace
      ? pendingInvites > 0
        ? `${pendingInvites} invito${pendingInvites > 1 ? "i" : ""} da gestire`
        : "Nessuno spazio attivo"
      : `${activeMembers} membri attivi • ${inactivityDays === null ? "nessuna attivita recente" : inactivityDays === 0 ? "attivita oggi" : `ultima attivita ${inactivityDays} giorni fa`}`;

  const focusLabel = hasActiveWorkspace
    ? weeklySharedSpend > 0
      ? `Focus settimana: ${formatExpenseEuro(weeklySharedSpend)}`
      : "Focus settimana: nessuna spesa registrata"
    : "Focus settimana: crea lo spazio per iniziare";

  const primaryAction = (() => {
    if (!hasActiveWorkspace && pendingInvites > 0) {
      return {
        label: "Controlla inviti",
        hint: "Apri subito gli inviti e scegli se accettare o rifiutare.",
        action: onOpenInvites,
      };
    }
    if (!hasActiveWorkspace) {
      return {
        label: "Crea spazio condiviso",
        hint: "Configura lo spazio per gestire spese e obiettivi di coppia.",
        action: onOpenSharing,
      };
    }
    if (!hasRecentActivity) {
      return {
        label: "Aggiungi spesa",
        hint: "Manca movimento recente: registra una spesa condivisa adesso.",
        action: onOpenQuickAdd,
      };
    }
    return {
      label: "Vai al riepilogo condiviso",
      hint: "Apri la dashboard condivisa per vedere numeri e attivita.",
      action: onOpenShared,
    };
  })();

  const storyboardFrames = [
    {
      title: "1. Inserisci una spesa condivisa",
      body: "Cena 42 EUR • categoria Casa",
    },
    {
      title: "2. Totale aggiornato in tempo reale",
      body: `Spese mese condivise: ${formatExpenseEuro(monthlySharedSpend)}`,
    },
    {
      title: "3. Tutti allineati senza frizioni",
      body: "Storico unico e visibile a entrambi.",
    },
  ];

  const [frameIndex, setFrameIndex] = useState(0);
  useEffect(() => {
    const interval = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % storyboardFrames.length);
    }, 2600);
    return () => window.clearInterval(interval);
  }, [storyboardFrames.length]);

  const lastTracked = useRef<string | null>(null);
  useEffect(() => {
    const signature = `${moduleState}:${pendingInvites}:${activeMembers}:${hasRecentActivity}`;
    if (lastTracked.current === signature) return;
    lastTracked.current = signature;

    trackEvent(AnalyticsEvents.SHARED_CARD_VIEW, {
      state: moduleState,
      pending_invites: pendingInvites,
      active_members: activeMembers,
      has_recent_activity: hasRecentActivity,
    });
  }, [moduleState, pendingInvites, activeMembers, hasRecentActivity]);

  const handlePrimaryAction = () => {
    trackEvent(AnalyticsEvents.SHARED_CARD_PRIMARY_CTA_CLICK, {
      state: moduleState,
      cta_label: primaryAction.label,
    });
    primaryAction.action();
  };

  const handleQuickAdd = () => {
    trackEvent(AnalyticsEvents.SHARED_QUICK_ADD_OPEN, {
      source: "shared_card",
      state: moduleState,
    });
    onOpenQuickAdd();
  };

  return (
    <motion.section
      variants={item}
      className={`mt-6 ${shellSurface} p-5`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Feature condivisa</p>
          <h2 className="mt-1 text-lg font-semibold">Patrimonio condiviso</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Coordinate soldi e obiettivi di coppia in un unico spazio.</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center ${innerSurface} bg-primary/12 text-primary`}>
          <Sparkles size={20} />
        </div>
      </div>

      <div className={`mt-4 ${innerSurface} border border-border/60 bg-background/70 p-3.5`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={`${capsule} px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${badgeTone}`}>{badgeLabel}</span>
          <span className="text-[11px] text-muted-foreground">{stateLabel}</span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{focusLabel}</p>
      </div>

      <div className={`mt-3 ${innerSurface} border border-border/60 bg-muted/40 p-3.5`}>
        <div className="flex items-start gap-2.5">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center ${innerSurface} bg-primary/12 text-primary`}>
            <Users size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold">Esempio reale</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={frameIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <p className="mt-1 text-xs text-foreground">{storyboardFrames[frameIndex]?.title}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{storyboardFrames[frameIndex]?.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          {storyboardFrames.map((_, index) => (
            <span
              key={`frame-${index}`}
              className={cn("h-1.5 rounded-full transition-all", frameIndex === index ? "w-5 bg-primary" : "w-2 bg-border")}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button className="h-11 rounded-[1.2rem] gap-2" onClick={handlePrimaryAction}>
          {primaryAction.label === "Aggiungi spesa" ? <Plus size={16} /> : primaryAction.label === "Controlla inviti" ? <Mail size={16} /> : <ArrowRight size={16} />}
          <span className="truncate">{primaryAction.label}</span>
        </Button>
        <Button variant="outline" className="h-11 rounded-[1.2rem]" onClick={onOpenSharing}>
          Gestisci membri e regole
        </Button>
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <p className="text-[11px] leading-5 text-muted-foreground">{primaryAction.hint}</p>
        {hasActiveWorkspace ? (
          <Button variant="ghost" size="sm" className="h-8 rounded-full px-3 text-xs" onClick={handleQuickAdd}>
            <CheckCircle2 size={14} /> Quick Add
          </Button>
        ) : null}
      </div>
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
}: {
  categorie: { nome: string; valore: number; colore: string; emoji: string }[];
  totalAssets: number;
}) {
  return (
    <motion.section variants={item} className={`mt-6 ${shellSurface} p-5`}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Distribuzione Asset</p>
          <h2 className="mt-1 text-lg font-semibold">Le tue 6 categorie</h2>
        </div>
        <div className={`${capsule} bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground`}>
          {formatEuro(totalAssets)}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {categorie.map((cat) => {
          const share = totalAssets > 0 ? Math.max(0, Math.min(100, Math.round((cat.valore / totalAssets) * 100))) : 0;
          const stale = isAssetStale(cat.nome);
          return (
            <div key={cat.nome} className={`${innerSurface} border border-border/60 bg-background/80 p-3`}>
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-base leading-none">{cat.emoji}</span>
                  <span className="text-xs font-medium truncate">{cat.nome}</span>
                  {stale && (
                    <span className="flex h-2 w-2 shrink-0 rounded-full bg-orange-400" title="Aggiornamento consigliato" />
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{share}%</span>
              </div>
              <p className="text-sm font-semibold mb-1.5">{formatEuro(cat.valore)}</p>
              <div className="h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${share}%`, backgroundColor: cat.colore }}
                />
              </div>
            </div>
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
  const [expanded, setExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<Passivita["tipo"]>("finanziamento");
  const [importoResiduo, setImportoResiduo] = useState("");
  const [rataMensile, setRataMensile] = useState("");
  const [dataFine, setDataFine] = useState("");

  const totaleLiabilities = passivita.reduce((s, p) => s + p.importoResiduo, 0);

  const handleSubmit = () => {
    const nome_ = nome.trim();
    if (!nome_) return;
    const importo = parseFloat(importoResiduo) || 0;
    const rata = parseFloat(rataMensile) || 0;
    if (importo <= 0) return;
    onAdd({ nome: nome_, tipo, importoResiduo: importo, rataMensile: rata, dataFine });
    setNome("");
    setImportoResiduo("");
    setRataMensile("");
    setDataFine("");
    setShowForm(false);
  };

  return (
    <motion.section variants={item} className={`mt-6 ${shellSurface} p-5`}>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3"
        onClick={() => setExpanded((v) => !v)}
      >
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground text-left">Passività</p>
          <h2 className="mt-1 text-lg font-semibold text-left">Debiti e rate</h2>
        </div>
        <div className="flex items-center gap-2">
          {totaleLiabilities > 0 && (
            <span className={`${capsule} bg-destructive/12 px-3 py-1 text-[11px] font-semibold text-destructive`}>
              −{formatEuro(totaleLiabilities)}
            </span>
          )}
          {expanded ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-2.5">
              {passivita.length === 0 && !showForm && (
                <div className={`${innerSurface} border border-dashed border-border bg-background/70 p-4`}>
                  <div className="flex items-center gap-3">
                    <TrendingDown size={20} className="text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Nessuna passività registrata.</p>
                  </div>
                </div>
              )}

              {passivita.map((p) => (
                <div key={p.id} className={`${innerSurface} border border-border/60 bg-background/80 px-3.5 py-3`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{p.nome}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {TIPO_LABELS[p.tipo]}{p.rataMensile > 0 ? ` • rata ${formatEuro(p.rataMensile)}/mese` : ""}{p.dataFine ? ` • fino al ${new Date(p.dataFine).toLocaleDateString("it-IT", { month: "short", year: "numeric" })}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-destructive">−{formatEuro(p.importoResiduo)}</span>
                      <button
                        type="button"
                        onClick={() => onDelete(p.id)}
                        className="text-muted-foreground/50 hover:text-destructive transition-colors p-0.5"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {showForm ? (
                <div className={`${innerSurface} border border-border/60 bg-background/80 p-4 space-y-3`}>
                  <Input
                    placeholder="Nome (es. Mutuo casa)"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="rounded-xl bg-background"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    {(["mutuo", "finanziamento", "carta"] as Passivita["tipo"][]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTipo(t)}
                        className={cn(
                          `${capsule} px-3 py-2 text-xs font-medium border transition-colors`,
                          tipo === t ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground"
                        )}
                      >
                        {TIPO_LABELS[t]}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                      <Input
                        type="number"
                        placeholder="Importo residuo"
                        value={importoResiduo}
                        onChange={(e) => setImportoResiduo(e.target.value)}
                        className="pl-7 rounded-xl bg-background"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                      <Input
                        type="number"
                        placeholder="Rata mensile"
                        value={rataMensile}
                        onChange={(e) => setRataMensile(e.target.value)}
                        className="pl-7 rounded-xl bg-background"
                      />
                    </div>
                  </div>
                  <Input
                    type="date"
                    placeholder="Data fine (opzionale)"
                    value={dataFine}
                    onChange={(e) => setDataFine(e.target.value)}
                    className="rounded-xl bg-background"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSubmit} className="flex-1 rounded-xl h-10">Aggiungi</Button>
                    <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-xl h-10">
                      <Minus size={14} />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-[1.2rem] gap-2"
                  onClick={() => setShowForm(true)}
                >
                  <Plus size={16} /> Aggiungi passività
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function TrendChart({ snapshots }: { snapshots: ReturnType<typeof loadSnapshots> }) {
  if (snapshots.length < 2) {
    const singleValue = snapshots[0]?.netWorth;
    return (
      <motion.section variants={item} className={`mt-6 ${shellSurface} p-5`}>
        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Andamento</p>
        <h2 className="mt-1 text-lg font-semibold">Trend patrimonio netto</h2>
        <div className={`mt-4 ${innerSurface} border border-dashed border-border bg-background/70 p-4 text-center`}>
          {singleValue !== undefined ? (
            <p className="text-sm text-muted-foreground">
              Primo accesso registrato: <span className="font-semibold text-foreground">{formatEuro(singleValue)}</span>.
              Il grafico apparirà dal mese prossimo.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Il grafico si costruisce automaticamente mese per mese.
            </p>
          )}
        </div>
      </motion.section>
    );
  }

  const data = snapshots.map((s) => {
    const [year, month] = s.month.split("-");
    const label = new Date(Number(year), Number(month) - 1).toLocaleDateString("it-IT", { month: "short", year: "2-digit" });
    return { label, valore: s.netWorth };
  });

  const minValue = Math.min(...data.map((d) => d.valore));
  const maxValue = Math.max(...data.map((d) => d.valore));
  const isGrowing = data[data.length - 1].valore >= data[0].valore;

  return (
    <motion.section variants={item} className={`mt-6 ${shellSurface} p-5`}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Andamento</p>
          <h2 className="mt-1 text-lg font-semibold">Trend patrimonio netto</h2>
        </div>
        <div className={cn(`${capsule} px-3 py-1 text-[11px] font-semibold flex items-center gap-1`, isGrowing ? "bg-emerald-500/12 text-emerald-700" : "bg-destructive/12 text-destructive")}>
          {isGrowing ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {isGrowing ? "In crescita" : "In calo"}
        </div>
      </div>

      <div className="mt-4 h-36">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis
              domain={[minValue * 0.95, maxValue * 1.05]}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              width={32}
            />
            <Tooltip
              formatter={(v: number) => [formatEuro(v), "Patrimonio netto"]}
              contentStyle={{
                borderRadius: "1rem",
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="valore"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "hsl(var(--primary))" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}

// Known income/non-asset keywords to exclude from allocation chart (fix "Stipendio" bug)
const ASSET_CATEGORY_NAMES = new Set([
  "liquidità", "investimenti", "immobili", "crypto", "pensione", "tfr", "pensione / tfr",
  "beni", "liquidita", "soldi al lavoro", "cose di valore",
]);

function isAssetCategory(nome: string): boolean {
  return ASSET_CATEGORY_NAMES.has(nome.toLowerCase());
}

const Patrimonio = () => {
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const { user } = useAuth();
  const { userData, categorie, salvadanai, investimenti, spese, categorieSpese, lastPatrimonioUpdate, passivita, setPassivita } =
    useUser();
  const { awardPoints } = usePoints();
  const navigate = useNavigate();
  const {
    hasActiveWorkspace,
    pendingInvites,
    members: sharedMembers,
    spese: sharedSpese,
  } = useSharedWorkspace();
  const [activeSection, setActiveSection] = useState<PatrimonioSection>(() => getPatrimonioSectionPreference(user?.id));
  const isBeginner = userData.level === "beginner";

  // Trend snapshots: record once per month on first render with data
  const snapshots = useMemo(() => loadSnapshots(), []);

  useEffect(() => {
    awardPoints("review_patrimonio");
  }, [awardPoints]);

  useEffect(() => {
    setActiveSection(getPatrimonioSectionPreference(user?.id));
  }, [user?.id]);

  const handleSectionChange = (section: PatrimonioSection) => {
    setActiveSection(section);
    if (user?.id) {
      setPatrimonioSectionPreference(user.id, section);
    }
  };

  // Asset totals — use only known asset categories to avoid income entries (fix "Stipendio" bug)
  const totalCategories = categorie
    .filter((c) => isAssetCategory(c.nome))
    .reduce((acc, c) => acc + c.valore, 0);
  const totalInvestments = investimenti.reduce((acc, i) => acc + i.valore, 0);
  const totalAssets = totalCategories + totalInvestments;
  const totalLiabilities = passivita.reduce((acc, p) => acc + p.importoResiduo, 0);
  const netWorth = totalAssets - totalLiabilities;

  const activeAssets =
    categorie.filter((c) => c.valore > 0).length + investimenti.filter((i) => i.valore > 0).length;

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthlySpending = spese
    .filter((e) => e.data.startsWith(thisMonth))
    .reduce((acc, e) => acc + e.importo, 0);

  const totalGoals = salvadanai.length;
  const totalGoalsValue = salvadanai.reduce((acc, s) => acc + s.obiettivo, 0);
  const currentGoalsValue = salvadanai.reduce((acc, s) => acc + s.attuale, 0);
  const goalsProgress = clampPercentage((currentGoalsValue / Math.max(totalGoalsValue, 1)) * 100);

  // Record monthly snapshot after assets are computed
  useEffect(() => {
    if (totalAssets > 0 || totalLiabilities > 0) {
      maybeRecordSnapshot(totalAssets, totalLiabilities);
    }
  }, [totalAssets, totalLiabilities]);

  // Allocation chart — exclude income/non-asset categories
  const allChartData = categorie
    .filter((c) => c.valore > 0 && isAssetCategory(c.nome))
    .map((c) => ({ nome: c.nome, valore: c.valore, colore: c.colore }))
    .concat(totalInvestments > 0 && !categorie.some((c) => c.nome.toLowerCase() === "investimenti")
      ? [{ nome: "Investimenti", valore: totalInvestments, colore: "hsl(var(--primary))" }]
      : [])
    .sort((a, b) => b.valore - a.valore);

  const chartData = allChartData.slice(0, 4);
  const hiddenBuckets = allChartData.slice(4);
  const hiddenBucketsValue = hiddenBuckets.reduce((sum, e) => sum + e.valore, 0);
  const chartDataSafe = chartData.length > 0
    ? chartData
    : [{ nome: "Da impostare", valore: 1, colore: "hsl(var(--muted))" }];
  const topBucket = chartData[0] ?? { nome: "Da impostare", valore: 0 };

  const freshnessLabel = formatFreshness(lastPatrimonioUpdate);
  const heroTitle = isBeginner
    ? "Una vista semplice per iniziare a capire quanto possiedi e dove stai andando."
    : "Gestire i tuoi soldi è come prendersi cura di un bonsai: richiede pazienza, precisione e la capacità di guardare lontano.";

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
        heroTitle={heroTitle}
        actionLabel={isBeginner ? "Imposta patrimonio" : "Aggiorna patrimonio"}
        onPrimaryAction={() => navigate("/patrimonio/gestisci")}
        monthlySpending={monthlySpending}
        activeGoals={totalGoals}
        activeAssets={activeAssets}
        primaryActionHint={
          isBeginner
            ? "Inserisci le basi del tuo patrimonio per trasformare questa schermata in una dashboard vera."
            : "Rivedi categorie e investimenti quando cambia qualcosa di rilevante."
        }
      />

      <TrendChart snapshots={snapshots} />

      <AssetCategoriesSection
        categorie={categorie.filter((c) => isAssetCategory(c.nome))}
        totalAssets={totalAssets}
      />

      <PassivitaSection
        passivita={passivita}
        onAdd={handleAddPassivita}
        onDelete={handleDeletePassivita}
      />

      <GuidedInsight isBeginner={isBeginner} onOpenLesson={() => navigate("/lezione/1")} />

      <FocusSection
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        salvadanai={salvadanai}
        spese={spese}
        categorieSpese={categorieSpese}
        onOpenSalvadanai={() => navigate("/patrimonio/salvadanai")}
        onOpenSpese={() => navigate("/patrimonio/spese")}
      />

      {(activeSection === "salvadanai" || salvadanai.length === 0) ? (
        <WhatIfModule hasGoals={salvadanai.length > 0} onOpen={() => setSimulatorOpen(true)} />
      ) : null}

      <SharedWealthModule
        hasActiveWorkspace={hasActiveWorkspace}
        pendingInvites={pendingInvites.length}
        activeMembers={sharedMembers.filter((m) => m.status === "active").length}
        sharedSpese={sharedSpese}
        onOpenSharing={() => navigate("/patrimonio/condivisione")}
        onOpenShared={() => navigate("/patrimonio/condiviso")}
        onOpenInvites={() => navigate("/patrimonio/inviti")}
        onOpenQuickAdd={() => navigate("/patrimonio/condiviso/spese?quickAdd=1")}
      />

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
    </motion.div>
  );
};

export default Patrimonio;
