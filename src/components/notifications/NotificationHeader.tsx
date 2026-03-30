import { ArrowLeft, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllRead: () => void;
}

export function NotificationHeader({
  unreadCount,
  onMarkAllRead,
}: NotificationHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-4 pt-2 pb-3">
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/60"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </motion.button>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Notifiche
          </h1>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.span>
          )}
        </div>
      </div>

      {unreadCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onMarkAllRead}
          className="gap-1.5 text-xs text-muted-foreground"
        >
          <CheckCheck className="h-4 w-4" />
          <span className="hidden min-[380px]:inline">Segna tutto</span>
        </Button>
      )}
    </div>
  );
}
