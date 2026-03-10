import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";
import { requireAuthenticatedUser } from "../_shared/auth.ts";

type InviteDecisionBody = {
  inviteId?: string;
  decision?: "accept" | "decline";
};

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const originBlocked = rejectDisallowedOrigin(req, corsHeaders);
  if (originBlocked) return originBlocked;

  try {
    const authResult = await requireAuthenticatedUser(req, corsHeaders);
    if (!authResult.ok) return authResult.response;

    const { inviteId, decision = "accept" } = (await req.json()) as InviteDecisionBody;
    if (!inviteId) {
      return new Response(JSON.stringify({ error: "inviteId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userEmail = authResult.user.email?.toLowerCase();
    if (!userEmail) {
      return new Response(JSON.stringify({ error: "User email is required" }), {
        status: 400,
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

    const { data: invite, error: inviteError } = await admin
      .from("shared_workspace_invites")
      .select("id, workspace_id, email, status, expires_at")
      .eq("id", inviteId)
      .maybeSingle();

    if (inviteError || !invite) {
      return new Response(JSON.stringify({ error: "Invite not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (invite.status !== "pending") {
      return new Response(JSON.stringify({ error: "Invite is no longer pending" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (new Date(invite.expires_at).getTime() < Date.now()) {
      await admin
        .from("shared_workspace_invites")
        .update({ status: "expired", responded_at: new Date().toISOString() })
        .eq("id", inviteId);

      return new Response(JSON.stringify({ error: "Invite expired" }), {
        status: 410,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (invite.email.toLowerCase() !== userEmail) {
      return new Response(JSON.stringify({ error: "Invite does not match your account email" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (decision === "decline") {
      await admin
        .from("shared_workspace_invites")
        .update({
          status: "declined",
          accepted_by_user_id: authResult.user.id,
          responded_at: new Date().toISOString(),
        })
        .eq("id", inviteId);

      return new Response(JSON.stringify({ ok: true, declined: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: activeMembership } = await admin
      .from("shared_workspace_members")
      .select("id")
      .eq("user_id", authResult.user.id)
      .eq("status", "active")
      .maybeSingle();
    if (activeMembership) {
      return new Response(JSON.stringify({ error: "You already belong to an active shared workspace" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const nowIso = new Date().toISOString();

    const { error: memberError } = await admin
      .from("shared_workspace_members")
      .upsert(
        {
          workspace_id: invite.workspace_id,
          user_id: authResult.user.id,
          role: "member",
          status: "active",
          joined_at: nowIso,
          left_at: null,
        },
        { onConflict: "workspace_id,user_id" },
      );

    if (memberError) {
      return new Response(JSON.stringify({ error: memberError.message }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: updateInviteError } = await admin
      .from("shared_workspace_invites")
      .update({
        status: "accepted",
        accepted_by_user_id: authResult.user.id,
        responded_at: nowIso,
      })
      .eq("id", inviteId);

    if (updateInviteError) {
      return new Response(JSON.stringify({ error: updateInviteError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, workspaceId: invite.workspace_id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("workspace-invite-accept error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
