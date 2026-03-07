import { motion } from "framer-motion";
import { ArrowLeft, Target, CheckCircle2, Circle, Flame, Star, Gamepad2, TrendingUp, HelpCircle, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePoints } from "@/contexts/PointsContext";
import { Progress } from "@/components/ui/progress";
import { getLivello } from "@/components/BadgeLivello";
import { useState } from "react";

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

const Giochi = () => {
  const navigate = useNavigate();
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
