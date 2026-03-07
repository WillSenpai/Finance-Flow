import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import DOMPurify from "dompurify";

const CATEGORY_LABELS: Record<string, string> = {
  app: "App & Strumenti",
  broker: "Broker",
  personaggio: "Personaggi",
  concetto: "Concetti Chiave",
};

type Article = {
  id: string;
  titolo: string;
  contenuto: string;
  categoria: string;
  emoji: string;
  image_url: string | null;
  tags: string[];
};

const EsploraArticolo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: article, isLoading } = useQuery({
    queryKey: ["explore-article", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("explore_articles")
        .select("id, titolo, contenuto, categoria, emoji, image_url, tags")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as Article;
    },
    enabled: !!id,
  });

  const { data: related = [] } = useQuery({
    queryKey: ["explore-related", article?.categoria, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("explore_articles")
        .select("id, titolo, emoji, categoria")
        .eq("published", true)
        .eq("categoria", article!.categoria)
        .neq("id", id!)
        .order("ordine")
        .limit(4);
      if (error) throw error;
      return data as Pick<Article, "id" | "titolo" | "emoji" | "categoria">[];
    },
    enabled: !!article?.categoria,
  });

  if (isLoading) {
    return (
      <div className="px-5 pt-14 pb-4 space-y-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="px-5 pt-14 pb-4 text-center">
        <p className="text-sm text-muted-foreground">Articolo non trovato</p>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate("/esplora")} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm">
          Torna a Esplora
        </motion.button>
      </div>
    );
  }

  return (
    <motion.div className="px-5 pt-14 pb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate("/esplora")} className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ArrowLeft size={20} />
        </motion.button>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
          {CATEGORY_LABELS[article.categoria] || article.categoria}
        </span>
      </div>

      {/* Hero image */}
      {article.image_url && (
        <img src={article.image_url} alt="" className="w-full aspect-video object-cover rounded-2xl mb-4" />
      )}

      {/* Title */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{article.emoji}</span>
        <h1 className="text-xl font-bold leading-tight">{article.titolo}</h1>
      </div>

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {article.tags.map((tag) => (
            <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-sm max-w-none text-foreground leading-relaxed whitespace-pre-wrap"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(article.contenuto),
        }}
      />

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border/30">
          <h2 className="text-sm font-semibold mb-3">Articoli correlati</h2>
          <div className="space-y-2">
            {related.map((r) => (
              <motion.button
                key={r.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/esplora/${r.id}`)}
                className="w-full bg-card border border-border/50 rounded-2xl p-3.5 flex items-center gap-3 text-left"
              >
                <span className="text-xl">{r.emoji}</span>
                <span className="text-sm font-medium">{r.titolo}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EsploraArticolo;
