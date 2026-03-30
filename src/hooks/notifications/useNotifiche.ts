import { useMemo, useState, useCallback } from "react";
import { useNotificationSources } from "./useNotificationSources";
import { useNotificationState } from "./useNotificationState";
import { groupNotificationsByTime } from "./groupByTime";
import type { Notifica, NotificationCategory, TimeGroup } from "./types";

export function useNotifiche() {
  const { allNotifiche, markNotifications, refresh } = useNotificationSources();
  const { dismissed, dismiss, dismissAll, markAsRead, markAllAsRead } =
    useNotificationState(allNotifiche);

  const [activeCategory, setActiveCategory] = useState<
    NotificationCategory | "all"
  >("all");

  // Unread notifications (not dismissed)
  const notifiche = useMemo(
    () => allNotifiche.filter((n) => !dismissed.has(n.id)),
    [allNotifiche, dismissed],
  );

  const unreadCount = notifiche.length;
  const markUnreadCount = markNotifications.length;

  // Filter by category
  const filteredNotifiche = useMemo(() => {
    if (activeCategory === "all") return notifiche;
    return notifiche.filter((n) => n.category === activeCategory);
  }, [notifiche, activeCategory]);

  // Group by time
  const groupedNotifiche = useMemo(
    () => groupNotificationsByTime(filteredNotifiche),
    [filteredNotifiche],
  );

  return {
    // Backward-compatible API
    notifiche,
    allNotifiche,
    dismissed,
    dismiss,
    dismissAll,
    unreadCount,
    markNotifications,
    markAsRead,
    markAllAsRead,
    markUnreadCount,
    // New API
    groupedNotifiche,
    activeCategory,
    setActiveCategory,
    filteredNotifiche,
    refresh,
  };
}
