import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DraftCategoria } from "@/components/patrimonio/patrimonioCategoryEditor";

interface PatrimonioCategoryQuickAddProps {
  amountInput: string;
  categories: DraftCategoria[];
  onAddCategory: () => void;
  onAddFunds: () => void;
  onAmountInputChange: (value: string) => void;
  onSelectedCategoryChange: (value: string) => void;
  selectedCategoryId: string;
}

export function PatrimonioCategoryQuickAdd({
  amountInput,
  categories,
  onAddCategory,
  onAddFunds,
  onAmountInputChange,
  onSelectedCategoryChange,
  selectedCategoryId,
}: PatrimonioCategoryQuickAddProps) {
  return (
    <Card className="rounded-3xl border-border/60 shadow-none">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-base">Aggiungi fondi</CardTitle>
          <p className="text-sm text-muted-foreground">Aggiorna una categoria esistente o crea la prossima.</p>
        </div>
        <Button variant="outline" className="rounded-xl" onClick={onAddCategory}>
          <Plus size={16} className="mr-2" /> Nuova categoria
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select value={selectedCategoryId} onValueChange={onSelectedCategoryChange}>
          <SelectTrigger className="h-11 rounded-xl">
            <SelectValue placeholder="Seleziona categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.localId} value={cat.localId}>
                {cat.emoji} {cat.nome || "Nuova categoria"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
            <Input
              type="number"
              min="0"
              step="1"
              placeholder="Inserisci importo"
              value={amountInput}
              onChange={(e) => onAmountInputChange(e.target.value)}
              className="h-11 rounded-xl pl-7"
            />
          </div>
          <Button onClick={onAddFunds} size="icon" className="h-11 w-11 rounded-xl">
            <Plus size={18} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
