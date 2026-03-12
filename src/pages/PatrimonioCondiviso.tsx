import { ArrowLeft, Landmark, PiggyBank, Receipt, TrendingUp, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSharedWorkspace } from "@/hooks/useSharedWorkspace";
import { toast } from "sonner";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const formatEuro = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const formatExpenseEuro = (n: number) => (n === 0 ? formatEuro(0) : formatEuro(-Math.abs(n)));

const PatrimonioCondiviso = () => {
  const navigate = useNavigate();
  const { hasActiveWorkspace, workspaceName, categorie, investimenti, spese, categorieSpese, myRole, deleteWorkspace } =
    useSharedWorkspace();
  const [isDeleting, setIsDeleting] = useState(false);

  const totaleCategorie = categorie.reduce((acc, c) => acc + c.valore, 0);
  const totaleInvestimenti = investimenti.reduce((acc, i) => acc + i.valore, 0);
  const totaleSpeseStoriche = spese.reduce((acc, s) => acc + s.importo, 0);
  const totale = totaleCategorie + totaleInvestimenti - totaleSpeseStoriche;

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthly = spese.filter((s) => s.data.startsWith(thisMonth));
  const monthlyTotal = monthly.reduce((acc, s) => acc + s.importo, 0);
  const byCat = monthly.reduce<Record<string, number>>((acc, s) => {
    acc[s.categoriaId] = (acc[s.categoriaId] ?? 0) + s.importo;
    return acc;
  }, {});

  const handleDeleteWorkspace = async () => {
    setIsDeleting(true);
    const result = await deleteWorkspace();
    setIsDeleting(false);
    if (!result.ok) {
      toast.error(result.error ?? "Impossibile eliminare il workspace");
      return;
    }
    toast.success("Workspace condiviso eliminato");
    navigate("/patrimonio");
  };

  if (!hasActiveWorkspace) {
    return (
      <motion.div className="px-5 pt-14 pb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary text-sm font-medium mb-6">
          <ArrowLeft size={18} /> Indietro
        </button>
        <div className="py-4 text-center border-t border-border/40">
          <p className="text-3xl mb-2">🤝</p>
          <p className="text-sm font-medium">Nessun workspace condiviso attivo</p>
          <p className="text-xs text-muted-foreground mt-1">Crea o accetta un invito dalla sezione Condivisione.</p>
          <Button className="rounded-xl h-10 mt-4" onClick={() => navigate("/patrimonio/condivisione")}>
            Vai a Condivisione
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="px-5 pt-14 pb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary text-sm font-medium mb-6">
        <ArrowLeft size={18} /> Indietro
      </button>

      <h1 className="text-2xl font-semibold tracking-tight">Patrimonio Condiviso 💞</h1>
      <p className="text-xs text-muted-foreground mt-1">{workspaceName}</p>

      <div className="mt-5 py-4 border-y border-border/40">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Totale condiviso</p>
        <p className="text-3xl font-bold mt-1">{formatEuro(totale)}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Netto aggiornato con {formatExpenseEuro(totaleSpeseStoriche)} di spese condivise storiche.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <Button className="rounded-xl h-10 gap-2" onClick={() => navigate("/patrimonio/condiviso/gestisci")}>
          <Landmark size={16} /> Categorie
        </Button>
        <Button variant="outline" className="rounded-xl h-10 gap-2" onClick={() => navigate("/patrimonio/condiviso/salvadanai")}>
          <PiggyBank size={16} /> Salvadanai
        </Button>
      </div>

      <Button variant="outline" className="rounded-xl h-10 mt-2 w-full gap-2" onClick={() => navigate("/patrimonio/condiviso/investimenti")}>
        <TrendingUp size={16} /> Investimenti
      </Button>

      <div className="mt-6 pt-4 border-t border-border/40">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Receipt size={16} /> Spese Condivise (mese corrente)
          </h2>
          <Button variant="outline" size="sm" className="rounded-full text-xs" onClick={() => navigate("/patrimonio/condiviso/spese")}>
            Gestisci
          </Button>
        </div>
        <div className="py-2 mb-2 flex items-center justify-between border-b border-border/40">
          <span className="text-xs text-muted-foreground">Totale mese</span>
          <span className="text-sm font-semibold text-destructive">{formatExpenseEuro(monthlyTotal)}</span>
        </div>
        <div className="space-y-2">
          {Object.entries(byCat)
            .slice(0, 4)
            .map(([catId, value]) => {
              const cat = categorieSpese.find((c) => c.id === catId);
              return (
                <div key={catId} className="px-1 py-2 flex items-center justify-between border-b border-border/30">
                  <span className="text-xs font-medium">{cat?.emoji ?? "📦"} {cat?.nome ?? "Altro"}</span>
                  <span className="text-xs font-semibold text-destructive">{formatExpenseEuro(value)}</span>
                </div>
              );
            })}
          {Object.keys(byCat).length === 0 && <p className="text-xs text-muted-foreground">Nessuna spesa condivisa registrata.</p>}
        </div>
      </div>

      {myRole === "owner" ? (
        <div className="mt-6 rounded-2xl border border-destructive/25 bg-destructive/5 p-4">
          <p className="text-sm font-semibold text-foreground">Zona pericolosa</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Eliminare il workspace rimuove in modo definitivo membri, inviti e tutti i dati condivisi.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="mt-4 h-10 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive">
                <Trash2 size={15} /> Elimina workspace
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-sm rounded-[1.5rem] border-border/70 bg-background">
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminare il workspace condiviso?</AlertDialogTitle>
                <AlertDialogDescription>
                  Questa azione è irreversibile. Verranno rimossi workspace, membri, inviti e tutti i dati condivisi collegati.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Annulla</AlertDialogCancel>
                <AlertDialogAction
                  className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => void handleDeleteWorkspace()}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Eliminazione..." : "Conferma eliminazione"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : null}
    </motion.div>
  );
};

export default PatrimonioCondiviso;
