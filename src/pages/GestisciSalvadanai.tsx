import { useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

const formatEuro = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const GestisciSalvadanai = () => {
  const navigate = useNavigate();
  const { salvadanai, setSalvadanai } = useUser();

  const [salValues, setSalValues] = useState<Record<string, string>>(
    Object.fromEntries(salvadanai.map((s) => [s.nome, String(s.attuale)])),
  );
  const [items, setItems] = useState([...salvadanai]);

  const [newNome, setNewNome] = useState("");
  const [newEmoji, setNewEmoji] = useState("🐷");
  const [newObiettivo, setNewObiettivo] = useState("");

  const handleAdd = () => {
    const nome = newNome.trim();
    const obiettivo = parseInt(newObiettivo) || 0;
    if (!nome) {
      toast.error("Inserisci un nome");
      return;
    }
    if (obiettivo <= 0) {
      toast.error("L'obiettivo deve essere maggiore di 0");
      return;
    }
    if (items.some((s) => s.nome.toLowerCase() === nome.toLowerCase())) {
      toast.error("Esiste già un salvadanaio con questo nome");
      return;
    }

    const displayName = `${nome} ${newEmoji || "🐷"}`;
    const next = [...items, { nome: displayName, obiettivo, attuale: 0 }];
    setItems(next);
    setSalValues((v) => ({ ...v, [displayName]: "0" }));
    setNewNome("");
    setNewEmoji("🐷");
    setNewObiettivo("");
    toast.success("Salvadanaio creato! 🎉");
  };

  const handleRemove = (name: string) => {
    setItems((current) => current.filter((s) => s.nome !== name));
    setSalValues((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
    toast("Salvadanaio rimosso");
  };

  const handleSave = async () => {
    const next = items.map((s) => ({
      ...s,
      attuale: Math.min(s.obiettivo, Math.max(0, parseInt(salValues[s.nome] || "0") || 0)),
    }));
    await setSalvadanai(next);
    toast.success("Salvadanai aggiornati ✅");
    navigate(-1);
  };

  return (
    <motion.div className="px-5 pt-14 pb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary text-sm font-medium mb-6">
        <ArrowLeft size={18} /> Indietro
      </button>

      <h1 className="text-2xl font-semibold tracking-tight mb-6">Gestisci Salvadanai 🐷</h1>

      <div className="space-y-4 mb-8">
        <AnimatePresence initial={false}>
          {items.map((s) => (
            <motion.div
              key={s.nome}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, x: -80, height: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="bg-card border border-border/50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-muted-foreground">{s.nome}</label>
                  <button
                    onClick={() => handleRemove(s.nome)}
                    className="text-muted-foreground/50 hover:text-destructive transition-colors p-0.5"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                    <Input
                      type="number"
                      value={salValues[s.nome] || ""}
                      onChange={(e) => setSalValues((v) => ({ ...v, [s.nome]: e.target.value }))}
                      className="pl-7 rounded-xl bg-background"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">/ {formatEuro(s.obiettivo)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mb-8 bg-card border border-border/50 rounded-2xl p-4">
        <p className="text-xs font-semibold text-muted-foreground mb-3">Nuovo Salvadanaio</p>
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Nome"
            value={newNome}
            onChange={(e) => setNewNome(e.target.value)}
            className="flex-1 rounded-xl bg-background"
          />
          <Input
            placeholder="🐷"
            value={newEmoji}
            onChange={(e) => setNewEmoji(e.target.value)}
            className="w-14 text-center rounded-xl bg-background"
            maxLength={2}
          />
        </div>
        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
            <Input
              type="number"
              placeholder="Obiettivo"
              value={newObiettivo}
              onChange={(e) => setNewObiettivo(e.target.value)}
              className="h-10 min-h-10 max-h-10 pl-7 rounded-xl bg-background"
            />
          </div>
          <Button onClick={handleAdd} size="icon" className="h-10 w-10 min-h-10 min-w-10 rounded-xl p-0 shrink-0">
            <Plus size={18} />
          </Button>
        </div>
      </div>

      <motion.div whileTap={{ scale: 0.97 }}>
        <Button onClick={handleSave} className="w-full rounded-2xl h-12 text-base">
          Salva modifiche ✅
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default GestisciSalvadanai;
