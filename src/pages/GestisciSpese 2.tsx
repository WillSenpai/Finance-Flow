import { useState } from "react";
import { ArrowLeft, Plus, X, Tag, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Spesa } from "@/contexts/UserContext";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { toast } from "sonner";

const ricorrenze = [
  { value: "once" as const, label: "Una tantum" },
  { value: "daily" as const, label: "Giornaliera" },
  { value: "weekly" as const, label: "Settimanale" },
  { value: "monthly" as const, label: "Mensile" },
  { value: "yearly" as const, label: "Annuale" },
];

const formatEuro = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(n);

const GestisciSpese = () => {
  const navigate = useNavigate();
  const { spese, setSpese, categorieSpese } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [importo, setImporto] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [ricorrenza, setRicorrenza] = useState<Spesa["ricorrenza"]>("once");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [nota, setNota] = useState("");
  const [badgeInput, setBadgeInput] = useState("");
  const [badges, setBadges] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nlInput, setNlInput] = useState("");
  const [nlLoading, setNlLoading] = useState(false);

  const PARSE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parse-spesa`;

  const parseNaturalLanguage = async () => {
    if (!nlInput.trim() || nlLoading) return;
    setNlLoading(true);
    try {
      const { data, error: sessionError } = await supabase.auth.getSession();
      const accessToken = data.session?.access_token;
      if (sessionError || !accessToken) {
        toast.error("Sessione non valida. Effettua di nuovo il login.");
        return;
      }

      const resp = await fetch(PARSE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ text: nlInput, categorie: categorieSpese }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Errore" }));
        toast.error(err.error || "Errore nel parsing");
        return;
      }
      const parsed = await resp.json();
      if (parsed.importo) setImporto(String(parsed.importo));
      if (parsed.categoriaId) setCategoriaId(parsed.categoriaId);
      if (parsed.nota) setNota(parsed.nota);
      setShowForm(true);
      setNlInput("");
      toast.success("Spesa riconosciuta! Controlla e conferma.");
    } catch (e) {
      toast.error("Errore di connessione");
    } finally {
      setNlLoading(false);
    }
  };

  const resetForm = () => {
    setImporto("");
    setCategoriaId("");
    setRicorrenza("once");
    setData(new Date().toISOString().split("T")[0]);
    setNota("");
    setBadges([]);
    setBadgeInput("");
    setEditingId(null);
    setShowForm(false);
  };

  const addBadge = () => {
    const t = badgeInput.trim();
    if (t && !badges.includes(t)) {
      setBadges([...badges, t]);
      setBadgeInput("");
    }
  };

  const salvaSpesa = () => {
    const val = parseFloat(importo);
    if (!val || !categoriaId) return;

    if (editingId) {
      setSpese(spese.map((s) => s.id === editingId ? { ...s, importo: val, categoriaId, ricorrenza, data, nota: nota || undefined, badge: badges } : s));
    } else {
      const nuova: Spesa = {
        id: crypto.randomUUID(),
        importo: val,
        categoriaId,
        badge: badges,
        data,
        nota: nota || undefined,
        ricorrenza,
      };
      setSpese([nuova, ...spese]);
    }
    resetForm();
  };

  const editSpesa = (s: Spesa) => {
    setImporto(s.importo.toString());
    setCategoriaId(s.categoriaId);
    setRicorrenza(s.ricorrenza);
    setData(s.data);
    setNota(s.nota || "");
    setBadges(s.badge);
    setEditingId(s.id);
    setShowForm(true);
  };

  const deleteSpesa = (id: string) => {
    setSpese(spese.filter((s) => s.id !== id));
  };

  const getCat = (id: string) => categorieSpese.find((c) => c.id === id);

  // Group by month
  const grouped = spese.reduce<Record<string, Spesa[]>>((acc, s) => {
    const month = s.data.substring(0, 7);
    if (!acc[month]) acc[month] = [];
    acc[month].push(s);
    return acc;
  }, {});

  return (
    <motion.div className="px-5 pt-14 pb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft size={18} /> Indietro
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Gestisci Spese 💸</h1>
        <Button size="sm" className="rounded-full gap-1" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus size={16} /> Aggiungi
        </Button>
      </div>

      {/* Natural Language Input */}
      <div className="bg-card border border-border/50 rounded-2xl p-4 mb-4">
        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
          <Sparkles size={12} /> Aggiungi con linguaggio naturale
        </p>
        <div className="flex gap-2">
          <Input
            value={nlInput}
            onChange={(e) => setNlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && parseNaturalLanguage()}
            placeholder='Es: "42€ sushi ieri sera"'
            className="rounded-xl h-10 flex-1 text-sm"
            disabled={nlLoading}
          />
          <Button size="sm" onClick={parseNaturalLanguage} disabled={nlLoading || !nlInput.trim()} className="rounded-xl h-10 gap-1">
            {nlLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          </Button>
        </div>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card border border-border/50 rounded-2xl p-5 mb-6 overflow-hidden"
          >
            <h2 className="text-sm font-semibold mb-4">{editingId ? "Modifica spesa" : "Nuova spesa"}</h2>
            <div className="space-y-3">
              <Input
                type="number"
                step="0.01"
                placeholder="Importo (€)"
                value={importo}
                onChange={(e) => setImporto(e.target.value)}
                className="rounded-xl h-11"
              />

              <Select value={categoriaId} onValueChange={setCategoriaId}>
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorieSpese.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.emoji} {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={ricorrenza} onValueChange={(v) => setRicorrenza(v as Spesa["ricorrenza"])}>
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue placeholder="Ricorrenza" />
                </SelectTrigger>
                <SelectContent>
                  {ricorrenze.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="rounded-xl h-11"
              />

              {/* Badges */}
              <div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Aggiungi badge/tag..."
                    value={badgeInput}
                    onChange={(e) => setBadgeInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBadge())}
                    className="rounded-xl h-11 flex-1"
                  />
                  <Button type="button" variant="outline" size="icon" className="rounded-xl h-11 w-11" onClick={addBadge}>
                    <Tag size={16} />
                  </Button>
                </div>
                {badges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {badges.map((b) => (
                      <span key={b} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full flex items-center gap-1">
                        {b}
                        <button onClick={() => setBadges(badges.filter((x) => x !== b))}><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <Textarea
                placeholder="Nota (opzionale)"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                className="rounded-xl min-h-[60px]"
              />

              <div className="flex gap-2">
                <Button variant="outline" onClick={resetForm} className="flex-1 rounded-xl">Annulla</Button>
                <Button onClick={salvaSpesa} disabled={!importo || !categoriaId} className="flex-1 rounded-xl">
                  {editingId ? "Salva" : "Aggiungi"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expense list */}
      {Object.keys(grouped).length === 0 && !showForm && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-sm">Nessuna spesa ancora registrata</p>
        </div>
      )}

      {Object.entries(grouped)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([month, items]) => {
          const [y, m] = month.split("-");
          const total = items.reduce((acc, s) => acc + s.importo, 0);
          return (
            <div key={month} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold capitalize">
                  {format(new Date(parseInt(y), parseInt(m) - 1), "MMMM yyyy", { locale: it })}
                </h3>
                <span className="text-sm font-bold text-destructive">{formatEuro(total)}</span>
              </div>
              <div className="space-y-2">
                {items.map((s) => {
                  const cat = getCat(s.categoriaId);
                  return (
                    <motion.div
                      key={s.id}
                      layout
                      className="bg-card border border-border/50 rounded-2xl p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: cat ? `${cat.colore}20` : undefined }}>
                            {cat?.emoji || "📦"}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{cat?.nome || "Altro"}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(s.data), "d MMM", { locale: it })}
                              {s.ricorrenza !== "once" && ` • ${ricorrenze.find((r) => r.value === s.ricorrenza)?.label}`}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-bold">{formatEuro(s.importo)}</p>
                      </div>
                      {s.badge.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {s.badge.map((b) => (
                            <span key={b} className="text-[10px] bg-accent text-accent-foreground px-2 py-0.5 rounded-full">{b}</span>
                          ))}
                        </div>
                      )}
                      {s.nota && <p className="text-xs text-muted-foreground mt-2">{s.nota}</p>}
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => editSpesa(s)} className="text-xs text-primary font-medium">Modifica</button>
                        <button onClick={() => deleteSpesa(s.id)} className="text-xs text-destructive font-medium">Elimina</button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
    </motion.div>
  );
};

export default GestisciSpese;
