import { useState } from "react";
import { motion } from "framer-motion";
import { useNotifiche } from "@/hooks/useNotifiche";
import {
  NotificationHeader,
  NotificationFilters,
  NotificationGroup,
  NotificationEmptyState,
  PullToRefresh,
} from "@/components/notifications";

const Notifiche = () => {
  const {
    notifiche,
    allNotifiche,
    groupedNotifiche,
    activeCategory,
    setActiveCategory,
    dismiss,
    dismissAll,
    unreadCount,
    markAsRead,
    refresh,
    dismissed,
  } = useNotifiche();

  const [showRead, setShowRead] = useState(false);

  // Determine empty state context
  const getEmptyContext = () => {
    if (allNotifiche.length === 0) return "no-notifications" as const;
    if (activeCategory !== "all" && groupedNotifiche.length === 0)
      return "filtered-empty" as const;
    if (notifiche.length === 0) return "all-read" as const;
    return null;
  };

  const emptyContext = getEmptyContext();

  return (
    <motion.div
      className="flex flex-col pb-4 pt-14"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <NotificationHeader
        unreadCount={unreadCount}
        onMarkAllRead={dismissAll}
      />

      <NotificationFilters
        active={activeCategory}
        onChange={setActiveCategory}
      />

      <PullToRefresh onRefresh={refresh}>
        <div className="space-y-5 px-4">
          {emptyContext ? (
            <NotificationEmptyState context={emptyContext} />
          ) : (
            groupedNotifiche.map(([group, items]) => (
              <NotificationGroup
                key={group}
                label={group}
                notifications={items}
                onDismiss={dismiss}
                onMarkAsRead={markAsRead}
              />
            ))
          )}

          {/* Show read toggle */}
          {notifiche.length > 0 && dismissed.size > 0 && (
            <button
              onClick={() => setShowRead((p) => !p)}
              className="mx-auto flex items-center gap-2 rounded-full border border-border/50 px-4 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted/50"
            >
              <span
                className={`h-2 w-2 rounded-full ${showRead ? "bg-primary" : "bg-muted-foreground/30"}`}
              />
              {showRead ? "Nascondi lette" : "Mostra notifiche lette"}
            </button>
          )}

          {/* Read notifications */}
          {showRead && dismissed.size > 0 && (
            <div className="space-y-5 opacity-55">
              {allNotifiche
                .filter((n) => dismissed.has(n.id))
                .map((n) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="relative flex items-start gap-3 rounded-2xl border border-border/40 bg-card px-3.5 py-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/50`}
                      >
                        <n.iconComponent className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {n.title}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground/70">
                          Letta
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </div>
      </PullToRefresh>
    </motion.div>
  );
};

export default Notifiche;
