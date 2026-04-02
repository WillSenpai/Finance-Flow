import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  SALVADANAIO_CATEGORIE,
  loadSalvadanaiExt,
  saveSalvadanaiExt,
  proiezioneMesi,
  addVersamento,
  type SalvadanaioPatch,
  type SalvadanaiCategoria,
} from "@/lib/salvadanaiExt";

const formatEuro = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(iso));

// ---------------------------------------------------------------------------
// Card per singolo salvadanaio
// ---------------------------------------------------------------------------
interface SalvadanaiCardProps {
  nome: string;
  obiettivo: number;
  attuale: number;
  valoreStr: string;
  onValoreChange: (v: string) => void;
  onRemove: () => void;
  ext: SalvadanaioPatch;
  onExtChange: (patch: Partial<SalvadanaioPatch>) => void;
}

const SalvadanaiCard = ({
  nome,
  obiettivo,
  attuale,
  valoreStr,
  onValoreChange,
  onRemove,
  ext,
  onExtChange,
}: SalvadanaiCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [newVersamentoImporto, setNewVersamentoImporto] = useState("");
  const [newVersamentoNota, setNewVersamentoNota] = useState("");

  const currentAttuale = Math.max(0, parseFloat(valoreStr || "0") || 0);
  const proiezione = proiezioneMesi(currentAttuale, obiettivo, ext.versamenti ?? []);

  const handleAddVersamento = () => {
    const importo = parseFloat(newVersamentoImporto);
    if (!importo || importo <= 0) {
      toast.error("Importo non valido");
      return;
    }
    addVersamento(nome, { data: new Date().toISOString().split("T")[0], importo, nota: newVersamentoNota || undefined });
    // reload from localStorage
    const updated = loadSalvadanaiExt();
    onExtChange({ versamenti: updated[nome]?.versamenti ?? [] });
    // auto-update the attuale field
    const newAttuale = currentAttuale + importo;
    onValoreChange(String(Math.min(obiettivo, newAttuale)));
    setNewVersamentoImporto("");
    setNewVersamentoNota("");
    toast.success(`+${formatEuro(importo)} aggiunto`);
  };

  return (
    <div className="bg-card border border-border/50 rounded-[1.5rem] overflow-hidden">
      {/* Header row */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-semibold">{nome}</span>
            {ext.categoria && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                {SALVADANAIO_CATEGORIE.find((c) => c.id === ext.categoria)?.emoji}{" "}
                {SALVADANAIO_CATEGORIE.find((c) => c.id === ext.categoria)?.label}
              </span>
            )}
          </div>
          <button onClick={onRemove} className="text-muted-foreground/50 hover:text-destructive transition-colors p-0.5">
            <Trash2 size={14} />
          </button>
        </div>

        {/* Valore attuale */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
            <Input
              type="number"
              value={valoreStr}
              onChange={(e) => onValoreChange(e.target.value)}
              className="pl-7 rounded-xl bg-background"
            />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">/ {formatEuro(obiettivo)}</span>
        </div>

        {/* Proiezione */}
        {proiezione !== null && proiezione > 0 && (
          <div className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock size={11} />
            <span>Obiettivo in circa <span className="font-semibold text-foreground">{proiezione} {proiezione === 1 ? "mese" : "mesi"}</span></span>
          </div>
        )}
        {proiezione === 0 && (
          <div className="mt-2 text-[11px] font-semibold text-green-600">🎉 Obiettivo raggiunto!</div>
        )}

        {/* Expand toggle */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {expanded ? "Nascondi dettagli" : "Mostra dettagli"}
        </button>
      </div>

      {/* Expanded section */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border/40"
          >
            <div className="p-4 space-y-4">
              {/* Categoria */}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Categoria</label>
                <div className="flex flex-wrap gap-1.5">
                  {SALVADANAIO_CATEGORIE.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => onExtChange({ categoria: cat.id as SalvadanaiCategoria })}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                        ext.categoria === cat.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground",
                      )}
                    >
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scadenza */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Scadenza obiettivo</label>
                <Input
                  type="date"
                  value={ext.scadenza ?? ""}
                  onChange={(e) => onExtChange({ scadenza: e.target.value || undefined })}
                  className="rounded-xl bg-background"
                />
              </div>

              {/* Descrizione */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Note / Descrizione</label>
                <Input
                  placeholder="es. Vacanza estiva a settembre..."
                  value={ext.descrizione ?? ""}
                  onChange={(e) => onExtChange({ descrizione: e.target.value || undefined })}
                  className="rounded-xl bg-background"
                />
              </div>

              {/* Storico versamenti */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Storico versamenti</p>
                {(ext.versamenti ?? []).length === 0 ? (
                  <p className="text-xs text-muted-foreground">Nessun versamento registrato.</p>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {[...(ext.versamenti ?? [])].reverse().map((v) => (
                      <div key={v.id} className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2">
                        <div>
                          <span className="text-xs font-semibold text-green-600">+{formatEuro(v.importo)}</span>
                          {v.nota && <span className="ml-2 text-[10px] text-muted-foreground">{v.nota}</span>}
                        </div>
                        <span className="text-[10px] text-muted-foreground">{formatDate(v.data)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Aggiungi versamento */}
                <div className="mt-3 flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">€</span>
                    <Input
                      type="number"
                      placeholder="Importo"
                      value={newVersamentoImporto}
                      onChange={(e) => setNewVersamentoImporto(e.target.value)}
                      className="pl-7 h-9 rounded-xl bg-background text-xs"
                    />
                  </div>
                  <Input
                    placeholder="Nota (opz.)"
                    value={newVersamentoNota}
                    onChange={(e) => setNewVersamentoNota(e.target.value)}
                    className="flex-1 h-9 rounded-xl bg-background text-xs"
                  />
                  <Button
                    type="button"
                    size="icon"
                    className="h-9 w-9 min-w-9 rounded-xl shrink-0"
                    onClick={handleAddVersamento}
                  >
                    <Plus size={15} />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
const GestisciSalvadanai = () => {
  const navigate = useNavigate();
  const { salvadanai, setSalvadanai } = useUser();

  const [salValues, setSalValues] = useState<Record<string, string>>(
    Object.fromEntries(salvadanai.map((s) => [s.nome, String(s.attuale)])),
  );
  const [items, setItems] = useState([...salvadanai]);
  const [extMap, setExtMap] = useState<Record<string, SalvadanaioPatch>>(() => loadSalvadanaiExt());

  const [newNome, setNewNome] = useState("");
  const [newEmoji, setNewEmoji] = useState("🐷");
  const [newObiettivo, setNewObiettivo] = useState("");

  // keep extMap in sync with localStorage (e.g. after addVersamento)
  const updateExt = (nome: string, patch: Partial<SalvadanaioPatch>) => {
    setExtMap((prev) => {
      const next = { ...prev, [nome]: { ...(prev[nome] ?? {}), ...patch } };
      saveSalvadanaiExt(next);
      return next;
    });
  };

  const handleAdd = () => {
    const nome = newNome.trim();
    const obiettivo = parseInt(newObiettivo) || 0;
    if (!nome) { toast.error("Inserisci un nome"); return; }
    if (obiettivo <= 0) { toast.error("L'obiettivo deve essere maggiore di 0"); return; }
    if (items.some((s) => s.nome.toLowerCase() === nome.toLowerCase())) {
      toast.error("Esiste già un salvadanaio con questo nome"); return;
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
    setSalValues((current) => { const next = { ...current }; delete next[name]; return next; });
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

      <h1 className="text-2xl font-semibold tracking-tight mb-1">Gestisci Salvadanai 🐷</h1>
      <p className="text-xs text-muted-foreground mb-6">Aggiorna valori, aggiungi versamenti e traccia i progressi.</p>

      <div className="space-y-3 mb-8">
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
              <SalvadanaiCard
                nome={s.nome}
                obiettivo={s.obiettivo}
                attuale={s.attuale}
                valoreStr={salValues[s.nome] ?? "0"}
                onValoreChange={(v) => setSalValues((prev) => ({ ...prev, [s.nome]: v }))}
                onRemove={() => handleRemove(s.nome)}
                ext={extMap[s.nome] ?? {}}
                onExtChange={(patch) => updateExt(s.nome, patch)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Form nuovo salvadanaio */}
      <div className="mb-8 bg-card border border-border/50 rounded-[1.5rem] p-4">
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
