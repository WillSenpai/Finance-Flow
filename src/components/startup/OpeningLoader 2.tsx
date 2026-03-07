import { motion, useReducedMotion } from "framer-motion";
import { OPENING_SLOW_TEXT } from "@/config/startup";

interface OpeningLoaderProps {
  showSlowState: boolean;
}

const OpeningLoader = ({ showSlowState }: OpeningLoaderProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        className="absolute inset-0"
        animate={
          shouldReduceMotion
            ? undefined
            : {
              background: [
                "radial-gradient(circle at 50% 40%, hsl(var(--primary) / 0.16) 0%, transparent 55%), radial-gradient(circle at 25% 70%, hsl(var(--secondary) / 0.12) 0%, transparent 48%)",
                "radial-gradient(circle at 50% 42%, hsl(var(--primary) / 0.2) 0%, transparent 58%), radial-gradient(circle at 73% 28%, hsl(var(--secondary) / 0.14) 0%, transparent 45%)",
              ],
            }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 3.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
        }
      />

      <div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center">
        <motion.div
          className="relative flex h-28 w-28 items-center justify-center"
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.div
            className="absolute h-full w-full rounded-full border border-primary/25"
            animate={shouldReduceMotion ? { opacity: 0.28 } : { scale: [1, 1.12], opacity: [0.58, 0.12] }}
            transition={shouldReduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            className="absolute h-[82%] w-[82%] rounded-full border border-secondary/35"
            animate={shouldReduceMotion ? { opacity: 0.2 } : { scale: [1, 1.18], opacity: [0.44, 0.08] }}
            transition={shouldReduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.22 }}
          />
          <motion.div
            className="h-16 w-16 rounded-2xl bg-primary/90 text-primary-foreground shadow-lg"
            animate={shouldReduceMotion ? undefined : { rotate: [0, 6, -6, 0] }}
            transition={shouldReduceMotion ? undefined : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex h-full items-center justify-center text-xl font-semibold">FF</div>
          </motion.div>
        </motion.div>

        <div className="space-y-2">
          <p className="text-base font-semibold tracking-wide text-foreground">Finance Flow</p>
          {showSlowState ? (
            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {OPENING_SLOW_TEXT}
            </motion.p>
          ) : (
            <div className="h-5" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OpeningLoader;
