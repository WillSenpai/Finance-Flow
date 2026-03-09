import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";
import { Keyboard } from "@capacitor/keyboard";

export default function NativeIOSKeyboardManager() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== "ios") return;

    const configureKeyboard = async () => {
      try {
        await Keyboard.setAccessoryBarVisible({ isVisible: false });
      } catch {
        // Best-effort: keep app functional even if plugin call fails.
      }
    };

    const listenerPromise = CapacitorApp.addListener("appStateChange", ({ isActive }) => {
      if (isActive) return;

      const activeElement = document.activeElement as HTMLElement | null;
      if (activeElement && typeof activeElement.blur === "function") {
        activeElement.blur();
      }

      void Keyboard.hide().catch(() => {
        // Ignore keyboard-hide failures.
      });
    });

    void configureKeyboard();

    return () => {
      void listenerPromise.then((listener) => listener.remove());
    };
  }, []);

  return null;
}
