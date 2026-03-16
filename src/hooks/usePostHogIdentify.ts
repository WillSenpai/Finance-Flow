/**
 * Hook that keeps PostHog user identity in sync with AuthContext & UserContext.
 * Mount once inside the authenticated app shell (e.g. AppBootstrapGate).
 */
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/hooks/useUser";
import { identifyUser, resetUser, isPostHogReady } from "@/lib/posthog";

export function usePostHogIdentify(): void {
  const { user } = useAuth();
  const { userData, isAdmin } = useUser();

  useEffect(() => {
    if (!isPostHogReady()) return;

    if (user) {
      identifyUser(user.id, {
        name: userData.name,
        email: userData.email,
        level: userData.level,
        goals: userData.goals,
        is_admin: isAdmin,
        avatar_id: userData.avatarId,
      });
    } else {
      resetUser();
    }
  }, [user, userData.name, userData.email, userData.level, userData.goals, isAdmin, userData.avatarId]);
}
