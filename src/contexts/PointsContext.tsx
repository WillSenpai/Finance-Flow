import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

interface DailyActivities {
  daily_login: boolean;
  review_patrimonio: boolean;
  view_lesson: boolean;
  complete_lesson: boolean;
}

export interface Badge {
  id: string;
  nome: string;
  emoji: string;
  descrizione: string;
  condizione: string; // human-readable condition
  sbloccato: boolean;
  target: number;
  progresso: number;
  unita: string;
}

export interface Challenge {
  id: string;
  nome: string;
  emoji: string;
  descrizione: string;
  tipo: "spesa_max" | "streak" | "punti" | "salvadanaio";
  target: number;
  progresso: number;
  completata: boolean;
  settimana: string; // ISO week identifier
}

interface PointsData {
  points: number;
  streak: number;
  dailyActivities: DailyActivities;
  lastActiveDate: string;
  badges: Badge[];
  challenges: Challenge[];
}

interface PointsContextType {
  points: number;
  streak: number;
  dailyActivities: DailyActivities;
  badges: Badge[];
  challenges: Challenge[];
  awardPoints: (activity: keyof DailyActivities) => void;
  updateChallengeProgress: (challengeId: string, progresso: number) => void;
  checkBadges: (context: { points: number; streak: number; salvadanaiCompletati: number; speseRegistrate: number; lezioniCompletate: number }) => void;
}

const POINTS_KEY = "investo_points";

const ACTIVITY_POINTS: Record<keyof DailyActivities, number> = {
  daily_login: 10,
  review_patrimonio: 15,
  view_lesson: 10,
  complete_lesson: 25,
};

