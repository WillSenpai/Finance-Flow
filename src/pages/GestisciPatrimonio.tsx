import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PatrimonioCategoryCard } from "@/components/patrimonio/PatrimonioCategoryCard";
import { PatrimonioCategoryQuickAdd } from "@/components/patrimonio/PatrimonioCategoryQuickAdd";
import { PatrimonioDeleteDialog } from "@/components/patrimonio/PatrimonioDeleteDialog";
import {
  emptyCategory,
  patrimonioColorPalette,
  toDraft,
  type DraftCategoria,
} from "@/components/patrimonio/patrimonioCategoryEditor";
import { useUser } from "@/hooks/useUser";

const GestisciPatrimonio = () => {
  const { categorie, setCategorie } = useUser();
  const navigate = useNavigate();

  const [categorieDraft, setCategorieDraft] = useState<DraftCategoria[]>(() => categorie.map(toDraft));
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [transferTargetId, setTransferTargetId] = useState("");

  const selectedCategory = categorieDraft.find((cat) => cat.localId === selectedCategoryId);
  const pendingDeleteCategory = categorieDraft.find((cat) => cat.localId === pendingDeleteId);
  const availableTransferTargets = useMemo(
    () => categorieDraft.filter((cat) => cat.localId !== pendingDeleteId),
    [categorieDraft, pendingDeleteId],
  );

  useEffect(() => {
    if (!selectedCategoryId && categorieDraft.length > 0) {
      setSelectedCategoryId(categorieDraft[0].localId);
    }
  }, [categorieDraft, selectedCategoryId]);

  const syncSelectedCategory = (nextCategories: DraftCategoria[]) => {
    if (nextCategories.length === 0) {
      setSelectedCategoryId("");
      return;
    }

    if (!nextCategories.some((cat) => cat.localId === selectedCategoryId)) {
      setSelectedCategoryId(nextCategories[0].localId);
    }
  };

  const handleDraftChange = (localId: string, updates: Partial<DraftCategoria>) => {
    setCategorieDraft((current) =>
      current.map((cat) => (cat.localId === localId ? { ...cat, ...updates } : cat)),
    );
  };

  const handleAddFunds = () => {
    const amount = Number(amountInput);
    if (!selectedCategory) {
      toast.error("Seleziona una categoria");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Inserisci un importo maggiore di 0");
      return;
    }

    handleDraftChange(selectedCategory.localId, { valore: Math.max(0, selectedCategory.valore + amount) });
    setAmountInput("");
    toast.success(`Aggiunti €${amount.toLocaleString("it-IT")} a ${selectedCategory.nome || "categoria"}`);
  };

  const handleAddCategory = () => {
    const nextCategory = emptyCategory();
    setCategorieDraft((current) => [...current, nextCategory]);
    setSelectedCategoryId(nextCategory.localId);
  };

  const handleDeleteRequest = (localId: string) => {
    const category = categorieDraft.find((cat) => cat.localId === localId);
    if (!category) return;

    if (categorieDraft.length === 1) {
      toast.error("Devi mantenere almeno una categoria patrimonio");
      return;
    }

    if (category.valore > 0) {
      const fallbackTarget = categorieDraft.find((cat) => cat.localId !== localId);
      setPendingDeleteId(localId);
      setTransferTargetId(fallbackTarget?.localId ?? "");
      return;
    }

    const nextCategories = categorieDraft.filter((cat) => cat.localId !== localId);
    setCategorieDraft(nextCategories);
    syncSelectedCategory(nextCategories);
    toast.success(`Categoria "${category.nome || "senza nome"}" rimossa`);
  };

  const closeDeleteDialog = (open: boolean) => {
    if (open) return;
    setPendingDeleteId(null);
    setTransferTargetId("");
  };

  const confirmDeleteWithTransfer = () => {
    if (!pendingDeleteCategory) return;
    if (!transferTargetId) {
      toast.error("Seleziona dove spostare il valore");
      return;
    }

    const nextCategories = categorieDraft
      .filter((cat) => cat.localId !== pendingDeleteId)
      .map((cat) =>
        cat.localId === transferTargetId
          ? { ...cat, valore: Math.max(0, cat.valore + pendingDeleteCategory.valore) }
          : cat,
      );

    setCategorieDraft(nextCategories);
    syncSelectedCategory(nextCategories);
    closeDeleteDialog(false);
    toast.success(`Valore spostato e categoria "${pendingDeleteCategory.nome || "senza nome"}" rimossa`);
  };

  const handleSave = async () => {
    const normalized = categorieDraft.map((cat) => ({
      ...cat,
      nome: cat.nome.trim(),
      emoji: cat.emoji.trim(),
      valore: Number.isFinite(cat.valore) ? Math.max(0, cat.valore) : 0,
    }));

    if (normalized.length === 0) {
      toast.error("Aggiungi almeno una categoria");
      return;
    }

    if (normalized.some((cat) => !cat.nome)) {
      toast.error("Ogni categoria deve avere un nome");
      return;
    }

    if (normalized.some((cat) => !cat.emoji)) {
      toast.error("Ogni categoria deve avere un'emoji");
      return;
    }

    const normalizedNames = normalized.map((cat) => cat.nome.toLocaleLowerCase("it-IT"));
    if (new Set(normalizedNames).size !== normalizedNames.length) {
      toast.error("I nomi delle categorie devono essere unici");
      return;
    }

    await setCategorie(
      normalized.map(({ localId, ...cat }) => ({
        ...cat,
        colore: cat.colore || patrimonioColorPalette[0].value,
      })),
    );

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
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1 text-sm font-medium text-primary">
        <ArrowLeft size={18} /> Indietro
      </button>

      <div className="space-y-6">
        <CardHeader className="px-0 pb-0">
          <CardTitle className="text-2xl">Gestisci Patrimonio 🏦</CardTitle>
          <CardDescription>
            Crea e personalizza le categorie. Se elimini una categoria con saldo, il valore viene spostato prima.
          </CardDescription>
        </CardHeader>

        <PatrimonioCategoryQuickAdd
          amountInput={amountInput}
          categories={categorieDraft}
          onAddCategory={handleAddCategory}
          onAddFunds={handleAddFunds}
          onAmountInputChange={setAmountInput}
          onSelectedCategoryChange={setSelectedCategoryId}
          selectedCategoryId={selectedCategoryId}
        />

        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Categorie</h2>
          </div>
          {categorieDraft.map((category) => (
            <PatrimonioCategoryCard
              key={category.localId}
              category={category}
              onChange={handleDraftChange}
              onDelete={handleDeleteRequest}
            />
          ))}
        </section>

        <Button onClick={handleSave} className="h-12 w-full rounded-2xl text-base">
          Salva modifiche ✅
        </Button>
      </div>

      <PatrimonioDeleteDialog
        open={Boolean(pendingDeleteId)}
        onOpenChange={closeDeleteDialog}
        pendingCategory={pendingDeleteCategory}
        categories={availableTransferTargets}
        transferTargetId={transferTargetId}
        onTransferTargetChange={setTransferTargetId}
        onConfirm={confirmDeleteWithTransfer}
      />
    </motion.div>
  );
};

export default GestisciPatrimonio;
