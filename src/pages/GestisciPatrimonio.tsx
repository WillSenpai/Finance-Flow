import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formatEuro = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const GestisciPatrimonio = () => {
  const { categorie, setCategorie } = useUser();
  const navigate = useNavigate();

  const [categorieDraft, setCategorieDraft] = useState([...categorie]);
  const [selectedCategory, setSelectedCategory] = useState(categorie[0]?.nome ?? "");
  const [amountInput, setAmountInput] = useState("");

  const handleAddFunds = () => {
    const amount = parseInt(amountInput) || 0;
    if (!selectedCategory) {
      toast.error("Seleziona una categoria");
      return;
    }
    if (amount <= 0) {
      toast.error("Inserisci un importo maggiore di 0");
      return;
    }

    setCategorieDraft((current) =>
      current.map((cat) =>
        cat.nome === selectedCategory ? { ...cat, valore: Math.max(0, cat.valore + amount) } : cat,
      ),
    );
    setAmountInput("");
    toast.success(`Aggiunti ${formatEuro(amount)} a ${selectedCategory}`);
  };

  const handleSave = async () => {
    await setCategorie(categorieDraft);
    toast.success("Categorie patrimonio aggiornate ✅");
    navigate(-1);
  };

  return (
    <motion.div
      className="px-5 pt-14 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary text-sm font-medium mb-6">
        <ArrowLeft size={18} /> Indietro
      </button>

      <h1 className="text-2xl font-semibold tracking-tight mb-6">Gestisci Patrimonio 🏦</h1>

      <div className="mb-8">
        <p className="text-sm font-semibold mb-4">Aggiungi fondi alle categorie</p>
        <div className="bg-card border border-border/50 rounded-2xl p-4">
          <div className="space-y-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="rounded-xl h-11">
                <SelectValue placeholder="Seleziona categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorieDraft.map((cat) => (
                  <SelectItem key={cat.nome} value={cat.nome}>
                    {cat.emoji} {cat.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-[1fr_auto] items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                <Input
                  type="number"
                  placeholder="Inserisci importo"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="h-10 min-h-10 max-h-10 pl-7 rounded-xl bg-background"
                />
              </div>
              <Button onClick={handleAddFunds} size="icon" className="h-10 w-10 min-h-10 min-w-10 rounded-xl p-0 shrink-0">
                <Plus size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-sm font-semibold mb-4">Riepilogo categorie</p>
        <div className="space-y-4">
          {categorieDraft.map((cat) => (
            <div key={cat.nome} className="bg-card border border-border/50 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{cat.emoji}</span>
                <span className="text-sm font-medium">{cat.nome}</span>
              </div>
              <span className="text-sm font-semibold">{formatEuro(cat.valore)}</span>
            </div>
          ))}
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

export default GestisciPatrimonio;
