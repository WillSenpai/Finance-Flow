import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  chatCompletionWithComplexFallback,
  extractAssistantContent,
} from "../_shared/ai.ts";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";
import { requireAdminUser, requireAuthenticatedUser } from "../_shared/auth.ts";
import { generateNewsIllustration } from "../_shared/news.ts";

interface NewsItem {
  titolo: string;
  fonte: string;
  link: string;
  tempo: string;
  data: string;
}

const feeds = [
  { url: "https://www.ansa.it/sito/notizie/economia/economia_rss.xml", fonte: "ANSA Economia" },
  { url: "https://www.ilsole24ore.com/rss/finanza.xml", fonte: "Il Sole 24 Ore" },
  { url: "https://www.milanofinanza.it/rss", fonte: "Milano Finanza" },
  { url: "https://www.wallstreetitalia.com/feed/", fonte: "Wall Street Italia" },
  { url: "https://www.money.it/spip.php?page=backend", fonte: "Money.it" },
  { url: "https://feeds.feedburner.com/Investireoggi", fonte: "Investire Oggi" },
];

function tempoRelativo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  if (isNaN(date)) return "";
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "ora";
  if (diffMin < 60) return `${diffMin}min fa`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h fa`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "ieri";
  return `${diffD}g fa`;
}

function parseItems(xml: string, fonte: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const titolo = block.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1]?.trim() || "";
    const link = block.match(/<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/)?.[1]?.trim() || "";
    const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]?.trim() || "";
    if (titolo && titolo.length > 10) {
      items.push({ titolo, fonte, link, tempo: tempoRelativo(pubDate), data: pubDate });
    }
  }
  return items;
}

function extractText(html: string): string {
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.slice(0, 8000);
}

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
    const incomingCronSecret = req.headers.get("x-cron-secret");
    const envCronSecret = Deno.env.get("NEWS_CRON_SECRET");
    const vaultCronSecret = await readVaultCronSecret(supabase);
    const effectiveCronSecret = envCronSecret || vaultCronSecret;
    const isCronInvocation = Boolean(
      effectiveCronSecret &&
      incomingCronSecret &&
      effectiveCronSecret === incomingCronSecret,
    );

    const hasAuthorizationHeader = Boolean(req.headers.get("Authorization"));
    if (!isCronInvocation && hasAuthorizationHeader) {
      const authResult = await requireAuthenticatedUser(req, corsHeaders);
      if (!authResult.ok) return authResult.response;
      const isAdmin = await requireAdminUser(authResult.user.id);
      if (!isAdmin) {
        return new Response(JSON.stringify({ error: "Admin role required" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // 1. Fetch RSS feeds
    const allNews: NewsItem[] = [];
    const results = await Promise.allSettled(
      feeds.map(async (feed) => {
        try {
          const res = await fetch(feed.url, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
            signal: AbortSignal.timeout(8000),
          });
          if (!res.ok) throw new Error(`${res.status}`);
          const xml = await res.text();
          return parseItems(xml, feed.fonte);
        } catch (e) {
          console.error(`Feed ${feed.fonte} failed:`, e);
          return [];
        }
      })
    );
    for (const r of results) {
      if (r.status === "fulfilled") allNews.push(...r.value);
    }
    allNews.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    const top = allNews.slice(0, 12);

    console.log(`Fetched ${allNews.length} total articles from ${feeds.length} feeds, top ${top.length}`);

    // 2. Check which are already cached
    const { data: existing } = await supabase
      .from("news_cache")
      .select("titolo,image,summary")
      .in("titolo", top.map(n => n.titolo));

    const existingByTitle = new Map(
      (existing || []).map((item: any) => [item.titolo as string, item as { titolo: string; image: string | null; summary: string | null }]),
    );
    const newArticles = top.filter(n => !existingByTitle.has(n.titolo));
    const missingImageArticles = top.filter((article) => {
      const cached = existingByTitle.get(article.titolo);
      return cached && !cached.image;
    });
    const missingSummaryArticles = top.filter((article) => {
      const cached = existingByTitle.get(article.titolo);
      return cached && !cached.summary;
    });

    console.log(
      `${newArticles.length} new articles, ${missingImageArticles.length} missing image, ${missingSummaryArticles.length} missing summary`,
    );

    // 2b. Refresh the top articles metadata on every run so cron executions
    // keep the cache current even when titles already exist.
    if (top.length > 0) {
      await supabase.from("news_cache").upsert(
        top.map((article) => {
          const cached = existingByTitle.get(article.titolo);
          return {
            titolo: article.titolo,
            fonte: article.fonte,
            link: article.link,
            tempo: article.tempo,
            summary: cached?.summary ?? null,
            image: cached?.image ?? null,
          };
        }),
        { onConflict: "titolo" },
      );
    }

    // 3. Generate summary for new articles plus any cached rows missing summary.
    const summaryCandidates = [...newArticles];
    for (const article of missingSummaryArticles) {
      if (!summaryCandidates.some((candidate) => candidate.titolo === article.titolo)) {
        summaryCandidates.push(article);
      }
    }
    const toProcess = summaryCandidates;
    const processedSummaryTitles = new Set<string>();

    for (const article of toProcess) {
      try {
        // Fetch article content
        let articleContent = "";
        if (article.link) {
          try {
            const res = await fetch(article.link, {
              headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
              redirect: "follow",
              signal: AbortSignal.timeout(6000),
            });
            if (res.ok) articleContent = extractText(await res.text());
          } catch (e) {
            console.error("Failed to fetch article content:", e);
          }
        }

        // Generate summary
        const { response: summaryResp, modelUsed } = await chatCompletionWithComplexFallback({
          apiKey: AI_API_KEY,
          isComplexTask: true,
          validateContent: isArticleSummaryAcceptable,
          messages: [{
            role: "user",
            content: `Sei un giornalista finanziario esperto. Scrivi un riassunto DETTAGLIATO di questo articolo finanziario in italiano.

