import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { chatCompletion, extractAssistantContent } from "../_shared/ai.ts";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";
import { requireAuthenticatedUser } from "../_shared/auth.ts";
import {
  enforceQuota,
  estimateRequestTokens,
  paymentRequiredResponse,
  resolveModelForFeature,
  trackUsageAsync,
} from "../_shared/ai_gateway.ts";

type CoachContext = {
  name?: string;
  level?: "beginner" | "intermediate" | "pro";
  goals?: string[];
  patrimonio?: number;
  salvadanai?: Array<{ nome: string; attuale: number; obiettivo: number }>;
  speseThisMonth?: number;
  spesePerCategoria?: Array<{ nome: string; totale: number }>;
  investimenti?: Array<{ nome: string; valore: number }>;
  points?: number;
  streak?: number;
  badgeSbloccati?: string[];
  badgeDaSbloccare?: string[];
  sfideAttive?: Array<{ nome: string; progresso: number; target: number; completata: boolean }>;
  corsi?: Array<{ titolo: string; completate: number; totali: number }>;
};

type ChatRequestBody = {
  messages?: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  context?: CoachContext;
  mode?: string;
};

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const originBlocked = rejectDisallowedOrigin(req, corsHeaders);
  if (originBlocked) return originBlocked;

  try {
    const authResult = await requireAuthenticatedUser(req, corsHeaders);
    if (!authResult.ok) return authResult.response;

    const { messages, context, mode } = (await req.json()) as ChatRequestBody;
    const AI_API_KEY = Deno.env.get("AI_API_KEY") ?? Deno.env.get("OPENAI_API_KEY");
    if (!AI_API_KEY) throw new Error("AI_API_KEY is not configured");

    const contextForPrompt = buildSelectiveContext(context ?? {}, messages ?? []);

    const systemPrompt = `Sei Mark, un coach finanziario personale amichevole e competente dentro l'app Finance Flow. Parli sempre in italiano.

## Il tuo stile
- Amichevole, incoraggiante, professionale
- Usa emoji con moderazione
- Dai consigli pratici e concreti
- Non sei un consulente finanziario certificato: ricordalo se ti chiedono consigli specifici sugli investimenti

## Conoscenza dell'app Finance Flow

L'app ha queste sezioni principali:
- **Dashboard** (route: \`/\`) — Panoramica finanziaria, patrimonio totale, salvadanai, sfida della settimana, notifiche intelligenti
- **Patrimonio** (route: \`/patrimonio\`) — Dettaglio patrimonio diviso in Liquidità, Soldi al Lavoro (investimenti), Cose di Valore (beni). Contiene anche i Salvadanai con obiettivi di risparmio
- **Gestisci Patrimonio** (route: \`/patrimonio/gestisci\`) — Modifica valori delle categorie patrimoniali
- **Gestisci Investimenti** (route: \`/patrimonio/investimenti\`) — Modifica valori degli investimenti (ETF/Fondi, Azioni, Crypto, Obbligazioni)
- **Simulatore What If** (route: \`/simulatore\`) — Simulatore interattivo: seleziona un salvadanaio, imposta un risparmio mensile extra con slider, e visualizza due curve di proiezione (attuale vs. con extra) per vedere quando raggiungerai l'obiettivo
- **Accademia** (route: \`/accademia\`) — Corsi di educazione finanziaria divisi per categoria
- **Gestisci Spese** (route: \`/patrimonio/spese\`) — Registra spese per categoria (Cibo, Trasporti, Shopping, Salute, Casa, Svago, Abbonamenti, Altro). Supporta input in linguaggio naturale con AI
- **Profilo** (route: \`/profilo\`) — Dati utente, livello, badge sbloccati, impostazioni
- **Coach AI** (route: \`/coach\`) — Questa chat! Il tuo assistente finanziario personale

## Istruzioni per formattazione avanzata

### Tabelle Markdown
Quando confronti opzioni, mostri riepiloghi spese, analizzi dati o presenti informazioni strutturate, USA TABELLE MARKDOWN:
\`\`\`
| Categoria | Spesa | % del totale |
|-----------|-------|--------------|
| Cibo      | €120  | 35%          |
\`\`\`
Usale specialmente quando:
- L'utente chiede di analizzare le spese
- Confronti tra opzioni di investimento
- Riepiloghi finanziari
- Pro e contro di una scelta

### Link interni (pulsanti di navigazione)
Quando suggerisci all'utente di visitare una sezione dell'app, usa questa sintassi speciale per creare pulsanti cliccabili:
\`[Testo del pulsante](investo:/percorso)\`

Esempi:
- \`[Vai al Simulatore](investo:/simulatore)\` — per suggerire di simulare scenari
- \`[Apri l'Accademia](investo:/accademia)\` — per suggerire di studiare
- \`[Gestisci le Spese](investo:/patrimonio/spese)\` — per registrare spese
- \`[Vedi il Patrimonio](investo:/patrimonio)\` — per controllare il patrimonio
- \`[Vai alla Dashboard](investo:/)\` — per la panoramica
- \`[Gestisci Investimenti](investo:/patrimonio/investimenti)\` — per modificare investimenti

Usa questi link quando sono rilevanti al contesto della conversazione, non forzarli.

### Mappe concettuali Mermaid
Quando l'utente studia un concetto finanziario, vuole capire relazioni tra concetti, o chiede esplicitamente una mappa concettuale, genera diagrammi Mermaid:

\`\`\`mermaid
graph TD
    A[Concetto Principale] --> B[Sotto-concetto 1]
    A --> C[Sotto-concetto 2]
    B --> D[Dettaglio]
\`\`\`

Usa mappe concettuali per:
- Spiegare relazioni tra concetti finanziari (es. tipi di investimento, rischio vs rendimento)
- Visualizzare flussi decisionali (es. come scegliere un investimento)
- Mostrare gerarchie (es. tipologie di fondi)
- Quando l'utente chiede "spiegami", "cos'è", "come funziona" un concetto complesso

IMPORTANTE per Mermaid:
- NON usare emoji nei nodi del diagramma
- Usa nomi chiari e concisi per i nodi
- Preferisci graph TD (top-down) o graph LR (left-right)
- Massimo 10-15 nodi per chiarezza

## Contesto finanziario dell'utente

- Nome: ${contextForPrompt.name || "Utente"}
- Livello: ${contextForPrompt.level === "beginner" ? "Principiante" : contextForPrompt.level === "intermediate" ? "Intermedio" : "Esperto"}
- Obiettivi: ${contextForPrompt.goals?.join(", ") || "Non specificati"}
- Patrimonio totale: €${contextForPrompt.patrimonio?.toLocaleString("it-IT") || "0"}
- Salvadanai: ${contextForPrompt.salvadanai?.map((s) => `${s.nome}: €${s.attuale.toLocaleString("it-IT")}/${s.obiettivo.toLocaleString("it-IT")} (${Math.round((s.attuale / s.obiettivo) * 100)}%)`).join("; ") || "Nessuno"}
- Spese questo mese totali: €${contextForPrompt.speseThisMonth?.toLocaleString("it-IT") || "0"}
- Spese per categoria questo mese: ${contextForPrompt.spesePerCategoria?.map((c) => `${c.nome}: €${c.totale.toLocaleString("it-IT")}`).join(", ") || "Nessuna spesa registrata"}
- Investimenti: ${contextForPrompt.investimenti?.map((i) => `${i.nome}: €${i.valore.toLocaleString("it-IT")}`).join(", ") || "Nessun investimento"}
- Stelline ⭐: ${contextForPrompt.points || 0}
- Streak: ${contextForPrompt.streak || 0} giorni
- Badge sbloccati: ${contextForPrompt.badgeSbloccati?.join(", ") || "Nessuno"}
- Badge da sbloccare: ${contextForPrompt.badgeDaSbloccare?.join(", ") || "Nessuno"}
- Sfide attive: ${contextForPrompt.sfideAttive?.map((s) => `${s.nome}: ${s.progresso}/${s.target} ${s.completata ? "(completata!)" : ""}`).join("; ") || "Nessuna"}
- Corsi Accademia: ${contextForPrompt.corsi?.map((c) => `${c.titolo}: ${c.completate}/${c.totali} lezioni`).join("; ") || "Non disponibili"}

## Regole di risposta
- Rispondi in modo conciso (max 200 parole) a meno che l'utente non chieda spiegazioni approfondite o mappe concettuali
- Usa il markdown per formattare: grassetto, elenchi, tabelle, link interni
- Quando l'utente chiede di analizzare dati, usa SEMPRE tabelle
- Quando l'utente chiede di capire un concetto, offri anche una mappa concettuale
- Quando suggerisci azioni, includi link interni alle sezioni rilevanti`;

    if (mode === "pro-analysis") {
      return paymentRequiredResponse(corsHeaders, "Questa modalità del Coach AI è disponibile solo per il piano Pro.");
    }

    if (mode === "suggestions") {
      const estimatedTokens = estimateRequestTokens({ base: 700, messages: messages ?? [] });
      const quotaGuard = await enforceQuota({
        userId: authResult.user.id,
        estimatedTokens,
        corsHeaders,
      });
      if (!quotaGuard.ok) return quotaGuard.response;
      const modelUsed = resolveModelForFeature("chat:suggestions", quotaGuard.quota.plan);

      const suggestionsPrompt = `Genera ESATTAMENTE 3 suggerimenti brevi per continuare una chat finanziaria in italiano.

Regole:
- Massimo 60 caratteri per suggerimento
- Frasi naturali, specifiche e contestuali
- Evita duplicati e formulazioni troppo generiche
- Non usare emoji
- Rispondi SOLO in JSON valido: {"suggestions":["...","...","..."]}`;

      const suggestionsResponse = await chatCompletion({
        apiKey: AI_API_KEY,
        model: modelUsed,
        messages: [
          { role: "system", content: suggestionsPrompt },
          {
            role: "user",
            content: `Contesto utente:\n${JSON.stringify(contextForPrompt, null, 2)}\n\nUltimi messaggi:\n${JSON.stringify(messages ?? [], null, 2)}`,
          },
        ],
        stream: false,
      });

      if (!suggestionsResponse.ok) {
        return new Response(JSON.stringify({ suggestions: [] }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const suggestionsJson = await suggestionsResponse.json();
      const rawContent = extractAssistantContent(suggestionsJson);
      const suggestions = parseSuggestions(rawContent);
      const promptTokens = Math.ceil(
        (JSON.stringify(contextForPrompt).length + JSON.stringify(messages ?? []).length + suggestionsPrompt.length) / 4,
      );
      const completionTokens = Math.ceil(rawContent.length / 4);
      await trackUsageAsync({
        userId: authResult.user.id,
        feature: "chat:suggestions",
        modelUsed,
        promptTokens,
        completionTokens,
      });

      return new Response(JSON.stringify({ suggestions }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const selectiveContext = contextForPrompt;
    const compactedMessages = compactMessagesForCost(messages ?? []);
    const estimatedTokens = estimateRequestTokens({
      base: 1400,
      messages: compactedMessages,
      context: selectiveContext,
    });
    const quotaGuard = await enforceQuota({
      userId: authResult.user.id,
      estimatedTokens,
      corsHeaders,
    });
    if (!quotaGuard.ok) return quotaGuard.response;
    const modelUsed = resolveModelForFeature("chat", quotaGuard.quota.plan);

    const response = await chatCompletion({
      apiKey: AI_API_KEY,
      model: modelUsed,
      messages: [
        { role: "system", content: systemPrompt },
        ...compactedMessages,
      ],
      stream: true,
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Troppe richieste, riprova tra qualche secondo." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crediti AI esauriti. Aggiungi crediti al tuo workspace." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Errore del servizio AI" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Stream forward while computing a lightweight completion-token estimate.
    const source = response.body?.getReader();
    if (!source) {
      return new Response(JSON.stringify({ error: "Stream AI non disponibile" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let completionChars = 0;
    const stream = new ReadableStream<Uint8Array>({
      async pull(controller) {
        const { done, value } = await source.read();
        if (done) {
          controller.close();
          await trackUsageAsync({
            userId: authResult.user.id,
            feature: "chat",
            modelUsed,
            promptTokens: Math.ceil(
              (
                systemPrompt.length +
                JSON.stringify(selectiveContext).length +
                JSON.stringify(compactedMessages).length
              ) / 4,
            ),
            completionTokens: Math.ceil(completionChars / 4),
          });
          return;
        }

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          completionChars += extractDeltaChars(chunk);
          controller.enqueue(encoder.encode(chunk));
        }
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Errore sconosciuto" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function parseSuggestions(rawContent: string): string[] {
  const fallback = ["Analizza le mie spese del mese", "Spiegami un ETF in modo semplice", "Come posso risparmiare di più?"];
  if (!rawContent) return fallback;

  const normalizedContent = normalizeSuggestionContent(rawContent);

  try {
    const parsed = JSON.parse(normalizedContent) as { suggestions?: unknown } | string[] | unknown;
    const candidate = Array.isArray(parsed)
      ? parsed
      : Array.isArray((parsed as { suggestions?: unknown })?.suggestions)
      ? (parsed as { suggestions: unknown[] }).suggestions
      : [];
    const cleaned = cleanSuggestions(candidate);
    if (cleaned.length === 3) return cleaned;
  } catch {
    // fallback to line parsing
  }

  const lineParsed = cleanSuggestions(
    normalizedContent
      .split("\n")
      .map((line) => line.replace(/^\s*[-*0-9.)\]]+\s*/, "").trim())
      .filter(Boolean),
  );
  if (lineParsed.length === 3) return lineParsed;

  return fallback;
}

function extractDeltaChars(sseChunk: string): number {
  let chars = 0;
  for (const rawLine of sseChunk.split("\n")) {
    const line = rawLine.trim();
    if (!line.startsWith("data: ") || line === "data: [DONE]") continue;
    const payload = line.slice(6);
    try {
      const parsed = JSON.parse(payload);
      const delta = parsed?.choices?.[0]?.delta?.content;
      if (typeof delta === "string") chars += delta.length;
    } catch {
      // ignore malformed partial lines in stream chunks
    }
  }
  return chars;
}

function compactMessagesForCost(messages: Array<{ role: "user" | "assistant" | "system"; content: string }>) {
  if (messages.length <= 10) return messages;

  const preservedTail = messages.slice(-5);
  const oldMessages = messages.slice(0, -5);

  // TODO: Replace with cheap-model summarization call in a background pass:
  // 1) send oldMessages to a low-cost model with strict JSON schema
  // 2) persist summary in coach_conversations metadata
  // 3) reuse persisted summary in subsequent turns, refreshing every N messages.
  const summary = oldMessages
    .slice(-8)
    .map((m) => `${m.role}: ${m.content.replace(/\s+/g, " ").trim().slice(0, 120)}`)
    .join(" | ");

  return [
    {
      role: "system" as const,
      content: `Riassunto conversazione precedente (compresso per ridurre costi token): ${summary}`,
    },
    ...preservedTail,
  ];
}

function buildSelectiveContext(
  context: CoachContext,
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
) {
  const latestUserInput = [...messages]
    .reverse()
    .find((m) => m.role === "user")
    ?.content?.toLowerCase() ?? "";

  const needsGoals = /(obiettiv|risparmi|salvadanaio|target)/i.test(latestUserInput);
  const needsSpese = /(spes|budget|categoria|uscite|consum)/i.test(latestUserInput);
  const needsInvestimenti = /(invest|etf|azioni|crypto|obbligaz)/i.test(latestUserInput);
  const needsGamification = /(badge|streak|sfide|stellin|punti|accademia|corso)/i.test(latestUserInput);

  return {
    name: context.name,
    level: context.level,
    goals: context.goals,
    patrimonio: context.patrimonio,
    salvadanai: needsGoals ? context.salvadanai : undefined,
    speseThisMonth: needsSpese ? context.speseThisMonth : undefined,
    spesePerCategoria: needsSpese ? context.spesePerCategoria : undefined,
    investimenti: needsInvestimenti ? context.investimenti : undefined,
    points: needsGamification ? context.points : undefined,
    streak: needsGamification ? context.streak : undefined,
    badgeSbloccati: needsGamification ? context.badgeSbloccati : undefined,
    badgeDaSbloccare: needsGamification ? context.badgeDaSbloccare : undefined,
    sfideAttive: needsGamification ? context.sfideAttive : undefined,
    corsi: needsGamification ? context.corsi : undefined,
  };
}

function cleanSuggestions(values: unknown[]): string[] {
  const out: string[] = [];
  for (const value of values) {
    if (typeof value !== "string") continue;
    const normalized = value.trim().replace(/\s+/g, " ").slice(0, 60);
    if (!normalized) continue;
    if (!out.includes(normalized)) out.push(normalized);
    if (out.length === 3) break;
  }
  return out;
}

function normalizeSuggestionContent(rawContent: string): string {
  const trimmed = rawContent.trim();
  const withoutFences = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  const jsonStart = withoutFences.indexOf("{");
  const jsonEnd = withoutFences.lastIndexOf("}");
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    return withoutFences.slice(jsonStart, jsonEnd + 1);
  }
  return withoutFences;
}
