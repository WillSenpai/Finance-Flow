import { useEffect, useCallback, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function usePushNotifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const registered = useRef(false);

  const saveToken = useCallback(
    async (token: string) => {
      if (!user?.id) return;
      const platform = Capacitor.getPlatform(); // "ios" | "android"
      try {
        await supabase.from("device_push_tokens").upsert(
          {
            user_id: user.id,
            token,
            platform,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,token" },
        );
      } catch (e) {
        console.error("Failed to save push token:", e);
      }
    },
    [user?.id],
  );

  const registerPush = useCallback(async () => {
    if (!Capacitor.isNativePlatform() || registered.current) return;

    const permResult = await PushNotifications.requestPermissions();
    if (permResult.receive !== "granted") return;

    await PushNotifications.register();
    registered.current = true;
  }, []);

  useEffect(() => {
    if (!Capacitor.isNativePlatform() || !user?.id) return;

    registerPush();

    // Token received
    const tokenListener = PushNotifications.addListener(
      "registration",
      (token) => {
        saveToken(token.value);
      },
    );

    // Registration error
    const errorListener = PushNotifications.addListener(
      "registrationError",
      (error) => {
        console.error("Push registration error:", error);
      },
    );

    // Notification received in foreground
    const foregroundListener = PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        toast(notification.title || "Nuova notifica", {
          description: notification.body,
        });
      },
    );

    // User tapped notification
    const actionListener = PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (action) => {
        const actionUrl = action.notification.data?.action_url;
        if (actionUrl && typeof actionUrl === "string") {
          navigate(actionUrl);
        }
      },
    );

    return () => {
      tokenListener.then((l) => l.remove());
      errorListener.then((l) => l.remove());
      foregroundListener.then((l) => l.remove());
      actionListener.then((l) => l.remove());
    };
  }, [user?.id, registerPush, saveToken, navigate]);
}
