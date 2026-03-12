import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { DraftCategoria } from "@/components/patrimonio/patrimonioCategoryEditor";
import {
  formatEuro,
  patrimonioColorPalette,
} from "@/components/patrimonio/patrimonioCategoryEditor";

interface PatrimonioCategoryCardProps {
  category: DraftCategoria;
  onChange: (localId: string, updates: Partial<DraftCategoria>) => void;
  onDelete: (localId: string) => void;
}

export function PatrimonioCategoryCard({
  category,
  onChange,
  onDelete,
}: PatrimonioCategoryCardProps) {
  const [open, setOpen] = useState(false);
  const [draftName, setDraftName] = useState(category.nome);
  const [draftEmoji, setDraftEmoji] = useState(category.emoji);
  const [draftColor, setDraftColor] = useState(category.colore);
  const [draftValue, setDraftValue] = useState(String(category.valore));

  useEffect(() => {
    if (!open) {
      setDraftName(category.nome);
      setDraftEmoji(category.emoji);
      setDraftColor(category.colore);
      setDraftValue(String(category.valore));
    }
  }, [category, open]);

  const saveChanges = () => {
    onChange(category.localId, {
      nome: draftName,
      emoji: draftEmoji,
      colore: draftColor,
      valore: Math.max(0, Number(draftValue) || 0),
    });
    setOpen(false);
  };

  return (
    <>
      <Card className="rounded-3xl border-border/60 shadow-none">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex items-center gap-3">
              <span
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border text-lg"
                style={{ backgroundColor: `${category.colore}22`, borderColor: category.colore }}
              >
                {category.emoji || "🪙"}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{category.nome || "Nuova categoria"}</p>
                <p className="text-xs text-muted-foreground">{formatEuro(category.valore)}</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 self-center">
              <Button type="button" variant="outline" className="h-8 rounded-lg px-2.5 text-xs" onClick={() => setOpen(true)}>
                <Pencil size={13} className="mr-1.5" /> Modifica
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg text-destructive"
                onClick={() => onDelete(category.localId)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-[1.5rem] border-border bg-card p-0 text-card-foreground sm:max-w-sm">
          <DialogHeader className="rounded-t-[1.5rem] border-b border-border/50 bg-muted/40 px-5 py-4 text-left">
            <DialogTitle className="text-lg font-semibold">Modifica categoria</DialogTitle>
            <DialogDescription>
              Aggiorna nome, saldo e identita visiva mantenendo il look FinanceFlow.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-5 py-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Nome</label>
              <Input
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="Nome categoria"
                className="h-10 rounded-xl border-border/70 bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Saldo</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={draftValue}
                  onChange={(e) => setDraftValue(e.target.value)}
                  className="h-10 rounded-xl border-border/70 bg-background pl-7"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Identita visuale</label>
              <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background px-2.5 py-2.5">
                <div className="w-16 shrink-0">
                  <Input
                    value={draftEmoji}
                    onChange={(e) => setDraftEmoji(e.target.value)}
                    placeholder="🙂"
                    className="h-9 rounded-xl border-border/70 bg-card px-2 text-center text-base"
                    maxLength={8}
                  />
                </div>

                <div className="h-7 w-px bg-border/70" />

                <div className="flex flex-1 flex-wrap gap-2">
                  {patrimonioColorPalette.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      aria-label={color.label}
                      title={color.label}
                      onClick={() => setDraftColor(color.value)}
                      className={`h-7 w-7 rounded-full border-2 transition ${
                        draftColor === color.value ? "scale-105 border-foreground ring-2 ring-primary/20" : "border-card"
                      }`}
                      style={{ backgroundColor: color.value }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-border/50 bg-muted/20 px-5 py-3.5">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>
              Annulla
            </Button>
            <Button type="button" className="rounded-xl" onClick={saveChanges}>
              Salva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
