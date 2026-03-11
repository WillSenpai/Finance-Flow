import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { it } from "date-fns/locale";

import type { CategoriaSpesa, Spesa } from "@/contexts/UserContext";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const ricorrenze = [
  { value: "once" as const, label: "Una tantum" },
  { value: "daily" as const, label: "Giornaliera" },
  { value: "weekly" as const, label: "Settimanale" },
  { value: "monthly" as const, label: "Mensile" },
  { value: "yearly" as const, label: "Annuale" },
];

const pageTransition = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

const sectionTransition = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

const formatEuro = (n: number) =>
  new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(n);

const getMonthKey = (date: string) => date.substring(0, 7);

const getMonthLabel = (month: string) => {
  const [year, monthNumber] = month.split("-");
  return format(new Date(Number(year), Number(monthNumber) - 1, 1), "MMMM yyyy", { locale: it });
};

const getRicorrenzaLabel = (value: Spesa["ricorrenza"]) =>
  ricorrenze.find((item) => item.value === value)?.label ?? "Una tantum";

const sortByDateDesc = (a: Spesa, b: Spesa) => {
  const dateComparison = b.data.localeCompare(a.data);
  if (dateComparison !== 0) return dateComparison;
  return b.id.localeCompare(a.id);
};

const createEmptyState = () => ({
  importo: "",
  categoriaId: "",
  ricorrenza: "once" as Spesa["ricorrenza"],
  data: new Date().toISOString().split("T")[0],
  nota: "",
  badgeInput: "",
  badges: [] as string[],
  editingId: null as string | null,
});

