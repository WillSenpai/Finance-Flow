import { Bell, Palette, Shield, Info, Flame, BookOpen, LogOut, Star, ArrowUpRight, X, CheckCheck, Lock, FileText, Gamepad2, Compass, GraduationCap, Trash2, Loader2, MessageSquare, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/contexts/AuthContext";
import { usePoints } from "@/contexts/PointsContext";
import { useNavigate } from "react-router-dom";
import BadgeLivello from "@/components/BadgeLivello";
import { useNotifiche } from "@/hooks/useNotifiche";
import AvatarPicker from "@/components/AvatarPicker";
import { useEffect, useState } from "react";
import { Badge as BadgeType } from "@/contexts/PointsContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import { toast } from "sonner";
import { isOpeningLoaderEnabled, setOpeningLoaderEnabled } from "@/lib/openingLoaderPreference";
import { isNativeBillingPlatform, loadBillingOfferingMetadata, loadBillingOffers } from "@/lib/billing/revenuecat";

const impostazioni = [
  { icona: Bell, label: "Notifiche", path: "/profilo/notifiche" },
  { icona: Palette, label: "Tema", path: "/profilo/tema" },
  { icona: Shield, label: "Privacy", path: "/profilo/privacy" },
  { icona: Info, label: "Info sull'app", path: "/profilo/info" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } } as const;
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } } as const;

