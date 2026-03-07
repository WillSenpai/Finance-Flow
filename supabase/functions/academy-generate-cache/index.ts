import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  chatCompletionWithComplexFallback,
  extractAssistantContent,
} from "../_shared/ai.ts";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";

type ExistingLessonRow = { lesson_id: string; titolo: string; content: string };

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const originBlocked = rejectDisallowedOrigin(req, corsHeaders);
  if (originBlocked) return originBlocked;

  try {
    const AI_API_KEY = Deno.env.get("AI_API_KEY") ?? Deno.env.get("OPENAI_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!AI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const authHeader = req.headers.get("Authorization");
    const jwt = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;
    if (!jwt) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: authData, error: authError } = await supabase.auth.getUser(jwt);
    if (authError || !authData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: adminRole, error: roleError } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", authData.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (roleError || !adminRole) {
      return new Response(JSON.stringify({ error: "Forbidden: admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Read official lessons from DB (single source of truth)
    const { data: existing } = await supabase
      .from("academy_lessons_cache")
      .select("lesson_id, titolo, content")
      .order("lesson_id", { ascending: true });

    const lessons = (existing || []) as ExistingLessonRow[];

    // Optionally force regeneration
    const body = await req.json().catch(() => ({}));
    const forceRegenerate = body?.force === true;
    const specificId = body?.lessonId;

    const toGenerate = specificId
      ? lessons.filter((l) => l.lesson_id === specificId)
      : forceRegenerate
        ? lessons
        : lessons.filter((l) => !l.content || !l.content.trim());

    console.log(`Generating ${toGenerate.length} lessons`);

    let generated = 0;

    for (const lesson of toGenerate) {
      try {
        const lessonId = lesson.lesson_id;
        const titoloUfficiale = lesson.titolo;
        const { response, modelUsed } = await chatCompletionWithComplexFallback({
          apiKey: AI_API_KEY,
          isComplexTask: true,
          validateContent: (content) => isAcademyChapterAcceptable(content, titoloUfficiale),
          messages: [
            {
              role: "system",
              content: `Sei l'autore di un manuale di educazione finanziaria per giovani adulti italiani. Scrivi in italiano.

Regole di scrittura:
- Scrivi come in un libro di testo ben fatto: chiaro, ordinato, progressivo
- Ogni concetto deve essere spiegato partendo dalle basi, senza dare nulla per scontato
- Usa un linguaggio semplice e diretto, evitando gergo tecnico non spiegato
- NON usare parole inglesi quando esiste un equivalente italiano comprensibile
- NON usare espressioni vaghe o fuori contesto
- Ogni affermazione deve essere concreta e utile
- Produci SOLO contenuto inerente al titolo del capitolo: nessuna frase meta, nessuna digressione, nessuna parola fuori tema
- Usa esempi pratici con cifre in euro e riferimenti italiani (BTP, conti deposito, Poste, INPS, ecc.)
- Struttura il testo con sezioni chiare usando intestazioni markdown (###)
- Usa il grassetto per i termini importanti quando li introduci per la prima volta
- Usa elenchi puntati per liste di consigli o passi da seguire`,
            },
            {
              role: "user",
              content: `Scrivi il capitolo "${titoloUfficiale}" per il manuale di educazione finanziaria. Segui questa struttura:

### Introduzione
Spiega cos'è l'argomento in modo semplice e perché è importante nella vita quotidiana di una persona. Parti dal concetto base, come se il lettore non ne avesse mai sentito parlare.

### Come funziona
Entra nel dettaglio del meccanismo. Spiega passo dopo passo come funziona nella pratica, con esempi numerici concreti in euro.

### Cosa fare nella pratica
Dai istruzioni operative: cosa può fare il lettore domani mattina per mettere in pratica quello che ha imparato. Passi concreti e ordinati.

### Errori comuni
Elenca i 3-5 errori più frequenti che le persone fanno su questo argomento, e spiega perché sono errori e come evitarli.

### In sintesi
Un paragrafo finale che riassume i punti chiave del capitolo in 3-4 frasi.

Scrivi almeno 600 parole. Non usare emoji. Non usare parole inglesi inutili. Sii sistematico e preciso.
Non aggiungere testo prima, dopo o fuori dalle 5 sezioni richieste.`
            },
          ],
        });

        if (!response.ok) {
          const t = await response.text();
          console.error(`AI error for lesson ${lessonId}:`, response.status, t);
          continue;
        }

        const data = await response.json();
        const content = extractAssistantContent(data);

        if (content) {
          const normalizedContent = normalizeAcademyChapter(content);
          if (!isAcademyChapterAcceptable(normalizedContent, titoloUfficiale)) {
            console.error(`Generated content not acceptable for lesson ${lessonId}`);
            continue;
          }
          await supabase.from("academy_lessons_cache").upsert({
            lesson_id: lessonId,
            titolo: titoloUfficiale,
            content: normalizedContent,
            updated_at: new Date().toISOString(),
          }, { onConflict: "lesson_id" });
          generated++;
          console.log(`Generated lesson ${lessonId}: ${titoloUfficiale} (${modelUsed})`);
        }
      } catch (e) {
        console.error(`Error generating lesson ${lesson.lesson_id}:`, e);
      }
    }

    return new Response(JSON.stringify({ generated, total: toGenerate.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("academy-generate-cache error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function isAcademyChapterAcceptable(content: string, titolo: string): boolean {
  const words = content.trim().split(/\s+/).length;
  const requiredSections = ["### Introduzione", "### Come funziona", "### Cosa fare nella pratica", "### Errori comuni", "### In sintesi"];
  return (
    words >= 550 &&
    requiredSections.every((section) => content.includes(section)) &&
    hasNoOutOfContextMarkers(content) &&
    hasTopicFocus(content, titolo)
  );
}

function normalizeAcademyChapter(content: string): string {
  const sectionTitles = [
    "Introduzione",
    "Come funziona",
    "Cosa fare nella pratica",
    "Errori comuni",
    "In sintesi",
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
