import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";
import { requireAuthenticatedUser } from "../_shared/auth.ts";

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
    if (titolo) {
      items.push({ titolo, fonte, link, tempo: tempoRelativo(pubDate), data: pubDate });
    }
  }
  return items;
}

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const originBlocked = rejectDisallowedOrigin(req, corsHeaders);
  if (originBlocked) return originBlocked;

  try {
    const authResult = await requireAuthenticatedUser(req, corsHeaders);
    if (!authResult.ok) return authResult.response;

    const allNews: NewsItem[] = [];

    const results = await Promise.allSettled(
      feeds.map(async (feed) => {
        const res = await fetch(feed.url, {
          headers: { "User-Agent": "Mozilla/5.0" },
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) throw new Error(`${res.status}`);
        const xml = await res.text();
        return parseItems(xml, feed.fonte);
      })
    );

    for (const r of results) {
      if (r.status === "fulfilled") allNews.push(...r.value);
    }

    // Sort by date descending, take top 10
    allNews.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    const top = allNews.slice(0, 10).map(({ data, ...rest }) => rest);

    return new Response(JSON.stringify({ news: top }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("news-rss error:", e);
    return new Response(JSON.stringify({ news: [], error: "Errore nel recupero delle news" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
