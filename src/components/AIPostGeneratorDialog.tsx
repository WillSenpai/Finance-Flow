import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export type AIPostGenerationDetails = {
  obiettivo: string;
  pubblico: string;
  tono: string;
  struttura: string;
  puntiChiave: string;
  noteAggiuntive: string;
  lunghezza: "breve" | "media" | "lunga";
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titolo: string;
  areaLabel: string;
  loading?: boolean;
  onGenerate: (details: AIPostGenerationDetails) => void;
};

const defaultDetails: AIPostGenerationDetails = {
  obiettivo: "",
  pubblico: "",
  tono: "",
  struttura: "",
  puntiChiave: "",
  noteAggiuntive: "",
  lunghezza: "media",
};

const AIPostGeneratorDialog = ({ open, onOpenChange, titolo, areaLabel, loading = false, onGenerate }: Props) => {
  const [details, setDetails] = useState<AIPostGenerationDetails>(defaultDetails);

  const canGenerate = useMemo(() => {
    if (!titolo.trim()) return false;
    return !!(details.obiettivo.trim() || details.struttura.trim() || details.puntiChiave.trim());
  }, [titolo, details]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] rounded-2xl" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            Genera con AI per {areaLabel}
          </DialogTitle>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Più dettagli inserisci, più il testo sarà specifico e utile. Titolo corrente: <span className="font-medium text-foreground">{titolo || "non inserito"}</span>
          </p>
        </DialogHeader>

        <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
          <div>
            <Label className="text-xs">Obiettivo del post</Label>
            <Input
              value={details.obiettivo}
              onChange={(e) => setDetails((p) => ({ ...p, obiettivo: e.target.value }))}
              placeholder="Es. Spiegare in modo pratico come scegliere un ETF..."
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs">Pubblico</Label>
            <Input
              value={details.pubblico}
              onChange={(e) => setDetails((p) => ({ ...p, pubblico: e.target.value }))}
              placeholder="Es. Principianti, utenti premium, studenti universitari..."
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs">Tono</Label>
            <Input
              value={details.tono}
              onChange={(e) => setDetails((p) => ({ ...p, tono: e.target.value }))}
              placeholder="Es. Semplice e concreto, professionale ma amichevole..."
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs">Struttura desiderata</Label>
            <Textarea
              value={details.struttura}
              onChange={(e) => setDetails((p) => ({ ...p, struttura: e.target.value }))}
              placeholder="Es. Intro breve, 3 sezioni con esempi, chiusura con takeaway..."
              className="mt-1 min-h-20"
            />
          </div>

          <div>
            <Label className="text-xs">Punti chiave obbligatori</Label>
            <Textarea
              value={details.puntiChiave}
              onChange={(e) => setDetails((p) => ({ ...p, puntiChiave: e.target.value }))}
              placeholder="Es. Costi, rischi, orizzonte temporale, errore da evitare..."
              className="mt-1 min-h-20"
            />
          </div>

          <div>
            <Label className="text-xs">Lunghezza</Label>
            <Select
              value={details.lunghezza}
              onValueChange={(value: "breve" | "media" | "lunga") => setDetails((p) => ({ ...p, lunghezza: value }))}
            >
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="breve">Breve</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="lunga">Lunga</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Note aggiuntive (opzionale)</Label>
            <Textarea
              value={details.noteAggiuntive}
              onChange={(e) => setDetails((p) => ({ ...p, noteAggiuntive: e.target.value }))}
              placeholder="Es. Evita tecnicismi, inserisci un esempio reale italiano..."
              className="mt-1 min-h-16"
            />
          </div>
        </div>

        <div className="text-[11px] text-muted-foreground">
          Inserisci almeno un dettaglio tra obiettivo, struttura o punti chiave.
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onGenerate(details)}
          disabled={!canGenerate || loading}
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Generazione in corso..." : "Genera contenuto"}
        </motion.button>
      </DialogContent>
    </Dialog>
  );
};

export default AIPostGeneratorDialog;
