import { motion } from "framer-motion";
import { Pencil, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AssessmentGate from "@/components/academy/AssessmentGate";
import SkillGraph from "@/components/academy/SkillGraph";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { invokeWithAuth } from "@/lib/invokeWithAuth";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";

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

type AcademyGraphPayload = {
  assessment_completed: boolean;
  review_due_count: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
};

const Accademia = () => {
  const navigate = useNavigate();
  const { isAdmin } = useUser();
  const { user, loading: authLoading } = useAuth();

  const graphQuery = useQuery({
    queryKey: ["academy-graph-v1"],
    queryFn: async (): Promise<AcademyGraphPayload> => {
      const data = await invokeWithAuth<AcademyGraphPayload>("academy-graph", { body: {} });
      if (!data) throw new Error("academy-graph returned empty payload");
      return data;
    },
    enabled: !authLoading && !!user,
    staleTime: 45_000,
  });

  const payload = graphQuery.data;

  if (graphQuery.isLoading) {
    return (
      <div className="px-5 pt-16 pb-6">
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">Carico il tuo skill graph...</CardContent>
        </Card>
      </div>
    );
  }

  if (graphQuery.isError || !payload) {
    return (
      <div className="px-5 pt-16 pb-6 space-y-3">
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            Non riesco a caricare l'Accademia adesso.
          </CardContent>
        </Card>
        <Button onClick={() => graphQuery.refetch()} className="rounded-xl">
          <RefreshCw size={14} className="mr-2" /> Riprova
        </Button>
      </div>
    );
  }

  if (!payload.assessment_completed) {
    return <AssessmentGate onCompleted={() => graphQuery.refetch()} />;
  }

  const openNode = (node: GraphNode) => {
    if (!node.lesson_id) return;
    navigate(`/lezione/${node.lesson_id}?skill=${encodeURIComponent(node.skill_id)}`);
  };

  return (
    <div className="pt-14 pb-6 px-5 space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Accademia Skill Graph 🎓</h1>
          {isAdmin ? (
            <Button
              onClick={() => navigate("/profilo/admin-accademia")}
              variant="outline"
              className="rounded-xl border-primary/30 bg-primary/10 text-primary"
            >
              <Pencil size={14} className="mr-1" /> Modifica
            </Button>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Nodi sbloccati in base alla tua mastery. Completare una skill genera review automatiche 1-3-7-14.
        </p>
      </motion.div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-muted-foreground">Skill disponibili</p>
            <p className="text-xl font-semibold">
              {payload.nodes.filter((n) => n.state === "available" || n.state === "fading").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-muted-foreground">Skill mastered</p>
            <p className="text-xl font-semibold">{payload.nodes.filter((n) => n.state === "mastered").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-muted-foreground">Review da fare</p>
            <p className="text-xl font-semibold">{payload.review_due_count}</p>
          </CardContent>
        </Card>
      </div>

      <SkillGraph nodes={payload.nodes} edges={payload.edges} onOpenNode={openNode} />
    </div>
  );
};

export default Accademia;