const Profilo = () => {
  const { userData, resetOnboarding, setUserData } = useUser();
  const { signOut, user } = useAuth();
  const { points, streak, badges } = usePoints();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { notifiche, dismiss, dismissAll, unreadCount } = useNotifiche();
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [openingLoaderEnabled, setOpeningLoaderEnabledState] = useState(true);

  const { data: isAdmin } = useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      return !!data;
    },
    enabled: !!user,
  });

  const profilo = {
    nome: userData.name,
    email: userData.email || "utente@email.it",
    salute: 85,
    streak: streak,
    lezioniCompletate: 11,
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (profilo.salute / 100) * circumference;

  const sbloccati = badges.filter(b => b.sbloccato).length;

  useEffect(() => {
    if (!user?.id) return;
    setOpeningLoaderEnabledState(isOpeningLoaderEnabled(user.id));
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || !isNativeBillingPlatform()) return;

    void Promise.allSettled([
      queryClient.prefetchQuery({
        queryKey: ["billing-offers", user.id],
        queryFn: () => loadBillingOffers(user.id),
      }),
      queryClient.prefetchQuery({
        queryKey: ["billing-offering-metadata", user.id],
        queryFn: () => loadBillingOfferingMetadata(user.id),
      }),
      queryClient.prefetchQuery({
        queryKey: ["billing-plan", user.id],
        queryFn: async () => {
          const { data, error } = await supabase
            .from("user_ai_plans" as never)
            .select("plan, monthly_token_limit, grace_until")
            .eq("user_id", user.id)
            .maybeSingle();
          if (error) throw error;
          return data;
        },
      }),
      queryClient.prefetchQuery({
        queryKey: ["billing-subscription", user.id],
        queryFn: async () => {
          const { data, error } = await supabase
            .from("billing_subscriptions" as never)
            .select("status, current_period_ends_at, auto_renews, product_id")
            .eq("user_id", user.id)
            .maybeSingle();
          if (error) throw error;
          return data;
        },
      }),
    ]);
  }, [queryClient, user?.id]);

  const openProPage = async () => {
    if (user?.id && isNativeBillingPlatform()) {
      await Promise.allSettled([
        queryClient.prefetchQuery({
          queryKey: ["billing-offers", user.id],
          queryFn: () => loadBillingOffers(user.id),
        }),
        queryClient.prefetchQuery({
          queryKey: ["billing-offering-metadata", user.id],
          queryFn: () => loadBillingOfferingMetadata(user.id),
        }),
      ]);
    }
    navigate("/profilo/pro");
  };

  const handleDeleteAccount = async () => {
    if (deletingAccount) return;
    setDeletingAccount(true);
    try {
      const { error } = await supabase.functions.invoke("delete-account", { body: {} });
      if (error) throw error;
      toast.success("Account eliminato definitivamente.");
      await signOut();
      navigate("/onboarding", { replace: true });
    } catch (err) {
      console.error("Delete account failed:", err);
      toast.error("Impossibile eliminare l'account. Riprova.");
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <motion.div className="px-5 pt-14 pb-4" variants={container} initial="hidden" animate="show">
      {/* Avatar + Nome */}
      <motion.div className="flex flex-col items-center mb-8" variants={item}>
        <AvatarPicker
          selectedId={userData.avatarId || "user"}
          onSelect={(id) => setUserData({ ...userData, avatarId: id })}
        />
        <h1 className="text-xl font-semibold">{profilo.nome}</h1>
        <p className="text-sm text-muted-foreground">{profilo.email}</p>
      </motion.div>

      {/* Notifiche */}
      {unreadCount > 0 && (
        <motion.div variants={item} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Bell size={16} /> Notifiche ({unreadCount})
            </h2>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={dismissAll}
              className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <CheckCheck size={14} /> Segna tutte come lette
            </motion.button>
          </div>
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {notifiche.slice(0, 5).map((n) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, x: -60, height: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div
                    className={`rounded-2xl p-3.5 flex items-center gap-3 text-left border ${n.tipo === "warning" ? "bg-destructive/5 border-destructive/20" :
                      n.tipo === "success" ? "bg-primary/5 border-primary/20" :
                        "bg-card border-border/50"
                      }`}
                  >
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => n.action && navigate(n.action)}
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <span className="text-lg flex-shrink-0">{n.icon}</span>
                      <span className="text-xs flex-1">{n.text}</span>
                      {n.action && <ArrowUpRight size={14} className="text-muted-foreground flex-shrink-0" />}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => dismiss(n.id)}
                      className="p-1 rounded-full text-muted-foreground/50 hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
                    >
                      <X size={14} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}


      {/* Badge Livello */}
      <motion.div variants={item} className="mb-6">
        <BadgeLivello points={points} />
      </motion.div>

      <motion.div variants={item} className="mb-6">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => void openProPage()}
          className="w-full rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card p-4 text-left"
        >
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/70 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles size={14} />
            Piano Pro
          </div>
          <p className="text-sm font-semibold">Passa a Pro</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Acquisti in-app, ripristino e sincronizzazione in una pagina dedicata.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">
            Apri pagina Pro
            <ArrowUpRight size={14} />
          </div>
        </motion.button>
      </motion.div>

      {/* Badge Grid */}
      <motion.div variants={item} className="mb-6">
        <h2 className="text-sm font-semibold mb-3">Badge ({sbloccati}/{badges.length}) 🏅</h2>
        <div className="grid grid-cols-5 gap-2">
          {badges.map(b => (
            <motion.button
              key={b.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedBadge(b)}
              className={`flex flex-col items-center p-2 rounded-xl text-center transition-colors ${b.sbloccato ? "bg-primary/10" : "bg-muted/50 opacity-50"
                }`}
            >
              <span className="text-2xl">{b.sbloccato ? b.emoji : "🔒"}</span>
              <span className="text-[9px] font-medium mt-1 leading-tight line-clamp-2">{b.nome}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Badge Detail Dialog */}
      <Dialog open={!!selectedBadge} onOpenChange={(open) => !open && setSelectedBadge(null)}>
        <DialogContent className="max-w-[340px] rounded-2xl" aria-describedby={undefined}>
          {selectedBadge && (
            <>
              <DialogHeader className="items-center text-center pt-2">
                <div className={`text-5xl mb-2 ${!selectedBadge.sbloccato ? "grayscale" : ""}`}>
                  {selectedBadge.sbloccato ? selectedBadge.emoji : "🔒"}
                </div>
                <DialogTitle className="text-lg">{selectedBadge.nome}</DialogTitle>
              </DialogHeader>
              <div className="text-center space-y-3 pb-2">
                <p className="text-sm text-muted-foreground">{selectedBadge.descrizione}</p>
                {selectedBadge.sbloccato ? (
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-medium">
                      ✅ Sbloccato
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground">
                      <Lock size={12} /> {selectedBadge.condizione}
                    </div>
                    <div className="space-y-1.5">
                      <Progress value={(selectedBadge.progresso / selectedBadge.target) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {selectedBadge.progresso} / {selectedBadge.target} {selectedBadge.unita}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Statistiche */}
      <motion.div className="grid grid-cols-3 gap-3 mb-6" variants={item}>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-card border border-border/50 rounded-2xl p-4 text-center">
          <Flame size={24} className="text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold">{profilo.streak}</p>
          <p className="text-xs text-muted-foreground">giorni di fila</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-card border border-border/50 rounded-2xl p-4 text-center">
          <BookOpen size={24} className="text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold">{profilo.lezioniCompletate}</p>
          <p className="text-xs text-muted-foreground">lezioni fatte</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-card border border-border/50 rounded-2xl p-4 text-center">
          <Star size={24} className="text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold">{points}</p>
          <p className="text-xs text-muted-foreground">stelline ⭐</p>
        </motion.div>
      </motion.div>

      {/* Stelline & Giochi */}
      <motion.div variants={item} className="mb-4">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/profilo/giochi")}
          className="w-full bg-card border border-primary/20 rounded-2xl p-4 flex items-center gap-3 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Gamepad2 size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Stelline & Giochi</p>
            <p className="text-[11px] text-muted-foreground">Sfide, quiz e mini-giochi finanziari</p>
          </div>
          <ArrowUpRight size={16} className="text-muted-foreground" />
        </motion.button>
      </motion.div>

      {/* Admin Section */}
      {isAdmin && (
        <motion.div variants={item} className="mb-4 space-y-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/profilo/admin-posts")}
            className="w-full bg-card border border-primary/20 rounded-2xl p-4 flex items-center gap-3 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Gestione Contenuti</p>
              <p className="text-[11px] text-muted-foreground">Crea e gestisci post e documenti</p>
            </div>
            <ArrowUpRight size={16} className="text-muted-foreground" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/profilo/admin-esplora")}
            className="w-full bg-card border border-primary/20 rounded-2xl p-4 flex items-center gap-3 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Compass size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Gestione Esplora</p>
              <p className="text-[11px] text-muted-foreground">Crea e gestisci articoli enciclopedia</p>
            </div>
            <ArrowUpRight size={16} className="text-muted-foreground" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/profilo/admin-accademia")}
            className="w-full bg-card border border-primary/20 rounded-2xl p-4 flex items-center gap-3 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCap size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Gestione Accademia</p>
              <p className="text-[11px] text-muted-foreground">Modifica lezioni e contenuti</p>
            </div>
            <ArrowUpRight size={16} className="text-muted-foreground" />
          </motion.button>

          <div className="w-full bg-card border border-primary/20 rounded-2xl p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Opening Loader</p>
                <p className="text-[11px] text-muted-foreground">Attivo solo per il tuo profilo admin</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!user?.id) return;
                  const next = !openingLoaderEnabled;
                  setOpeningLoaderEnabledState(next);
                  setOpeningLoaderEnabled(user.id, next);
                }}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${openingLoaderEnabled ? "bg-primary" : "bg-muted"
                  }`}
                aria-pressed={openingLoaderEnabled}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${openingLoaderEnabled ? "translate-x-7" : "translate-x-1"
                    }`}
                />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Impostazioni */}
      <motion.div className="bg-card border border-border/50 rounded-2xl overflow-hidden mb-4" variants={item}>
        {impostazioni.map((impostazione, i) => (
          <motion.button
            key={impostazione.label}
            whileTap={{ backgroundColor: "hsl(var(--muted))" }}
            onClick={() => navigate(impostazione.path)}
            className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium hover:bg-muted/50 transition-colors ${i < impostazioni.length - 1 ? "border-b border-border/30" : ""
              }`}
          >
            <impostazione.icona size={20} className="text-muted-foreground" />
            {impostazione.label}
          </motion.button>
        ))}
      </motion.div>

      <motion.div variants={item} className="bg-card border border-border/50 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare size={16} className="text-primary" />
          <p className="text-sm font-semibold">Hai qualche suggerimento?</p>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Apri il form dedicato e inviaci idee o consigli per migliorare l'app.
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/profilo/suggerimenti")}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
        >
          Inviaci le tua opinione!
          <ArrowUpRight size={14} />
        </motion.button>
      </motion.div>

      {/* Logout */}
      <motion.div variants={item}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={async () => { await signOut(); }}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-2xl transition-colors"
        >
          <LogOut size={18} />
          Esci dall'app
        </motion.button>
      </motion.div>

      <motion.div variants={item} className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
        <p className="text-sm font-semibold text-destructive">Eliminazione Account</p>
        <p className="text-xs text-muted-foreground mt-1 mb-3">
          Questa azione cancellera definitivamente il tuo account e tutti i tuoi dati.
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setDeleteDialogOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-destructive border border-destructive/30 rounded-xl hover:bg-destructive/10 transition-colors"
        >
          <Trash2 size={16} />
          Elimina tutti i tuoi dati
        </motion.button>
      </motion.div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[360px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro di voler continuare?</AlertDialogTitle>
            <AlertDialogDescription>
              Il tuo account e tutti i dati verranno cancellati definitivamente e non potranno essere recuperati.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingAccount}>Annulla</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                handleDeleteAccount();
              }}
              disabled={deletingAccount}
            >
              {deletingAccount ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Eliminazione...
                </>
              ) : (
                "Elimina definitivamente"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default Profilo;
