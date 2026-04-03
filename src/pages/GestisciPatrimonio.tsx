import { useEffect, useState } from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import {
  type AssetMetadata,
  loadAssetMetadata,
  saveAssetMetadata,
  isAssetStale,
} from "@/lib/assetMetadata";
import { useSharedWorkspace } from "@/hooks/useSharedWorkspace";

const fmt = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const FREQUENZE = [
  { id: "mensile", label: "Mensile" },
  { id: "trimestrale", label: "Trimestrale" },
  { id: "annuale", label: "Annuale" },
] as const;

const GestisciPatrimonio = () => {
  const { categorie, setCategorie } = useUser();
  const navigate = useNavigate();
  const { members, hasActiveWorkspace } = useSharedWorkspace();
  const activePartners = members.filter((m) => m.status === "active" && m.role !== "owner");

  // --- local draft values (valore per category) ---
  const [valori, setValori] = useState<Record<string, string>>(
    Object.fromEntries(categorie.map((c) => [c.nome, String(c.valore)])),
  );

  // --- metadata map (localStorage) ---
  const [metaMap, setMetaMap] = useState<Record<string, AssetMetadata>>(() => loadAssetMetadata());

  // --- selected category ---
  const [selected, setSelected] = useState<string | null>(categorie[0]?.nome ?? null);

  useEffect(() => {
    if (!selected && categorie.length > 0) setSelected(categorie[0].nome);
  }, [categorie, selected]);

  const selectedCat = categorie.find((c) => c.nome === selected);
  const selectedMeta = selected ? (metaMap[selected.toLowerCase()] ?? {}) : {};

  const updateMeta = (key: string, partial: Partial<AssetMetadata>) => {
    const k = key.toLowerCase();
    const next = { ...metaMap, [k]: { ...(metaMap[k] ?? {}), ...partial } };
    setMetaMap(next);
  };

  const handleSave = async () => {
    const next = categorie.map((c) => ({
      ...c,
      valore: Math.max(0, parseFloat(valori[c.nome] || "0") || 0),
    }));

    // Persist extended metadata + mark lastUpdated for changed categories
    const updatedMeta = { ...metaMap };
    next.forEach((c) => {
      const k = c.nome.toLowerCase();
      const wasChanged = c.valore !== categorie.find((o) => o.nome === c.nome)?.valore;
      if (wasChanged) {
        updatedMeta[k] = { ...(updatedMeta[k] ?? {}), lastUpdated: new Date().toISOString() };
      }
    });
    saveAssetMetadata(updatedMeta);
    setMetaMap(updatedMeta);

    await setCategorie(next);
    toast.success("Patrimonio aggiornato ✅");
    navigate(-1);
  };

  if (categorie.length === 0) {
    return (
      <motion.div className="px-5 pt-14 pb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1 text-sm font-medium text-primary">
          <ArrowLeft size={18} /> Indietro
        </button>
        <p className="text-sm text-muted-foreground">Nessuna categoria trovata. Ricarica l'app.</p>
      </motion.div>
    );
  }

  return (
    <motion.div className="px-5 pt-14 pb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1 text-sm font-medium text-primary">
        <ArrowLeft size={18} /> Indietro
      </button>

      <h1 className="text-2xl font-semibold tracking-tight mb-1">Aggiungi Asset 🏦</h1>
      <p className="text-xs text-muted-foreground mb-6">Seleziona una categoria e aggiorna il valore.</p>

      {/* 3×2 Category Picker */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        {categorie.map((cat) => {
          const stale = isAssetStale(cat.nome);
          const isSelected = selected === cat.nome;
          return (
            <button
              key={cat.nome}
              type="button"
              onClick={() => setSelected(cat.nome)}
              className={cn(
                "relative flex flex-col items-center gap-1.5 rounded-[1.5rem] border p-3 text-center transition-all",
                isSelected
                  ? "border-primary bg-primary/8 shadow-[0_8px_20px_-14px_hsl(var(--primary)/0.5)]"
                  : "border-border/60 bg-card hover:border-primary/40",
              )}
            >
              {stale && (
                <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-orange-400" />
              )}
              <span className="text-2xl leading-none">{cat.emoji}</span>
              <span className="text-[11px] font-medium leading-tight">{cat.nome}</span>
              <span className="text-[10px] text-muted-foreground">{fmt(cat.valore)}</span>
            </button>
          );
        })}
      </div>

      {/* Detail form for selected category */}
      <AnimatePresence mode="wait">
        {selectedCat && (
          <motion.div
            key={selectedCat.nome}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="space-y-4"
          >
            <div className="rounded-[1.85rem] border border-border/60 bg-card p-4 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{selectedCat.emoji}</span>
                <p className="text-sm font-semibold">{selectedCat.nome}</p>
                {isAssetStale(selectedCat.nome) && (
                  <span className="flex items-center gap-1 rounded-full bg-orange-400/15 px-2 py-0.5 text-[10px] font-semibold text-orange-600">
                    <AlertCircle size={10} /> Aggiornamento consigliato
                  </span>
                )}
              </div>

              {/* Nome asset */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Nome</label>
                <Input
                  placeholder="es. Conto BancoPosta"
                  value={selectedMeta.nome ?? ""}
                  onChange={(e) => updateMeta(selectedCat.nome, { nome: e.target.value })}
                  className="rounded-xl bg-background"
                />
              </div>

              {/* Valore */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Valore attuale</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                  <Input
                    type="number"
                    value={valori[selectedCat.nome] ?? ""}
                    onChange={(e) => setValori((v) => ({ ...v, [selectedCat.nome]: e.target.value }))}
                    className="pl-7 rounded-xl bg-background"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Istituto / broker */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Istituto / Broker</label>
                <Input
                  placeholder="es. Fineco, DEGIRO, UniCredit..."
                  value={selectedMeta.istituto ?? ""}
                  onChange={(e) => updateMeta(selectedCat.nome, { istituto: e.target.value })}
                  className="rounded-xl bg-background"
                />
              </div>

              {/* Data acquisizione */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Data acquisizione</label>
                <Input
                  type="date"
                  value={selectedMeta.dataAcquisizione ?? ""}
                  onChange={(e) => updateMeta(selectedCat.nome, { dataAcquisizione: e.target.value })}
                  className="rounded-xl bg-background"
                />
              </div>

              {/* Auto-aggiornamento toggle */}
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background px-3.5 py-3">
                <div>
                  <p className="text-sm font-medium">Aggiornamento automatico</p>
                  <p className="text-[11px] text-muted-foreground">Ricevi promemoria per aggiornare</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateMeta(selectedCat.nome, { autoAggiornamento: !selectedMeta.autoAggiornamento })}
                  className={cn(
                    "relative h-6 w-11 rounded-full transition-colors",
                    selectedMeta.autoAggiornamento ? "bg-primary" : "bg-muted",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                      selectedMeta.autoAggiornamento ? "left-[22px]" : "left-0.5",
                    )}
                  />
                </button>
              </div>

              {/* Frequenza — visible only when autoAggiornamento is on */}
              <AnimatePresence initial={false}>
                {selectedMeta.autoAggiornamento && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <label className="text-xs text-muted-foreground mb-1.5 block">Frequenza</label>
                    <div className="grid grid-cols-3 gap-2">
                      {FREQUENZE.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => updateMeta(selectedCat.nome, { frequenzaAggiornamento: f.id })}
                          className={cn(
                            "rounded-full border px-3 py-2 text-xs font-medium transition-colors",
                            selectedMeta.frequenzaAggiornamento === f.id
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background text-muted-foreground",
                          )}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Collegato a passività */}
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background px-3.5 py-3">
                <div>
                  <p className="text-sm font-medium">Collegato a passività?</p>
                  <p className="text-[11px] text-muted-foreground">Mutuo / Finanziamento associato</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateMeta(selectedCat.nome, { collegatoPassivita: !selectedMeta.collegatoPassivita })}
                  className={cn(
                    "relative h-6 w-11 rounded-full transition-colors",
                    selectedMeta.collegatoPassivita ? "bg-primary" : "bg-muted",
                  )}
                >
                  <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", selectedMeta.collegatoPassivita ? "left-[22px]" : "left-0.5")} />
                </button>
              </div>

              {/* Co-proprietà toggle */}
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background px-3.5 py-3">
                <div>
                  <p className="text-sm font-medium">Co-proprietà</p>
                  <p className="text-[11px] text-muted-foreground">Asset condiviso con il tuo partner</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateMeta(selectedCat.nome, {
                      coProprietà: selectedMeta.coProprietà?.attivo
                        ? null
                        : { attivo: true, percentuale: 50, partnerName: "" },
                    })
                  }
                  className={cn(
                    "relative h-6 w-11 rounded-full transition-colors",
                    selectedMeta.coProprietà?.attivo ? "bg-primary" : "bg-muted",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                      selectedMeta.coProprietà?.attivo ? "left-[22px]" : "left-0.5",
                    )}
                  />
                </button>
              </div>

              {/* Co-proprietà detail */}
              <AnimatePresence initial={false}>
                {selectedMeta.coProprietà?.attivo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs text-muted-foreground">
                          Tua quota: <span className="font-semibold text-foreground">{selectedMeta.coProprietà.percentuale}%</span>
                        </label>
                        <span className="text-xs text-muted-foreground">
                          Partner: {100 - selectedMeta.coProprietà.percentuale}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={selectedMeta.coProprietà.percentuale}
                        onChange={(e) =>
                          updateMeta(selectedCat.nome, {
                            coProprietà: { ...selectedMeta.coProprietà!, percentuale: Number(e.target.value) },
                          })
                        }
                        className="w-full accent-primary"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                        <span>0%</span><span>50%</span><span>100%</span>
                      </div>
                    </div>

                    {hasActiveWorkspace && activePartners.length > 0 ? (
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">Partner</label>
                        <div className="space-y-1.5">
                          {activePartners.map((p) => (
                            <button
                              key={p.userId}
                              type="button"
                              onClick={() =>
                                updateMeta(selectedCat.nome, {
                                  coProprietà: { ...selectedMeta.coProprietà!, partnerName: p.name },
                                })
                              }
                              className={cn(
                                "w-full rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                                selectedMeta.coProprietà?.partnerName === p.name
                                  ? "border-primary bg-primary/8"
                                  : "border-border/60 bg-background",
                              )}
                            >
                              {p.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Nome partner</label>
                        <Input
                          placeholder="es. Marco"
                          value={selectedMeta.coProprietà?.partnerName ?? ""}
                          onChange={(e) =>
                            updateMeta(selectedCat.nome, {
                              coProprietà: { ...selectedMeta.coProprietà!, partnerName: e.target.value },
                            })
                          }
                          className="rounded-xl bg-background"
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div whileTap={{ scale: 0.97 }}>
              <Button onClick={handleSave} className="w-full rounded-2xl h-12 text-base">
                Salva modifiche ✅
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GestisciPatrimonio;
