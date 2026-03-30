import { useRef } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

interface SwipeableNotificationProps {
  id: string;
  onDismiss: (id: string) => void;
  children: React.ReactNode;
}

export function SwipeableNotification({
  id,
  onDismiss,
  children,
}: SwipeableNotificationProps) {
  const x = useMotionValue(0);
  const bgOpacity = useTransform(x, [-100, -40, 0], [1, 0.6, 0]);
  const iconScale = useTransform(x, [-100, -60, 0], [1, 0.8, 0]);
  const isDismissing = useRef(false);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Reveal background */}
      <motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 flex items-center justify-end rounded-2xl bg-destructive px-5"
      >
        <motion.div style={{ scale: iconScale }}>
          <Trash2 className="h-5 w-5 text-destructive-foreground" />
        </motion.div>
      </motion.div>

      {/* Draggable card */}
      <motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: -120, right: 0 }}
        dragElastic={0.1}
        style={{ x }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -80 && !isDismissing.current) {
            isDismissing.current = true;
            onDismiss(id);
          }
        }}
        exit={{ x: -400, opacity: 0, transition: { duration: 0.3 } }}
      >
        {children}
      </motion.div>
    </div>
  );
}
