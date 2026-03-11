import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, TrendingUp, ExternalLink, Sparkles, Megaphone, Crown, Heart, Eye, ShieldCheck, Compass } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { usePoints } from "@/contexts/PointsContext";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import DOMPurify from "dompurify";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } } as const;
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } } } as const;

const formatDate = () => {
  const d = new Date();
  return d.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
};

type NewsItem = { titolo: string; fonte: string; tempo: string; link: string; summary: string | null; image: string | null };
type AdminPost = { id: string; titolo: string; contenuto: string; emoji: string; tipo: string; image_url: string | null; visibility: string; created_at: string; scheduled_at: string | null };

function getNextNewsRefresh(now: Date): Date {
  const next = new Date(now);
  next.setSeconds(0, 0);
  const currentHour = now.getHours();
  const nextHour = Math.floor(currentHour / 4) * 4 + 4;
  if (nextHour >= 24) {
    next.setDate(next.getDate() + 1);
    next.setHours(0, 0, 0, 0);
    return next;
  }
  next.setHours(nextHour, 0, 0, 0);
  return next;
}

function formatRefreshCountdown(now: Date): string {
  const target = getNextNewsRefresh(now);
  const diffMs = Math.max(target.getTime() - now.getTime(), 0);
  const totalMinutes = Math.ceil(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0 && minutes <= 1) return "Prossimo aggiornamento tra meno di 1m";
  if (hours <= 0) return `Prossimo aggiornamento tra ${minutes}m`;
  if (minutes === 0) return `Prossimo aggiornamento tra ${hours}h`;
  return `Prossimo aggiornamento tra ${hours}h ${minutes}m`;
}

function NewsImage({ src, alt, className }: { src: string | null; alt: string; className?: string }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={`bg-gradient-to-br from-primary/15 via-sky-500/10 to-emerald-500/15 ${className ?? ""}`}>
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-background/70 text-primary shadow-sm">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setHasError(true)} />;
}

