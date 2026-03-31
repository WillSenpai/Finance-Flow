import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";
import { requireAuthenticatedUser } from "../_shared/auth.ts";

type TelemetryAction =
  | {
      action: "track_event";
      event_name: string;
      campaign_id?: string;
      run_id?: string;
      latency_ms?: number;
      fps_bucket?: string;
      error_code?: string;
      payload?: Record<string, unknown>;
    }
  | {
      action: "record_test_result";
      campaign_id?: string;
      suite_name: string;
      case_name: string;
      status: "pass" | "fail" | "skip";
      duration_ms?: number;
      details?: Record<string, unknown>;
    };

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const originBlocked = rejectDisallowedOrigin(req, corsHeaders);
  if (originBlocked) return originBlocked;

  try {
    const authResult = await requireAuthenticatedUser(req, corsHeaders);
    if (!authResult.ok) return authResult.response;

    const body = (await req.json()) as TelemetryAction;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const client = createClient(supabaseUrl, serviceRoleKey);

    if (body.action === "track_event") {
      if (!body.event_name) {
        return new Response(JSON.stringify({ error: "event_name is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await client
        .from("game_telemetry_events")
        .insert({
          user_id: authResult.user.id,
          campaign_id: body.campaign_id ?? null,
          run_id: body.run_id ?? null,
          event_name: body.event_name,
          payload: body.payload ?? {},
          latency_ms: body.latency_ms ?? null,
          fps_bucket: body.fps_bucket ?? null,
          error_code: body.error_code ?? null,
        })
        .select("id")
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ tracked: true, id: data.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (body.action === "record_test_result") {
      if (!body.suite_name || !body.case_name || !body.status) {
        return new Response(JSON.stringify({ error: "suite_name, case_name and status are required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await client
        .from("game_test_results")
        .insert({
          user_id: authResult.user.id,
          campaign_id: body.campaign_id ?? null,
          suite_name: body.suite_name,
          case_name: body.case_name,
          status: body.status,
          duration_ms: body.duration_ms ?? null,
          details: body.details ?? {},
        })
        .select("id")
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ recorded: true, id: data.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unsupported action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("game-telemetry error", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
