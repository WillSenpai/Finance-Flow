const DEFAULT_ALLOWED_ORIGINS = [
  "capacitor://localhost",
  "ionic://localhost",
  "http://localhost",
  "http://127.0.0.1",
  "https://localhost",
  "https://127.0.0.1",
];

function getAllowedOrigins(): Set<string> {
  const configured = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return new Set(configured.length > 0 ? configured : DEFAULT_ALLOWED_ORIGINS);
}

function isAllowedOrigin(origin: string, allowedOrigins: Set<string>): boolean {
  if (allowedOrigins.has(origin)) return true;

  // Dev convenience: if localhost/127.0.0.1 base origin is allowed, accept any port.
  try {
    const parsed = new URL(origin);
    const host = parsed.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") return false;

    const normalizedBase = `${parsed.protocol}//${host}`;
    return allowedOrigins.has(normalizedBase);
  } catch {
    return false;
  }
}

export function buildCorsHeaders(req: Request): HeadersInit {
  const allowedOrigins = getAllowedOrigins();
  const origin = req.headers.get("Origin");
  const allowOrigin = origin && isAllowedOrigin(origin, allowedOrigins) ? origin : "*";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-cron-secret",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Vary": "Origin",
  };
}

export function rejectDisallowedOrigin(req: Request, corsHeaders: HeadersInit): Response | null {
  const origin = req.headers.get("Origin");
  if (!origin) return null;

  const allowedOrigins = getAllowedOrigins();
  if (isAllowedOrigin(origin, allowedOrigins)) return null;

  return new Response(JSON.stringify({ error: "Origin not allowed" }), {
    status: 403,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
