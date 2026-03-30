import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  onRefresh: () => void;
  children: React.ReactNode;
}

const THRESHOLD = 60;

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [refreshing, setRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const iconRotation = useTransform(y, [0, THRESHOLD], [0, 180]);
  const iconOpacity = useTransform(y, [0, 30, THRESHOLD], [0, 0.5, 1]);

  const handleDragEnd = useCallback(async () => {
    if (y.get() >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      onRefresh();
      // Give visual feedback
      await new Promise((r) => setTimeout(r, 800));
      setRefreshing(false);
    }
  }, [onRefresh, refreshing, y]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ overscrollBehavior: "none" }}
    >
      {/* Pull indicator */}
      <motion.div
        style={{ opacity: iconOpacity }}
        className="flex items-center justify-center py-2"
      >
        <motion.div
          style={{ rotate: iconRotation }}
          animate={refreshing ? { rotate: 360 } : undefined}
          transition={
            refreshing
              ? { repeat: Infinity, duration: 0.8, ease: "linear" }
              : undefined
          }
        >
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        drag="y"
        dragDirectionLock
        dragConstraints={{ top: 0, bottom: THRESHOLD + 20 }}
        dragElastic={0.4}
        style={{ y }}
        onDragEnd={handleDragEnd}
      >
        {children}
      </motion.div>
    </div>
  );
}
