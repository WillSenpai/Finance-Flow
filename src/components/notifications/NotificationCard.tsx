import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import type { Notifica, NotificationCategory } from "@/hooks/useNotifiche";

const CATEGORY_STYLES: Record<
  NotificationCategory,
  { bg: string; text: string }
> = {
  ai: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" },
  finance: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  system: {
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
  },
  social: {
    bg: "bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400",
  },
  achievement: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-600 dark:text-yellow-400",
  },
};

interface NotificationCardProps {
  notification: Notifica;
  onDismiss: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
}

export function NotificationCard({
  notification: n,
  onDismiss,
  onMarkAsRead,
}: NotificationCardProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const style = CATEGORY_STYLES[n.category];
  const Icon = n.iconComponent;
  const hasBody = !!n.body;
  const isUnread = !n.isRead && !expanded;

  const handleTap = () => {
    if (hasBody) {
      setExpanded((prev) => !prev);
    }
    if (n.action) {
      onMarkAsRead?.(n.id);
      navigate(n.action);
    }
  };

  const timeAgo = formatDistanceToNow(n.timestamp, {
    addSuffix: true,
    locale: it,
  });

  return (
    <motion.div
      layout
      onClick={handleTap}
      className={`relative flex cursor-pointer items-start gap-3 rounded-2xl border border-border/40 bg-card px-3.5 py-3 transition-opacity ${
        n.isRead ? "opacity-55" : ""
      }`}
    >
      {/* Unread dot */}
      {!n.isRead && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary"
        />
      )}

      {/* Icon circle */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style.bg}`}
      >
        <Icon className={`h-5 w-5 ${style.text}`} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {n.title}
        </p>

        <AnimatePresence initial={false}>
          {hasBody && !expanded && (
            <motion.p
              key="collapsed"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-0.5 line-clamp-2 text-xs text-muted-foreground"
            >
              {n.body}
            </motion.p>
          )}
          {hasBody && expanded && (
            <motion.p
              key="expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-0.5 text-xs text-muted-foreground"
            >
              {n.body}
            </motion.p>
          )}
        </AnimatePresence>

        <p className="mt-1 text-[10px] text-muted-foreground/70">{timeAgo}</p>
      </div>

      {/* Action chevron */}
      {n.action && (
        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/50" />
      )}
    </motion.div>
  );
}
