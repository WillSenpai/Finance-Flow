import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Smartphone, TrendingUp, User, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import DOMPurify from "dompurify";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } } as const;
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } } as const;

const CATEGORIES = [
  { key: "app", label: "App & Strumenti", emoji: "📱", icon: Smartphone },
  { key: "broker", label: "Broker", emoji: "📈", icon: TrendingUp },
  { key: "personaggio", label: "Personaggi", emoji: "👤", icon: User },
  { key: "concetto", label: "Concetti Chiave", emoji: "💡", icon: Lightbulb },
] as const;

type Article = {
  id: string;
  titolo: string;
  contenuto: string;
  categoria: string;
  emoji: string;
  image_url: string | null;
  tags: string[];
};

const Esplora = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["explore-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("explore_articles")
        .select("id, titolo, contenuto, categoria, emoji, image_url, tags")
        .eq("published", true)
        .order("ordine", { ascending: true });
      if (error) throw error;
      return data as Article[];
    },
  });

  const filtered = articles.filter((a) => {
    if (activeCategory && a.categoria !== activeCategory) return false;
    if (search && !a.titolo.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stripHtml = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = DOMPurify.sanitize(html);
    return div.textContent || "";
  };

  return (
    <motion.div className="px-5 pt-14 pb-4" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} className="flex items-center gap-3 mb-4">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate("/")} className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ArrowLeft size={20} />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Esplora 🔍</h1>
          <p className="text-xs text-muted-foreground">Enciclopedia finanziaria</p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div variants={item} className="mb-4 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca articoli..."
          className="pl-9"
        />
      </motion.div>

      {/* Categories */}
      <motion.div variants={item} className="grid grid-cols-2 gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat.key}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveCategory(activeCategory === cat.key ? null : cat.key)}
            className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-colors ${
              activeCategory === cat.key
                ? "bg-primary/10 border-primary/30"
                : "bg-card border-border/50"
            }`}
          >
            <span className="text-xl">{cat.emoji}</span>
            <span className="text-xs font-medium">{cat.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Articles */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border/50 rounded-2xl p-4">
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div variants={item} className="text-center py-12">
          <Search size={32} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nessun articolo trovato</p>
          <p className="text-xs text-muted-foreground mt-1">Prova a cambiare filtro o ricerca</p>
        </motion.div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((article) => (
            <motion.div
              key={article.id}
              variants={item}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/esplora/${article.id}`)}
              className="bg-card border border-border/50 rounded-2xl p-4 cursor-pointer active:bg-muted/50 transition-colors"
            >
              {article.image_url && (
                <img src={article.image_url} alt="" className="mb-3 w-full aspect-[16/9] object-cover rounded-xl" />
              )}
              <div className="flex items-start gap-3">
                <span className="text-2xl">{article.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight">{article.titolo}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {stripHtml(article.contenuto)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {CATEGORIES.find((c) => c.key === article.categoria)?.label || article.categoria}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Esplora;
