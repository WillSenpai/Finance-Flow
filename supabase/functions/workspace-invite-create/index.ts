import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";
import { requireAuthenticatedUser } from "../_shared/auth.ts";

type InviteBody = {
  workspaceId?: string;
  email?: string;
};

const encoder = new TextEncoder();

async function sha256(input: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", encoder.encode(input));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const originBlocked = rejectDisallowedOrigin(req, corsHeaders);
  if (originBlocked) return originBlocked;

  try {
    const authResult = await requireAuthenticatedUser(req, corsHeaders);
    if (!authResult.ok) return authResult.response;

    const { workspaceId, email } = (await req.json()) as InviteBody;
    const normalizedEmail = email?.trim().toLowerCase();
    if (!workspaceId || !normalizedEmail) {
      return new Response(JSON.stringify({ error: "workspaceId and email are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if ((authResult.user.email ?? "").toLowerCase() === normalizedEmail) {
      return new Response(JSON.stringify({ error: "Non puoi invitare te stesso" }), {
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

    const { data: ownerMembership } = await admin
      .from("shared_workspace_members")
      .select("id")
      .eq("workspace_id", workspaceId)
      .eq("user_id", authResult.user.id)
      .eq("role", "owner")
      .eq("status", "active")
      .maybeSingle();

    if (!ownerMembership) {
      return new Response(JSON.stringify({ error: "Only workspace owner can invite members" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: workspace } = await admin
      .from("shared_workspaces")
      .select("id, name, max_members")
      .eq("id", workspaceId)
      .maybeSingle();
    if (!workspace) {
      return new Response(JSON.stringify({ error: "Workspace not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: inviterProfile } = await admin
      .from("profiles")
      .select("name")
      .eq("id", authResult.user.id)
      .maybeSingle();
    const inviterName =
      inviterProfile?.name?.trim() || authResult.user.email?.split("@")[0] || "Un tuo contatto";

    // Normalize invite lifecycle so expired pending invites don't block reinvites.
    await admin
      .from("shared_workspace_invites")
      .update({ status: "expired", responded_at: new Date().toISOString() })
      .eq("workspace_id", workspaceId)
      .eq("status", "pending")
      .lt("expires_at", new Date().toISOString());

    const { data: existingProfile } = await admin
      .from("profiles")
      .select("id")
      .ilike("email", normalizedEmail)
      .limit(1)
      .maybeSingle();

    if (existingProfile?.id) {
      const { data: existingMember } = await admin
        .from("shared_workspace_members")
        .select("id")
        .eq("workspace_id", workspaceId)
        .eq("user_id", existingProfile.id)
        .eq("status", "active")
        .maybeSingle();

      if (existingMember) {
        return new Response(JSON.stringify({ error: "Questo utente è già nel workspace" }), {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const { count: activeMembers } = await admin
      .from("shared_workspace_members")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .eq("status", "active");

    const { count: pendingInvites } = await admin
      .from("shared_workspace_invites")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .eq("status", "pending")
      .gte("expires_at", new Date().toISOString());

    const seatsUsed = (activeMembers ?? 0) + (pendingInvites ?? 0);
    if (seatsUsed >= (workspace.max_members ?? 5)) {
      return new Response(JSON.stringify({ error: "Workspace member limit reached" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = crypto.randomUUID().replaceAll("-", "") + crypto.randomUUID().replaceAll("-", "");
    const tokenHash = await sha256(token);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const { data: invite, error: inviteError } = await admin
      .from("shared_workspace_invites")
      .insert({
        workspace_id: workspaceId,
        email: normalizedEmail,
        invited_by_user_id: authResult.user.id,
        token_hash: tokenHash,
        status: "pending",
        expires_at: expiresAt,
      })
      .select("id")
      .single();

    if (inviteError || !invite) {
      if (inviteError?.code === "23505") {
        return new Response(JSON.stringify({ error: "Esiste già un invito pendente per questa email" }), {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: inviteError?.message ?? "Failed to create invite" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const appSiteUrl = Deno.env.get("APP_SITE_URL") ?? req.headers.get("Origin") ?? "";
    const next = encodeURIComponent(`/patrimonio/inviti?invite=${invite.id}`);
    const redirectTo = appSiteUrl
      ? `${appSiteUrl}/auth/callback?next=${next}`
      : undefined;

    const { error: authInviteError } = await admin.auth.admin.inviteUserByEmail(normalizedEmail, {
      redirectTo,
      data: {
        invited_by_name: inviterName,
        workspace_name: workspace.name ?? "Spazio condiviso",
      },
    });

    if (authInviteError) {
      // Keep invite row so existing users can still accept manually in-app.
      console.error("inviteUserByEmail failed:", authInviteError.message);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        inviteId: invite.id,
        expiresAt,
        emailSent: !authInviteError,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("workspace-invite-create error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