const Dashboard = () => {
  const { userData, salvadanai, spese } = useUser();
  const { points, streak, dailyActivities, awardPoints, checkBadges } = usePoints();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedPost, setSelectedPost] = useState<AdminPost | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [newsRefreshLabel, setNewsRefreshLabel] = useState(() => formatRefreshCountdown(new Date()));

  // Fetch admin posts (published, non-future, visible to all)
  const { data: adminPosts = [] } = useQuery({
    queryKey: ["admin-posts-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_posts")
        .select("id, titolo, contenuto, emoji, tipo, image_url, visibility, created_at, scheduled_at")
        .eq("published", true)
        .eq("visibility", "all")
        .or("scheduled_at.is.null,scheduled_at.lte." + new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data as AdminPost[];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  // Fetch likes for posts
  const { data: postLikes = [] } = useQuery({
    queryKey: ["post-likes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("post_likes").select("post_id, user_id");
      if (error) throw error;
      return data as { post_id: string; user_id: string }[];
    },
    staleTime: 0,
  });

  // Fetch view counts
  const { data: postViews = [] } = useQuery({
    queryKey: ["post-views"],
    queryFn: async () => {
      const { data, error } = await supabase.from("post_views").select("post_id");
      if (error) throw error;
      return data as { post_id: string }[];
    },
    staleTime: 0,
  });

  const getLikeCount = (postId: string) => postLikes.filter(l => l.post_id === postId).length;
  const isLiked = (postId: string) => user ? postLikes.some(l => l.post_id === postId && l.user_id === user.id) : false;
  const getViewCount = (postId: string) => postViews.filter(v => v.post_id === postId).length;

  const toggleLike = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) return;
      if (isLiked(postId)) {
        await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
      } else {
        await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["post-likes"] }),
  });

  const trackView = async (postId: string) => {
    if (!user) return;
    await supabase.from("post_views").insert({ post_id: postId, user_id: user.id }).select().maybeSingle();
    queryClient.invalidateQueries({ queryKey: ["post-views"] });
  };

  // Read from news_cache table
  const { data: newsData, isLoading: newsLoading } = useQuery({
    queryKey: ["news-cache"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_cache")
        .select("titolo, fonte, link, tempo, summary, image")
        .order("created_at", { ascending: false })
        .limit(12);
      if (error) throw error;
      return data as NewsItem[];
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // On-demand summary generation when opening a news without summary
  const handleOpenNews = async (n: NewsItem) => {
    setSelectedNews(n);
    if (!n.summary) {
      setLoadingSummary(true);
      try {
        const { data, error } = await supabase.functions.invoke("news-summary", {
          body: { titolo: n.titolo, link: n.link },
        });
        if (!error && data?.summary) {
          const updated = { ...n, summary: data.summary, image: data.image || n.image };
          setSelectedNews(updated);
          // Update the cache in react-query
          queryClient.setQueryData(["news-cache"], (old: NewsItem[] | undefined) =>
            old?.map(item => item.titolo === n.titolo ? { ...item, summary: data.summary, image: data.image || item.image } : item)
          );
          queryClient.invalidateQueries({ queryKey: ["news-cache"] });
        }
      } catch (e) {
        console.error("Failed to generate summary:", e);
      }
      setLoadingSummary(false);
    }
  };

  const news = newsData?.length ? newsData : [];

  useEffect(() => {
    awardPoints("daily_login");
  }, [awardPoints]);

  useEffect(() => {
    const salvadanaiCompletati = salvadanai.filter((s) => s.attuale >= s.obiettivo).length;
    checkBadges({ points, streak, salvadanaiCompletati, speseRegistrate: spese.length, lezioniCompletate: 0 });
  }, [points, streak, salvadanai, spese, checkBadges]);

  useEffect(() => {
    const updateLabel = () => setNewsRefreshLabel(formatRefreshCountdown(new Date()));
    updateLabel();
    const intervalId = window.setInterval(updateLabel, 30_000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <motion.div className="px-5 pt-14 pb-4" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="font-semibold tracking-tight text-xl font-serif">Buongiorno, {userData.name} 👋</h1>
        <p className="text-muted-foreground mt-1 capitalize text-xs">{formatDate()}</p>
      </motion.div>

      {/* Esplora Button */}
      <motion.div variants={item} className="mt-6">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/esplora")}
          className="w-full bg-card border border-primary/20 rounded-2xl p-4 flex items-center gap-3 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Compass size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Esplora 🔍</p>
            <p className="text-[11px] text-muted-foreground">Scopri app, broker, personaggi e concetti finanziari</p>
          </div>
        </motion.button>
      </motion.div>


      {/* Comunicazioni Admin */}
      {adminPosts.length > 0 && (
        <motion.div variants={item} className="mt-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <Megaphone size={18} /> Comunicazioni
          </h2>
          <div className="space-y-2.5">
            {adminPosts.map(post => (
              <motion.div
                key={post.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setSelectedPost(post); trackView(post.id); }}
                className="bg-card border border-border/50 rounded-2xl p-4 cursor-pointer active:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{post.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold leading-tight">{post.titolo}</p>
                      <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/15 text-primary shrink-0">
                        <ShieldCheck size={10} /> Admin
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.contenuto, { ALLOWED_TAGS: ["b", "i", "u", "mark", "br"] }) }} />
                  </div>
                </div>
                {post.image_url && (
                  <img src={post.image_url} alt="" className="w-full aspect-video object-cover rounded-xl mt-3" />
                )}
                <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-border/30">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleLike.mutate(post.id); }}
                    className={`flex items-center gap-1.5 text-xs transition-colors ${isLiked(post.id) ? "text-red-500" : "text-muted-foreground"}`}
                  >
                    <Heart size={14} fill={isLiked(post.id) ? "currentColor" : "none"} />
                    <span>{getLikeCount(post.id)}</span>
                  </button>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Eye size={14} />
                    <span>{getViewCount(post.id)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Post Detail Drawer */}
      <Drawer open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
        <DrawerContent className="max-h-[85dvh] overflow-hidden">
          {selectedPost && (
            <div
              className="max-h-[calc(85dvh-2.5rem)] overflow-y-auto overscroll-contain px-5 pb-6 pt-2"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <DrawerHeader className="px-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                    <ShieldCheck size={11} /> Pubblicato dall'Admin
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedPost.emoji}</span>
                  <DrawerTitle className="text-base leading-snug text-left">{selectedPost.titolo}</DrawerTitle>
                </div>
              </DrawerHeader>
              {selectedPost.image_url && (
                <img src={selectedPost.image_url} alt="" className="w-full aspect-video object-cover rounded-xl mb-4" />
              )}
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedPost.contenuto, { ALLOWED_TAGS: ["b", "i", "u", "mark", "br"] }) }} />
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/30">
                <button
                  onClick={() => toggleLike.mutate(selectedPost.id)}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isLiked(selectedPost.id) ? "text-red-500" : "text-muted-foreground"}`}
                >
                  <Heart size={16} fill={isLiked(selectedPost.id) ? "currentColor" : "none"} />
                  <span>{getLikeCount(selectedPost.id)} Mi piace</span>
                </button>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Eye size={16} />
                  <span>{getViewCount(selectedPost.id)} visualizzazioni</span>
                </div>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>

      {/* News */}
      <motion.div variants={item} className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Newspaper size={18} /> News Finanziarie
          </h2>
          <span className="text-[11px] text-muted-foreground text-right">{newsRefreshLabel}</span>
        </div>

        {/* Horizontal scroll news cards */}
        {newsLoading ? (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="min-w-[280px] bg-card border border-border/50 rounded-2xl p-4 flex-shrink-0">
                <Skeleton className="h-32 w-full rounded-xl mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="bg-card border border-border/50 rounded-2xl p-6 text-center">
            <Newspaper size={32} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Caricamento news in corso...</p>
            <p className="text-xs text-muted-foreground mt-1">Le news verranno caricate a breve</p>
          </div>
        ) : (
          <>
            {/* Featured news - first item */}
            <motion.div
              className="bg-card border border-border/50 rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform mb-3"
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenNews(news[0])}
            >
              <NewsImage
                src={news[0].image}
                alt={news[0].titolo}
                className="h-44 w-full object-cover"
              />
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-primary/20 rounded-lg px-2 py-0.5">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">In evidenza</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{news[0].tempo}</span>
                </div>
                <p className="text-sm font-semibold leading-snug">{news[0].titolo}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">{news[0].fonte}</p>
                  <div className="flex items-center gap-1 text-primary">
                    {news[0].summary ? <Sparkles size={12} /> : null}
                    <ExternalLink size={12} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Rest of news in horizontal scroll */}
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
              {news.slice(1).map((n, i) => (
                <motion.div
                  key={i}
                  className="min-w-[220px] max-w-[240px] bg-card border border-border/50 rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 flex flex-col"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleOpenNews(n)}
                >
                  <NewsImage
                    src={n.image}
                    alt={n.titolo}
                    className="h-28 w-full object-cover"
                  />
                  <div className="p-3.5 flex flex-1 flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <TrendingUp size={14} className="text-primary" />
                      </div>
                      <span className="text-[10px] text-muted-foreground truncate">{n.fonte}</span>
                    </div>
                    <p className="text-xs font-medium leading-snug flex-1 line-clamp-3">{n.titolo}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
                      <span className="text-[10px] text-muted-foreground">{n.tempo}</span>
                      <div className="flex items-center gap-1">
                        {n.summary && <Sparkles size={10} className="text-primary" />}
                        <ExternalLink size={10} className="text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>

      {/* News Summary Drawer */}
      <Drawer open={!!selectedNews} onOpenChange={(open) => !open && setSelectedNews(null)}>
        <DrawerContent className="max-h-[85dvh] overflow-hidden">
          {selectedNews && (
            <div
              className="max-h-[calc(85dvh-2.5rem)] overflow-y-auto overscroll-contain px-5 pb-6 pt-2"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <DrawerHeader className="px-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {selectedNews.fonte}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{selectedNews.tempo}</span>
                </div>
                <DrawerTitle className="text-base leading-snug text-left">{selectedNews.titolo}</DrawerTitle>
              </DrawerHeader>

              <div className="mt-4">
                {selectedNews.image && (
                  <img
                    src={selectedNews.image}
                    alt={selectedNews.titolo}
                    className="w-full aspect-[16/9] object-cover rounded-xl mb-4"
                  />
                )}

                {loadingSummary ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-primary mb-3">
                      <Sparkles size={16} className="animate-pulse" />
                      <span className="text-xs font-medium">Generazione riassunto AI in corso...</span>
                    </div>
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-11/12" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                ) : selectedNews.summary ? (
                  <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                    {selectedNews.summary}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Riassunto non disponibile per questo articolo.</p>
                )}
              </div>

              {selectedNews.link && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => window.open(selectedNews.link, "_blank")}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium"
                >
                  <ExternalLink size={16} />
                  Leggi articolo originale
                </motion.button>
              )}
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </motion.div>
  );
};

export default Dashboard;
