import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Ellipsis,
  PiggyBank,
  Receipt,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector, Tooltip } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
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
import type { CategoriaSpesa, Salvadanaio, Spesa } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useSharedWorkspace } from "@/hooks/useSharedWorkspace";
import { cn } from "@/lib/utils";
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

  const diffMs = Date.now() - new Date(date).getTime();
  const days = Math.max(0, Math.floor(diffMs / 86400000));

  if (days === 0) return "Aggiornato oggi";
  if (days === 1) return "Aggiornato ieri";
  return `Aggiornato ${days} giorni fa`;
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
  total,
  freshnessLabel,
  heroTitle,
  heroDescription,
  actionLabel,
  onPrimaryAction,
  monthlySpending,
  activeGoals,
  activeAssets,
  primaryActionHint,
}: {
  total: number;
  freshnessLabel: string;
  heroTitle: string;
  heroDescription: string;
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
                <div className="mt-3 flex items-end gap-3">
                  <h1 className="text-[2.85rem] font-semibold leading-none tracking-[-0.05em] sm:text-[3.4rem]">
                    {formatEuro(total)}
                  </h1>
                  <span className="mb-1 hidden rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/72 sm:inline-flex">
                    Snapshot
                  </span>
                </div>
                <p className="mt-3 max-w-[20rem] text-sm leading-6 text-primary-foreground/84 sm:text-[15px]">{heroTitle}</p>
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
  onOpenSharing,
  onOpenShared,
  onOpenInvites,
}: {
  hasActiveWorkspace: boolean;
  pendingInvites: number;
  onOpenSharing: () => void;
  onOpenShared: () => void;
  onOpenInvites: () => void;
}) {
  return (
    <motion.section
      variants={item}
      className={`mt-6 ${shellSurface} p-5`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Feature condivisa</p>
          <h2 className="mt-1 text-lg font-semibold">Patrimonio condiviso</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {hasActiveWorkspace
              ? "Hai gia uno spazio condiviso attivo. Usalo per tenere allineati obiettivi, spese e patrimonio di coppia o famiglia."
              : "Quando vuoi fare un salto di livello, qui puoi aprire uno spazio condiviso con partner, amici o famiglia."}
          </p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center ${innerSurface} bg-primary/12 text-primary`}>
          <Sparkles size={20} />
        </div>
      </div>

      {pendingInvites > 0 ? (
        <button
          onClick={onOpenInvites}
          className={`mt-4 ${capsule} bg-primary px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground`}
        >
          {pendingInvites} invito{pendingInvites > 1 ? "i" : ""} in attesa
        </button>
      ) : null}

      {hasActiveWorkspace ? (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-11 rounded-[1.2rem]" onClick={onOpenSharing}>
            Gestisci
          </Button>
          <Button className="h-11 rounded-[1.2rem]" onClick={onOpenShared}>
            Apri condiviso
          </Button>
        </div>
      ) : pendingInvites > 0 ? (
        <div className="mt-5">
          <Button className="h-11 w-full rounded-[1.2rem]" onClick={onOpenInvites}>
            Vedi gli inviti
          </Button>
        </div>
      ) : (
        <div className="mt-5">
          <Button className="h-11 w-full rounded-[1.2rem]" onClick={onOpenSharing}>
            Scopri la feature
          </Button>
        </div>
      )}
    </motion.section>
  );
}

const Patrimonio = () => {
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const { user } = useAuth();
  const { userData, categorie, salvadanai, investimenti, spese, categorieSpese, lastPatrimonioUpdate } =
    useUser();
  const { awardPoints } = usePoints();
  const navigate = useNavigate();
  const { hasActiveWorkspace, pendingInvites } = useSharedWorkspace();
  const [activeSection, setActiveSection] = useState<PatrimonioSection>(() => getPatrimonioSectionPreference(user?.id));
  const isBeginner = userData.level === "beginner";

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

  const totalCategories = categorie.reduce((acc, category) => acc + category.valore, 0);
  const totalInvestments = investimenti.reduce((acc, investment) => acc + investment.valore, 0);
  const totalHistoricalSpending = spese.reduce((acc, expense) => acc + expense.importo, 0);
  const totalAssets = totalCategories + totalInvestments;
  const total = totalAssets - totalHistoricalSpending;
  const activeAssets =
    categorie.filter((category) => category.valore > 0).length + investimenti.filter((investment) => investment.valore > 0).length;

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthlyExpenses = spese.filter((expense) => expense.data.startsWith(thisMonth));
  const monthlySpending = monthlyExpenses.reduce((acc, expense) => acc + expense.importo, 0);

  const totalGoals = salvadanai.length;
  const totalGoalsValue = salvadanai.reduce((acc, saving) => acc + saving.obiettivo, 0);
  const currentGoalsValue = salvadanai.reduce((acc, saving) => acc + saving.attuale, 0);
  const goalsProgress = clampPercentage((currentGoalsValue / Math.max(totalGoalsValue, 1)) * 100);

  const allChartData = [
    ...categorie.map((category) => ({ nome: category.nome, valore: category.valore, colore: category.colore })),
    ...(totalInvestments > 0 ? [{ nome: "Investimenti", valore: totalInvestments, colore: "hsl(var(--primary))" }] : []),
  ]
    .filter((entry) => entry.valore > 0)
    .sort((a, b) => b.valore - a.valore);

  const chartData = allChartData.slice(0, 4);
  const hiddenBuckets = allChartData.slice(4);
  const hiddenBucketsValue = hiddenBuckets.reduce((sum, entry) => sum + entry.valore, 0);

  const chartDataSafe =
    chartData.length > 0
      ? chartData
      : [{ nome: "Da impostare", valore: 1, colore: "hsl(var(--muted))" }];

  const topBucket = chartData[0] ?? { nome: "Da impostare", valore: 0 };
  const freshnessLabel = formatFreshness(lastPatrimonioUpdate);
  const heroTitle = isBeginner
    ? "Una vista semplice per iniziare a capire quanto possiedi e dove stai andando."
    : "Gestire i tuoi soldi è come prendersi cura di un bonsai, richiede pazienza, precisione e la capacità di guardare lontano.";
  const heroDescription = isBeginner
    ? `Hai ${totalGoals} obiettiv${totalGoals === 1 ? "o" : "i"} attiv${totalGoals === 1 ? "o" : "i"} e ${goalsProgress}% di progresso sui salvadanai attuali.`
    : `Il patrimonio netto include ${formatExpenseEuro(totalHistoricalSpending)} di spese storiche e ${activeAssets} bucket con valore attivo.`;

  return (
    <motion.div className="px-5 pt-14 pb-4" variants={container} initial="hidden" animate="show">


      <WealthHero
        total={total}
        freshnessLabel={freshnessLabel}
        heroTitle={heroTitle}
        heroDescription={heroDescription}
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

      <ActionCluster
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onOpenSalvadanai={() => navigate("/patrimonio/salvadanai")}
        onOpenInvestimenti={() => navigate("/patrimonio/investimenti")}
        onOpenSpese={() => navigate("/patrimonio/spese")}
        onOpenPatrimonio={() => navigate("/patrimonio/gestisci")}
        onOpenWhatIf={() => setSimulatorOpen(true)}
        hasGoals={salvadanai.length > 0}
      />

      <AllocationSnapshot
        total={totalAssets}
        chartData={chartDataSafe}
        topCategoryName={topBucket.nome}
        topCategoryValue={topBucket.valore}
        isEmpty={chartData.length === 0}
        hiddenBucketsCount={hiddenBuckets.length}
        hiddenBucketsValue={hiddenBucketsValue}
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
        onOpenSharing={() => navigate("/patrimonio/condivisione")}
        onOpenShared={() => navigate("/patrimonio/condiviso")}
        onOpenInvites={() => navigate("/patrimonio/inviti")}
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
