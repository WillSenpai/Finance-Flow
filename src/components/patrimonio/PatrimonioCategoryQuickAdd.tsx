import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      <CardContent className="space-y-3 p-4">
        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
          <Select value={selectedCategoryId} onValueChange={onSelectedCategoryChange}>
            <SelectTrigger className="h-10 rounded-xl">
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
          <Button variant="outline" className="h-10 rounded-xl px-3 text-sm" onClick={onAddCategory}>
            <Plus size={15} className="mr-1.5" /> Nuova categoria
          </Button>
        </div>

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
              className="h-10 rounded-xl pl-7"
            />
          </div>
          <Button onClick={onAddFunds} size="icon" className="h-10 w-10 rounded-xl">
            <Plus size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
