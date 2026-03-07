import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Edit3, Eye, EyeOff, X, Image as ImageIcon, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/RichTextEditor";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";
import AIPostGeneratorDialog, { type AIPostGenerationDetails } from "@/components/AIPostGeneratorDialog";
import { invokeEdgeWithJwt } from "@/lib/edge";

const readFunctionError = (error: unknown): string => {
  if (!error) return "Errore sconosciuto";
  if (error instanceof Error) {
    const withContext = error as Error & { context?: { error?: string; message?: string } | string };
    if (typeof withContext.context === "string" && withContext.context.trim()) {
      return withContext.context;
    }
    if (withContext.context && typeof withContext.context === "object") {
      if (typeof withContext.context.error === "string" && withContext.context.error.trim()) {
        return withContext.context.error;
      }
      if (typeof withContext.context.message === "string" && withContext.context.message.trim()) {
        return withContext.context.message;
      }
    }
    if (error.message.trim()) return error.message;
  }
  if (typeof error === "string" && error.trim()) return error;
  return "Errore sconosciuto";
};

type ExploreArticle = {
  id: string;
  user_id: string;
  titolo: string;
  contenuto: string;
  categoria: string;
  emoji: string;
  image_url: string | null;
  tags: string[];
  ordine: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

const CATEGORY_OPTIONS = [
  { value: "app", label: "📱 App & Strumenti" },
  { value: "broker", label: "📈 Broker" },
  { value: "personaggio", label: "👤 Personaggi" },
  { value: "concetto", label: "💡 Concetti Chiave" },
];

const AdminEsplora = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ExploreArticle | null>(null);
  const [titolo, setTitolo] = useState("");
  const [contenuto, setContenuto] = useState("");
  const [emoji, setEmoji] = useState("📄");
  const [categoria, setCategoria] = useState("concetto");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [ordine, setOrdine] = useState(0);
  const [published, setPublished] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["admin-explore-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("explore_articles")
        .select("*")
        .order("ordine", { ascending: true });
      if (error) throw error;
      return data as ExploreArticle[];
    },
  });

  const resetForm = () => {
    setTitolo(""); setContenuto(""); setEmoji("📄"); setCategoria("concetto");
    setImageUrl(""); setImageFile(null); setImagePreview(null); setUploading(false); setTagsInput(""); setOrdine(0); setPublished(false);
    setEditing(null); setShowForm(false);
  };

  const openEdit = (a: ExploreArticle) => {
    setEditing(a); setTitolo(a.titolo); setContenuto(a.contenuto); setEmoji(a.emoji);
    setCategoria(a.categoria); setImageUrl(a.image_url || "");
    setImageFile(null); setImagePreview(a.image_url || null);
    setTagsInput(a.tags.join(", ")); setOrdine(a.ordine); setPublished(a.published);
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (): Promise<string | null> => {
    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("explore-articles-images").upload(path, imageFile);
      if (error) throw error;
      const { data } = supabase.storage.from("explore-articles-images").getPublicUrl(path);
      return data.publicUrl;
    }

    if (imageUrl.trim()) return imageUrl.trim();
    return editing?.image_url || null;
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      setUploading(true);
      const image_url = await uploadImage();
      const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
      const payload = {
        titolo, contenuto, emoji: emoji.trim(), categoria,
        image_url, tags, ordine, published,
        user_id: user!.id,
      };
      if (editing) {
        const { error } = await supabase.from("explore_articles").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("explore_articles").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-explore-articles"] });
      toast.success(editing ? "Articolo aggiornato!" : "Articolo creato!");
      resetForm();
    },
    onError: (e) => {
      setUploading(false);
      toast.error("Errore: " + (e as Error).message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("explore_articles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-explore-articles"] });
      toast.success("Articolo eliminato");
    },
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from("explore_articles").update({ published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-explore-articles"] }),
  });

  const generateArticleWithAI = useMutation({
    mutationFn: async (details: AIPostGenerationDetails) => {
      const { error: userError } = await supabase.auth.getUser();
      if (userError) {
        throw new Error("Sessione non valida. Effettua di nuovo il login.");
      }

      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        throw new Error("Sessione scaduta. Effettua di nuovo il login.");
      }

      const freshToken = refreshData.session?.access_token;
      if (!freshToken) {
        throw new Error("Sessione scaduta. Effettua di nuovo il login.");
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        throw new Error("Impossibile verificare la sessione. Riprova.");
      }
      const accessToken = sessionData.session?.access_token ?? freshToken;
      if (!accessToken) {
        throw new Error("Sessione scaduta. Effettua di nuovo il login.");
      }

      const generated = await invokeEdgeWithJwt<{ content?: string; emoji?: string; tags?: string[] }>(
        "post-generate",
        accessToken,
        {
          target: "esplora",
          title: titolo.trim(),
          details,
        },
      );
      const generatedContent = generated.content?.trim();
      if (!generatedContent) {
        throw new Error("La AI non ha generato contenuto valido.");
      }

      const nextEmoji = generated.emoji?.trim() || emoji.trim() || "📄";
      const nextTags = Array.isArray(generated.tags) && generated.tags.length > 0
        ? generated.tags
        : tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      const image_url = await uploadImage();

      const payload = {
        titolo: titolo.trim(),
        contenuto: generatedContent,
        emoji: nextEmoji,
        categoria,
        image_url,
        tags: nextTags,
        ordine,
        published,
        user_id: user!.id,
      };

      if (editing) {
        const { data, error } = await supabase
          .from("explore_articles")
          .update(payload)
          .eq("id", editing.id)
          .select("*")
          .single();
        if (error) throw error;
        return data as ExploreArticle;
      }

      const { data, error } = await supabase
        .from("explore_articles")
        .insert(payload)
        .select("*")
        .single();
      if (error) throw error;
      return data as ExploreArticle;
    },
    onSuccess: (savedArticle) => {
      setEditing(savedArticle);
      setShowForm(true);
      setTitolo(savedArticle.titolo);
      setContenuto(savedArticle.contenuto);
      setEmoji(savedArticle.emoji);
      setCategoria(savedArticle.categoria);
      setTagsInput(savedArticle.tags.join(", "));
      setOrdine(savedArticle.ordine);
      setPublished(savedArticle.published);
      setImageUrl(savedArticle.image_url || "");
      setImagePreview(savedArticle.image_url || null);
      setImageFile(null);
      setAiDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-explore-articles"] });
      toast.success(editing ? "Articolo aggiornato con AI" : "Articolo creato con AI");
    },
    onError: (e) => {
      toast.error("Errore generazione AI: " + readFunctionError(e));
    },
  });

  return (
    <motion.div className="px-5 pt-14 pb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate("/profilo")} className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ArrowLeft size={20} />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Gestione Esplora</h1>
          <p className="text-xs text-muted-foreground">{articles.length} articoli</p>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => { resetForm(); setShowForm(true); }} className="p-2.5 bg-primary text-primary-foreground rounded-xl">
          <Plus size={18} />
        </motion.button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
            <div className="bg-card border border-border/50 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-sm">{editing ? "Modifica Articolo" : "Nuovo Articolo"}</h2>
                <motion.button whileTap={{ scale: 0.9 }} onClick={resetForm}><X size={18} className="text-muted-foreground" /></motion.button>
              </div>

              {/* Emoji */}
              <div>
                <Label className="text-xs">Emoji</Label>
                <Input value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="😀" className="mt-1" maxLength={8} />
              </div>

              <div>
                <Label className="text-xs">Titolo</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input value={titolo} onChange={e => setTitolo(e.target.value)} placeholder="Titolo articolo..." />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAiDialogOpen(true)}
                    disabled={!titolo.trim() || generateArticleWithAI.isPending}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary text-xs font-medium disabled:opacity-50"
                  >
                    <Sparkles size={14} />
                    AI
                  </motion.button>
                </div>
              </div>

              <div>
                <Label className="text-xs">Contenuto</Label>
                <RichTextEditor value={contenuto} onChange={setContenuto} placeholder="Scrivi il contenuto..." rows={6} className="mt-1" />
                {(contenuto.trim() || imagePreview) && (
                  <div className="mt-3">
                    <Label className="text-xs text-muted-foreground">Anteprima</Label>
                    <div className="mt-1 bg-muted/30 border border-border/50 rounded-xl p-3">
                      {imagePreview && (
                        <img src={imagePreview} alt="" className="mb-3 w-full aspect-video object-cover rounded-lg" />
                      )}
                      {contenuto.trim() && (
                        <div
                          className="text-sm leading-relaxed whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(contenuto) }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-xs">Immagine</Label>
                <div className="mt-1">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="preview" className="w-full aspect-video object-cover rounded-xl" />
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => { setImageFile(null); setImagePreview(null); setImageUrl(""); }}
                        className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur rounded-full"
                      >
                        <X size={14} />
                      </motion.button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                      <ImageIcon size={24} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Tocca per caricare</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-xs">Categoria</Label>
                <Select value={categoria} onValueChange={setCategoria}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">URL Immagine (opzionale)</Label>
                <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." className="mt-1" />
              </div>

              <div>
                <Label className="text-xs">Tags (separati da virgola)</Label>
                <Input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="etf, investimenti, finanza..." className="mt-1" />
              </div>

              <div>
                <Label className="text-xs">Ordine</Label>
                <Input type="number" value={ordine} onChange={e => setOrdine(Number(e.target.value))} className="mt-1" />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-xs">Pubblica</Label>
                <Switch checked={published} onCheckedChange={setPublished} />
              </div>

              <motion.button whileTap={{ scale: 0.97 }} onClick={() => saveMutation.mutate()}
                disabled={!titolo.trim() || !contenuto.trim() || !emoji.trim() || uploading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium disabled:opacity-50">
                {uploading ? "Caricamento..." : editing ? "Salva Modifiche" : "Crea Articolo"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Articles list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card border border-border/50 rounded-2xl p-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-2/3 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">Nessun articolo creato</p>
          <p className="text-xs text-muted-foreground mt-1">Tocca + per creare il primo</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map(article => (
            <motion.div key={article.id} layout className="bg-card border border-border/50 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{article.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight">{article.titolo}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={cn("inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full",
                      article.published ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground")}>
                      {article.published ? <><Eye size={10} /> Pubblicato</> : <><EyeOff size={10} /> Bozza</>}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {CATEGORY_OPTIONS.find(c => c.value === article.categoria)?.label || article.categoria}
                    </span>
                  </div>
                </div>
              </div>
              {article.image_url && (
                <img src={article.image_url} alt="" className="mt-3 w-full aspect-video object-cover rounded-xl" />
              )}
              <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-border/30">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => openEdit(article)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                  <Edit3 size={14} /> Modifica
                </motion.button>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => togglePublish.mutate({ id: article.id, published: !article.published })} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                  {article.published ? <><EyeOff size={14} /> Nascondi</> : <><Eye size={14} /> Pubblica</>}
                </motion.button>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => deleteMutation.mutate(article.id)} className="flex items-center gap-1.5 text-xs text-destructive ml-auto">
                  <Trash2 size={14} /> Elimina
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AIPostGeneratorDialog
        open={aiDialogOpen}
        onOpenChange={setAiDialogOpen}
        titolo={titolo}
        areaLabel="Esplora"
        loading={generateArticleWithAI.isPending}
        onGenerate={(details) => generateArticleWithAI.mutate(details)}
      />
    </motion.div>
  );
};

export default AdminEsplora;
