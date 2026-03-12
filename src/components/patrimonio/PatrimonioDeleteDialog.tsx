import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DraftCategoria } from "@/components/patrimonio/patrimonioCategoryEditor";
import { formatEuro } from "@/components/patrimonio/patrimonioCategoryEditor";

interface PatrimonioDeleteDialogProps {
  categories: DraftCategoria[];
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  onTransferTargetChange: (value: string) => void;
  open: boolean;
  pendingCategory: DraftCategoria | undefined;
  transferTargetId: string;
}

export function PatrimonioDeleteDialog({
  categories,
  onConfirm,
  onOpenChange,
  onTransferTargetChange,
  open,
  pendingCategory,
  transferTargetId,
}: PatrimonioDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Elimina categoria con saldo</AlertDialogTitle>
          <AlertDialogDescription>
            {pendingCategory
              ? `Prima di eliminare "${pendingCategory.nome || "questa categoria"}", sposta ${formatEuro(pendingCategory.valore)} in un'altra categoria.`
              : "Seleziona una destinazione per il saldo."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2">
          <p className="text-sm font-medium">Categoria di destinazione</p>
          <Select value={transferTargetId} onValueChange={onTransferTargetChange}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Scegli dove spostare il saldo" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((target) => (
                <SelectItem key={target.localId} value={target.localId}>
                  {target.emoji} {target.nome || "Categoria"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl">Annulla</AlertDialogCancel>
          <AlertDialogAction className="rounded-xl" onClick={onConfirm}>
            Sposta e elimina
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
