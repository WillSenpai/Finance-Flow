import { useEffect, useState } from "react";
import { TrendingUp, Trash2, Target, BookOpen, ArrowUpRight, Receipt, Calculator, PiggyBank, Landmark } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/hooks/useUser";
import { usePoints } from "@/contexts/PointsContext";
import { useAuth } from "@/contexts/AuthContext";
import type { CategoriaSpesa, Salvadanaio, Spesa } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import WhatIfSimulator from "@/components/WhatIfSimulator";
import { useSharedWorkspace } from "@/hooks/useSharedWorkspace";
import {
  getPatrimonioSectionPreference,
  setPatrimonioSectionPreference,
  type PatrimonioSection,
} from "@/lib/patrimonioSectionPreference";

const formatEuro = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } } as const;
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
} as const;

const sectionMeta: Record<PatrimonioSection, { title: string; description: string }> = {
  salvadanai: {
    title: "I tuoi Salvadanai",
    description: "Segui i tuoi obiettivi di risparmio e mostra solo quello che ti serve adesso.",
  },
  spese: {
    title: "Le tue Spese",
    description: "Controlla le spese recenti senza occupare spazio quando vuoi concentrarti su altro.",
  },
};

function SalvadanaiSectionContent({
  salvadanai,
  setSalvadanai,
  onOpenManager,
}: {
  salvadanai: Salvadanaio[];
  setSalvadanai: (salvadanai: Salvadanaio[]) => void;
  onOpenManager: () => void;
}) {
  if (salvadanai.length === 0) {
    return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onOpenManager}
        className="w-full bg-card border border-border/50 rounded-2xl p-5 text-center"
      >
        <p className="text-2xl mb-2">🐷</p>
        <p className="text-sm font-medium">Crea il tuo primo salvadanaio</p>
        <p className="text-xs text-muted-foreground mt-1">Imposta un obiettivo e inizia a metterti da parte qualcosa.</p>
      </motion.button>
    );
  }

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {salvadanai.map((s) => {
        const perc = Math.round((s.attuale / s.obiettivo) * 100);
        return (
          <motion.div
            key={s.nome}
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, x: -80, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-4 last:mb-0"
          >
            <div className="bg-card rounded-2xl p-4 border border-border/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{s.nome}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{perc}%</span>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setSalvadanai(salvadanai.filter((x) => x.nome !== s.nome))}
                    className="text-muted-foreground/50 hover:text-destructive transition-colors p-0.5"
                  >
                    <Trash2 size={14} />
                  </motion.button>
                </div>
              </div>
              <Progress value={perc} className="h-2.5 rounded-full" />
              <p className="text-xs text-muted-foreground mt-2">
                {formatEuro(s.attuale)} di {formatEuro(s.obiettivo)}
              </p>
            </div>
          </motion.div>
        );
      })}
    </AnimatePresence>
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
        whileTap={{ scale: 0.97 }}
        onClick={onOpenManager}
        className="w-full bg-card border border-border/50 rounded-2xl p-5 text-center"
      >
        <p className="text-2xl mb-2">💸</p>
        <p className="text-sm font-medium">Inizia a tracciare le tue spese</p>
        <p className="text-xs text-muted-foreground mt-1">Tieni sotto controllo dove vanno i tuoi soldi</p>
      </motion.button>
    );
  }

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthly = spese.filter((s) => s.data.startsWith(thisMonth));
  const total = monthly.reduce((acc, s) => acc + s.importo, 0);
  const byCat = monthly.reduce<Record<string, number>>((acc, s) => {
    acc[s.categoriaId] = (acc[s.categoriaId] || 0) + s.importo;
    return acc;
  }, {});

  return (
    <div className="space-y-2">
      <div className="bg-card border border-border/50 rounded-2xl p-4 flex items-center justify-between">
        <span className="text-sm font-medium">Spese questo mese</span>
        <span className="text-lg font-bold text-destructive">{formatEuro(total)}</span>
      </div>
      {Object.entries(byCat)
        .slice(0, 4)
        .map(([catId, val]) => {
          const cat = categorieSpese.find((c) => c.id === catId);
          return (
            <div
              key={catId}
              className="bg-card border border-border/50 rounded-2xl p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span>{cat?.emoji || "📦"}</span>
                <span className="text-xs font-medium">{cat?.nome || "Altro"}</span>
              </div>
              <span className="text-xs font-bold">{formatEuro(val)}</span>
            </div>
          );
        })}
    </div>
  );
}

