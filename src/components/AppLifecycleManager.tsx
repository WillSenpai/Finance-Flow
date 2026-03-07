import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { App as CapacitorApp } from "@capacitor/app";
import { Preferences } from "@capacitor/preferences";

const BACKGROUND_TIMEOUT_MS = 10 * 60 * 1000;
const LAST_BACKGROUND_AT_KEY = "last_background_at";

const AppLifecycleManager = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const saveBackgroundTimestamp = async () => {
      try {
        await Preferences.set({
          key: LAST_BACKGROUND_AT_KEY,
          value: String(Date.now()),
        });
      } catch {
        // Ignore plugin errors; app refresh logic is best-effort.
      }
    };

    const refreshIfExpired = async () => {
      try {
        const { value } = await Preferences.get({ key: LAST_BACKGROUND_AT_KEY });
        if (!value) return;

        const elapsed = Date.now() - Number(value);
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
