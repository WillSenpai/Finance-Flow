import { motion } from "framer-motion";
import { ArrowLeft, Target, CheckCircle2, Circle, Flame, Star, Gamepad2, HelpCircle, Lightbulb, Coins, Trophy, PlayCircle, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePoints } from "@/contexts/PointsContext";
import { Progress } from "@/components/ui/progress";
import { getLivello } from "@/components/BadgeLivello";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { invokeWithAuth } from "@/lib/invokeWithAuth";
import { boardProgressPercent, canPlayDailyRun, coinsTone, streakLabel } from "@/lib/gameCampaign";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } } as const;
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } } as const;

const getChallengeProgressPercent = (progresso: number, target: number, completata: boolean) => {
  if (target <= 0) return completata ? 100 : 0;
  const percent = (progresso / target) * 100;
  if (!Number.isFinite(percent)) return 0;
  return Math.max(0, Math.min(100, percent));
};

// Finance quiz questions
const QUIZ_QUESTIONS = [
  { q: "Cos'è l'inflazione?", options: ["Aumento dei prezzi nel tempo", "Diminuzione del PIL", "Un tipo di investimento", "Un tasso bancario"], correct: 0 },
  { q: "Cosa significa diversificare?", options: ["Investire tutto in un'azione", "Distribuire gli investimenti", "Vendere tutto", "Risparmiare di più"], correct: 1 },
  { q: "Cos'è un ETF?", options: ["Un conto corrente", "Un fondo che replica un indice", "Una criptovaluta", "Un'assicurazione"], correct: 1 },
  { q: "Cos'è l'interesse composto?", options: ["Interesse solo sul capitale", "Interesse su capitale + interessi", "Un prestito bancario", "Una tassa"], correct: 1 },
  { q: "Cosa indica il rapporto P/E?", options: ["Profitto/Entrate", "Prezzo/Utili", "Performance/Efficienza", "Patrimonio/Equity"], correct: 1 },
  { q: "Cos'è un fondo emergenza?", options: ["Un investimento ad alto rischio", "Soldi per spese impreviste", "Un conto deposito", "Un'assicurazione vita"], correct: 1 },
  { q: "La regola del 50/30/20 divide il reddito in:", options: ["Cibo/Affitto/Risparmio", "Necessità/Desideri/Risparmio", "Investimenti/Spese/Tasse", "Entrate/Uscite/Debiti"], correct: 1 },
  { q: "Cos'è un bear market?", options: ["Mercato in crescita", "Mercato in calo prolungato", "Mercato stabile", "Mercato delle materie prime"], correct: 1 },
];

type CampaignState = {
  id: string;
  current_level: number;
  board_position: number;
  coins: number;
  energy: number;
  streak_days: number;
  last_run_at: string | null;
};

type GameMission = {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "skipped";
  reward_coins: number;
};

const normalizeGameError = (error: unknown): string => {
  const message = error instanceof Error ? error.message : String(error ?? "");
  const lower = message.toLowerCase();

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return "Sei offline. Controlla la connessione e riprova.";
  }
  if (lower.includes("failed to fetch") || lower.includes("network")) {
    return "Connessione instabile o server non raggiungibile. Riprova tra qualche secondo.";
  }
  if (lower.includes("404")) {
    return "Feature game non ancora disponibile su server. Aggiorna e riprova.";
  }
  if (
    lower.includes("401") ||
    lower.includes("unauthorized") ||
    lower.includes("authorization required") ||
    lower.includes("sessione") ||
    lower.includes("login")
  ) {
    return "Sessione scaduta. Rientra nell'app e riprova.";
  }

  return "Campagna temporaneamente non disponibile. Riprova.";
};

const isAuthLikeError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : String(error ?? "");
  const lower = message.toLowerCase();
  return (
    lower.includes("401") ||
    lower.includes("unauthorized") ||
    lower.includes("authorization") ||
    lower.includes("sessione") ||
    lower.includes("login")
  );
};