Il riassunto deve essere di 8-12 frasi e deve coprire:
1. Il contesto e lo sfondo della notizia
2. I dati chiave, numeri e cifre menzionati
3. Le cause e i fattori che hanno portato a questa situazione
4. Le implicazioni pratiche per i risparmiatori e investitori italiani
5. Le prospettive future e cosa aspettarsi

Titolo: ${article.titolo}
${articleContent ? `\nContenuto:\n${articleContent}` : "\nGenera basandoti sul titolo e sulle tue conoscenze."}

Scrivi SOLO il riassunto, senza titoli o prefissi. Tono professionale ma accessibile.`
          }],
        });

        let summary = null;
        if (summaryResp.ok) {
          const d = await summaryResp.json();
          summary = extractAssistantContent(d) || null;
          console.log(`Cached summary model for "${article.titolo.slice(0, 40)}...": ${modelUsed}`);
        } else {
          console.error("Summary generation failed:", summaryResp.status);
          await summaryResp.text();
        }

        const existingCached = existingByTitle.get(article.titolo);
        const image = existingCached?.image ?? await generateNewsIllustration(AI_API_KEY, article.titolo);

        // Upsert into cache with best-effort preview image.
        await supabase.from("news_cache").upsert({
          titolo: article.titolo,
          fonte: article.fonte,
          link: article.link,
          tempo: article.tempo,
          summary,
          image,
        }, { onConflict: "titolo" });

        processedSummaryTitles.add(article.titolo);
        console.log(`Cached: ${article.titolo.slice(0, 50)}...`);
      } catch (e) {
        console.error(`Error processing "${article.titolo}":`, e);
      }
    }

    // 4. Backfill missing preview images for cached rows and seed remaining fresh news.
    const imageOnlyCandidates = [...missingImageArticles];
    for (const article of newArticles) {
      if (processedSummaryTitles.has(article.titolo)) continue;
      if (!imageOnlyCandidates.some((candidate) => candidate.titolo === article.titolo)) {
        imageOnlyCandidates.push(article);
      }
    }

    if (imageOnlyCandidates.length > 0) {
      const inserts = [];
      for (const article of imageOnlyCandidates) {
        const image = await generateNewsIllustration(AI_API_KEY, article.titolo);
        inserts.push({
          titolo: article.titolo,
          fonte: article.fonte,
          link: article.link,
          tempo: article.tempo,
          summary: existingByTitle.get(article.titolo)?.summary ?? null,
          image,
        });
      }
      await supabase.from("news_cache").upsert(inserts, { onConflict: "titolo" });
    }

    // 5. Delete cache entries not refreshed in the last 7 days.
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { error: cleanupError } = await supabase
      .from("news_cache")
      .delete()
      .lt("updated_at", sevenDaysAgo);

    if (cleanupError) {
      console.error("news-cache cleanup error:", cleanupError);
    }

    return new Response(JSON.stringify({ processed: toProcess.length, total: top.length, new: newArticles.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("news-generate-cache error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function isArticleSummaryAcceptable(content: string): boolean {
  const sentences = content
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return sentences.length >= 7;
}

async function readVaultCronSecret(
  supabase: ReturnType<typeof createClient>,
): Promise<string | null> {
  const { data, error } = await supabase
    .schema("vault")
    .from("decrypted_secrets")
    .select("name,decrypted_secret")
    .in("name", ["NEWS_CRON_SECRET", "news_cron_secret"])
    .limit(2);

  if (error) return null;
  if (!Array.isArray(data) || data.length === 0) return null;

  const preferred =
    data.find((row) => row.name === "NEWS_CRON_SECRET") ??
    data.find((row) => row.name === "news_cron_secret");

  if (preferred && typeof preferred.decrypted_secret === "string" && preferred.decrypted_secret.trim()) {
    return preferred.decrypted_secret.trim();
  }

  return null;
}
