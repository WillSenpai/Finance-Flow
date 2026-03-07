-- Skill Graph Academy V1: schema, RLS, seed data, and legacy backfill.

CREATE TABLE IF NOT EXISTS public.academy_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  lesson_id text,
  min_mastery_required integer NOT NULL DEFAULT 0 CHECK (min_mastery_required BETWEEN 0 AND 100),
  unlock_mastery_threshold integer NOT NULL DEFAULT 0 CHECK (unlock_mastery_threshold BETWEEN 0 AND 100),
  position_x integer NOT NULL DEFAULT 50 CHECK (position_x BETWEEN 0 AND 100),
  position_y integer NOT NULL DEFAULT 50 CHECK (position_y BETWEEN 0 AND 100),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.academy_skill_edges (
  from_skill_id uuid NOT NULL REFERENCES public.academy_skills(id) ON DELETE CASCADE,
  to_skill_id uuid NOT NULL REFERENCES public.academy_skills(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (from_skill_id, to_skill_id),
  CONSTRAINT academy_skill_edges_no_self_loop CHECK (from_skill_id <> to_skill_id)
);

CREATE TABLE IF NOT EXISTS public.user_skill_mastery (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES public.academy_skills(id) ON DELETE CASCADE,
  mastery_score integer NOT NULL DEFAULT 0 CHECK (mastery_score BETWEEN 0 AND 100),
  mastery_level text NOT NULL DEFAULT 'base' CHECK (mastery_level IN ('base', 'foundation', 'intermediate', 'advanced')),
  last_event_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS public.user_skill_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES public.academy_skills(id) ON DELETE CASCADE,
  event_id text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('concept', 'widget', 'challenge', 'review', 'feedback')),
  delta integer NOT NULL DEFAULT 0,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, event_id)
);

