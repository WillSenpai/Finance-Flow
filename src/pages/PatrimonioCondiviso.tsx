import { useMemo, useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSharedWorkspace } from "@/hooks/useSharedWorkspace";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { loadAssetMetadata } from "@/lib/assetMetadata";
import type { Spesa } from "@/contexts/UserContext";
import { cn } from "@/lib/utils";

const fmt = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

// Category icon backgrounds (matches Patrimonio.tsx)
const CAT_BG: Record<string, string> = {
  liquidità: "#e8f4e8", investimenti: "#e8eef8", immobili: "#f8f0e8",
  crypto: "#f0e8f8", pensione: "#f8e8e8", "pensione / tfr": "#f8e8e8", beni: "#f8f8e8",
};

type Tab = "assets" | "spese";

const PatrimonioCondiviso = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categorie: myCategorie } = useUser();
  const {
    hasActiveWorkspace, workspaceName, categorie, investimenti, spese,
    categorieSpese, members, myRole, deleteWorkspace,
  } = useSharedWorkspace();
  const [tab, setTab] = useState<Tab>("assets");
  const [isDeleting, setIsDeleting] = useState(false);

  const activeMembers = members.filter((m) => m.status === "active");
  const totaleAsset = categorie.reduce((a, c) => a + c.valore, 0) + investimenti.reduce((a, i) => a + i.valore, 0);
  const totaleSpeseStoriche = spese.reduce((a, s) => a + s.importo, 0);
  const nettoCondiviso = totaleAsset - totaleSpeseStoriche;

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const speseMonth = spese.filter((s) => s.data.startsWith(thisMonth));
  const totaleMonth = speseMonth.reduce((a, s) => a + s.importo, 0);

  // Asset condivisi (co-proprietà attiva)
  const metaMap = useMemo(() => loadAssetMetadata(), []);
  const condivisi = useMemo(() =>
    myCategorie
      .map((cat) => {
        const meta = metaMap[cat.nome.toLowerCase()];
        if (!meta?.coProprietà?.attivo) return null;
        const miaPerc = meta.coProprietà.percentuale;
        const partnerName = meta.coProprietà.partnerName ?? "Partner";
        const initials = (n: string) => n.slice(0, 2).toUpperCase();
        return { ...cat, miaPerc, partnerPerc: 100 - miaPerc, partnerName, initials };
      })
      .filter(Boolean) as {
        nome: string; valore: number; emoji: string;
        miaPerc: number; partnerPerc: number; partnerName: string;
        initials: (n: string) => string;
      }[],
    [myCategorie, metaMap],
  );

  // Bilancio mensile per membro
  const memberCount = activeMembers.length;
  const quota = memberCount > 0 ? totaleMonth / memberCount : 0;

  const handleDeleteWorkspace = async () => {
    setIsDeleting(true);
    const result = await deleteWorkspace();
    setIsDeleting(false);
    if (!result.ok) { toast.error(result.error ?? "Impossibile eliminare"); return; }
    toast.success("Workspace eliminato");
    navigate("/patrimonio");
  };

  if (!hasActiveWorkspace) {
    return (
      <motion.div className="px-5 pt-14 pb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary text-sm font-medium mb-6">
          <ArrowLeft size={18} /> Indietro
        </button>
        <div className="py-10 text-center">
          <p className="text-4xl mb-3">🤝</p>
          <p className="text-sm font-semibold">Nessun workspace condiviso</p>
          <p className="text-xs text-muted-foreground mt-1">Crea o accetta un invito dalla sezione Condivisione.</p>
          <Button className="rounded-xl h-10 mt-5" onClick={() => navigate("/patrimonio/condivisione")}>
            Vai a Condivisione
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="pt-14 pb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Back button */}
      <div className="px-5 mb-0">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary text-sm font-medium">
          <ArrowLeft size={18} /> Indietro
        </button>
      </div>

      {/* Hero verde */}
      <div
        className="mx-4 mt-3 rounded-[1.5rem] p-5 text-white"
        style={{ background: "linear-gradient(145deg, #2d5016, #4a7c2a)" }}
      >
        <p className="text-[11px] uppercase tracking-[0.07em] opacity-70">{workspaceName ?? "Patrimonio di coppia"}</p>
        <p className="text-[36px] font-bold leading-none mt-1">{fmt(totaleAsset)}</p>
        <p className="text-[13px] opacity-80 mt-1">Netto condiviso: {fmt(nettoCondiviso)}</p>

        {/* Members row */}
        <div className="mt-4 flex items-center gap-3">
          {activeMembers[0] && (
            <div className="flex flex-col items-center gap-1">
              <div className="h-11 w-11 rounded-full flex items-center justify-center text-xl border-2 border-white/40" style={{ background: "rgba(255,255,255,0.2)" }}>
                👤
              </div>
              <p className="text-[11px] opacity-80">{activeMembers[0].name}</p>
            </div>
          )}
          <div className="flex-1">
            <div className="flex justify-between text-[11px] opacity-70 mb-1">
              <span>50%</span><span>50%</span>
            </div>
            <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
              <div className="h-full rounded-full" style={{ width: "50%", background: "#7fff7f" }} />
            </div>
          </div>
          {activeMembers[1] && (
            <div className="flex flex-col items-center gap-1">
              <div className="h-11 w-11 rounded-full flex items-center justify-center text-xl border-2 border-white/40" style={{ background: "rgba(255,255,255,0.2)" }}>
                👤
              </div>
              <p className="text-[11px] opacity-80">{activeMembers[1].name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tab switcher */}
      <div className="px-4 mt-4">
        <div className="flex bg-white rounded-[14px] p-1 gap-1">
          {(["assets", "spese"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 rounded-[10px] py-2.5 text-sm font-semibold text-center transition-colors",
                tab === t ? "bg-[#8b7355] text-white" : "text-[#9e8a72]",
              )}
            >
              {t === "assets" ? "Asset condivisi" : "Spese condivise"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab: Asset condivisi ── */}
      {tab === "assets" && (
        <div className="px-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] uppercase tracking-[0.07em] text-muted-foreground font-semibold">
              {condivisi.length} asset condivisi
            </span>
            <button type="button" onClick={() => navigate("/patrimonio/gestisci")} className="text-[13px] font-semibold text-primary">
              + Aggiungi →
            </button>
          </div>

          {condivisi.length === 0 ? (
            <div className="rounded-[1.25rem] bg-white py-10 text-center shadow-sm">
              <p className="text-3xl mb-2">🤝</p>
              <p className="text-sm font-medium">Nessun asset condiviso</p>
              <p className="text-xs text-muted-foreground mt-1">Attiva la co-proprietà in "Aggiungi Asset".</p>
            </div>
          ) : (
            <div className="rounded-[1.25rem] bg-white overflow-hidden shadow-sm">
              {condivisi.map((a, idx) => {
                const bg = CAT_BG[a.nome.toLowerCase()] ?? "#f4ede3";
                const myName = activeMembers.find((m) => m.userId === user?.id)?.name ?? "Tu";
                return (
                  <div key={a.nome} className={cn("flex items-center gap-3 px-4 py-3.5", idx < condivisi.length - 1 ? "border-b border-[#f0e8dc]" : "")}>
                    <div className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-lg" style={{ background: bg }}>
                      {a.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-[#2d2416]">{a.nome}</p>
                      <p className="text-[11px] text-[#9e8a72]">{metaMap[a.nome.toLowerCase()]?.istituto ?? "—"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[15px] font-bold text-[#2d2416]">{fmt(a.valore)}</p>
                      <div className="flex gap-1 mt-1 justify-end">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ background: "#fdf0e0", color: "#7a5530" }}>
                          {myName.slice(0, 2).toUpperCase()} {a.miaPerc}%
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ background: "#e8f5e2", color: "#2d5016" }}>
                          {a.partnerName.slice(0, 2).toUpperCase()} {a.partnerPerc}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bilancio */}
          <div className="mt-5">
            <p className="text-[12px] uppercase tracking-[0.07em] text-muted-foreground font-semibold mb-3">Bilancio mensile</p>
            <div className="rounded-[1.25rem] bg-white overflow-hidden shadow-sm">
              {totaleMonth === 0 ? (
                <p className="px-4 py-5 text-sm text-muted-foreground">Nessuna spesa condivisa questo mese.</p>
              ) : (
                <>
                  {activeMembers.map((m, idx) => (
                    <div key={m.userId} className={cn("flex justify-between px-4 py-3", idx < activeMembers.length - 1 ? "border-b border-[#f0e8dc]" : "")}>
                      <span className="text-[14px] text-[#5a4a35]">{m.name} ha pagato</span>
                      <span className="text-[14px] font-bold text-[#c0392b]">–{fmt(quota)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between px-4 py-3 border-t border-[#f0e8dc]">
                    <span className="text-[14px] text-[#5a4a35]">Totale spese</span>
                    <span className="text-[14px] font-bold text-[#9e8a72]">{fmt(totaleMonth)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-3 border-t border-[#f0e8dc]">
                    <span className="text-[14px] font-bold text-[#2d2416]">Bilancio</span>
                    <span className="text-[14px] font-bold" style={{ color: "#2d7a1e" }}>In pari</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Spese condivise ── */}
      {tab === "spese" && (
        <div className="px-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] uppercase tracking-[0.07em] text-muted-foreground font-semibold">Spese del mese</span>
            <button type="button" onClick={() => navigate("/patrimonio/condiviso/spese")} className="text-[13px] font-semibold text-primary">
              Gestisci →
            </button>
          </div>

          <div className="rounded-[1.25rem] bg-white overflow-hidden shadow-sm">
            {speseMonth.length === 0 ? (
              <p className="px-4 py-5 text-sm text-muted-foreground text-center">Nessuna spesa questo mese.</p>
            ) : (
              speseMonth.map((s, idx) => {
                const cat = categorieSpese.find((c) => c.id === s.categoriaId);
                return (
                  <div key={s.id} className={cn("flex items-center px-4 py-3 gap-3", idx < speseMonth.length - 1 ? "border-b border-[#f0e8dc]" : "")}>
                    <div className="rounded-[8px] px-2 py-1 text-sm" style={{ background: "#f0e8dc" }}>
                      {cat?.emoji ?? "📦"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-[#2d2416]">{s.descrizione ?? cat?.nome ?? "Spesa"}</p>
                      <p className="text-[11px] text-[#9e8a72]">{new Date(s.data).toLocaleDateString("it-IT", { day: "numeric", month: "short" })}</p>
                    </div>
                    <p className="text-[14px] font-bold text-[#c0392b]">–{fmt(s.importo)}</p>
                  </div>
                );
              })
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => navigate("/patrimonio/condiviso/spese")}
              className="flex-1 rounded-[14px] py-3.5 text-[14px] font-bold text-white text-center"
              style={{ background: "#8b7355" }}
            >
              + Aggiungi spesa
            </button>
            <button
              type="button"
              onClick={() => navigate("/patrimonio/condiviso")}
              className="flex-1 rounded-[14px] py-3.5 text-[14px] font-bold text-center border-2"
              style={{ color: "#8b7355", borderColor: "#8b7355" }}
            >
              Regole
            </button>
          </div>
        </div>
      )}

      {/* Zona pericolosa — solo owner */}
      {myRole === "owner" && (
        <div className="px-4 mt-8">
          <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-4">
            <p className="text-sm font-semibold">Zona pericolosa</p>
            <p className="mt-1 text-xs text-muted-foreground">Elimina workspace, membri e tutti i dati condivisi.</p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="mt-3 h-9 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5">
                  <Trash2 size={14} /> Elimina workspace
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-sm rounded-[1.5rem]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Eliminare il workspace?</AlertDialogTitle>
                  <AlertDialogDescription>Azione irreversibile. Verranno rimossi tutti i dati condivisi.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Annulla</AlertDialogCancel>
                  <AlertDialogAction
                    className="rounded-xl bg-destructive text-destructive-foreground"
                    onClick={() => void handleDeleteWorkspace()}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "..." : "Conferma"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PatrimonioCondiviso;
