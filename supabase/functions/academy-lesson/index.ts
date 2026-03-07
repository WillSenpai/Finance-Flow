import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  AI_BASE_MODEL,
  chatCompletion,
  chatCompletionWithComplexFallback,
  extractAssistantContent,
} from "../_shared/ai.ts";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";
import { requireAuthenticatedUser } from "../_shared/auth.ts";
import {
  consumeAiTokens,
  estimateTokensFromMessages,
  estimateTokensFromText,
  quotaExceededResponse,
} from "../_shared/quota.ts";

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const originBlocked = rejectDisallowedOrigin(req, corsHeaders);
  if (originBlocked) return originBlocked;

  try {
    const authResult = await requireAuthenticatedUser(req, corsHeaders);
    if (!authResult.ok) return authResult.response;

    const { lessonId, titolo, messages } = await req.json();
    const AI_API_KEY = Deno.env.get("AI_API_KEY") ?? Deno.env.get("OPENAI_API_KEY");
    if (!AI_API_KEY) throw new Error("AI_API_KEY is not configured");

    const estimatedTokens =
      550 + estimateTokensFromText(String(titolo ?? "")) + estimateTokensFromMessages(messages ?? []);
    const quota = await consumeAiTokens(authResult.user.id, estimatedTokens, "academy-lesson");
    if (!quota.allowed) return quotaExceededResponse(quota, corsHeaders);

    const systemPrompt = `Sei un educatore finanziario esperto e amichevole. Parli sempre in italiano. Il tuo compito è spiegare concetti di finanza personale in modo chiaro, pratico e accessibile a un pubblico italiano.

Argomento della lezione: "${titolo}"

Regola assoluta: l'output deve contenere solo contenuto pertinente all'argomento "${titolo}". Non inserire parole o frasi fuori contesto, meta-commenti o digressioni.

## Quando generi la spiegazione iniziale (nessun messaggio dell'utente):
Struttura la risposta così:

### 🎯 Introduzione
Una spiegazione semplice e accessibile del concetto, come se parlassi a un amico che non sa nulla di finanza.

### 📚 Concetti Chiave
I punti fondamentali da capire, con **esempi pratici italiani** (cifre in euro, riferimenti a prodotti/istituzioni italiane come BTP, conti deposito, Poste Italiane, ecc.)

### ✅ Cosa Fare nella Pratica
Passi concreti e actionable che il lettore può mettere in atto subito.

### ⚠️ Errori da Evitare
Gli sbagli più comuni che fanno i principianti su questo argomento.

Usa un tono incoraggiante. Usa emoji con moderazione. Usa il grassetto per i concetti importanti. Scrivi contenuti sostanziosi (almeno 500 parole). Non aggiungere testo fuori dalle sezioni richieste.

## Quando l'utente fa domande (messaggi presenti):
Rispondi come un tutor paziente. Mantieni sempre il contesto della lezione "${titolo}". Dai risposte concise ma complete (max 200 parole). Usa esempi pratici.
Se la domanda non è pertinente alla lezione, non aprire nuovi argomenti: reindirizza con una risposta breve al tema della lezione.`;

    const isChat = messages && messages.length > 0;

    const requestMessages = [
      { role: "system" as const, content: systemPrompt },
      ...(isChat
        ? messages
        : [{ role: "user" as const, content: `Genera una spiegazione completa e approfondita sull'argomento: "${titolo}". Segui la struttura indicata nel system prompt.` }]
      ),
    ];

    const response = isChat
      ? await chatCompletion({
        apiKey: AI_API_KEY,
        model: AI_BASE_MODEL,
        messages: requestMessages,
        stream: true,
      })
      : (await chatCompletionWithComplexFallback({
        apiKey: AI_API_KEY,
        messages: requestMessages,
        isComplexTask: true,
        validateContent: (content) => isAcademyLongformAcceptable(content, titolo),
      })).response;

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Troppe richieste, riprova tra qualche secondo." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crediti AI esauriti." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Errore del servizio AI" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (isChat) {
      // Streaming response for chat
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    } else {
      // Non-streaming for initial explanation
      const data = await response.json();
      const content = normalizeAcademyExplanation(extractAssistantContent(data) || "Spiegazione non disponibile.");
      return new Response(JSON.stringify({ content }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (e) {
    console.error("academy-lesson error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Errore sconosciuto" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function isAcademyLongformAcceptable(content: string, titolo: string): boolean {
  const words = content.trim().split(/\s+/).length;
  const requiredSections = ["###", "Introduzione", "Concetti Chiave", "Cosa Fare nella Pratica", "Errori da Evitare"];
  return (
    words >= 450 &&
    requiredSections.every((section) => content.includes(section)) &&
    hasNoOutOfContextMarkers(content) &&
    hasTopicFocus(content, titolo)
  );
}

function normalizeAcademyExplanation(content: string): string {
  const sectionTitles = [
    "🎯 Introduzione",
    "📚 Concetti Chiave",
    "✅ Cosa Fare nella Pratica",
    "⚠️ Errori da Evitare",
  ];
  const sections = sectionTitles
    .map((title) => extractMarkdownSection(content, title))
    .filter((section): section is string => !!section);

  if (sections.length === sectionTitles.length) {
    return sections.join("\n\n").trim();
  }
  return content.trim();
}

function extractMarkdownSection(content: string, sectionTitle: string): string | null {
  const escaped = sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`###\\s+${escaped}\\s*\\n([\\s\\S]*?)(?=\\n###\\s+|$)`, "i");
  const match = content.match(re);
  if (!match) return null;
  return `### ${sectionTitle}\n${match[1].trim()}`;
}

function hasNoOutOfContextMarkers(content: string): boolean {
  const markers = [
    "come modello",
    "come ia",
    "non posso",
    "non ho accesso",
    "non sono in grado",
    "mi dispiace",
    "fuori tema",
  ];
  const text = content.toLowerCase();
  return !markers.some((marker) => text.includes(marker));
}

function hasTopicFocus(content: string, titolo: string): boolean {
  const keywords = titolo
    .toLowerCase()
    .replace(/[^a-z0-9àèéìòù\s]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .filter((w) => !["che", "cos", "cosa", "non", "una", "con", "per", "dei", "delle"].includes(w));
  if (keywords.length === 0) return true;
  const text = content.toLowerCase();
  return keywords.some((keyword) => text.includes(keyword));
}