function PatrimonioFocusSection({
  activeSection,
  onSectionChange,
  salvadanai,
  setSalvadanai,
  spese,
  categorieSpese,
  onOpenSalvadanai,
  onOpenSpese,
  className,
}: {
  activeSection: PatrimonioSection;
  onSectionChange: (section: PatrimonioSection) => void;
  salvadanai: Salvadanaio[];
  setSalvadanai: (salvadanai: Salvadanaio[]) => void;
  spese: Spesa[];
  categorieSpese: CategoriaSpesa[];
  onOpenSalvadanai: () => void;
  onOpenSpese: () => void;
  className?: string;
}) {
  const activeMeta = sectionMeta[activeSection];

  return (
    <motion.div className={className} variants={item}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Sezione in evidenza</p>
          <h2 className="text-lg font-semibold mt-1">{activeMeta.title}</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Scegli la sezione da visualizzare per tenere questa schermata piu ordinata.
          </p>
        </div>
        {activeSection === "spese" ? (
          <Button
            variant="outline"
            size="sm"
            className="rounded-full gap-1 text-xs shrink-0"
            onClick={onOpenSpese}
          >
            Gestisci
          </Button>
        ) : null}
      </div>

      <Select value={activeSection} onValueChange={(value) => onSectionChange(value as PatrimonioSection)}>
        <SelectTrigger className="rounded-2xl h-12 bg-card">
          <SelectValue placeholder="Scegli una sezione" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="salvadanai">Salvadanai</SelectItem>
          <SelectItem value="spese">Spese</SelectItem>
        </SelectContent>
      </Select>

      <p className="text-xs text-muted-foreground mt-3">{activeMeta.description}</p>

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
              setSalvadanai={setSalvadanai}
              onOpenManager={onOpenSalvadanai}
            />
          ) : (
            <SpeseSectionContent
              spese={spese}
              categorieSpese={categorieSpese}
              onOpenManager={onOpenSpese}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

const Patrimonio = () => {
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const { user } = useAuth();
  const { userData, categorie, salvadanai, setSalvadanai, investimenti, spese, categorieSpese } = useUser();
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

  const totaleCategorie = categorie.reduce((acc, c) => acc + c.valore, 0);
  const totaleInvestimenti = investimenti.reduce((acc, i) => acc + i.valore, 0);
  const totale = totaleCategorie + totaleInvestimenti;

  const chartData = [
    ...categorie.map((c) => ({ nome: c.nome, valore: c.valore, colore: c.colore })),
    ...(totaleInvestimenti > 0
      ? [{ nome: "Investimenti", valore: totaleInvestimenti, colore: "hsl(270, 50%, 55%)" }]
      : []),
  ];

  if (isBeginner) {
    return (
      <motion.div className="px-5 pt-14 pb-4" variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <h1 className="text-2xl font-semibold tracking-tight">Ciao, {userData.name} 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">Iniziamo questo viaggio!</p>
        </motion.div>

        <motion.div variants={item} className="mt-6">
          <div className="bg-card border border-border/50 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Condivisione patrimonio</p>
                <p className="text-xs text-muted-foreground">
                  {hasActiveWorkspace ? "Spazio condiviso attivo" : "Condividi con partner, amici o famiglia"}
                </p>
              </div>
              {pendingInvites.length > 0 && (
                <button
                  onClick={() => navigate("/patrimonio/inviti")}
                  className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary font-semibold"
                >
                  {pendingInvites.length} invito{pendingInvites.length > 1 ? "i" : ""}
                </button>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" className="rounded-xl flex-1 h-10" onClick={() => navigate("/patrimonio/condivisione")}>
                Gestisci
              </Button>
              {hasActiveWorkspace && (
                <Button className="rounded-xl flex-1 h-10" onClick={() => navigate("/patrimonio/condiviso")}>
                  Apri condiviso
                </Button>
              )}
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Target size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Il tuo primo passo</p>
                <p className="text-xs text-muted-foreground">{userData.goals.join(", ")}</p>
              </div>
            </div>
            <Progress value={0} className="h-3 rounded-full" />
            <p className="text-xs text-muted-foreground mt-2">0% — Sei pronto a iniziare!</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button className="rounded-2xl h-11 gap-2" onClick={() => navigate("/patrimonio/gestisci")}>
                <Landmark size={16} /> Categorie
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl h-11 gap-2"
                onClick={() => navigate("/patrimonio/salvadanai")}
              >
                <PiggyBank size={16} /> Salvadanai
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Consigliato per te 📚</h2>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/lezione/1")}
            className="w-full bg-card border border-border/50 rounded-2xl p-4 flex items-center gap-4 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
              <BookOpen size={20} className="text-accent-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Cos&apos;e l&apos;inflazione e perche ti ruba i soldi</p>
              <p className="text-xs text-muted-foreground">5 min • Lezione base</p>
            </div>
            <ArrowUpRight size={16} className="text-muted-foreground flex-shrink-0" />
          </motion.button>
        </motion.div>

        <PatrimonioFocusSection
          className="mt-8"
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          salvadanai={salvadanai}
          setSalvadanai={setSalvadanai}
          spese={spese}
          categorieSpese={categorieSpese}
          onOpenSalvadanai={() => navigate("/patrimonio/salvadanai")}
          onOpenSpese={() => navigate("/patrimonio/spese")}
        />

        {activeSection === "salvadanai" ? (
          <motion.div className="mt-8" variants={item}>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setSimulatorOpen(true)}
              className="w-full bg-primary/10 border border-primary/20 rounded-2xl p-5 flex items-center gap-4 text-left"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Calculator size={22} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Simulatore What If 🔮</p>
                <p className="text-xs text-muted-foreground">Scopri quanto prima puoi raggiungere i tuoi obiettivi</p>
              </div>
              <ArrowUpRight size={16} className="text-primary flex-shrink-0" />
            </motion.button>
          </motion.div>
        ) : null}

        <Drawer open={simulatorOpen} onOpenChange={setSimulatorOpen}>
          <DrawerContent className="max-h-[90vh]">
            <div className="px-5 pb-6 pt-2 overflow-y-auto">
              <DrawerHeader className="px-0">
                <DrawerTitle className="text-base text-left">Simulatore What If 🔮</DrawerTitle>
              </DrawerHeader>
              <WhatIfSimulator />
            </div>
          </DrawerContent>
        </Drawer>
      </motion.div>
    );
  }

  return (
    <motion.div className="px-5 pt-14 pb-4" variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold tracking-tight">Il tuo Patrimonio 💰</h1>
        <p className="text-muted-foreground text-sm mt-1">Tieni sotto controllo i tuoi risparmi e investimenti.</p>
      </motion.div>

      <motion.div className="mt-6 text-center" variants={item}>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Il tuo Patrimonio Totale</p>
        <p className="text-4xl font-bold mt-1 tracking-tight">{formatEuro(totale)}</p>
        <p className="text-sm text-primary font-medium mt-1">+ €250 questo mese ↑</p>
      </motion.div>

      <motion.div className="mt-6 flex items-center gap-4" variants={item}>
        <div className="w-36 h-36 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="valore"
                nameKey="nome"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                strokeWidth={2}
                stroke="hsl(0, 0%, 100%)"
              >
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.colore} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-3">
          {chartData.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.colore }} />
              <div>
                <p className="text-xs font-medium leading-tight">{d.nome}</p>
                <p className="text-xs text-muted-foreground">{formatEuro(d.valore)}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div className="flex gap-3 mt-6" variants={item}>
        <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
          <Button className="w-full rounded-2xl h-11 gap-2" onClick={() => navigate("/patrimonio/gestisci")}>
            <Landmark size={18} /> Categorie
          </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
          <Button
            variant="outline"
            className="w-full rounded-2xl h-11 gap-2"
            onClick={() => navigate("/patrimonio/salvadanai")}
          >
            <PiggyBank size={18} /> Salvadanai
          </Button>
        </motion.div>
      </motion.div>

      <motion.div className="mt-3" variants={item}>
        <Button
          variant="outline"
          className="w-full rounded-2xl h-11 gap-2"
          onClick={() => navigate("/patrimonio/investimenti")}
        >
          <TrendingUp size={18} /> Aggiorna Asset
        </Button>
      </motion.div>

      <motion.div className="mt-3" variants={item}>
        <div className="bg-card border border-border/50 rounded-2xl p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Condivisione patrimonio</p>
              <p className="text-xs text-muted-foreground">
                {hasActiveWorkspace ? "Spazio condiviso attivo" : "Invita partner, amici o familiari"}
              </p>
            </div>
            {pendingInvites.length > 0 && (
              <button
                onClick={() => navigate("/patrimonio/inviti")}
                className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary font-semibold"
              >
                {pendingInvites.length} invito{pendingInvites.length > 1 ? "i" : ""}
              </button>
            )}
          </div>
          <div className="mt-3 flex gap-2">
            <Button variant="outline" className="rounded-xl flex-1 h-10" onClick={() => navigate("/patrimonio/condivisione")}>
              Gestisci
            </Button>
            {hasActiveWorkspace && (
              <Button className="rounded-xl flex-1 h-10" onClick={() => navigate("/patrimonio/condiviso")}>
                Apri condiviso
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      <PatrimonioFocusSection
        className="mt-8"
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        salvadanai={salvadanai}
        setSalvadanai={setSalvadanai}
        spese={spese}
        categorieSpese={categorieSpese}
        onOpenSalvadanai={() => navigate("/patrimonio/salvadanai")}
        onOpenSpese={() => navigate("/patrimonio/spese")}
      />

      {activeSection === "salvadanai" ? (
        <motion.div className="mt-8" variants={item}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setSimulatorOpen(true)}
            className="w-full bg-primary/10 border border-primary/20 rounded-2xl p-5 flex items-center gap-4 text-left"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Calculator size={22} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Simulatore What If 🔮</p>
              <p className="text-xs text-muted-foreground">Scopri quanto prima puoi raggiungere i tuoi obiettivi</p>
            </div>
            <ArrowUpRight size={16} className="text-primary flex-shrink-0" />
          </motion.button>
        </motion.div>
      ) : null}

      <Drawer open={simulatorOpen} onOpenChange={setSimulatorOpen}>
        <DrawerContent className="max-h-[90vh]">
          <div className="px-5 pb-6 pt-2 overflow-y-auto">
            <WhatIfSimulator />
          </div>
        </DrawerContent>
      </Drawer>
    </motion.div>
  );
};

export default Patrimonio;