const GestisciSpese = () => {
  const navigate = useNavigate();
  const { spese, setSpese, categorieSpese } = useUser();
  const pageRef = useRef<HTMLDivElement>(null);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<"all" | string>("all");
  const [nlInput, setNlInput] = useState("");
  const [nlLoading, setNlLoading] = useState(false);
  const [formState, setFormState] = useState(createEmptyState);

  const PARSE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parse-spesa`;

  const resetForm = () => {
    setFormState(createEmptyState());
    setShowAdvanced(false);
  };

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
      setFormState((current) => ({
        ...current,
        importo: parsed.importo ? String(parsed.importo) : current.importo,
        categoriaId: parsed.categoriaId || current.categoriaId,
        nota: parsed.nota || current.nota,
      }));
      setShowAdvanced(Boolean(parsed.nota));
      setNlInput("");
      toast.success("Spesa riconosciuta. Controlla e conferma.");
    } catch {
      toast.error("Errore di connessione");
    } finally {
      setNlLoading(false);
    }
  };

  const addBadge = () => {
    const next = formState.badgeInput.trim();
    if (!next || formState.badges.includes(next)) return;

    setFormState((current) => ({
      ...current,
      badges: [...current.badges, next],
      badgeInput: "",
    }));
  };

  const removeBadge = (badge: string) => {
    setFormState((current) => ({
      ...current,
      badges: current.badges.filter((item) => item !== badge),
    }));
  };

  const salvaSpesa = () => {
    const valore = Number.parseFloat(formState.importo);
    if (!Number.isFinite(valore) || valore <= 0 || !formState.categoriaId) return;

    if (formState.editingId) {
      setSpese(
        spese.map((spesa) =>
          spesa.id === formState.editingId
            ? {
                ...spesa,
                importo: valore,
                categoriaId: formState.categoriaId,
                ricorrenza: formState.ricorrenza,
                data: formState.data,
                nota: formState.nota || undefined,
                badge: formState.badges,
              }
            : spesa,
        ),
      );
      toast.success("Spesa aggiornata.");
    } else {
      const nuovaSpesa: Spesa = {
        id: crypto.randomUUID(),
        importo: valore,
        categoriaId: formState.categoriaId,
        badge: formState.badges,
        data: formState.data,
        nota: formState.nota || undefined,
        ricorrenza: formState.ricorrenza,
      };
      setSpese([nuovaSpesa, ...spese]);
      toast.success("Spesa aggiunta.");
    }

    resetForm();
  };

  const editSpesa = (spesa: Spesa) => {
    setFormState({
      importo: spesa.importo.toString(),
      categoriaId: spesa.categoriaId,
      ricorrenza: spesa.ricorrenza,
      data: spesa.data,
      nota: spesa.nota || "",
      badgeInput: "",
      badges: spesa.badge,
      editingId: spesa.id,
    });
    setShowAdvanced(Boolean(spesa.nota || spesa.badge.length || spesa.ricorrenza !== "once"));
    pageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const deleteSpesa = (id: string) => {
    setSpese(spese.filter((spesa) => spesa.id !== id));
    if (formState.editingId === id) resetForm();
    toast.success("Spesa eliminata.");
  };

  const categoryById = useMemo(
    () => new Map(categorieSpese.map((categoria) => [categoria.id, categoria])),
    [categorieSpese],
  );

  const monthKeys = useMemo(() => {
    const keys = [...new Set(spese.map((spesa) => getMonthKey(spesa.data)))];
    return keys.sort((a, b) => b.localeCompare(a));
  }, [spese]);

  const filteredSpese = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return [...spese]
      .sort(sortByDateDesc)
      .filter((spesa) => {
        if (selectedMonth !== "all" && getMonthKey(spesa.data) !== selectedMonth) return false;
        if (!term) return true;

        const categoria = categoryById.get(spesa.categoriaId);
        const haystack = [
          categoria?.nome ?? "",
          spesa.nota ?? "",
          ...spesa.badge,
          String(spesa.importo),
          formatEuro(spesa.importo),
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(term);
      });
  }, [categoryById, searchTerm, selectedMonth, spese]);

  const groupedSpese = useMemo(() => {
    return filteredSpese.reduce<Record<string, Spesa[]>>((acc, spesa) => {
      const month = getMonthKey(spesa.data);
      if (!acc[month]) acc[month] = [];
      acc[month].push(spesa);
      return acc;
    }, {});
  }, [filteredSpese]);

  const thisMonthKey = new Date().toISOString().slice(0, 7);
  const thisMonthSpese = useMemo(
    () => spese.filter((spesa) => getMonthKey(spesa.data) === thisMonthKey),
    [spese, thisMonthKey],
  );
  const thisMonthTotal = thisMonthSpese.reduce((total, spesa) => total + spesa.importo, 0);
  const thisMonthAverage = thisMonthSpese.length ? thisMonthTotal / thisMonthSpese.length : 0;
  const latestExpense = useMemo(() => [...spese].sort(sortByDateDesc)[0], [spese]);

  const isFormValid = Number.parseFloat(formState.importo) > 0 && Boolean(formState.categoriaId);

  return (
    <motion.div
      ref={pageRef}
      className="min-h-full bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.08),transparent_38%)] px-4 pb-6 pt-10 sm:px-5"
      initial="hidden"
      animate="show"
      variants={pageTransition}
    >
      <div className="mx-auto flex w-full max-w-[760px] flex-col gap-5">
        <motion.section
          variants={sectionTransition}
          className="overflow-hidden rounded-[28px] border border-border/80 bg-background/95 shadow-[0_18px_60px_-40px_rgba(0,0,0,0.35)]"
        >
          <div className="border-b border-border/70 px-4 pb-4 pt-4 sm:px-5">
            <button
              onClick={() => navigate(-1)}
              className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft size={18} />
              Indietro
            </button>

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Registro spese
                </p>
                <h1 className="mt-1 text-[clamp(1.8rem,4vw,2.35rem)] font-semibold tracking-[-0.04em] text-foreground">
                  Inserisci in pochi secondi, rivedi senza fatica.
                </h1>
                <p className="mt-2 max-w-[42rem] text-sm leading-6 text-muted-foreground">
                  La pagina resta unica: aggiungi velocemente una spesa, poi controlla subito mese, storico e dettagli.
                </p>
              </div>

              <Button
                size="sm"
                className="shrink-0 rounded-full px-4"
                onClick={resetForm}
                disabled={!formState.editingId && !formState.importo && !formState.categoriaId && !formState.nota && !formState.badges.length}
              >
                <Plus size={15} />
                Nuova
              </Button>
            </div>
          </div>

          <div className="grid gap-3 border-b border-border/70 bg-muted/25 px-4 py-4 sm:grid-cols-3 sm:px-5">
            <MetricBox label="Questo mese" value={formatEuro(thisMonthTotal)} detail={`${thisMonthSpese.length} movimenti`} />
            <MetricBox label="Media spesa" value={formatEuro(thisMonthAverage)} detail="calcolata sul mese corrente" />
            <MetricBox
              label="Ultima registrazione"
              value={latestExpense ? formatEuro(latestExpense.importo) : "Nessuna"}
              detail={latestExpense ? format(new Date(latestExpense.data), "d MMMM", { locale: it }) : "inizia da qui"}
            />
          </div>

          <div className="space-y-5 px-4 py-5 sm:px-5">
            <div className="rounded-2xl border border-border/70 bg-card/65 p-3.5">
              <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <Sparkles size={14} />
                Aggiunta rapida
              </div>
              <div className="flex gap-2">
                <Input
                  value={nlInput}
                  onChange={(event) => setNlInput(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && parseNaturalLanguage()}
                  placeholder='Es: "42 euro sushi ieri sera"'
                  className="h-11 rounded-2xl border-border/80 bg-background text-sm"
                  disabled={nlLoading}
                />
                <Button
                  onClick={parseNaturalLanguage}
                  disabled={nlLoading || !nlInput.trim()}
                  className="h-11 rounded-2xl px-4"
                >
                  {nlLoading ? <Loader2 className="animate-spin" size={15} /> : <Sparkles size={15} />}
                  <span className="hidden sm:inline">Analizza</span>
                </Button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)]">
              <div className="space-y-3 rounded-[24px] border border-border/70 bg-card/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {formState.editingId ? "Modifica spesa" : "Nuova spesa"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Importo, categoria e data sono il nucleo. Il resto resta disponibile ma non intralcia.
                    </p>
                  </div>
                  {formState.editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Esci modifica
                    </button>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_160px]">
                  <label className="space-y-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Importo</span>
                    <div className="flex h-14 items-center rounded-2xl border border-border/80 bg-background px-4">
                      <span className="mr-2 text-base font-semibold text-muted-foreground">€</span>
                      <input
                        type="number"
                        step="0.01"
                        inputMode="decimal"
                        placeholder="0,00"
                        value={formState.importo}
                        onChange={(event) =>
                          setFormState((current) => ({ ...current, importo: event.target.value }))
                        }
                        className="h-full w-full border-none bg-transparent text-2xl font-semibold tracking-[-0.04em] text-foreground outline-none placeholder:text-muted-foreground/45"
                      />
                    </div>
                  </label>

                  <label className="space-y-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Data</span>
                    <div className="relative">
                      <CalendarDays
                        size={16}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <Input
                        type="date"
                        value={formState.data}
                        onChange={(event) =>
                          setFormState((current) => ({ ...current, data: event.target.value }))
                        }
                        className="h-14 rounded-2xl border-border/80 bg-background pl-10"
                      />
                    </div>
                  </label>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Categoria</span>
                    <span className="text-[11px] text-muted-foreground">Selezione rapida</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {categorieSpese.map((categoria) => {
                      const active = formState.categoriaId === categoria.id;
                      return (
                        <button
                          key={categoria.id}
                          type="button"
                          onClick={() =>
                            setFormState((current) => ({ ...current, categoriaId: categoria.id }))
                          }
                          className={cn(
                            "flex min-h-[72px] flex-col items-start justify-between rounded-2xl border px-3 py-3 text-left transition-all",
                            active
                              ? "border-transparent bg-foreground text-background shadow-[0_14px_30px_-22px_rgba(0,0,0,0.6)]"
                              : "border-border/80 bg-background hover:border-border hover:bg-muted/45",
                          )}
                        >
                          <span className="text-xl leading-none">{categoria.emoji}</span>
                          <span className="text-sm font-medium">{categoria.nome}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 border-t border-border/70 pt-3">
                        <div className="grid gap-3 sm:grid-cols-[200px_minmax(0,1fr)]">
                          <div className="space-y-1.5">
                            <span className="text-xs font-medium text-muted-foreground">Ricorrenza</span>
                            <Select
                              value={formState.ricorrenza}
                              onValueChange={(value) =>
                                setFormState((current) => ({
                                  ...current,
                                  ricorrenza: value as Spesa["ricorrenza"],
                                }))
                              }
                            >
                              <SelectTrigger className="h-11 rounded-2xl border-border/80 bg-background">
                                <SelectValue placeholder="Ricorrenza" />
                              </SelectTrigger>
                              <SelectContent>
                                {ricorrenze.map((ricorrenza) => (
                                  <SelectItem key={ricorrenza.value} value={ricorrenza.value}>
                                    {ricorrenza.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-xs font-medium text-muted-foreground">Tag rapidi</span>
                            <div className="flex gap-2">
                              <Input
                                placeholder="es. cena, lavoro, urgenza"
                                value={formState.badgeInput}
                                onChange={(event) =>
                                  setFormState((current) => ({
                                    ...current,
                                    badgeInput: event.target.value,
                                  }))
                                }
                                onKeyDown={(event) => {
                                  if (event.key === "Enter") {
                                    event.preventDefault();
                                    addBadge();
                                  }
                                }}
                                className="h-11 rounded-2xl border-border/80 bg-background"
                              />
                              <Button type="button" variant="outline" size="icon" className="h-11 w-11 rounded-2xl" onClick={addBadge}>
                                <Tag size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {formState.badges.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formState.badges.map((badge) => (
                              <span
                                key={badge}
                                className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground"
                              >
                                {badge}
                                <button
                                  type="button"
                                  onClick={() => removeBadge(badge)}
                                  className="rounded-full p-0.5 text-accent-foreground/70 transition-colors hover:text-accent-foreground"
                                >
                                  <X size={12} />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}

                        <label className="space-y-1.5">
                          <span className="text-xs font-medium text-muted-foreground">Nota</span>
                          <Textarea
                            placeholder="Aggiungi un dettaglio utile per ricordarti il contesto"
                            value={formState.nota}
                            onChange={(event) =>
                              setFormState((current) => ({ ...current, nota: event.target.value }))
                            }
                            className="min-h-[88px] rounded-2xl border-border/80 bg-background"
                          />
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col gap-2 border-t border-border/70 pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced((current) => !current)}
                    className="text-left text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    {showAdvanced ? "Riduci dettagli" : "Aggiungi dettagli, tag o ricorrenza"}
                  </button>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={resetForm} className="rounded-2xl">
                      Annulla
                    </Button>
                    <Button onClick={salvaSpesa} disabled={!isFormValid} className="rounded-2xl px-5">
                      {formState.editingId ? "Salva modifiche" : "Registra spesa"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-border/70 bg-muted/25 p-4">
                <p className="text-sm font-semibold text-foreground">Controllo rapido</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Filtra e scorri lo storico senza aprire schermate secondarie.
                </p>

                <div className="mt-4 space-y-3">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Cerca</span>
                    <div className="relative">
                      <Search
                        size={16}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <Input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Categoria, nota o tag"
                        className="h-11 rounded-2xl border-border/80 bg-background pl-10"
                      />
                    </div>
                  </label>

                  <div>
                    <span className="mb-2 block text-xs font-medium text-muted-foreground">Periodo</span>
                    <div className="flex flex-wrap gap-2">
                      <FilterChip
                        active={selectedMonth === "all"}
                        onClick={() => setSelectedMonth("all")}
                        label="Tutto"
                      />
                      {monthKeys.slice(0, 5).map((month) => (
                        <FilterChip
                          key={month}
                          active={selectedMonth === month}
                          onClick={() => setSelectedMonth(month)}
                          label={getMonthLabel(month)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-background p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Risultati visibili
                    </p>
                    <div className="mt-2 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
                          {filteredSpese.length}
                        </p>
                        <p className="text-xs text-muted-foreground">movimenti filtrati</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">
                          {formatEuro(filteredSpese.reduce((total, spesa) => total + spesa.importo, 0))}
                        </p>
                        <p className="text-xs text-muted-foreground">somma selezionata</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          variants={sectionTransition}
          className="overflow-hidden rounded-[28px] border border-border/80 bg-background/95 shadow-[0_18px_60px_-40px_rgba(0,0,0,0.35)]"
        >
          <div className="border-b border-border/70 px-4 py-4 sm:px-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Cronologia
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-foreground">
                  Registro mensile
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                {filteredSpese.length === spese.length ? "Vista completa" : "Vista filtrata"}
              </p>
            </div>
          </div>

          <div className="px-4 py-4 sm:px-5">
            {filteredSpese.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-border px-5 py-12 text-center">
                <p className="text-sm font-medium text-foreground">Nessuna spesa da mostrare</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {spese.length === 0
                    ? "Registra la prima spesa per iniziare a costruire lo storico."
                    : "Prova a cambiare periodo o testo di ricerca."}
                </p>
              </div>
            ) : (
              <LayoutGroup>
                <div className="space-y-4">
                  {Object.entries(groupedSpese)
                    .sort(([monthA], [monthB]) => monthB.localeCompare(monthA))
                    .map(([month, items]) => {
                      const total = items.reduce((sum, item) => sum + item.importo, 0);

                      return (
                        <motion.div
                          key={month}
                          layout
                          className="overflow-hidden rounded-[24px] border border-border/70 bg-card/60"
                        >
                          <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-muted/30 px-4 py-3">
                            <div>
                              <p className="text-base font-semibold capitalize text-foreground">
                                {getMonthLabel(month)}
                              </p>
                              <p className="text-xs text-muted-foreground">{items.length} movimenti</p>
                            </div>
                            <p className="text-sm font-semibold text-foreground">{formatEuro(total)}</p>
                          </div>

                          <AnimatePresence initial={false}>
                            {items.map((spesa, index) => (
                              <ExpenseRow
                                key={spesa.id}
                                spesa={spesa}
                                categoria={categoryById.get(spesa.categoriaId)}
                                isLast={index === items.length - 1}
                                onEdit={() => editSpesa(spesa)}
                                onDelete={() => deleteSpesa(spesa.id)}
                              />
                            ))}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                </div>
              </LayoutGroup>
            )}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

function MetricBox({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/85 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border/80 bg-background text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function ExpenseRow({
  spesa,
  categoria,
  isLast,
  onEdit,
  onDelete,
}: {
  spesa: Spesa;
  categoria?: CategoriaSpesa;
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={cn("px-4 py-3", !isLast && "border-b border-border/70")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-background text-lg"
              style={{
                backgroundColor: categoria ? `${categoria.colore}14` : undefined,
              }}
            >
              {categoria?.emoji || "📦"}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="text-sm font-semibold text-foreground">{categoria?.nome || "Altro"}</p>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(spesa.data), "d MMMM", { locale: it })}
                </span>
                {spesa.ricorrenza !== "once" && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {getRicorrenzaLabel(spesa.ricorrenza)}
                  </span>
                )}
              </div>

              {spesa.nota && <p className="mt-1 text-sm leading-5 text-muted-foreground">{spesa.nota}</p>}

              {spesa.badge.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {spesa.badge.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-accent-foreground"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-3">
          <p className="text-sm font-semibold tracking-[-0.03em] text-foreground">{formatEuro(spesa.importo)}</p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Modifica spesa"
            >
              <Pencil size={15} />
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label="Elimina spesa"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default GestisciSpese;
