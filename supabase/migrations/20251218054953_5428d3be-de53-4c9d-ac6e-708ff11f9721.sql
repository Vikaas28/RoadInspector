-- Create storage buckets for videos, frames, and reports
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('videos', 'videos', false),
  ('frames', 'frames', false),
  ('reports', 'reports', false)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for videos bucket
CREATE POLICY "Users can upload videos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'videos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own videos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'videos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all videos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'videos' 
    AND public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for frames bucket
CREATE POLICY "Users can upload frames"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'frames' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own frames"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'frames' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all frames"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'frames' 
    AND public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for reports bucket
CREATE POLICY "Users can upload reports"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'reports' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own reports"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'reports' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all reports"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'reports' 
    AND public.has_role(auth.uid(), 'admin')
  );