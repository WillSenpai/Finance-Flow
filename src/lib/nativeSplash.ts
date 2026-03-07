import { Capacitor, registerPlugin } from "@capacitor/core";

type SplashScreenPlugin = {
  hide: () => Promise<void>;
};

const SplashScreen = registerPlugin<SplashScreenPlugin>("SplashScreen");

export const hideNativeSplash = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await SplashScreen.hide();
  } catch {
    // Best-effort hide; avoid blocking bootstrap on plugin/runtime issues.
  }
};
