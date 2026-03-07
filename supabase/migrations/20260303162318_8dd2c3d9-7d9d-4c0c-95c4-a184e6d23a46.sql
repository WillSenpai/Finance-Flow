
-- Add views_count to admin_posts
ALTER TABLE public.admin_posts ADD COLUMN IF NOT EXISTS views_count integer NOT NULL DEFAULT 0;

-- Create post_likes table
CREATE TABLE public.post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.admin_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read likes
CREATE POLICY "Anyone can read likes" ON public.post_likes FOR SELECT TO authenticated USING (true);

-- Users can insert own likes
CREATE POLICY "Users can like posts" ON public.post_likes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Users can remove own likes
CREATE POLICY "Users can unlike posts" ON public.post_likes FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Create post_views table to track unique views
CREATE TABLE public.post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.admin_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.post_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read views" ON public.post_views FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert views" ON public.post_views FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
