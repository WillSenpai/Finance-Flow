import { Progress } from "@/components/ui/progress";

const livelli = [
  { nome: "Bronzo", min: 0, max: 99, emoji: "🥉" },
  { nome: "Argento", min: 100, max: 299, emoji: "🥈" },
  { nome: "Oro", min: 300, max: 599, emoji: "🥇" },
  { nome: "Diamante", min: 600, max: Infinity, emoji: "💎" },
] as const;

export const getLivello = (points: number) => {
  return livelli.find((l) => points >= l.min && points <= l.max) || livelli[0];
};

const BadgeLivello = ({ points, compact = false }: { points: number; compact?: boolean }) => {
  const livello = getLivello(points);
  const nextLivello = livelli.find((l) => l.min > livello.min);
  const progress = nextLivello
    ? Math.round(((points - livello.min) / (nextLivello.min - livello.min)) * 100)
    : 100;

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium">
        {livello.emoji} {livello.nome}
      </span>
    );
  }

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{livello.emoji}</span>
        <div>
          <p className="font-semibold">Livello {livello.nome}</p>
          <p className="text-xs text-muted-foreground">
            {nextLivello ? `${nextLivello.min - points} stelline al prossimo livello` : "Livello massimo raggiunto!"}
          </p>
        </div>
      </div>
      <Progress value={progress} className="h-2.5" />
    </div>
  );
};

export default BadgeLivello;
