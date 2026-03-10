import { useMemo, useState, useCallback, useEffect, useContext } from "react";
import { useUser } from "@/hooks/useUser";
import { useSharedWorkspace } from "@/hooks/useSharedWorkspace";
import { PointsContext } from "@/contexts/PointsContext";
import { supabase } from "@/integrations/supabase/client";

export interface Notifica {
  id: string;
  icon: string;
  text: string;
  action?: string;
  tipo: "warning" | "info" | "success";
}

const DISMISSED_KEY = "notifiche_dismissed";
const DISMISSED_UPDATED_EVENT = "notifiche-dismissed-updated";

const getDismissed = (): Set<string> => {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

const saveDismissed = (set: Set<string>) => {
  localStorage.setItem(DISMISSED_KEY, JSON.stringify([...set]));
  window.dispatchEvent(new Event(DISMISSED_UPDATED_EVENT));
};

const sameSet = (a: Set<string>, b: Set<string>) => {
  if (a.size !== b.size) return false;
  for (const v of a) {
    if (!b.has(v)) return false;
  }
  return true;
};

const formatEuro = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export function useNotifiche() {
  const { salvadanai, lastPatrimonioUpdate, spese, categorieSpese } = useUser();
  const { pendingInvites, hasActiveWorkspace, spese: sharedSpese } = useSharedWorkspace();
  const pointsCtx = useContext(PointsContext);
  const points = pointsCtx?.points ?? 0;
  const [dismissed, setDismissed] = useState<Set<string>>(getDismissed);
  const [recentPosts, setRecentPosts] = useState<Array<{ id: string; titolo: string; emoji: string }>>([]);

  // Fetch recent admin posts for notifications (using useEffect instead of useQuery)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString();
        const { data } = await supabase
          .from("admin_posts")
          .select("id, titolo, emoji, created_at, scheduled_at")
          .eq("published", true)
          .eq("visibility", "all")
          .or("scheduled_at.is.null,scheduled_at.lte." + new Date().toISOString())
          .gte("created_at", threeDaysAgo)
          .order("created_at", { ascending: false })
          .limit(5);
        if (data) setRecentPosts(data);
      } catch (e) {
        console.error("Failed to fetch admin posts for notifications:", e);
      }
    };
    fetchPosts();
  }, []);

  // Sync dismissed to localStorage
  useEffect(() => {
    saveDismissed(dismissed);
  }, [dismissed]);

  // Keep all hook instances in sync when dismissed changes elsewhere
  useEffect(() => {
    const syncDismissed = () => {
      const next = getDismissed();
      setDismissed((prev) => (sameSet(prev, next) ? prev : next));
    };
    window.addEventListener("storage", syncDismissed);
    window.addEventListener(DISMISSED_UPDATED_EVENT, syncDismissed);
    return () => {
      window.removeEventListener("storage", syncDismissed);
      window.removeEventListener(DISMISSED_UPDATED_EVENT, syncDismissed);
    };
  }, []);

  const allNotifiche = useMemo(() => {
    const notifications: Notifica[] = [];

    // Admin post notifications (shown first)
    recentPosts.forEach(post => {
      notifications.push({
        id: `admin-post-${post.id}`,
        icon: post.emoji || "📢",
        text: `Nuovo: ${post.titolo}`,
        action: "/",
        tipo: "info",
      });
    });

    if (lastPatrimonioUpdate) {
      const daysSince = Math.floor((Date.now() - new Date(lastPatrimonioUpdate).getTime()) / 86400000);
      if (daysSince >= 3) {
        notifications.push({ id: "patrimonio-stale", icon: "📊", text: `Non aggiorni il patrimonio da ${daysSince} giorni`, action: "/patrimonio", tipo: "warning" });
      }
    } else {
      notifications.push({ id: "patrimonio-missing", icon: "📊", text: "Non hai ancora impostato il tuo patrimonio", action: "/patrimonio", tipo: "info" });
    }

    salvadanai.forEach((s) => {
      const perc = Math.round((s.attuale / s.obiettivo) * 100);
      if (perc >= 80 && perc < 100) {
        notifications.push({ id: `salv-${s.nome}-almost`, icon: "🐷", text: `"${s.nome}" è quasi completo! (${perc}%)`, action: "/patrimonio", tipo: "success" });
      } else if (perc >= 30 && perc < 80) {
        notifications.push({ id: `salv-${s.nome}-progress`, icon: "🐷", text: `"${s.nome}" è al ${perc}%`, action: "/patrimonio", tipo: "info" });
      }
    });

    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const monthlySpese = spese.filter(s => s.data.startsWith(thisMonth));
    const byCat = monthlySpese.reduce<Record<string, number>>((a, s) => { a[s.categoriaId] = (a[s.categoriaId] || 0) + s.importo; return a; }, {});

    Object.entries(byCat).forEach(([catId, val]) => {
      if (val > 200) {
        const cat = categorieSpese.find(c => c.id === catId);
        notifications.push({ id: `spese-high-${catId}`, icon: "⚠️", text: `${cat?.emoji || ""} ${cat?.nome || "Categoria"}: ${formatEuro(val)} questo mese`, action: "/patrimonio/spese", tipo: "warning" });
      }
    });

    if (spese.length === 0) {
      notifications.push({ id: "spese-empty", icon: "💸", text: "Inizia a tracciare le tue spese!", action: "/patrimonio/spese", tipo: "info" });
    }

    if (pendingInvites.length > 0) {
      notifications.push({
        id: "shared-invites-pending",
        icon: "✉️",
        text: `Hai ${pendingInvites.length} invito${pendingInvites.length > 1 ? "i" : ""} alla condivisione`,
        action: "/patrimonio/inviti",
        tipo: "info",
      });
    }

    if (hasActiveWorkspace && sharedSpese.length === 0) {
      notifications.push({
        id: "shared-spese-empty",
        icon: "🤝",
        text: "Aggiungi la prima spesa nel patrimonio condiviso",
        action: "/patrimonio/condiviso/spese",
        tipo: "info",
      });
    }

    if (points >= 50 && points < 100) {
      notifications.push({ id: "points-milestone", icon: "🏆", text: `Hai raggiunto ${points} punti! Continua così!`, tipo: "success" });
    }

    return notifications;
  }, [salvadanai, lastPatrimonioUpdate, spese, categorieSpese, points, recentPosts, pendingInvites.length, hasActiveWorkspace, sharedSpese.length]);

  const notifiche = useMemo(() => allNotifiche.filter(n => !dismissed.has(n.id)), [allNotifiche, dismissed]);

  const dismiss = useCallback((id: string) => {
    setDismissed(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const dismissAll = useCallback(() => {
    setDismissed(prev => {
      const next = new Set(prev);
      allNotifiche.forEach(n => next.add(n.id));
      return next;
    });
  }, [allNotifiche]);

  const unreadCount = notifiche.length;

  return { notifiche, allNotifiche, dismissed, dismiss, dismissAll, unreadCount };
}