const today = () => new Date().toISOString().split("T")[0];
const currentWeek = () => {
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((d.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${weekNum}`;
};

const defaultActivities: DailyActivities = {
  daily_login: false,
  review_patrimonio: false,
  view_lesson: false,
  complete_lesson: false,
};

const defaultBadges: Badge[] = [
  { id: "first_login", nome: "Primo Passo", emoji: "👣", descrizione: "Accedi per la prima volta", condizione: "Primo accesso", sbloccato: false, target: 1, progresso: 0, unita: "accesso" },
  { id: "streak_7", nome: "Una Settimana!", emoji: "🔥", descrizione: "7 giorni di streak consecutivi", condizione: "7 giorni di streak", sbloccato: false, target: 7, progresso: 0, unita: "giorni" },
  { id: "streak_30", nome: "Un Mese Intero", emoji: "🏆", descrizione: "30 giorni di streak consecutivi", condizione: "30 giorni di streak", sbloccato: false, target: 30, progresso: 0, unita: "giorni" },
  { id: "points_100", nome: "Cento!", emoji: "💯", descrizione: "Raggiungi 100 stelline", condizione: "100 stelline totali", sbloccato: false, target: 100, progresso: 0, unita: "stelline" },
  { id: "points_500", nome: "Mezzo Mille", emoji: "⭐", descrizione: "Raggiungi 500 stelline", condizione: "500 stelline totali", sbloccato: false, target: 500, progresso: 0, unita: "stelline" },
  { id: "points_1000", nome: "Mille!", emoji: "🌟", descrizione: "Raggiungi 1000 stelline", condizione: "1000 stelline totali", sbloccato: false, target: 1000, progresso: 0, unita: "stelline" },
  { id: "first_goal", nome: "Obiettivo Raggiunto", emoji: "🎯", descrizione: "Completa il tuo primo salvadanaio", condizione: "1 salvadanaio completato", sbloccato: false, target: 1, progresso: 0, unita: "salvadanaio" },
  { id: "spese_tracker", nome: "Tracker Esperto", emoji: "📊", descrizione: "Registra almeno 20 spese", condizione: "20 spese registrate", sbloccato: false, target: 20, progresso: 0, unita: "spese" },
  { id: "lesson_master", nome: "Studente Modello", emoji: "📚", descrizione: "Completa 5 lezioni", condizione: "5 lezioni completate", sbloccato: false, target: 5, progresso: 0, unita: "lezioni" },
  { id: "saver", nome: "Risparmiatore", emoji: "🐷", descrizione: "Mantieni streak di 14 giorni", condizione: "14 giorni di streak", sbloccato: false, target: 14, progresso: 0, unita: "giorni" },
];

const ALL_CHALLENGES: Omit<Challenge, "progresso" | "completata" | "settimana">[] = [
  // Risparmio & Spese
  { id: "ch_spesa_cibo", nome: "Dieta del Portafoglio", emoji: "🍕", descrizione: "Spendi meno di €50 in Cibo questa settimana", tipo: "spesa_max", target: 50 },
  { id: "ch_spesa_shopping", nome: "Shopping Detox", emoji: "🛍️", descrizione: "Spendi meno di €30 in Shopping questa settimana", tipo: "spesa_max", target: 30 },
  { id: "ch_spesa_svago", nome: "Svago Consapevole", emoji: "🎬", descrizione: "Limita lo svago a €40 questa settimana", tipo: "spesa_max", target: 40 },
  { id: "ch_no_impulse", nome: "Zero Impulsi", emoji: "🧘", descrizione: "Non registrare spese nella categoria Altro per 7 giorni", tipo: "spesa_max", target: 0 },
  { id: "ch_spesa_trasporti", nome: "Pendolare Smart", emoji: "🚗", descrizione: "Tieni i trasporti sotto €25 questa settimana", tipo: "spesa_max", target: 25 },
  // Costanza
  { id: "ch_streak_5", nome: "Costanza Paga", emoji: "🔥", descrizione: "Accedi per 5 giorni consecutivi", tipo: "streak", target: 5 },
  { id: "ch_streak_7", nome: "Settimana Perfetta", emoji: "💪", descrizione: "Accedi tutti e 7 i giorni della settimana", tipo: "streak", target: 7 },
  { id: "ch_review_3", nome: "Guardiano del Patrimonio", emoji: "🛡️", descrizione: "Controlla il patrimonio almeno 3 volte questa settimana", tipo: "punti", target: 45 },
  // Punti & Apprendimento
  { id: "ch_punti_50", nome: "Caccia ai Punti", emoji: "⚡", descrizione: "Guadagna 50 punti questa settimana", tipo: "punti", target: 50 },
  { id: "ch_punti_100", nome: "Centurione", emoji: "🏅", descrizione: "Guadagna 100 punti questa settimana", tipo: "punti", target: 100 },
  { id: "ch_lezioni_3", nome: "Studente della Settimana", emoji: "📚", descrizione: "Completa 3 lezioni questa settimana", tipo: "punti", target: 75 },
  { id: "ch_lezione_1", nome: "Curiosità Finanziaria", emoji: "💡", descrizione: "Guarda almeno 1 lezione questa settimana", tipo: "punti", target: 10 },
  // Salvadanai
  { id: "ch_salvadanaio", nome: "Verso l'Obiettivo", emoji: "🐷", descrizione: "Aggiungi fondi a un salvadanaio", tipo: "salvadanaio", target: 1 },
  { id: "ch_nuovo_goal", nome: "Nuovi Orizzonti", emoji: "🎯", descrizione: "Crea un nuovo salvadanaio con un obiettivo", tipo: "salvadanaio", target: 1 },
];

function generateWeeklyChallenges(week: string): Challenge[] {
  // Deterministic shuffle based on week string, pick 5 challenges
  const seed = week.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const shuffled = [...ALL_CHALLENGES].sort((a, b) => {
    const ha = ((seed * 31 + a.id.charCodeAt(3)) % 997);
    const hb = ((seed * 31 + b.id.charCodeAt(3)) % 997);
    return ha - hb;
  });
  return shuffled.slice(0, 5).map(ch => ({
    ...ch,
    progresso: 0,
    completata: false,
    settimana: week,
  }));
}

export const PointsContext = createContext<PointsContextType | undefined>(undefined);

export const PointsProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<PointsData>({
    points: 0,
    streak: 0,
    dailyActivities: { ...defaultActivities },
    lastActiveDate: "",
    badges: [...defaultBadges],
    challenges: generateWeeklyChallenges(currentWeek()),
  });

  useEffect(() => {
    const stored = localStorage.getItem(POINTS_KEY);
    if (stored) {
      try {
        const parsed: PointsData = JSON.parse(stored);
        const t = today();
        const week = currentWeek();

        // Ensure badges exist (migration)
        if (!parsed.badges) parsed.badges = [...defaultBadges];
        // Merge new badges
        const existingIds = new Set(parsed.badges.map(b => b.id));
        defaultBadges.forEach(b => { if (!existingIds.has(b.id)) parsed.badges.push(b); });

        // Ensure challenges exist or regenerate for new week
        if (!parsed.challenges || parsed.challenges[0]?.settimana !== week) {
          parsed.challenges = generateWeeklyChallenges(week);
        }

        if (parsed.lastActiveDate === t) {
          setData(parsed);
        } else {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const wasYesterday = parsed.lastActiveDate === yesterday.toISOString().split("T")[0];
          setData({
            points: parsed.points,
            streak: wasYesterday ? parsed.streak : 0,
            dailyActivities: { ...defaultActivities },
            lastActiveDate: t,
            badges: parsed.badges,
            challenges: parsed.challenges,
          });
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const persist = useCallback((d: PointsData) => {
    localStorage.setItem(POINTS_KEY, JSON.stringify(d));
  }, []);

  const awardPoints = useCallback((activity: keyof DailyActivities) => {
    setData((prev) => {
      if (prev.dailyActivities[activity]) return prev;
      const t = today();
      const isNewDay = prev.lastActiveDate !== t;
      const newStreak = isNewDay ? prev.streak + 1 : prev.streak;
      const newPoints = prev.points + ACTIVITY_POINTS[activity];

      // Update progress and unlock badges
      const newBadges = prev.badges.map(b => {
        if (b.id === "first_login") return { ...b, sbloccato: true, progresso: 1 };
        if (b.id === "streak_7") return { ...b, progresso: Math.min(newStreak, b.target), sbloccato: newStreak >= 7 || b.sbloccato };
        if (b.id === "streak_30") return { ...b, progresso: Math.min(newStreak, b.target), sbloccato: newStreak >= 30 || b.sbloccato };
        if (b.id === "saver") return { ...b, progresso: Math.min(newStreak, b.target), sbloccato: newStreak >= 14 || b.sbloccato };
        if (b.id === "points_100") return { ...b, progresso: Math.min(newPoints, b.target), sbloccato: newPoints >= 100 || b.sbloccato };
        if (b.id === "points_500") return { ...b, progresso: Math.min(newPoints, b.target), sbloccato: newPoints >= 500 || b.sbloccato };
        if (b.id === "points_1000") return { ...b, progresso: Math.min(newPoints, b.target), sbloccato: newPoints >= 1000 || b.sbloccato };
        return b;
      });

      const next: PointsData = {
        points: newPoints,
        streak: newStreak,
        dailyActivities: { ...prev.dailyActivities, [activity]: true },
        lastActiveDate: t,
        badges: newBadges,
        challenges: prev.challenges,
      };
      persist(next);
      return next;
    });
  }, [persist]);

  const updateChallengeProgress = useCallback((challengeId: string, progresso: number) => {
    setData(prev => {
      const challenges = prev.challenges.map(c => {
        if (c.id !== challengeId || c.completata) return c;
        const newProgress = Math.min(progresso, c.target);
        return { ...c, progresso: newProgress, completata: newProgress >= c.target };
      });
      const next = { ...prev, challenges };
      persist(next);
      return next;
    });
  }, [persist]);

  const checkBadges = useCallback((context: { points: number; streak: number; salvadanaiCompletati: number; speseRegistrate: number; lezioniCompletate: number }) => {
    setData(prev => {
      const badges = prev.badges.map(b => {
        if (b.sbloccato) return b;
        if (b.id === "first_goal") return { ...b, progresso: Math.min(context.salvadanaiCompletati, b.target), sbloccato: context.salvadanaiCompletati >= 1 };
        if (b.id === "spese_tracker") return { ...b, progresso: Math.min(context.speseRegistrate, b.target), sbloccato: context.speseRegistrate >= 20 };
        if (b.id === "lesson_master") return { ...b, progresso: Math.min(context.lezioniCompletate, b.target), sbloccato: context.lezioniCompletate >= 5 };
        return b;
      });
      const next = { ...prev, badges };
      persist(next);
      return next;
    });
  }, [persist]);

  return (
    <PointsContext.Provider value={{
      points: data.points, streak: data.streak, dailyActivities: data.dailyActivities,
      badges: data.badges, challenges: data.challenges,
      awardPoints, updateChallengeProgress, checkBadges,
    }}>
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => {
  const ctx = useContext(PointsContext);
  if (!ctx) throw new Error("usePoints must be used within PointsProvider");
  return ctx;
};
