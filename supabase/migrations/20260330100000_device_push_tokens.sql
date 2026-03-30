-- Device push tokens for native push notifications
CREATE TABLE IF NOT EXISTS device_push_tokens (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  token text NOT NULL,
  platform text NOT NULL CHECK (platform IN ('ios', 'android')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, token)
);

ALTER TABLE device_push_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tokens"
  ON device_push_tokens
  FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX idx_device_push_tokens_user_id ON device_push_tokens(user_id);
