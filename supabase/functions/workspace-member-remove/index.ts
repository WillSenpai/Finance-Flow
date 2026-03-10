import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";
import { requireAuthenticatedUser } from "../_shared/auth.ts";

type Body = {
  workspaceId?: string;
  targetUserId?: string;
  action?: "leave" | "remove";
};

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const originBlocked = rejectDisallowedOrigin(req, corsHeaders);
  if (originBlocked) return originBlocked;

  try {
    const authResult = await requireAuthenticatedUser(req, corsHeaders);
    if (!authResult.ok) return authResult.response;

    const { workspaceId, targetUserId, action = "leave" } = (await req.json()) as Body;
    if (!workspaceId) {
      return new Response(JSON.stringify({ error: "workspaceId is required" }), {
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

    if (action === "leave") {
      const { data: selfMember } = await admin
        .from("shared_workspace_members")
        .select("id, role, status")
        .eq("workspace_id", workspaceId)
        .eq("user_id", authResult.user.id)
        .maybeSingle();

      if (!selfMember || selfMember.status !== "active") {
        return new Response(JSON.stringify({ error: "Active membership not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (selfMember.role === "owner") {
        return new Response(JSON.stringify({ error: "Owner cannot leave workspace. Transfer ownership or delete workspace." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: leaveError } = await admin
        .from("shared_workspace_members")
        .update({ status: "left", left_at: new Date().toISOString() })
        .eq("id", selfMember.id);

      if (leaveError) {
        return new Response(JSON.stringify({ error: leaveError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!targetUserId) {
      return new Response(JSON.stringify({ error: "targetUserId is required for remove action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: ownerMembership } = await admin
      .from("shared_workspace_members")
      .select("id")
      .eq("workspace_id", workspaceId)
      .eq("user_id", authResult.user.id)
      .eq("role", "owner")
      .eq("status", "active")
      .maybeSingle();
    if (!ownerMembership) {
      return new Response(JSON.stringify({ error: "Only owner can remove members" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: targetMember } = await admin
      .from("shared_workspace_members")
      .select("id, role, status")
      .eq("workspace_id", workspaceId)
      .eq("user_id", targetUserId)
      .maybeSingle();
    if (!targetMember || targetMember.status !== "active") {
      return new Response(JSON.stringify({ error: "Target member not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (targetMember.role === "owner") {
      return new Response(JSON.stringify({ error: "Owner cannot be removed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: removeError } = await admin
      .from("shared_workspace_members")
      .update({ status: "removed", left_at: new Date().toISOString() })
      .eq("id", targetMember.id);
    if (removeError) {
      return new Response(JSON.stringify({ error: removeError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("workspace-member-remove error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
