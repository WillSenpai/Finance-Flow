import { useMemo, useState, useEffect, useContext, useCallback } from "react";
import {
  Bot,
  BarChart3,
  PiggyBank,
  AlertTriangle,
  Receipt,
  Mail,
  Users,
  Trophy,
  Megaphone,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useSharedWorkspace } from "@/hooks/useSharedWorkspace";
import { PointsContext } from "@/contexts/PointsContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Notifica, MarkNotification } from "./types";

const formatEuro = (n: number) =>
  new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

function markTypeToTipo(type: string): "warning" | "info" | "success" {
  if (type === "urgent") return "warning";
  if (type === "important") return "success";
  return "info";
}

function markTypeToPriority(type: string): Notifica["priority"] {
  if (type === "urgent") return "urgent";
  if (type === "important") return "high";
  return "normal";
}

export function useNotificationSources() {
  const { salvadanai, lastPatrimonioUpdate, spese, categorieSpese } = useUser();
  const { pendingInvites, hasActiveWorkspace, spese: sharedSpese } = useSharedWorkspace();
  const { user } = useAuth();
  const pointsCtx = useContext(PointsContext);
  const points = pointsCtx?.points ?? 0;

  const [recentPosts, setRecentPosts] = useState<
    Array<{ id: string; titolo: string; emoji: string; created_at: string }>
  >([]);
  const [markNotifications, setMarkNotifications] = useState<MarkNotification[]>([]);

  // Fetch recent admin posts
  const fetchPosts = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Fetch Mark notifications with realtime subscription
  const fetchMarkNotifications = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data } = await supabase
        .from("mark_notifications")
        .select("*")
        .eq("user_id", user.id)
        .is("read_at", null)
        .order("created_at", { ascending: false })
        .limit(20);
      if (data) setMarkNotifications(data as MarkNotification[]);
    } catch (e) {
      console.error("Failed to fetch Mark notifications:", e);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    fetchMarkNotifications();

    const channel = supabase
      .channel(`mark-notifications-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "mark_notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchMarkNotifications();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchMarkNotifications]);

  const refresh = useCallback(() => {
    fetchPosts();
    fetchMarkNotifications();
  }, [fetchPosts, fetchMarkNotifications]);

  // Build enriched notification list
  const allNotifiche = useMemo(() => {
    const now = new Date();
    const notifications: Notifica[] = [];

    // Helper to build a Notifica
    const push = (
      partial: Omit<Notifica, "isRead" | "text">,
    ) => {
      notifications.push({
        ...partial,
        text: partial.title,
        isRead: false,
      });
    };

    // Mark AI notifications - urgent
    markNotifications
      .filter((n) => n.type === "urgent")
      .forEach((n) => {
        push({
          id: `mark-${n.id}`,
          category: "ai",
          iconComponent: Bot,
          icon: "🤖",
          title: n.title,
          body: n.body,
          timestamp: new Date(n.created_at),
          action: n.action_url || "/coach",
          priority: "urgent",
          tipo: "warning",
        });
      });

    // Admin posts
    recentPosts.forEach((post) => {
      push({
        id: `admin-post-${post.id}`,
        category: "system",
        iconComponent: Megaphone,
        icon: post.emoji || "📢",
        title: `Nuovo: ${post.titolo}`,
        timestamp: new Date(post.created_at),
        action: "/",
        priority: "normal",
        tipo: "info",
      });
    });

    // Mark AI notifications - important
    markNotifications
      .filter((n) => n.type === "important")
      .forEach((n) => {
        push({
          id: `mark-${n.id}`,
          category: "ai",
          iconComponent: Bot,
          icon: "🤖",
          title: n.title,
          body: n.body,
          timestamp: new Date(n.created_at),
          action: n.action_url || "/coach",
          priority: "high",
          tipo: "success",
        });
      });

    // Patrimonio
    if (lastPatrimonioUpdate) {
      const daysSince = Math.floor(
        (Date.now() - new Date(lastPatrimonioUpdate).getTime()) / 86400000,
      );
      if (daysSince >= 3) {
        push({
          id: "patrimonio-stale",
          category: "finance",
          iconComponent: BarChart3,
          icon: "📊",
          title: `Non aggiorni il patrimonio da ${daysSince} giorni`,
          body: "Aggiorna il tuo patrimonio per tenere traccia dei progressi",
          timestamp: now,
          action: "/patrimonio",
          priority: "high",
          tipo: "warning",
        });
      }
    } else {
      push({
        id: "patrimonio-missing",
        category: "finance",
        iconComponent: BarChart3,
        icon: "📊",
        title: "Non hai ancora impostato il tuo patrimonio",
        body: "Inizia a tracciare i tuoi asset per avere una visione completa",
        timestamp: now,
        action: "/patrimonio",
        priority: "normal",
        tipo: "info",
      });
    }

    // Salvadanai
    salvadanai.forEach((s) => {
      const perc = Math.round((s.attuale / s.obiettivo) * 100);
      if (perc >= 80 && perc < 100) {
        push({
          id: `salv-${s.nome}-almost`,
          category: "achievement",
          iconComponent: PiggyBank,
          icon: "🐷",
          title: `"${s.nome}" è quasi completo! (${perc}%)`,
          body: `Mancano solo ${formatEuro(s.obiettivo - s.attuale)} per raggiungere l'obiettivo`,
          timestamp: now,
          action: "/patrimonio",
          priority: "normal",
          tipo: "success",
        });
      } else if (perc >= 30 && perc < 80) {
        push({
          id: `salv-${s.nome}-progress`,
          category: "finance",
          iconComponent: PiggyBank,
          icon: "🐷",
          title: `"${s.nome}" è al ${perc}%`,
          timestamp: now,
          action: "/patrimonio",
          priority: "low",
          tipo: "info",
        });
      }
    });

    // Spese mensili elevate
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const monthlySpese = spese.filter((s) => s.data.startsWith(thisMonth));
    const byCat = monthlySpese.reduce<Record<string, number>>(
      (a, s) => {
        a[s.categoriaId] = (a[s.categoriaId] || 0) + s.importo;
        return a;
      },
      {},
    );

    Object.entries(byCat).forEach(([catId, val]) => {
      if (val > 200) {
        const cat = categorieSpese.find((c) => c.id === catId);
        push({
          id: `spese-high-${catId}`,
          category: "finance",
          iconComponent: AlertTriangle,
          icon: "⚠️",
          title: `${cat?.emoji || ""} ${cat?.nome || "Categoria"}: ${formatEuro(val)} questo mese`,
          body: "Questa categoria ha superato i €200 di spesa mensile",
          timestamp: now,
          action: "/patrimonio/spese",
          priority: "high",
          tipo: "warning",
        });
      }
    });

    // Spese vuote
    if (spese.length === 0) {
      push({
        id: "spese-empty",
        category: "finance",
        iconComponent: Receipt,
        icon: "💸",
        title: "Inizia a tracciare le tue spese!",
        body: "Registra le spese per avere il controllo delle tue finanze",
        timestamp: now,
        action: "/patrimonio/spese",
        priority: "low",
        tipo: "info",
      });
    }

    // Inviti condivisione
    if (pendingInvites.length > 0) {
      push({
        id: "shared-invites-pending",
        category: "social",
        iconComponent: Mail,
        icon: "✉️",
        title: `Hai ${pendingInvites.length} invito${pendingInvites.length > 1 ? "i" : ""} alla condivisione`,
        timestamp: now,
        action: "/patrimonio/inviti",
        priority: "normal",
        tipo: "info",
      });
    }

    // Spese condivise vuote
    if (hasActiveWorkspace && sharedSpese.length === 0) {
      push({
        id: "shared-spese-empty",
        category: "social",
        iconComponent: Users,
        icon: "🤝",
        title: "Aggiungi la prima spesa nel patrimonio condiviso",
        timestamp: now,
        action: "/patrimonio/condiviso/spese",
        priority: "low",
        tipo: "info",
      });
    }

    // Punti milestone
    if (points >= 50 && points < 100) {
      push({
        id: "points-milestone",
        category: "achievement",
        iconComponent: Trophy,
        icon: "🏆",
        title: `Hai raggiunto ${points} punti! Continua così!`,
        timestamp: now,
        priority: "normal",
        tipo: "success",
      });
    }

    // Mark AI notifications - informative
    markNotifications
      .filter((n) => n.type === "informative")
      .forEach((n) => {
        push({
          id: `mark-${n.id}`,
          category: "ai",
          iconComponent: Bot,
          icon: "🤖",
          title: n.title,
          body: n.body,
          timestamp: new Date(n.created_at),
          action: n.action_url || "/coach",
          priority: "low",
          tipo: "info",
        });
      });

    return notifications;
  }, [
    salvadanai,
    lastPatrimonioUpdate,
    spese,
    categorieSpese,
    points,
    recentPosts,
    pendingInvites.length,
    hasActiveWorkspace,
    sharedSpese.length,
    markNotifications,
  ]);

  return {
    allNotifiche,
    markNotifications,
    refresh,
  };
}
