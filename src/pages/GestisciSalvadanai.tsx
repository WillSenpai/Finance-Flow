import { useState } from "react";
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

const CAT_TAG: Record<SalvadanaiCategoria, { bg: string; color: string }> = {
  viaggi:    { bg: "#e0ecff", color: "#1a4a99" },
  casa:      { bg: "#f0e0ff", color: "#6a2a99" },
  auto:      { bg: "#fff0e0", color: "#a05a20" },
  emergenza: { bg: "#e0ffe0", color: "#1a7a1a" },
  altro:     { bg: "#f0e8dc", color: "#7a5530" },
};

// ---------------------------------------------------------------------------
// Card goal — mockup v2 style
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

const SalvadanaiCard = ({ nome, obiettivo, valoreStr, onValoreChange, onRemove, ext, onExtChange }: SalvadanaiCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [newVersamentoImporto, setNewVersamentoImporto] = useState("");
  const [newVersamentoNota, setNewVersamentoNota] = useState("");

  const currentAttuale = Math.max(0, parseFloat(valoreStr || "0") || 0);
  const pct = obiettivo > 0 ? Math.min(100, Math.round((currentAttuale / obiettivo) * 100)) : 0;
  const mancano = Math.max(0, obiettivo - currentAttuale);
  const proiezione = proiezioneMesi(currentAttuale, obiettivo, ext.versamenti ?? []);
  const catMeta = ext.categoria ? SALVADANAIO_CATEGORIE.find((c) => c.id === ext.categoria) : null;
  const tagStyle = ext.categoria ? CAT_TAG[ext.categoria] : null;
  // Extract emoji from nome (first emoji char)
  const emojiMatch = nome.match(/\p{Emoji}/u);
  const emoji = emojiMatch?.[0] ?? "🐷";

  const handleAddVersamento = () => {
    const importo = parseFloat(newVersamentoImporto);
    if (!importo || importo <= 0) { toast.error("Importo non valido"); return; }
    addVersamento(nome, { data: new Date().toISOString().split("T")[0], importo, nota: newVersamentoNota || undefined });
    const updated = loadSalvadanaiExt();
    onExtChange({ versamenti: updated[nome]?.versamenti ?? [] });
    onValoreChange(String(Math.min(obiettivo, currentAttuale + importo)));
    setNewVersamentoImporto("");
    setNewVersamentoNota("");
    toast.success(`+${formatEuro(importo)} aggiunto`);
  };

  return (
    <div className="rounded-[1.25rem] bg-white shadow-sm overflow-hidden">
      <div className="p-4">
        {/* Top: emoji + name + menu */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[22px] leading-none mb-1">{emoji}</p>
            <p className="text-[16px] font-bold text-[#2d2416]">{nome}</p>
            <div className="flex items-center gap-2 mt-1">
              {catMeta && tagStyle && (
                <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={{ background: tagStyle.bg, color: tagStyle.color }}>
                  {catMeta.emoji} {catMeta.label}
                </span>
              )}
              <span className="text-[11px] text-[#9e8a72]">
                {ext.scadenza
                  ? `Scade ${new Date(ext.scadenza).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })}`
                  : "Senza scadenza"}
              </span>
            </div>
          </div>
          <button type="button" onClick={onRemove} className="text-muted-foreground/40 hover:text-destructive p-0.5 mt-0.5">
            <Trash2 size={14} />
          </button>
        </div>

        {/* Progress row */}
        <div className="flex justify-between text-[13px] text-[#5a4a35] mb-1.5">
          <span>{formatEuro(currentAttuale)} di {formatEuro(obiettivo)}</span>
          <span className="font-bold text-[#8b7355]">{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-[#f0e8dc] overflow-hidden">
          <div className="h-full rounded-full bg-[#8b7355] transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>

        {/* Footer */}
        {pct >= 100 ? (
          <p className="mt-2.5 text-[12px] font-semibold text-green-600">🎉 Obiettivo raggiunto!</p>
        ) : (
          <div className="mt-2.5 flex items-center justify-between">
            <p className="text-[12px] text-[#9e8a72]">
              Mancano {formatEuro(mancano)}
              {proiezione !== null && proiezione > 0 && (
                <> · <Clock size={10} className="inline -mt-0.5" /> {proiezione} {proiezione === 1 ? "mese" : "mesi"}</>
              )}
            </p>
            <button type="button" onClick={() => setExpanded(true)}
              className="rounded-xl px-3.5 py-1.5 text-[13px] font-bold" style={{ background: "#fdf0e0", color: "#8b7355" }}>
              + Aggiungi
            </button>
          </div>
        )}

        {/* Expand toggle */}
        <button type="button" onClick={() => setExpanded((v) => !v)}
          className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {expanded ? "Nascondi dettagli" : "Mostra dettagli"}
        </button>
      </div>

      {/* Expanded section */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-[#f0e8dc]">
            <div className="p-4 space-y-4">
              {/* Valore attuale */}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Valore attuale</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                  <Input type="number" value={valoreStr} onChange={(e) => onValoreChange(e.target.value)} className="pl-7 rounded-xl bg-background" />
                </div>
              </div>

              {/* Categoria */}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Categoria</label>
                <div className="flex flex-wrap gap-1.5">
                  {SALVADANAIO_CATEGORIE.map((cat) => (
                    <button key={cat.id} type="button" onClick={() => onExtChange({ categoria: cat.id as SalvadanaiCategoria })}
                      className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                        ext.categoria === cat.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground")}>
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scadenza */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Scadenza obiettivo</label>
                <Input type="date" value={ext.scadenza ?? ""} onChange={(e) => onExtChange({ scadenza: e.target.value || undefined })} className="rounded-xl bg-background" />
              </div>

              {/* Descrizione */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Note / Descrizione</label>
                <Input placeholder="es. Vacanza estiva a settembre..." value={ext.descrizione ?? ""} onChange={(e) => onExtChange({ descrizione: e.target.value || undefined })} className="rounded-xl bg-background" />
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
                <div className="mt-3 flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">€</span>
                    <Input type="number" placeholder="Importo" value={newVersamentoImporto} onChange={(e) => setNewVersamentoImporto(e.target.value)} className="pl-7 h-9 rounded-xl bg-background text-xs" />
                  </div>
                  <Input placeholder="Nota (opz.)" value={newVersamentoNota} onChange={(e) => setNewVersamentoNota(e.target.value)} className="flex-1 h-9 rounded-xl bg-background text-xs" />
                  <Button type="button" size="icon" className="h-9 w-9 min-w-9 rounded-xl shrink-0" onClick={handleAddVersamento}>
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNome, setNewNome] = useState("");
  const [newEmoji, setNewEmoji] = useState("🐷");
  const [newObiettivo, setNewObiettivo] = useState("");

  const updateExt = (nome: string, patch: Partial<SalvadanaioPatch>) => {
    setExtMap((prev) => {
      const next = { ...prev, [nome]: { ...(prev[nome] ?? {}), ...patch } };
      saveSalvadanaiExt(next);
      return next;
    });
  };

  // Summary stats
  const totaleAccantonato = items.reduce((acc, s) => acc + (parseFloat(salValues[s.nome] || "0") || 0), 0);
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const versamentMese = items.reduce((acc, s) => {
    const vers = extMap[s.nome]?.versamenti ?? [];
    return acc + vers.filter((v) => v.data.startsWith(thisMonth)).reduce((a, v) => a + v.importo, 0);
  }, 0);

  const handleAdd = () => {
    const nome = newNome.trim();
    const obiettivo = parseInt(newObiettivo) || 0;
    if (!nome) { toast.error("Inserisci un nome"); return; }
    if (obiettivo <= 0) { toast.error("Obiettivo deve essere > 0"); return; }
    const displayName = `${nome} ${newEmoji || "🐷"}`;
    if (items.some((s) => s.nome.toLowerCase() === displayName.toLowerCase())) {
      toast.error("Nome già esistente"); return;
    }
    setItems((prev) => [...prev, { nome: displayName, obiettivo, attuale: 0 }]);
    setSalValues((v) => ({ ...v, [displayName]: "0" }));
    setNewNome(""); setNewEmoji("🐷"); setNewObiettivo("");
    setShowAddForm(false);
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
    <motion.div className="pt-14 pb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
      <div className="px-5 mb-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary text-sm font-medium mb-5">
          <ArrowLeft size={18} /> Indietro
        </button>
        <h1 className="text-2xl font-semibold tracking-tight">Salvadanai 🐷</h1>
      </div>

      {/* Summary header card */}
      <div className="px-4 mb-4">
        <div className="rounded-[1.25rem] bg-white p-4 shadow-sm flex justify-between items-start">
          <div>
            <p className="text-[12px] uppercase tracking-[0.06em] text-[#9e8a72]">Totale accantonato</p>
            <p className="text-[28px] font-bold text-[#2d2416] mt-1 leading-none">{formatEuro(totaleAccantonato)}</p>
          </div>
          <div className="text-right">
            <p className="text-[12px] text-[#9e8a72]">{items.length} {items.length === 1 ? "obiettivo attivo" : "obiettivi attivi"}</p>
            {versamentMese > 0 && (
              <p className="text-[14px] font-bold text-[#8b7355] mt-1">+{formatEuro(versamentMese)} questo mese</p>
            )}
          </div>
        </div>
      </div>

      {/* Goal cards */}
      <div className="px-4 space-y-2.5 mb-4">
        <AnimatePresence initial={false}>
          {items.map((s) => (
            <motion.div key={s.nome} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, x: -80, height: 0 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
              <SalvadanaiCard
                nome={s.nome} obiettivo={s.obiettivo} attuale={s.attuale}
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

      {/* Dashed "+ Nuovo salvadanaio" button / inline form */}
      <div className="px-4 mb-6">
        <AnimatePresence initial={false}>
          {!showAddForm ? (
            <button type="button" onClick={() => setShowAddForm(true)}
              className="w-full rounded-[1.25rem] border-2 border-dashed border-[#c8bfb4] bg-white py-5 flex items-center justify-center gap-2 text-[14px] font-semibold text-[#9e8a72]">
              <span className="text-xl leading-none">+</span> Nuovo salvadanaio
            </button>
          ) : (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="rounded-[1.25rem] bg-white p-4 shadow-sm space-y-3">
                <p className="text-xs font-semibold text-muted-foreground">Nuovo Salvadanaio</p>
                <div className="flex gap-2">
                  <Input placeholder="Nome" value={newNome} onChange={(e) => setNewNome(e.target.value)} className="flex-1 rounded-xl bg-background" />
                  <Input placeholder="🐷" value={newEmoji} onChange={(e) => setNewEmoji(e.target.value)} className="w-14 text-center rounded-xl bg-background" maxLength={2} />
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                    <Input type="number" placeholder="Obiettivo" value={newObiettivo} onChange={(e) => setNewObiettivo(e.target.value)} className="pl-7 rounded-xl bg-background" />
                  </div>
                  <Button onClick={handleAdd} size="icon" className="h-10 w-10 rounded-xl shrink-0"><Plus size={18} /></Button>
                </div>
                <button type="button" onClick={() => setShowAddForm(false)} className="text-xs text-muted-foreground">Annulla</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Save button */}
      <div className="px-4">
        <motion.div whileTap={{ scale: 0.97 }}>
          <Button onClick={handleSave} className="w-full rounded-2xl h-12 text-base">Salva modifiche ✅</Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GestisciSalvadanai;
