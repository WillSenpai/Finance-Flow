import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Edit3, Eye, EyeOff, Clock, Users, Crown, Image as ImageIcon, FileText, X, Calendar as CalendarIcon, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/RichTextEditor";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import { it } from "date-fns/locale";
import { cn } from "@/lib/utils";
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

type AdminPost = {
  id: string;
  user_id: string;
  titolo: string;
  contenuto: string;
  emoji: string;
  tipo: string;
  image_url: string | null;
  file_url: string | null;
  published: boolean;
  scheduled_at: string | null;
  visibility: string;
  created_at: string;
  updated_at: string;
};

type Destination = "comunicazioni" | "esplora";

type ExploreArticle = {
  id: string;
  titolo: string;
  contenuto: string;
  emoji: string;
  image_url: string | null;
  published: boolean;
};

const AdminPosts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<AdminPost | null>(null);
  const [titolo, setTitolo] = useState("");
  const [contenuto, setContenuto] = useState("");
  const [emoji, setEmoji] = useState("📢");
  const [tipo, setTipo] = useState("post");
  const [destination, setDestination] = useState<Destination>("comunicazioni");
  const [visibility, setVisibility] = useState("all");
  const [published, setPublished] = useState(true);
  const [useSchedule, setUseSchedule] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [scheduledTime, setScheduledTime] = useState("09:00");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as AdminPost[];
    },
  });

  const resetForm = () => {
    setTitolo("");
    setContenuto("");
    setEmoji("📢");
    setTipo("post");
    setDestination("comunicazioni");
    setVisibility("all");
    setPublished(true);
    setUseSchedule(false);
    setScheduledDate(undefined);
    setScheduledTime("09:00");
    setImageFile(null);
    setImagePreview(null);
    setEditingPost(null);
    setShowForm(false);
  };

  const openEdit = (post: AdminPost) => {
    setEditingPost(post);
    setDestination("comunicazioni");
    setTitolo(post.titolo);
    setContenuto(post.contenuto);
    setEmoji(post.emoji);
    setTipo(post.tipo);
    setVisibility(post.visibility);
    setPublished(post.published);
    if (post.scheduled_at) {
      setUseSchedule(true);
      const d = new Date(post.scheduled_at);
      setScheduledDate(d);
      setScheduledTime(format(d, "HH:mm"));
    } else {
      setUseSchedule(false);
    }
    setImagePreview(post.image_url);
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (target: Destination): Promise<string | null> => {
    if (!imageFile) {
      if (imagePreview && !imagePreview.startsWith("blob:")) return imagePreview;
      return editingPost?.image_url || null;
    }
    const ext = imageFile.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const bucket = target === "esplora" ? "explore-articles-images" : "admin-posts-images";
    const { error } = await supabase.storage.from(bucket).upload(path, imageFile);
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      setUploading(true);
      const image_url = await uploadImage(destination);

      let scheduled_at: string | null = null;
      if (useSchedule && scheduledDate) {
        const [h, m] = scheduledTime.split(":").map(Number);
        const d = new Date(scheduledDate);
        d.setHours(h, m, 0, 0);
        scheduled_at = d.toISOString();
      }

      if (destination === "esplora") {
        const explorePayload = {
          titolo: titolo.trim(),
          contenuto,
          emoji: emoji.trim(),
          image_url,
          published,
          user_id: user!.id,
        };
        const { error } = await supabase.from("explore_articles").insert(explorePayload);
        if (error) throw error;
        return;
      }

      const payload = {
        titolo,
        contenuto,
        emoji: emoji.trim(),
        tipo,
        visibility,
        published: useSchedule ? false : published,
        scheduled_at,
        image_url,
        user_id: user!.id,
      };

      if (editingPost) {
        const { error } = await supabase
          .from("admin_posts")
          .update(payload)
          .eq("id", editingPost.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("admin_posts")
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-explore-articles"] });
      toast.success(
        destination === "esplora"
          ? "Articolo Esplora creato!"
          : editingPost
            ? "Post aggiornato!"
            : "Post creato!",
      );
      resetForm();
      setUploading(false);
    },
    onError: (e) => {
      toast.error("Errore: " + (e as Error).message);
      setUploading(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("admin_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      toast.success("Post eliminato");
    },
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from("admin_posts").update({ published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-posts"] }),
  });

  const generatePostWithAI = useMutation({
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

      const generated = await invokeEdgeWithJwt<{ content?: string; emoji?: string }>(
        "post-generate",
        accessToken,
        {
          target: destination === "esplora" ? "esplora" : "comunicazioni",
          title: titolo.trim(),
          details,
          contentType: destination === "comunicazioni" ? tipo : undefined,
        },
      );
      const generatedContent = generated.content?.trim();
      if (!generatedContent) {
        throw new Error("La AI non ha generato contenuto valido.");
      }

      const generatedEmoji = generated.emoji?.trim() || emoji.trim() || "📢";
      const image_url = await uploadImage(destination);

      let scheduled_at: string | null = null;
      if (useSchedule && scheduledDate) {
        const [h, m] = scheduledTime.split(":").map(Number);
        const d = new Date(scheduledDate);
        d.setHours(h, m, 0, 0);
        scheduled_at = d.toISOString();
      }

      if (destination === "esplora") {
        const payload = {
          titolo: titolo.trim(),
          contenuto: generatedContent,
          emoji: generatedEmoji,
          image_url,
          published,
          user_id: user!.id,
        };

        const { data, error } = await supabase
          .from("explore_articles")
          .insert(payload)
          .select("id, titolo, contenuto, emoji, image_url, published")
          .single();
        if (error) throw error;
        return { destination, saved: data as ExploreArticle };
      }

      const payload = {
        titolo: titolo.trim(),
        contenuto: generatedContent,
        emoji: generatedEmoji,
        tipo,
        visibility,
        published: useSchedule ? false : published,
        scheduled_at,
        image_url,
        user_id: user!.id,
      };

      if (editingPost) {
        const { data, error } = await supabase
          .from("admin_posts")
          .update(payload)
          .eq("id", editingPost.id)
          .select("*")
          .single();
        if (error) throw error;
        return { destination, saved: data as AdminPost };
      }

      const { data, error } = await supabase
        .from("admin_posts")
        .insert(payload)
        .select("*")
        .single();
      if (error) throw error;
      return { destination, saved: data as AdminPost };
    },
    onSuccess: (result) => {
      setAiDialogOpen(false);
      setImageFile(null);

      if (result.destination === "esplora") {
        const savedArticle = result.saved as ExploreArticle;
        setEditingPost(null);
        setShowForm(true);
        setTitolo(savedArticle.titolo);
        setContenuto(savedArticle.contenuto);
        setEmoji(savedArticle.emoji);
        setPublished(savedArticle.published);
        setImagePreview(savedArticle.image_url);
        queryClient.invalidateQueries({ queryKey: ["admin-explore-articles"] });
        toast.success("Articolo Esplora creato con AI");
        return;
      }

      const savedPost = result.saved as AdminPost;
      setEditingPost(savedPost);
      setShowForm(true);
      setTitolo(savedPost.titolo);
      setContenuto(savedPost.contenuto);
      setEmoji(savedPost.emoji);
      setTipo(savedPost.tipo);
      setVisibility(savedPost.visibility);
      setPublished(savedPost.published);
      if (savedPost.scheduled_at) {
        const d = new Date(savedPost.scheduled_at);
        setUseSchedule(true);
        setScheduledDate(d);
        setScheduledTime(format(d, "HH:mm"));
      } else {
        setUseSchedule(false);
      }
      setImagePreview(savedPost.image_url);
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      toast.success(editingPost ? "Post aggiornato con AI" : "Post creato con AI");
    },
    onError: (e) => {
      toast.error("Errore generazione AI: " + readFunctionError(e));
    },
  });

  const getStatusBadge = (post: AdminPost) => {
    if (post.scheduled_at && new Date(post.scheduled_at) > new Date()) {
      return { label: "Programmato", color: "bg-amber-500/10 text-amber-600", icon: Clock };
    }
    if (post.published) {
      return { label: "Pubblicato", color: "bg-emerald-500/10 text-emerald-600", icon: Eye };
    }
    return { label: "Bozza", color: "bg-muted text-muted-foreground", icon: EyeOff };
  };

  return (
    <motion.div className="px-5 pt-14 pb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate("/profilo")} className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ArrowLeft size={20} />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Gestione Contenuti</h1>
          <p className="text-xs text-muted-foreground">{posts.length} post totali</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => { resetForm(); setShowForm(true); }}
          className="p-2.5 bg-primary text-primary-foreground rounded-xl"
        >
          <Plus size={18} />
        </motion.button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-card border border-border/50 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-sm">{editingPost ? "Modifica Post" : "Nuovo Post"}</h2>
                <motion.button whileTap={{ scale: 0.9 }} onClick={resetForm}>
                  <X size={18} className="text-muted-foreground" />
                </motion.button>
              </div>

              {/* Emoji */}
              <div>
                <Label className="text-xs">Emoji</Label>
                <Input value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="📢" className="mt-1" maxLength={8} />
              </div>

              <div>
                <Label className="text-xs">Titolo</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input value={titolo} onChange={e => setTitolo(e.target.value)} placeholder="Titolo del post..." />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAiDialogOpen(true)}
                    disabled={!titolo.trim() || generatePostWithAI.isPending}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary text-xs font-medium disabled:opacity-50"
                  >
                    <Sparkles size={14} />
                    AI
                  </motion.button>
                </div>
              </div>

              <div>
                <Label className="text-xs">Contenuto</Label>
                <RichTextEditor value={contenuto} onChange={setContenuto} placeholder="Scrivi il contenuto..." rows={4} className="mt-1" />
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
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(contenuto, { ALLOWED_TAGS: ["b", "i", "u", "mark", "br"] }),
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Type */}
              <div>
                <Label className="text-xs">Sezione</Label>
                <Select
                  value={destination}
                  onValueChange={(value: Destination) => {
                    setDestination(value);
                    if (value === "esplora") {
                      setEditingPost(null);
                      setTipo("documento");
                      setVisibility("all");
                      setUseSchedule(false);
                    }
                  }}
                >
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comunicazioni">📣 Comunicazioni</SelectItem>
                    <SelectItem value="esplora">🔍 Esplora</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {destination === "comunicazioni" && (
                <div>
                  <Label className="text-xs">Tipo</Label>
                  <Select value={tipo} onValueChange={setTipo}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post">📝 Post</SelectItem>
                      <SelectItem value="documento">📄 Documento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Image upload */}
              <div>
                <Label className="text-xs">Immagine</Label>
                <div className="mt-1">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="preview" className="w-full aspect-video object-cover rounded-xl" />
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => { setImageFile(null); setImagePreview(null); }}
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

              {/* Visibility */}
              {destination === "comunicazioni" && (
                <div>
                  <Label className="text-xs">Visibilità</Label>
                  <Select value={visibility} onValueChange={setVisibility}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all"><div className="flex items-center gap-2"><Users size={14} /> Tutti gli utenti</div></SelectItem>
                      <SelectItem value="premium"><div className="flex items-center gap-2"><Crown size={14} /> Solo Premium</div></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {destination === "comunicazioni" && (
                <>
                  {/* Schedule toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-xs">Programmazione</Label>
                      <p className="text-[10px] text-muted-foreground">Pubblica in una data futura</p>
                    </div>
                    <Switch checked={useSchedule} onCheckedChange={setUseSchedule} />
                  </div>

                  {useSchedule && (
                    <div className="space-y-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className={cn("w-full flex items-center gap-2 border border-input rounded-xl px-3 py-2.5 text-sm", !scheduledDate && "text-muted-foreground")}>
                            <CalendarIcon size={16} />
                            {scheduledDate ? format(scheduledDate, "dd MMMM yyyy", { locale: it }) : "Seleziona data"}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={scheduledDate}
                            onSelect={setScheduledDate}
                            disabled={(date) => date < new Date()}
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <div>
                        <Label className="text-xs">Orario</Label>
                        <Input type="time" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} className="mt-1" />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Publish toggle (only if not scheduled) */}
              {!useSchedule && (
                <div className="flex items-center justify-between">
                  <Label className="text-xs">{destination === "esplora" ? "Pubblica su Esplora" : "Pubblica subito"}</Label>
                  <Switch checked={published} onCheckedChange={setPublished} />
                </div>
              )}

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => saveMutation.mutate()}
                disabled={!titolo.trim() || !contenuto.trim() || !emoji.trim() || uploading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium disabled:opacity-50"
              >
                {uploading
                  ? "Caricamento..."
                  : destination === "esplora"
                    ? "Crea Articolo Esplora"
                    : editingPost
                      ? "Salva Modifiche"
                      : "Crea Post"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card border border-border/50 rounded-2xl p-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-2/3 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <FileText size={40} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nessun post creato</p>
          <p className="text-xs text-muted-foreground mt-1">Tocca + per creare il primo</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => {
            const status = getStatusBadge(post);
            const StatusIcon = status.icon;
            return (
              <motion.div
                key={post.id}
                layout
                className="bg-card border border-border/50 rounded-2xl p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{post.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-tight">{post.titolo}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.contenuto}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={cn("inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full", status.color)}>
                        <StatusIcon size={10} /> {status.label}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {post.visibility === "premium" ? <><Crown size={10} /> Premium</> : <><Users size={10} /> Tutti</>}
                      </span>
                      {post.image_url && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          <ImageIcon size={10} /> Immagine
                        </span>
                      )}
                      {post.scheduled_at && (
                        <span className="text-[10px] text-muted-foreground">
                          {format(new Date(post.scheduled_at), "dd/MM/yy HH:mm")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {post.image_url && (
                  <img src={post.image_url} alt="" className="w-full aspect-video object-cover rounded-xl mt-3" />
                )}

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => togglePublish.mutate({ id: post.id, published: !post.published })}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium bg-muted hover:bg-muted/80 transition-colors"
                  >
                    {post.published ? <><EyeOff size={14} /> Nascondi</> : <><Eye size={14} /> Pubblica</>}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openEdit(post)}
                    className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <Edit3 size={14} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteMutation.mutate(post.id)}
                    className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 size={14} />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AIPostGeneratorDialog
        open={aiDialogOpen}
        onOpenChange={setAiDialogOpen}
        titolo={titolo}
        areaLabel={destination === "esplora" ? "Esplora" : "Comunicazioni"}
        loading={generatePostWithAI.isPending}
        onGenerate={(details) => generatePostWithAI.mutate(details)}
      />
    </motion.div>
  );
};

export default AdminPosts;
