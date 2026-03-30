import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Notifica } from "./types";

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

export function useNotificationState(allNotifiche: Notifica[]) {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState<Set<string>>(getDismissed);

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

  // Prune stale dismissed IDs that no longer exist in allNotifiche
  useEffect(() => {
    if (dismissed.size === 0) return;
    const activeIds = new Set(allNotifiche.map((n) => n.id));
    const pruned = new Set([...dismissed].filter((id) => activeIds.has(id)));
    if (pruned.size !== dismissed.size) {
      setDismissed(pruned);
    }
  }, [allNotifiche, dismissed]);

  const dismiss = useCallback((id: string) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const dismissAll = useCallback(() => {
    setDismissed((prev) => {
      const next = new Set(prev);
      allNotifiche.forEach((n) => next.add(n.id));
      return next;
    });
  }, [allNotifiche]);

  // Mark a Mark notification as read in Supabase
  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (!user?.id) return;
      const actualId = notificationId.startsWith("mark-")
        ? notificationId.replace("mark-", "")
        : notificationId;
      try {
        await supabase
          .from("mark_notifications")
          .update({ read_at: new Date().toISOString() })
          .eq("id", actualId)
          .eq("user_id", user.id);
      } catch (e) {
        console.error("Error marking notification as read:", e);
      }
    },
    [user?.id],
  );

  // Mark all Mark notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;
    try {
      await supabase
        .from("mark_notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .is("read_at", null);
    } catch (e) {
      console.error("Error marking all notifications as read:", e);
    }
  }, [user?.id]);

  return {
    dismissed,
    dismiss,
    dismissAll,
    markAsRead,
    markAllAsRead,
  };
}