CREATE TABLE IF NOT EXISTS public.academy_assessment_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id uuid NOT NULL REFERENCES public.academy_skills(id) ON DELETE CASCADE,
  prompt text NOT NULL,
  options jsonb NOT NULL,
  correct_option integer NOT NULL,
  difficulty integer NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  explanation text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_assessment_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  current_step integer NOT NULL DEFAULT 0,
  total_steps integer NOT NULL DEFAULT 12,
  current_difficulty integer NOT NULL DEFAULT 2 CHECK (current_difficulty BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.user_assessment_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES public.user_assessment_runs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.academy_assessment_questions(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES public.academy_skills(id) ON DELETE CASCADE,
  selected_option integer NOT NULL,
  is_correct boolean NOT NULL,
  difficulty_at_answer integer NOT NULL CHECK (difficulty_at_answer BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (run_id, question_id)
);

CREATE TABLE IF NOT EXISTS public.user_review_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES public.academy_skills(id) ON DELETE CASCADE,
  step_day integer NOT NULL CHECK (step_day IN (1, 3, 7, 14)),
  due_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  last_result boolean,
  last_reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_skill_events_user_skill_created_idx
  ON public.user_skill_events(user_id, skill_id, created_at DESC);

CREATE INDEX IF NOT EXISTS user_assessment_runs_user_status_idx
  ON public.user_assessment_runs(user_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS user_assessment_answers_run_idx
  ON public.user_assessment_answers(run_id, created_at ASC);

CREATE INDEX IF NOT EXISTS user_review_queue_due_idx
  ON public.user_review_queue(user_id, due_at)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS user_review_queue_user_skill_status_idx
  ON public.user_review_queue(user_id, skill_id, status, due_at DESC);

CREATE INDEX IF NOT EXISTS academy_assessment_questions_skill_difficulty_idx
  ON public.academy_assessment_questions(skill_id, difficulty)
  WHERE is_active = true;

ALTER TABLE public.academy_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_skill_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skill_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skill_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_assessment_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_review_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can read academy skills" ON public.academy_skills;
CREATE POLICY "Authenticated can read academy skills"
  ON public.academy_skills
  FOR SELECT
  TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Admin can write academy skills" ON public.academy_skills;
CREATE POLICY "Admin can write academy skills"
  ON public.academy_skills
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Authenticated can read academy edges" ON public.academy_skill_edges;
CREATE POLICY "Authenticated can read academy edges"
  ON public.academy_skill_edges
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin can write academy edges" ON public.academy_skill_edges;
CREATE POLICY "Admin can write academy edges"
  ON public.academy_skill_edges
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can read own skill mastery" ON public.user_skill_mastery;
CREATE POLICY "Users can read own skill mastery"
  ON public.user_skill_mastery
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can upsert own skill mastery" ON public.user_skill_mastery;
CREATE POLICY "Users can upsert own skill mastery"
  ON public.user_skill_mastery
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can read own skill events" ON public.user_skill_events;
CREATE POLICY "Users can read own skill events"
  ON public.user_skill_events
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own skill events" ON public.user_skill_events;
CREATE POLICY "Users can insert own skill events"
  ON public.user_skill_events
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Authenticated can read assessment questions" ON public.academy_assessment_questions;
CREATE POLICY "Authenticated can read assessment questions"
  ON public.academy_assessment_questions
  FOR SELECT
  TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Admin can write assessment questions" ON public.academy_assessment_questions;
CREATE POLICY "Admin can write assessment questions"
  ON public.academy_assessment_questions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can manage own assessment runs" ON public.user_assessment_runs;
CREATE POLICY "Users can manage own assessment runs"
  ON public.user_assessment_runs
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage own assessment answers" ON public.user_assessment_answers;
CREATE POLICY "Users can manage own assessment answers"
  ON public.user_assessment_answers
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage own review queue" ON public.user_review_queue;
CREATE POLICY "Users can manage own review queue"
  ON public.user_review_queue
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.academy_mastery_level(p_score integer)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN GREATEST(0, LEAST(100, COALESCE(p_score, 0))) <= 29 THEN 'base'
    WHEN GREATEST(0, LEAST(100, COALESCE(p_score, 0))) <= 59 THEN 'foundation'
    WHEN GREATEST(0, LEAST(100, COALESCE(p_score, 0))) <= 79 THEN 'intermediate'
    ELSE 'advanced'
  END;
$$;

CREATE OR REPLACE FUNCTION public.touch_updated_at_academy_entities()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_touch_updated_at_academy_skills ON public.academy_skills;
CREATE TRIGGER trg_touch_updated_at_academy_skills
  BEFORE UPDATE ON public.academy_skills
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at_academy_entities();

DROP TRIGGER IF EXISTS trg_touch_updated_at_user_skill_mastery ON public.user_skill_mastery;
CREATE TRIGGER trg_touch_updated_at_user_skill_mastery
  BEFORE UPDATE ON public.user_skill_mastery
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at_academy_entities();

DROP TRIGGER IF EXISTS trg_touch_updated_at_user_review_queue ON public.user_review_queue;
CREATE TRIGGER trg_touch_updated_at_user_review_queue
  BEFORE UPDATE ON public.user_review_queue
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at_academy_entities();

INSERT INTO public.academy_skills (slug, title, description, lesson_id, min_mastery_required, unlock_mastery_threshold, position_x, position_y)
VALUES
  ('budget-base', 'Budget Base', 'Capire entrate, uscite e saldo mensile.', '1', 0, 0, 8, 22),
  ('fondo-emergenza', 'Fondo Emergenza', 'Costruire il cuscinetto di sicurezza.', '2', 20, 20, 30, 16),
  ('debito-intelligente', 'Debito Intelligente', 'Distinguere debito buono e cattivo.', '3', 25, 30, 52, 24),
  ('investimenti-base', 'Investimenti Base', 'Rischio-rendimento e orizzonte.', '4', 35, 40, 74, 18),
  ('pac-etf', 'PAC ed ETF', 'Piano di accumulo e diversificazione.', '5', 45, 50, 84, 36),
  ('protezione-assicurativa', 'Protezione Assicurativa', 'Coperture essenziali nella vita reale.', '6', 35, 40, 44, 46),
  ('fiscalita-italia', 'Fiscalita in Italia', 'Regole fiscali base per risparmi e investimenti.', '7', 50, 55, 64, 56),
  ('piano-lungo-termine', 'Piano Lungo Termine', 'Strategia 5-10 anni e revisione periodica.', '8', 60, 65, 84, 66)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  lesson_id = EXCLUDED.lesson_id,
  min_mastery_required = EXCLUDED.min_mastery_required,
  unlock_mastery_threshold = EXCLUDED.unlock_mastery_threshold,
  position_x = EXCLUDED.position_x,
  position_y = EXCLUDED.position_y,
  is_active = true,
  updated_at = now();

INSERT INTO public.academy_skill_edges (from_skill_id, to_skill_id)
SELECT s_from.id, s_to.id
FROM (VALUES
  ('budget-base', 'fondo-emergenza'),
  ('fondo-emergenza', 'debito-intelligente'),
  ('debito-intelligente', 'investimenti-base'),
  ('investimenti-base', 'pac-etf'),
  ('debito-intelligente', 'protezione-assicurativa'),
  ('protezione-assicurativa', 'fiscalita-italia'),
  ('pac-etf', 'piano-lungo-termine'),
  ('fiscalita-italia', 'piano-lungo-termine')
) AS edges(from_slug, to_slug)
JOIN public.academy_skills s_from ON s_from.slug = edges.from_slug
JOIN public.academy_skills s_to ON s_to.slug = edges.to_slug
ON CONFLICT DO NOTHING;

INSERT INTO public.academy_assessment_questions (skill_id, prompt, options, correct_option, difficulty, explanation)
SELECT s.id, q.prompt, q.options::jsonb, q.correct_option, q.difficulty, q.explanation
FROM (
  VALUES
    ('budget-base', 'Se spendi 900€ e guadagni 1200€, il saldo mensile è:', '["-300€", "300€", "1200€", "900€"]', 1, 1, 'Saldo = entrate - uscite.'),
    ('budget-base', 'Qual è la regola più utile per iniziare un budget?', '["Tracciare tutto per una settimana", "Investire subito tutto", "Eliminare ogni spesa", "Usare solo contanti"]', 0, 2, 'Prima misura, poi ottimizza.'),
    ('fondo-emergenza', 'Obiettivo minimo realistico del fondo emergenza:', '["1 mese spese essenziali", "10 anni di stipendio", "Solo 200€", "Nessun fondo"]', 0, 1, 'Si parte piccolo e si cresce.'),
    ('fondo-emergenza', 'Dove tenere il fondo emergenza?', '["Conto liquido e separato", "Azioni speculative", "Crypto ad alta volatilità", "Contanti in casa"]', 0, 2, 'Serve accessibilità e stabilità.'),
    ('debito-intelligente', 'Un debito con tasso 18% annuo è in genere:', '["Neutro", "Sostenibile sempre", "Costoso", "Preferibile al risparmio"]', 2, 3, 'Tassi alti erodono capacità di risparmio.'),
    ('debito-intelligente', 'Priorità corretta se hai debiti costosi:', '["Investire prima", "Rimborsare i più costosi", "Ignorare il debito", "Aumentare spese"]', 1, 3, 'Riduci il costo del denaro prima possibile.'),
    ('investimenti-base', 'Diversificare significa:', '["Comprare solo un titolo", "Distribuire rischio su strumenti diversi", "Evitare totalmente il rischio", "Fare trading giornaliero"]', 1, 2, 'Riduce il rischio specifico.'),
    ('investimenti-base', 'Orizzonte lungo in investimenti azionari tipicamente:', '["< 6 mesi", "1 anno", "5+ anni", "2 settimane"]', 2, 3, 'Il tempo assorbe volatilità.'),
    ('pac-etf', 'Un PAC funziona meglio quando:', '["Si investe con regolarità", "Si entra tutto sui massimi", "Si cambia piano ogni settimana", "Si usa leva alta"]', 0, 3, 'Costanza batte timing perfetto.'),
    ('protezione-assicurativa', 'Una polizza utile prima di investire molto può essere:', '["RC/casa/salute base coerente col rischio", "Solo polizze investimento costose", "Nessuna copertura", "Solo garanzie duplicate"]', 0, 3, 'Proteggi prima i rischi catastrofici.'),
    ('fiscalita-italia', 'In Italia, tassazione tipica rendite finanziarie standard:', '["0%", "12.5%", "26%", "52%"]', 2, 4, 'Molti strumenti finanziari sono al 26%, con eccezioni.'),
    ('piano-lungo-termine', 'Un buon piano lungo termine include:', '["Obiettivi, allocazione, revisione periodica", "Solo rendimento atteso", "Solo intuizione", "Nessun controllo annuale"]', 0, 4, 'Struttura + revisione = sostenibilità.')
) AS q(skill_slug, prompt, options, correct_option, difficulty, explanation)
JOIN public.academy_skills s ON s.slug = q.skill_slug
ON CONFLICT DO NOTHING;

-- Legacy backfill: convert completed lessons into initial mastery.
INSERT INTO public.user_skill_mastery (user_id, skill_id, mastery_score, mastery_level, last_event_at)
SELECT
  lp.user_id,
  s.id,
  LEAST(75, 60 + (COUNT(*) OVER (PARTITION BY lp.user_id, s.id) - 1) * 5)::integer AS mastery_score,
  public.academy_mastery_level(LEAST(75, 60 + (COUNT(*) OVER (PARTITION BY lp.user_id, s.id) - 1) * 5)::integer),
  now()
FROM public.lesson_progress lp
JOIN public.academy_skills s ON s.lesson_id = lp.lesson_id
ON CONFLICT (user_id, skill_id) DO UPDATE
SET
  mastery_score = GREATEST(public.user_skill_mastery.mastery_score, EXCLUDED.mastery_score),
  mastery_level = public.academy_mastery_level(GREATEST(public.user_skill_mastery.mastery_score, EXCLUDED.mastery_score)),
  last_event_at = now(),
  updated_at = now();
