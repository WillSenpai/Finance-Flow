import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";

type NotificationType = "urgent" | "important" | "informative";

type SendNotificationAction =
  | {
      action: "send";
      userId: string;
      type: NotificationType;
      title: string;
      body: string;
      actionUrl?: string;
      metadata?: Record<string, unknown>;
      sendPush?: boolean;
    }
  | {
      action: "send_to_workspace";
      workspaceId: string;
      type: NotificationType;
      title: string;
      body: string;
      actionUrl?: string;
      metadata?: Record<string, unknown>;
      excludeUserId?: string;
      sendPush?: boolean;
    }
  | {
      action: "mark_read";
      notificationIds: string[];
    }
  | {
      action: "mark_all_read";
    }
  | {
      action: "get_unread";
      limit?: number;
    }
  | {
      action: "get_all";
      limit?: number;
      offset?: number;
    };

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const originBlocked = rejectDisallowedOrigin(req, corsHeaders);
  if (originBlocked) return originBlocked;

  try {
    // This function can be called with service role key for internal use
    // or with user auth for reading/marking notifications
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const body = (await req.json()) as SendNotificationAction;
    const { action } = body;

    // Service client for sending notifications
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

    // Determine if this is a service-level call or user call
    const isServiceCall = authHeader?.includes(supabaseServiceKey);

    // For user calls, verify the user
    let userId: string | null = null;
    if (!isServiceCall && authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const userClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
      });
      const { data: { user }, error: authError } = await userClient.auth.getUser();
      if (authError || !user) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      userId = user.id;
    }

    switch (action) {
      case "send": {
        // Only allow service calls to send notifications
        if (!isServiceCall) {
          return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { userId: targetUserId, type, title, body: notifBody, actionUrl, metadata, sendPush } = body;

        // Insert notification
        const { data: notification, error } = await serviceClient
          .from("mark_notifications")
          .insert({
            user_id: targetUserId,
            type,
            title,
            body: notifBody,
            action_url: actionUrl,
            metadata: metadata || {},
          })
          .select()
          .single();

        if (error) throw error;

        // Send push notification if requested
        if (sendPush && type !== "informative") {
          await sendPushNotification(serviceClient, targetUserId, { title, body: notifBody });
        }

        return new Response(
          JSON.stringify({ notification }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "send_to_workspace": {
        // Only allow service calls
        if (!isServiceCall) {
          return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const {
          workspaceId,
          type,
          title,
          body: notifBody,
          actionUrl,
          metadata,
          excludeUserId,
          sendPush,
        } = body;

        // Get workspace members
        const { data: members, error: membersError } = await serviceClient
          .from("shared_workspace_members")
          .select("user_id")
          .eq("workspace_id", workspaceId)
          .eq("status", "active");

        if (membersError) throw membersError;

        const targetUserIds = (members || [])
          .map((m) => m.user_id)
          .filter((id) => id !== excludeUserId);

        if (targetUserIds.length === 0) {
          return new Response(
            JSON.stringify({ sent: 0 }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Insert notifications for all members
        const notifications = targetUserIds.map((uid) => ({
          user_id: uid,
          type,
          title,
          body: notifBody,
          action_url: actionUrl,
          metadata: { ...metadata, workspace_id: workspaceId },
        }));

        const { data, error: insertError } = await serviceClient
          .from("mark_notifications")
          .insert(notifications)
          .select();

        if (insertError) throw insertError;

        // Send push notifications if requested
        if (sendPush && type !== "informative") {
          for (const uid of targetUserIds) {
            await sendPushNotification(serviceClient, uid, { title, body: notifBody });
          }
        }

        return new Response(
          JSON.stringify({ sent: data?.length || 0 }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "mark_read": {
        if (!userId) {
          return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { notificationIds } = body;

        const { error } = await serviceClient
          .from("mark_notifications")
          .update({ read_at: new Date().toISOString() })
          .in("id", notificationIds)
          .eq("user_id", userId);

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "mark_all_read": {
        if (!userId) {
          return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { error } = await serviceClient
          .from("mark_notifications")
          .update({ read_at: new Date().toISOString() })
          .eq("user_id", userId)
          .is("read_at", null);

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "get_unread": {
        if (!userId) {
          return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const limit = body.limit || 20;

        const { data, error, count } = await serviceClient
          .from("mark_notifications")
          .select("*", { count: "exact" })
          .eq("user_id", userId)
          .is("read_at", null)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (error) throw error;

        return new Response(
          JSON.stringify({ notifications: data || [], unreadCount: count || 0 }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "get_all": {
        if (!userId) {
          return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const limit = body.limit || 50;
        const offset = body.offset || 0;

        const { data, error, count } = await serviceClient
          .from("mark_notifications")
          .select("*", { count: "exact" })
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) throw error;

        return new Response(
          JSON.stringify({ notifications: data || [], total: count || 0 }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Azione non riconosciuta" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (e) {
    console.error("send-notification error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Errore sconosciuto" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Send push notification via FCM HTTP v1 API
async function sendPushNotification(
  client: ReturnType<typeof createClient>,
  userId: string,
  notification: { title: string; body: string; action_url?: string }
) {
  try {
    // Get user's device tokens
    const { data: tokens } = await client
      .from("device_push_tokens")
      .select("token, platform")
      .eq("user_id", userId);

    if (!tokens || tokens.length === 0) {
      console.log(`[Push] No device tokens for user ${userId}`);
      return;
    }

    const FCM_SERVER_KEY = Deno.env.get("FCM_SERVER_KEY");
    if (!FCM_SERVER_KEY) {
      console.warn("[Push] FCM_SERVER_KEY not configured, skipping push");
      return;
    }

    const invalidTokens: string[] = [];

    for (const { token } of tokens) {
      try {
        const res = await fetch("https://fcm.googleapis.com/fcm/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `key=${FCM_SERVER_KEY}`,
          },
          body: JSON.stringify({
            to: token,
            notification: {
              title: notification.title,
              body: notification.body,
            },
            data: {
              action_url: notification.action_url || "",
            },
          }),
        });

        const result = await res.json();

        // Handle invalid/unregistered tokens
        if (result.failure && result.results?.[0]?.error === "NotRegistered") {
          invalidTokens.push(token);
        }
      } catch (err) {
        console.error(`[Push] Error sending to token ${token.slice(0, 10)}...:`, err);
      }
    }

    // Clean up invalid tokens
    if (invalidTokens.length > 0) {
      await client
        .from("device_push_tokens")
        .delete()
        .eq("user_id", userId)
        .in("token", invalidTokens);
      console.log(`[Push] Removed ${invalidTokens.length} invalid tokens for user ${userId}`);
    }

    // Mark notifications as pushed
    await client
      .from("mark_notifications")
      .update({ pushed_at: new Date().toISOString() })
      .eq("user_id", userId)
      .is("pushed_at", null)
      .order("created_at", { ascending: false })
      .limit(1);

    console.log(`[Push] Sent to ${tokens.length - invalidTokens.length} devices for user ${userId}`);
  } catch (err) {
    console.error("Error sending push notification:", err);
  }
}
