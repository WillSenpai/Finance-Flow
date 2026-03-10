import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";
import { requireAuthenticatedUser } from "../_shared/auth.ts";

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const originBlocked = rejectDisallowedOrigin(req, corsHeaders);
  if (originBlocked) return originBlocked;

  try {
    const authResult = await requireAuthenticatedUser(req, corsHeaders);
    if (!authResult.ok) return authResult.response;

    const userEmail = authResult.user.email?.toLowerCase();
    if (!userEmail) {
      return new Response(JSON.stringify({ invites: [] }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: "Service env missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const admin = createClient(supabaseUrl, serviceRoleKey);

    const { data: invites, error: invitesError } = await admin
      .from("shared_workspace_invites")
      .select("id, workspace_id, invited_by_user_id, expires_at, created_at, status")
      .eq("email", userEmail)
      .eq("status", "pending")
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (invitesError) {
      return new Response(JSON.stringify({ error: invitesError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const workspaceIds = [...new Set((invites ?? []).map((i) => i.workspace_id))];
    const inviterIds = [...new Set((invites ?? []).map((i) => i.invited_by_user_id))];

    const [workspacesResp, invitersResp] = await Promise.all([
      workspaceIds.length
        ? admin.from("shared_workspaces").select("id, name").in("id", workspaceIds)
        : Promise.resolve({ data: [], error: null }),
      inviterIds.length
        ? admin.from("profiles").select("id, name").in("id", inviterIds)
        : Promise.resolve({ data: [], error: null }),
    ]);

    const workspacesById = new Map((workspacesResp.data ?? []).map((w: any) => [w.id, w]));
    const invitersById = new Map((invitersResp.data ?? []).map((p: any) => [p.id, p]));

    const payload = (invites ?? []).map((invite) => ({
      id: invite.id,
      workspaceId: invite.workspace_id,
      workspaceName: workspacesById.get(invite.workspace_id)?.name ?? "Workspace condiviso",
      inviterName: invitersById.get(invite.invited_by_user_id)?.name ?? "Membro",
      expiresAt: invite.expires_at,
      createdAt: invite.created_at,
    }));

    return new Response(JSON.stringify({ invites: payload }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("workspace-invite-list error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
