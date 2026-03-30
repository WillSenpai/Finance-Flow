import { AnimatePresence, motion } from "framer-motion";
import type { Notifica, TimeGroup } from "@/hooks/useNotifiche";
import { NotificationCard } from "./NotificationCard";
import { SwipeableNotification } from "./SwipeableNotification";

interface NotificationGroupProps {
  label: TimeGroup;
  notifications: Notifica[];
  onDismiss: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
}

export function NotificationGroup({
  label,
  notifications,
  onDismiss,
  onMarkAsRead,
}: NotificationGroupProps) {
  return (
    <div className="space-y-2">
      <h3 className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
        {label}
      </h3>
      <AnimatePresence mode="popLayout">
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -300, transition: { duration: 0.25 } }}
          >
            <SwipeableNotification id={n.id} onDismiss={onDismiss}>
              <NotificationCard
                notification={n}
                onDismiss={onDismiss}
                onMarkAsRead={onMarkAsRead}
              />
            </SwipeableNotification>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
