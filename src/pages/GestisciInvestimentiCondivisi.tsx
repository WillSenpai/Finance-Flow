import { useState } from "react";
import { ArrowLeft, Plus, Trash2, PieChart as PieChartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useSharedWorkspace } from "@/hooks/useSharedWorkspace";

const formatEuro = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const defaultColors = [
  "hsl(270, 50%, 55%)",
  "hsl(140, 50%, 45%)",
  "hsl(30, 80%, 55%)",
  "hsl(220, 50%, 35%)",
  "hsl(340, 60%, 50%)",
  "hsl(180, 50%, 40%)",
];

const GestisciInvestimentiCondivisi = () => {
  const { investimenti, setInvestimenti } = useSharedWorkspace();
  const navigate = useNavigate();

  const [items, setItems] = useState([...investimenti]);
  const [values, setValues] = useState<Record<string, string>>(Object.fromEntries(investimenti.map((i) => [i.id, String(i.valore)])));
  const [newNome, setNewNome] = useState("");
  const [newEmoji, setNewEmoji] = useState("💎");

  const totale = items.reduce((a, i) => a + (parseInt(values[i.id] || "0") || 0), 0);

  const handleAdd = () => {
    const nome = newNome.trim();
    if (!nome) {
      toast.error("Inserisci un nome");
      return;
    }
    const id = crypto.randomUUID();
    const color = defaultColors[items.length % defaultColors.length];
    setItems([...items, { id, nome, valore: 0, emoji: newEmoji || "💎", colore: color }]);
    setValues((v) => ({ ...v, [id]: "0" }));
    setNewNome("");
    setNewEmoji("💎");
    toast.success("Asset aggiunto! 🎉");
  };

  const handleRemove = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    setValues((v) => {
      const next = { ...v };
      delete next[id];
      return next;
    });
    toast("Asset rimosso");
  };

  const handleSave = async () => {
    await setInvestimenti(items.map((i) => ({ ...i, valore: Math.max(0, parseInt(values[i.id] || "0") || 0) })));
    toast.success("Investimenti condivisi aggiornati ✅");
    navigate(-1);
  };

  const chartData = items
    .map((i) => ({ nome: i.nome, valore: parseInt(values[i.id] || "0") || 0, colore: i.colore, emoji: i.emoji }))
    .filter((d) => d.valore > 0);

  return (
    <motion.div className="px-5 pt-14 pb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary text-sm font-medium mb-6">
        <ArrowLeft size={18} /> Indietro
      </button>

      <h1 className="text-2xl font-semibold tracking-tight mb-2">Investimenti Condivisi 📈</h1>
      <p className="text-sm text-muted-foreground mb-6">Aggiungi o aggiorna gli asset del workspace.</p>

      <div className="bg-card border border-border/50 rounded-2xl p-4 mb-6">
        <p className="text-xs font-semibold text-muted-foreground mb-3">Nuovo Asset</p>
        <div className="flex gap-2 mb-3">
          <Input placeholder="Nome (es. BTP)" value={newNome} onChange={(e) => setNewNome(e.target.value)} className="flex-1 rounded-xl bg-background" />
          <Input
            placeholder="💎"
            value={newEmoji}
            onChange={(e) => setNewEmoji(e.target.value)}
            className="w-14 text-center rounded-xl bg-background"
            maxLength={2}
          />
        </div>
        <Button onClick={handleAdd} variant="outline" className="w-full rounded-xl h-10 gap-2">
          <Plus size={18} /> Aggiungi asset
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {items.map((inv) => {
            const val = parseInt(values[inv.id] || "0") || 0;
            const perc = totale > 0 ? Math.round((val / totale) * 100) : 0;
            return (
              <motion.div
                key={inv.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, x: -80, height: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="bg-card border border-border/50 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{inv.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs text-muted-foreground">{inv.nome}</label>
                        <div className="flex items-center gap-2">
                          {totale > 0 && <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{perc}%</span>}
                          <motion.button whileTap={{ scale: 0.85 }} onClick={() => handleRemove(inv.id)} className="text-muted-foreground/50 hover:text-destructive transition-colors p-0.5">
                            <Trash2 size={14} />
                          </motion.button>
                        </div>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                        <Input
                          type="number"
                          value={values[inv.id] || ""}
                          onChange={(e) => setValues((v) => ({ ...v, [inv.id]: e.target.value }))}
                          className="pl-7 rounded-xl bg-background"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {chartData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border/50 rounded-2xl p-5 mt-6">
          <div className="flex items-center gap-2 mb-3">
            <PieChartIcon size={16} className="text-muted-foreground" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Distribuzione Portfolio</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} dataKey="valore" nameKey="nome" cx="50%" cy="50%" innerRadius={30} outerRadius={50} strokeWidth={2} stroke="hsl(var(--background))">
                    {chartData.map((d, i) => (
                      <Cell key={i} fill={d.colore} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              {chartData.map((d) => {
                const perc = totale > 0 ? Math.round((d.valore / totale) * 100) : 0;
                return (
                  <div key={d.nome} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.colore }} />
                    <span className="text-xs font-medium flex-1 truncate">{d.emoji} {d.nome}</span>
                    <span className="text-xs text-muted-foreground">{perc}%</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border/50 flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Totale investito</span>
            <span className="text-sm font-bold">{formatEuro(totale)}</span>
          </div>
        </motion.div>
      )}

      <motion.div whileTap={{ scale: 0.97 }} className="mt-8">
        <Button onClick={() => void handleSave()} className="w-full rounded-2xl h-12 text-base">
          Salva modifiche ✅
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default GestisciInvestimentiCondivisi;
