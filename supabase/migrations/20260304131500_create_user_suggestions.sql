CREATE TABLE public.user_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email text NOT NULL,
  category text NOT NULL CHECK (category IN ('bug', 'idea', 'ux', 'altro')),
  message text NOT NULL CHECK (char_length(trim(message)) >= 10),
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own suggestions"
  ON public.user_suggestions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own suggestions"
  ON public.user_suggestions FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admin can read all suggestions"
  ON public.user_suggestions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_user_suggestions_updated_at
  BEFORE UPDATE ON public.user_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
