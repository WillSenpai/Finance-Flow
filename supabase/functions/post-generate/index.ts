import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { chatCompletionWithComplexFallback, extractAssistantContent } from "../_shared/ai.ts";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";
import { requireAdminUser, requireAuthenticatedUser } from "../_shared/auth.ts";

type Target = "esplora" | "comunicazioni";
type Length = "breve" | "media" | "lunga";

type GenerationDetails = {
  obiettivo?: string;
  pubblico?: string;
  tono?: string;
  struttura?: string;
  puntiChiave?: string;
  noteAggiuntive?: string;
  lunghezza?: Length;
};

type Payload = {
  target?: Target;
  title?: string;
  details?: GenerationDetails;
  contentType?: string;
};

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const originBlocked = rejectDisallowedOrigin(req, corsHeaders);
  if (originBlocked) return originBlocked;

  try {
    const authResult = await requireAuthenticatedUser(req, corsHeaders);
    if (!authResult.ok) return authResult.response;
    const isAdmin = await requireAdminUser(authResult.user.id);
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin role required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as Payload;
    const AI_API_KEY = Deno.env.get("AI_API_KEY") ?? Deno.env.get("OPENAI_API_KEY");
    if (!AI_API_KEY) throw new Error("AI_API_KEY is not configured");

    const target: Target = body?.target === "esplora" ? "esplora" : "comunicazioni";
    const title = (body?.title ?? "").trim();
    if (!title) throw new Error("Titolo mancante");

    const details = sanitizeDetails(body?.details);
    const contentType = (body?.contentType ?? "post").trim();

    const targetInstruction = target === "esplora"
      ? `Target: articolo "Esplora" (educativo, approfondito e pratico).
- Spiega chiaramente il tema del titolo.
- Usa esempi concreti, analogie semplici e consigli pratici.
- Struttura suggerita: apertura breve, 2-4 sezioni, chiusura con takeaway.`
      : `Target: post "Comunicazioni" in app (utile, diretto, leggibile su mobile).
- Vai subito al punto.
- Evidenzia valore pratico per l'utente.
- Chiudi con una call to action chiara.`;

    const lengthInstruction = getLengthInstruction(details.lunghezza);

    const { response } = await chatCompletionWithComplexFallback({
      apiKey: AI_API_KEY,
      isComplexTask: true,
      validateContent: (content) => isAcceptable(content, title),
      messages: [
        {
          role: "system",
          content: `Sei un content editor senior per un'app italiana di educazione finanziaria.
Regole fondamentali:
- NON generare testo casuale o generico.
- Segui in modo stretto il titolo e i dettagli forniti.
- Mantieni un italiano naturale, preciso e concreto.
- Nessun meta-commento (es. "ecco il post"), nessuna premessa tecnica.
- Restituisci SOLO JSON valido (senza markdown, senza testo extra) nel formato:
{"content":"...","emoji":"📌","tags":["tag1","tag2"]}`,
        },
        {
          role: "user",
          content: `Genera un contenuto per l'app.

${targetInstruction}

Titolo obbligatorio:
${title}

Dettagli utente:
- Obiettivo: ${details.obiettivo || "non specificato"}
- Pubblico: ${details.pubblico || "non specificato"}
- Tono: ${details.tono || "non specificato"}
- Struttura richiesta: ${details.struttura || "non specificata"}
- Punti chiave da includere: ${details.puntiChiave || "non specificati"}
- Note aggiuntive: ${details.noteAggiuntive || "nessuna"}
- Lunghezza richiesta: ${details.lunghezza || "media"}
- Tipo contenuto (solo comunicazioni): ${contentType}

Vincoli:
- Content: formato testo pulito con \n o <br> per i ritorni a capo.
- Per target "comunicazioni", mantieni il testo compatto e orientato all'azione.
- Per target "esplora", aggiungi anche tags pertinenti (max 6, lowercase, senza #).
- Per target "comunicazioni", tags può essere array vuoto.
- Emoji: una sola emoji coerente col titolo.
- ${lengthInstruction}`,
        },
      ],
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Troppe richieste" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crediti AI esauriti" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("post-generate error:", response.status, t);
      return new Response(JSON.stringify({ error: "Errore AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const rawContent = extractRawAssistantPayload(data);
    const generated = parseGeneratedPayload(rawContent, target);
    if (!generated || !isAcceptable(generated.content, title)) {
      return new Response(JSON.stringify({ error: "Output AI non valido o troppo generico" }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(generated), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("post-generate error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Errore" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function sanitizeDetails(details?: GenerationDetails): GenerationDetails {
  return {
    obiettivo: sanitizeText(details?.obiettivo),
    pubblico: sanitizeText(details?.pubblico),
    tono: sanitizeText(details?.tono),
    struttura: sanitizeText(details?.struttura),
    puntiChiave: sanitizeText(details?.puntiChiave),
    noteAggiuntive: sanitizeText(details?.noteAggiuntive),
    lunghezza: normalizeLength(details?.lunghezza),
  };
}

function sanitizeText(value?: string): string {
  return (value ?? "").trim().slice(0, 1200);
}

function normalizeLength(value?: string): Length {
  if (value === "breve" || value === "lunga") return value;
  return "media";
}

function getLengthInstruction(length: Length = "media"): string {
  if (length === "breve") return "Lunghezza target: circa 90-140 parole.";
  if (length === "lunga") return "Lunghezza target: circa 260-420 parole.";
  return "Lunghezza target: circa 160-260 parole.";
}

function parseGeneratedPayload(raw: string, target: Target): { content: string; emoji: string; tags: string[] } | null {
  const parsed = safeParseJson(raw);
  if (!parsed || typeof parsed !== "object") {
    const fallbackContent = raw.trim();
    if (!fallbackContent) return null;
    return { content: fallbackContent, emoji: "📝", tags: [] };
  }

  const content = typeof parsed.content === "string" ? parsed.content.trim() : "";
  const emoji = typeof parsed.emoji === "string" ? parsed.emoji.trim().slice(0, 8) : "📝";
  const incomingTags = Array.isArray(parsed.tags) ? parsed.tags : [];
  const tags = incomingTags
    .filter((t) => typeof t === "string")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, target === "esplora" ? 6 : 0);

  if (!content) return null;

  return { content, emoji: emoji || "📝", tags };
}

function safeParseJson(raw: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed ? parsed as Record<string, unknown> : null;
  } catch {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start < 0 || end <= start) return null;
    try {
      const parsed = JSON.parse(raw.slice(start, end + 1));
      return typeof parsed === "object" && parsed ? parsed as Record<string, unknown> : null;
    } catch {
      return null;
    }
  }
}

function isAcceptable(content: string, title: string): boolean {
  if (!content || content.length < 60) return false;
  if (!title) return true;
  // Keep quality check but avoid false negatives when model uses synonyms.
  return hasTopicFocus(content, title) || content.length >= 180;
}

function hasTopicFocus(content: string, title: string): boolean {
  const text = normalize(content);
  const keywords = title
    .split(/[^\p{L}\p{N}]+/u)
    .map((k) => normalize(k))
    .filter((k) => k.length >= 4);

  if (keywords.length === 0) return true;
  return keywords.some((k) => text.includes(k));
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function extractRawAssistantPayload(data: unknown): string {
  const direct = extractAssistantContent(data);
  if (direct) return direct;

  const maybe = data as {
    choices?: Array<{ message?: { content?: string | Array<{ type?: string; text?: string }> } }>;
  };
  const content = maybe?.choices?.[0]?.message?.content;

  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part?.text === "string" ? part.text : ""))
      .join("\n")
      .trim();
  }
  return "";
}
