import { useEffect } from "react";
import { useState } from "react";
import { TrendingUp, Trash2, Target, BookOpen, ArrowUpRight, Receipt, Calculator, PiggyBank, Landmark } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/hooks/useUser";
import { usePoints } from "@/contexts/PointsContext";
import { useNavigate } from "react-router-dom";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import WhatIfSimulator from "@/components/WhatIfSimulator";

const formatEuro = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } } as const;
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
} as const;

const Patrimonio = () => {
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const { userData, categorie, salvadanai, setSalvadanai, investimenti, spese, categorieSpese } = useUser();
  const { awardPoints } = usePoints();
  const navigate = useNavigate();
  const isBeginner = userData.level === "beginner";

  useEffect(() => {
    awardPoints("review_patrimonio");
  }, [awardPoints]);

  const totaleCategorie = categorie.reduce((acc, c) => acc + c.valore, 0);
  const totaleInvestimenti = investimenti.reduce((acc, i) => acc + i.valore, 0);
  const totale = totaleCategorie + totaleInvestimenti;

  // Chart data: categorie + investimenti as one segment
  const chartData = [
    ...categorie.map((c) => ({ nome: c.nome, valore: c.valore, colore: c.colore })),
    ...(totaleInvestimenti > 0
      ? [{ nome: "Investimenti", valore: totaleInvestimenti, colore: "hsl(270, 50%, 55%)" }]
      : []),
  ];

  // === BEGINNER VIEW ===
  if (isBeginner) {
    return (
      <motion.div className="px-5 pt-14 pb-4" variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <h1 className="text-2xl font-semibold tracking-tight">Ciao, {userData.name} 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">Iniziamo questo viaggio!</p>
        </motion.div>

        <motion.div variants={item} className="mt-6">
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
              <p className="text-sm font-medium">Cos'è l'inflazione e perché ti ruba i soldi</p>
              <p className="text-xs text-muted-foreground">5 min • Lezione base</p>
            </div>
            <ArrowUpRight size={16} className="text-muted-foreground flex-shrink-0" />
          </motion.button>
        </motion.div>

        <motion.div className="mt-8" variants={item}>
          <h2 className="text-lg font-semibold mb-4">I tuoi Salvadanai</h2>
          <AnimatePresence initial={false}>
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
        </motion.div>

        {/* What If Simulator Button */}
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

        {/* Spese section */}
        <motion.div className="mt-8" variants={item}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Receipt size={18} /> Le tue Spese
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-1 text-xs"
              onClick={() => navigate("/patrimonio/spese")}
            >
              Gestisci
            </Button>
          </div>
          {spese.length === 0 ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/patrimonio/spese")}
              className="w-full bg-card border border-border/50 rounded-2xl p-5 text-center"
            >
              <p className="text-2xl mb-2">💸</p>
              <p className="text-sm font-medium">Inizia a tracciare le tue spese</p>
              <p className="text-xs text-muted-foreground mt-1">Tieni sotto controllo dove vanno i tuoi soldi</p>
            </motion.button>
          ) : (
            <div className="space-y-2">
              {(() => {
                const now = new Date();
                const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
                const monthly = spese.filter((s) => s.data.startsWith(thisMonth));
                const total = monthly.reduce((a, s) => a + s.importo, 0);
                const byCat = monthly.reduce<Record<string, number>>((a, s) => {
                  a[s.categoriaId] = (a[s.categoriaId] || 0) + s.importo;
                  return a;
                }, {});
                return (
                  <>
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
                  </>
                );
              })()}
            </div>
          )}
        </motion.div>

        {/* Simulator Drawer */}
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

  // === INTERMEDIATE / PRO VIEW ===
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

      <motion.div className="mt-8" variants={item}>
        <h2 className="text-lg font-semibold mb-4">I tuoi Salvadanai</h2>
        <AnimatePresence initial={false}>
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
      </motion.div>

      {/* What If Simulator Button */}
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

      {/* Spese section */}
      <motion.div className="mt-8 mb-4" variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Receipt size={18} /> Le tue Spese
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full gap-1 text-xs"
            onClick={() => navigate("/patrimonio/spese")}
          >
            Gestisci
          </Button>
        </div>
        {spese.length === 0 ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/patrimonio/spese")}
            className="w-full bg-card border border-border/50 rounded-2xl p-5 text-center"
          >
            <p className="text-2xl mb-2">💸</p>
            <p className="text-sm font-medium">Inizia a tracciare le tue spese</p>
            <p className="text-xs text-muted-foreground mt-1">Tieni sotto controllo dove vanno i tuoi soldi</p>
          </motion.button>
        ) : (
          <div className="space-y-2">
            {(() => {
              const now = new Date();
              const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
              const monthly = spese.filter((s) => s.data.startsWith(thisMonth));
              const total = monthly.reduce((a, s) => a + s.importo, 0);
              const byCat = monthly.reduce<Record<string, number>>((a, s) => {
                a[s.categoriaId] = (a[s.categoriaId] || 0) + s.importo;
                return a;
              }, {});
              return (
                <>
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
                </>
              );
            })()}
          </div>
        )}
      </motion.div>

      {/* Simulator Drawer */}
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