const Giochi = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { points, streak, challenges, dailyActivities } = usePoints();

  const activities = [
    { key: "daily_login" as const, label: "Accesso giornaliero", done: dailyActivities.daily_login },
    { key: "review_patrimonio" as const, label: "Revisiona patrimonio", done: dailyActivities.review_patrimonio },
    { key: "view_lesson" as const, label: "Guarda una lezione", done: dailyActivities.view_lesson },
    { key: "complete_lesson" as const, label: "Completa una lezione", done: dailyActivities.complete_lesson },
  ];
  const livello = getLivello(points);

  // Quiz state
  const [quizActive, setQuizActive] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  // Pick 5 random questions per session
  const [quizQuestions] = useState(() => {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  });

  const [campaign, setCampaign] = useState<CampaignState | null>(null);
  const [missions, setMissions] = useState<GameMission[]>([]);
  const [unclaimedCoins, setUnclaimedCoins] = useState(0);
  const [isGameLoading, setIsGameLoading] = useState(true);
  const [isRunLoading, setIsRunLoading] = useState(false);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [gameError, setGameError] = useState<string | null>(null);

  const canRun = useMemo(() => canPlayDailyRun(campaign?.last_run_at ?? null), [campaign?.last_run_at]);
  const boardPercent = boardProgressPercent(campaign?.board_position ?? 0, 24);
  const coinStatus = coinsTone(campaign?.coins ?? 0);

  const trackGameTelemetry = async (eventName: string, payload: Record<string, unknown> = {}) => {
    if (!user) return;
    try {
      await invokeWithAuth("game-telemetry", {
        body: {
          action: "track_event",
          event_name: eventName,
          campaign_id: campaign?.id ?? null,
          payload,
        },
      });
    } catch {
      // best effort
    }
  };

  const recordGameClientTest = async (
    caseName: string,
    status: "pass" | "fail" | "skip",
    details: Record<string, unknown> = {},
  ) => {
    if (!user) return;
    try {
      await invokeWithAuth("game-telemetry", {
        body: {
          action: "record_test_result",
          campaign_id: campaign?.id ?? null,
          suite_name: "client_smoke",
          case_name: caseName,
          status,
          duration_ms: 0,
          details,
        },
      });
    } catch {
      // best effort
    }
  };

  const loadCampaignState = async () => {
    if (!user) {
      setCampaign(null);
      setMissions([]);
      setUnclaimedCoins(0);
      setGameError(null);
      setIsGameLoading(false);
      return;
    }
    setIsGameLoading(true);
    setGameError(null);
    try {
      const started = await invokeWithAuth<{ campaign: CampaignState }>("game-campaign", {
        body: { action: "start_campaign" },
      });

      await invokeWithAuth("game-missions", { body: { action: "generate_daily" } });

      const state = await invokeWithAuth<{
        campaign: CampaignState;
        canPlayDailyRun: boolean;
        missions: GameMission[];
        unclaimedCoins: number;
      }>("game-campaign", { body: { action: "get_state" } });

      setCampaign(started.campaign ?? state.campaign);
      setMissions(state.missions ?? []);
      setUnclaimedCoins(state.unclaimedCoins ?? 0);

      await trackGameTelemetry("game_campaign_loaded", { missions_count: state.missions?.length ?? 0 });
      await recordGameClientTest("campaign_load", "pass");
    } catch (error) {
      setGameError(normalizeGameError(error));
      if (!isAuthLikeError(error)) {
        await recordGameClientTest("campaign_load", "fail", {
          message: error instanceof Error ? error.message : "unknown",
        });
      }
    } finally {
      setIsGameLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    void loadCampaignState();
  }, [authLoading, user?.id]);

  const handlePlayDailyRun = async () => {
    if (!user) {
      setGameError("Accedi per usare la campagna.");
      return;
    }
    if (!campaign || !canRun) return;
    setIsRunLoading(true);
    setGameError(null);
    const startedAt = performance.now();
    try {
      const response = await invokeWithAuth<{ campaign: CampaignState; run: { id: string } }>("game-campaign", {
        body: { action: "play_daily_run" },
      });
      setCampaign(response.campaign);

      const refreshed = await invokeWithAuth<{
        campaign: CampaignState;
        canPlayDailyRun: boolean;
        missions: GameMission[];
        unclaimedCoins: number;
      }>("game-campaign", { body: { action: "get_state" } });

      setMissions(refreshed.missions ?? []);
      setUnclaimedCoins(refreshed.unclaimedCoins ?? 0);
      await trackGameTelemetry("daily_run_completed", {
        run_id: response.run?.id,
        latency_ms: Math.round(performance.now() - startedAt),
      });
      await recordGameClientTest("daily_run_action", "pass");
    } catch (error) {
      setGameError(normalizeGameError(error));
      if (!isAuthLikeError(error)) {
        await recordGameClientTest("daily_run_action", "fail", {
          message: error instanceof Error ? error.message : "unknown",
        });
      }
    } finally {
      setIsRunLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!user) {
      setGameError("Accedi per riscattare le ricompense.");
      return;
    }
    if (isClaimLoading) return;
    setIsClaimLoading(true);
    try {
      await invokeWithAuth("game-campaign", { body: { action: "claim_rewards" } });
      const refreshed = await invokeWithAuth<{
        campaign: CampaignState;
        canPlayDailyRun: boolean;
        missions: GameMission[];
        unclaimedCoins: number;
      }>("game-campaign", { body: { action: "get_state" } });
      setCampaign(refreshed.campaign);
      setMissions(refreshed.missions ?? []);
      setUnclaimedCoins(refreshed.unclaimedCoins ?? 0);
      await trackGameTelemetry("rewards_claimed");
      await recordGameClientTest("claim_rewards_action", "pass");
    } catch (error) {
      setGameError(normalizeGameError(error));
      if (!isAuthLikeError(error)) {
        await recordGameClientTest("claim_rewards_action", "fail", {
          message: error instanceof Error ? error.message : "unknown",
        });
      }
    } finally {
      setIsClaimLoading(false);
    }
  };

  const handleMissionAction = async (missionId: string, action: "complete_mission" | "skip_mission") => {
    if (!user) {
      setGameError("Accedi per gestire le missioni.");
      return;
    }
    try {
      await invokeWithAuth("game-missions", { body: { action, missionId } });
      const refreshed = await invokeWithAuth<{
        campaign: CampaignState;
        canPlayDailyRun: boolean;
        missions: GameMission[];
        unclaimedCoins: number;
      }>("game-campaign", { body: { action: "get_state" } });
      setCampaign(refreshed.campaign);
      setMissions(refreshed.missions ?? []);
      setUnclaimedCoins(refreshed.unclaimedCoins ?? 0);
      await trackGameTelemetry(action);
    } catch (error) {
      setGameError(normalizeGameError(error));
    }
  };

  const handleQuizAnswer = (idx: number) => {
    if (quizAnswered !== null) return;
    setQuizAnswered(idx);
    if (idx === quizQuestions[quizIndex].correct) {
      setQuizScore(s => s + 1);
    }
    setTimeout(() => {
      if (quizIndex + 1 >= quizQuestions.length) {
        setQuizFinished(true);
      } else {
        setQuizIndex(i => i + 1);
        setQuizAnswered(null);
      }
    }, 1200);
  };

  const resetQuiz = () => {
    setQuizActive(false);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizAnswered(null);
    setQuizFinished(false);
  };

  return (
    <motion.div className="px-5 pt-14 pb-4" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} className="flex items-center gap-3 mb-6">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate("/profilo")} className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ArrowLeft size={20} />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Stelline & Giochi</h1>
          <p className="text-xs text-muted-foreground">Impara giocando e guadagna stelline ⭐</p>
        </div>
      </motion.div>

      {/* Points Summary */}
      <motion.div variants={item} className="bg-card border border-border/50 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Le tue Stelline ⭐</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-3xl font-bold">{points}</p>
              <span className="text-sm font-medium text-muted-foreground">{livello.emoji} {livello.nome}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full">
            <Flame size={16} className="text-primary" />
            <span className="text-sm font-semibold text-primary">{streak} giorni</span>
          </div>
        </div>
        {/* Daily Activities */}
        <div className="mt-4 pt-4 border-t border-border/30 space-y-2.5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Attività Giornaliere</p>
          {activities.map((a) => (
            <div key={a.key} className="flex items-center gap-2.5">
              {a.done ? (
                <CheckCircle2 size={18} className="text-primary flex-shrink-0" />
              ) : (
                <Circle size={18} className="text-muted-foreground/40 flex-shrink-0" />
              )}
              <span className={`text-sm ${a.done ? "text-foreground" : "text-muted-foreground"}`}>{a.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Challenges */}
      {challenges.length > 0 && (
        <motion.div variants={item} className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Target size={18} /> Sfide della Settimana
            </h2>
            <span className="text-xs text-muted-foreground">
              {challenges.filter((c) => c.completata).length}/{challenges.length} completate
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Ogni settimana nuove sfide per migliorare le tue abitudini finanziarie!
          </p>
          <div className="space-y-2.5">
            {challenges.map((ch) => {
              const progressPercent = getChallengeProgressPercent(ch.progresso, ch.target, ch.completata);
              return (
              <motion.div
                key={ch.id}
                whileTap={{ scale: 0.98 }}
                className={`bg-card border rounded-2xl p-4 ${ch.completata ? "border-primary/30 bg-primary/5" : "border-border/50"}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${ch.completata ? "bg-primary/20" : "bg-muted"}`}>
                    <span className="text-xl">{ch.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-tight">{ch.nome}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{ch.descrizione}</p>
                  </div>
                </div>
                {ch.completata ? (
                  <div className="flex items-center gap-2 bg-primary/10 rounded-xl px-3 py-2">
                    <CheckCircle2 size={16} className="text-primary" />
                    <span className="text-xs font-medium text-primary">Completata! 🎉</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Progresso</span>
                      <span className="text-xs font-semibold">{Math.round(progressPercent)}%</span>
                    </div>
                    <Progress value={progressPercent} className="h-2.5 rounded-full" />
                  </div>
                )}
              </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      <motion.div variants={item} className="mb-6">
        <h2 className="text-base font-semibold flex items-center gap-2 mb-3">
          <Trophy size={18} /> Campaign Board
        </h2>

        <div className="bg-card border border-border/50 rounded-2xl p-4">
          {authLoading ? (
            <p className="text-sm text-muted-foreground">Verifica sessione...</p>
          ) : isGameLoading ? (
            <p className="text-sm text-muted-foreground">Caricamento campagna...</p>
          ) : !user ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Accedi per attivare la Campaign Board sincronizzata.</p>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="inline-flex items-center justify-center rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
              >
                Vai al login
              </button>
            </div>
          ) : !campaign ? (
            <div className="space-y-3">
              <p className="text-sm text-destructive">Campagna non disponibile: {gameError ?? "Errore temporaneo"}</p>
              <button
                type="button"
                onClick={() => void loadCampaignState()}
                className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium"
              >
                Riprova
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <div className="rounded-xl border border-border/50 p-3 bg-muted/30">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Level</p>
                  <p className="text-lg font-semibold">{campaign.current_level}</p>
                </div>
                <div className="rounded-xl border border-border/50 p-3 bg-muted/30">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Streak</p>
                  <p className="text-sm font-semibold">{streakLabel(campaign.streak_days)}</p>
                </div>
                <div className="rounded-xl border border-border/50 p-3 bg-muted/30">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Coins</p>
                  <p
                    className={`text-lg font-semibold inline-flex items-center gap-1.5 ${
                      coinStatus === "good"
                        ? "text-emerald-600"
                        : coinStatus === "warning"
                          ? "text-amber-600"
                          : "text-red-600"
                    }`}
                  >
                    <Coins size={16} />
                    {campaign.coins}
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 p-3 bg-muted/30">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Energy</p>
                  <p className="text-lg font-semibold">{campaign.energy}</p>
                </div>
              </div>

              <div className="game-board-3d mb-3">
                {Array.from({ length: 12 }).map((_, idx) => {
                  const step = Math.floor((campaign.board_position % 24) / 2);
                  const active = step === idx;
                  return (
                    <div key={`tile-${idx}`} className={`game-board-tile ${active ? "active" : ""}`}>
                      <span>{idx + 1}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">Progress board</span>
                  <span className="text-xs font-medium">{boardPercent}%</span>
                </div>
                <Progress value={boardPercent} className="h-2.5" />
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => void handlePlayDailyRun()}
                  disabled={!canRun || isRunLoading}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
                >
                  <PlayCircle size={16} />
                  {isRunLoading ? "Running..." : canRun ? "Daily Run" : "Run gia fatta"}
                </button>
                <button
                  type="button"
                  onClick={() => void handleClaimRewards()}
                  disabled={unclaimedCoins <= 0 || isClaimLoading}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-medium disabled:opacity-60"
                >
                  <Gift size={16} />
                  {isClaimLoading ? "Claim..." : `Claim ${unclaimedCoins}`}
                </button>
              </div>

              {missions.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Missioni di oggi</p>
                  {missions.map((mission) => (
                    <div key={mission.id} className="rounded-xl border border-border/50 p-3 bg-muted/20">
                      <p className="text-sm font-semibold">{mission.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{mission.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-primary">+{mission.reward_coins} coins</span>
                        {mission.status === "active" ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => void handleMissionAction(mission.id, "complete_mission")}
                              className="rounded-lg bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground"
                            >
                              Completa
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleMissionAction(mission.id, "skip_mission")}
                              className="rounded-lg border border-border px-2.5 py-1 text-xs"
                            >
                              Salta
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground capitalize">{mission.status}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {gameError ? <p className="text-xs text-destructive mt-3">{gameError}</p> : null}
            </>
          )}
        </div>
      </motion.div>

      {/* Quiz Section */}
      <motion.div variants={item} className="mb-6">
        <h2 className="text-base font-semibold flex items-center gap-2 mb-3">
          <HelpCircle size={18} /> Quiz Finanziario
        </h2>

        {!quizActive ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { resetQuiz(); setQuizActive(true); }}
            className="w-full bg-card border border-border/50 rounded-2xl p-5 flex items-center gap-4 text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Lightbulb size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Metti alla prova le tue conoscenze!</p>
              <p className="text-xs text-muted-foreground mt-0.5">5 domande casuali di finanza personale</p>
            </div>
            <Star size={18} className="text-primary" />
          </motion.button>
        ) : quizFinished ? (
          <div className="bg-card border border-border/50 rounded-2xl p-5 text-center space-y-4">
            <div className="text-4xl">{quizScore >= 4 ? "🏆" : quizScore >= 3 ? "👏" : "📚"}</div>
            <p className="text-lg font-semibold">{quizScore}/{quizQuestions.length} corrette</p>
            <p className="text-sm text-muted-foreground">
              {quizScore >= 4 ? "Ottimo lavoro! Sei un esperto!" : quizScore >= 3 ? "Buon risultato, continua così!" : "Continua a studiare nell'Accademia!"}
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { resetQuiz(); setQuizActive(true); }}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium"
            >
              Gioca ancora
            </motion.button>
          </div>
        ) : (
          <div className="bg-card border border-border/50 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Domanda {quizIndex + 1}/{quizQuestions.length}</span>
              <span className="text-xs font-medium text-primary">{quizScore} ✓</span>
            </div>
            <Progress value={((quizIndex + 1) / quizQuestions.length) * 100} className="h-1.5" />
            <p className="text-sm font-semibold">{quizQuestions[quizIndex].q}</p>
            <div className="space-y-2">
              {quizQuestions[quizIndex].options.map((opt, idx) => {
                let bg = "bg-muted/50 hover:bg-muted";
                if (quizAnswered !== null) {
                  if (idx === quizQuestions[quizIndex].correct) bg = "bg-emerald-500/15 border-emerald-500/30";
                  else if (idx === quizAnswered) bg = "bg-destructive/10 border-destructive/30";
                }
                return (
                  <motion.button
                    key={idx}
                    whileTap={quizAnswered === null ? { scale: 0.97 } : {}}
                    onClick={() => handleQuizAnswer(idx)}
                    className={`w-full text-left p-3 rounded-xl text-sm border border-transparent transition-colors ${bg}`}
                  >
                    {opt}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* More Games Coming Soon */}
      <motion.div variants={item} className="mb-6">
        <div className="bg-card border border-dashed border-border rounded-2xl p-5 text-center">
          <Gamepad2 size={28} className="text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm font-medium text-muted-foreground">Altri giochi in arrivo!</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Simulazioni, sfide tra amici e molto altro...</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Giochi;
