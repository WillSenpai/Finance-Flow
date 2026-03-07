import { memo } from "react";

type GraphNode = {
  skill_id: string;
  title: string;
  description: string;
  lesson_id: string | null;
  mastery_score: number;
  mastery_level: string;
  state: "locked" | "available" | "mastered" | "fading";
  position_x: number;
  position_y: number;
};

type GraphEdge = {
  from_skill_id: string;
  to_skill_id: string;
};

type SkillGraphProps = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onOpenNode: (node: GraphNode) => void;
};

const statusLabel: Record<GraphNode["state"], string> = {
  locked: "Bloccata",
  available: "Disponibile",
  mastered: "Mastered",
  fading: "Ripasso dovuto",
};

const nodeClass: Record<GraphNode["state"], string> = {
  locked: "border-border/60 bg-muted/60 text-muted-foreground",
  available: "border-primary/50 bg-primary/10 text-foreground",
  mastered: "border-emerald-400/60 bg-emerald-500/10 text-foreground",
  fading: "border-amber-400/60 bg-amber-500/10 text-foreground",
};

const SkillGraph = ({ nodes, edges, onOpenNode }: SkillGraphProps) => {
  const byId = new Map(nodes.map((node) => [node.skill_id, node]));

  return (
    <div className="space-y-4">
      <div className="relative h-[460px] overflow-hidden rounded-2xl border border-border/70 bg-card">
        <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
          {edges.map((edge) => {
            const from = byId.get(edge.from_skill_id);
            const to = byId.get(edge.to_skill_id);
            if (!from || !to) return null;

            const x1 = `${from.position_x}%`;
            const y1 = `${from.position_y}%`;
            const x2 = `${to.position_x}%`;
            const y2 = `${to.position_y}%`;
            const isActive = to.state !== "locked";

            return (
              <line
                key={`${edge.from_skill_id}-${edge.to_skill_id}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isActive ? "hsl(var(--primary) / 0.45)" : "hsl(var(--muted-foreground) / 0.25)"}
                strokeWidth="2"
                strokeDasharray={isActive ? "0" : "5 4"}
              />
            );
          })}
        </svg>

        {nodes.map((node) => {
          const clickable = (node.state === "available" || node.state === "mastered") && !!node.lesson_id;
          return (
            <button
              key={node.skill_id}
              type="button"
              onClick={() => clickable && onOpenNode(node)}
              disabled={!clickable}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border px-3 py-2 text-left shadow-sm transition ${nodeClass[node.state]} ${
                clickable ? "hover:scale-[1.02]" : "cursor-not-allowed opacity-85"
              }`}
              style={{ left: `${node.position_x}%`, top: `${node.position_y}%`, width: "154px" }}
            >
              <p className="text-[13px] font-semibold leading-tight">{node.title}</p>
              <p className="mt-1 text-[10px] opacity-90">{statusLabel[node.state]}</p>
              <p className="mt-1 text-[11px]">Mastery {node.mastery_score}%</p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-2 text-xs text-muted-foreground md:grid-cols-2">
        {nodes.map((node) => (
          <div key={`legend-${node.skill_id}`} className="rounded-xl border border-border/70 bg-card px-3 py-2">
            <p className="font-medium text-foreground">{node.title}</p>
            <p>{node.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(SkillGraph);
