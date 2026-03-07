CREATE TABLE IF NOT EXISTS public.coach_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Nuova chat',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.coach_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.coach_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coach_conversations_user_updated
  ON public.coach_conversations(user_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_coach_messages_conversation_created
  ON public.coach_messages(conversation_id, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_coach_messages_created_at
  ON public.coach_messages(created_at);

ALTER TABLE public.coach_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own coach conversations"
  ON public.coach_conversations
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own coach conversations"
  ON public.coach_conversations
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own coach conversations"
  ON public.coach_conversations
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own coach conversations"
  ON public.coach_conversations
  FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own coach messages"
  ON public.coach_messages
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own coach messages"
  ON public.coach_messages
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.coach_conversations c
      WHERE c.id = coach_messages.conversation_id
        AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own coach messages"
  ON public.coach_messages
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own coach messages"
  ON public.coach_messages
  FOR DELETE
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.touch_coach_conversation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.coach_conversations
  SET updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS update_coach_conversation_on_new_message ON public.coach_messages;

CREATE TRIGGER update_coach_conversation_on_new_message
  AFTER INSERT ON public.coach_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_coach_conversation_updated_at();

CREATE OR REPLACE FUNCTION public.cleanup_old_coach_data()
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.coach_messages
  WHERE created_at < now() - interval '30 days';

  DELETE FROM public.coach_conversations c
  WHERE c.updated_at < now() - interval '30 days'
    AND NOT EXISTS (
      SELECT 1
      FROM public.coach_messages m
      WHERE m.conversation_id = c.id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM cron.job
    WHERE jobname = 'cleanup_coach_history_30d'
  ) THEN
    PERFORM cron.unschedule((
      SELECT jobid
      FROM cron.job
      WHERE jobname = 'cleanup_coach_history_30d'
      LIMIT 1
    ));
  END IF;

  PERFORM cron.schedule(
    'cleanup_coach_history_30d',
    '0 3 * * *',
    'SELECT public.cleanup_old_coach_data();'
  );
END;
$$;
