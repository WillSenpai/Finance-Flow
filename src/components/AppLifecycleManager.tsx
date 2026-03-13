import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { App as CapacitorApp } from "@capacitor/app";
import { persistBackgroundTimestamp, readBackgroundTimestamp } from "@/lib/nativeResume";

const BACKGROUND_TIMEOUT_MS = 10 * 60 * 1000;

const AppLifecycleManager = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const saveBackgroundTimestamp = async () => {
      try {
        await persistBackgroundTimestamp();
      } catch {
        // Ignore plugin errors; app refresh logic is best-effort.
      }
    };

    const refreshIfExpired = async () => {
      try {
        const lastBackgroundAt = await readBackgroundTimestamp();
        if (!lastBackgroundAt) return;

        const elapsed = Date.now() - lastBackgroundAt;
        if (elapsed <= BACKGROUND_TIMEOUT_MS) return;

        await queryClient.invalidateQueries();
        await queryClient.refetchQueries({ type: "active" });
      } catch {
        // Ignore plugin errors; app refresh logic is best-effort.
      }
    };

    const listenerPromise = CapacitorApp.addListener("appStateChange", ({ isActive }) => {
      if (isActive) {
        void refreshIfExpired();
      } else {
        void saveBackgroundTimestamp();
      }
    });

    return () => {
      void listenerPromise.then((listener) => listener.remove());
    };
  }, [queryClient]);

  return null;
};

export default AppLifecycleManager;
