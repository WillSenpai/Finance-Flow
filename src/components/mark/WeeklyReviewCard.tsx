import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  PiggyBank,
  Calendar,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { invokeWithAuth } from "@/lib/invokeWithAuth";
import { cn } from "@/lib/utils";

interface SpesaCategoria {
  categoria: string;
  totale: number;
  count: number;
}

interface Anomalia {
  descrizione: string;
  importo: number;
  categoria: string;
}

interface Salvadanaio {
  nome: string;
  attuale: number;
  obiettivo: number;
  percentuale: number;
}

interface WeeklyData {
  speseSettimana: number;
  speseSettimanaScorsa: number;
  spesePerCategoria: SpesaCategoria[];
  anomalie: Anomalia[];
  salvadanai: Salvadanaio[];
  trend: "up" | "down" | "stable";
}

interface WeeklyReview {
  week_start: string;
  week_end: string;
  data: WeeklyData;
  summary: string;
  suggestions: string[];
  read_at?: string;
  created_at: string;
}

interface WeeklyReviewCardProps {
  onGenerate?: () => void;
  autoLoad?: boolean;
  compact?: boolean;
}

export function WeeklyReviewCard({
  onGenerate,
  autoLoad = true,
  compact = false,
}: WeeklyReviewCardProps) {
  const [review, setReview] = useState<WeeklyReview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(!compact);

  const loadLatestReview = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await invokeWithAuth<{ review: WeeklyReview | null }>("mark-weekly-review", {
        body: { action: "get_latest" },
      });
      setReview(result.review);
    } catch (err) {
      if (err instanceof Error && err.message.includes("402")) {
        setError("Funzionalità Pro");
      } else {
        setError(err instanceof Error ? err.message : "Errore nel caricamento");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateReview = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await invokeWithAuth<{ review: WeeklyReview }>("mark-weekly-review", {
        body: { action: "generate" },
      });
      setReview(result.review);
      onGenerate?.();
    } catch (err) {
      if (err instanceof Error && err.message.includes("402")) {
        setError("Funzionalità Pro");
      } else {
        setError(err instanceof Error ? err.message : "Errore nella generazione");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (autoLoad) {
      loadLatestReview();
    }
  }, [autoLoad]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
    });
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-5 h-5 text-red-500" />;
      case "down":
        return <TrendingDown className="w-5 h-5 text-green-500" />;
      default:
        return <Minus className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getTrendText = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return "In aumento";
      case "down":
        return "In diminuzione";
      default:
        return "Stabile";
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error === "Funzionalità Pro") {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Review Settimanale</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
              Pro
            </span>
            <p className="mt-3 text-sm text-muted-foreground">
              Le review settimanali AI sono disponibili con il piano Pro
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!review) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Review Settimanale</CardTitle>
          </div>
          <CardDescription>
            Ricevi un riepilogo delle tue spese della settimana
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={generateReview}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generazione in corso...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Genera Review
              </>
            )}
          </Button>
          {error && <p className="text-xs text-destructive text-center mt-2">{error}</p>}
        </CardContent>
      </Card>
    );
  }

  const data = review.data;
  const diffAmount = data.speseSettimana - data.speseSettimanaScorsa;
  const diffPercent = data.speseSettimanaScorsa > 0
    ? Math.round((diffAmount / data.speseSettimanaScorsa) * 100)
    : 0;

  if (compact && !isExpanded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              {getTrendIcon(data.trend)}
            </div>
            <div>
              <p className="font-medium">Review Settimanale</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(review.week_start)} - {formatDate(review.week_end)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-semibold">€{data.speseSettimana.toLocaleString("it-IT")}</p>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Review Settimanale</CardTitle>
          </div>
          {compact && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
          )}
        </div>
        <CardDescription>
          {formatDate(review.week_start)} - {formatDate(review.week_end)}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm">{review.summary}</p>
        </div>

        {/* Main stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Questa settimana</p>
            <p className="text-2xl font-bold">€{data.speseSettimana.toLocaleString("it-IT")}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">vs settimana scorsa</p>
            <div className="flex items-center gap-2">
              {getTrendIcon(data.trend)}
              <p className={cn(
                "text-lg font-semibold",
                diffAmount > 0 ? "text-red-500" : diffAmount < 0 ? "text-green-500" : ""
              )}>
                {diffAmount >= 0 ? "+" : ""}€{diffAmount.toLocaleString("it-IT")}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              {getTrendText(data.trend)} ({diffPercent >= 0 ? "+" : ""}{diffPercent}%)
            </p>
          </div>
        </div>

        {/* Categories breakdown */}
        {data.spesePerCategoria.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">Spese per categoria</h4>
            <div className="space-y-3">
              {data.spesePerCategoria.slice(0, 4).map((cat, i) => {
                const percentage = data.speseSettimana > 0
                  ? Math.round((cat.totale / data.speseSettimana) * 100)
                  : 0;
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{cat.categoria}</span>
                      <span className="font-medium">
                        €{cat.totale.toLocaleString("it-IT")} ({percentage}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Anomalies */}
        {data.anomalie.length > 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <h4 className="text-sm font-medium text-yellow-800">Spese anomale</h4>
            </div>
            <ul className="space-y-1">
              {data.anomalie.map((a, i) => (
                <li key={i} className="text-sm text-yellow-700">
                  {a.descrizione}: €{a.importo.toLocaleString("it-IT")} ({a.categoria})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Salvadanai progress */}
        {data.salvadanai.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <PiggyBank className="w-4 h-4" />
              Progresso Salvadanai
            </h4>
            <div className="space-y-3">
              {data.salvadanai.slice(0, 3).map((s, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{s.nome}</span>
                    <span className="font-medium">{s.percentuale}%</span>
                  </div>
                  <Progress value={s.percentuale} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {review.suggestions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Suggerimenti</h4>
            <ul className="space-y-2">
              {review.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Refresh button */}
        <Button
          onClick={generateReview}
          disabled={isGenerating}
          variant="outline"
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Aggiornamento...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Aggiorna Review
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
