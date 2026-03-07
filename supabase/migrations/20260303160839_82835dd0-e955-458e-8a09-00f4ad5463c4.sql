
-- Create admin_posts table
CREATE TABLE public.admin_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titolo text NOT NULL,
  contenuto text NOT NULL,
  emoji text NOT NULL DEFAULT '📢',
  tipo text NOT NULL DEFAULT 'post',
  image_url text,
  file_url text,
  published boolean NOT NULL DEFAULT false,
  scheduled_at timestamptz,
  visibility text NOT NULL DEFAULT 'all',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_posts ENABLE ROW LEVEL SECURITY;

-- Trigger for updated_at
CREATE TRIGGER update_admin_posts_updated_at
  BEFORE UPDATE ON public.admin_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Admin can do everything
CREATE POLICY "Admin can insert posts"
  ON public.admin_posts FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can update posts"
  ON public.admin_posts FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete posts"
  ON public.admin_posts FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin can see all their posts (including drafts)
CREATE POLICY "Admin can view all own posts"
  ON public.admin_posts FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Everyone can read published, non-future, visible posts
CREATE POLICY "Anyone can read published visible posts"
  ON public.admin_posts FOR SELECT TO authenticated
  USING (
    published = true
    AND (scheduled_at IS NULL OR scheduled_at <= now())
    AND visibility = 'all'
  );

-- Storage bucket for admin post images
INSERT INTO storage.buckets (id, name, public) VALUES ('admin-posts-images', 'admin-posts-images', true);

-- Storage policies
CREATE POLICY "Anyone can view admin post images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'admin-posts-images');

CREATE POLICY "Admin can upload post images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'admin-posts-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete post images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'admin-posts-images' AND public.has_role(auth.uid(), 'admin'));
