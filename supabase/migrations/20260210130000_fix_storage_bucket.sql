-- Create agent-documents storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('agent-documents', 'agent-documents', false)
ON CONFLICT (id) DO NOTHING;

-- RLS: agent-documents bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Anyone can upload agent documents
CREATE POLICY "Anyone can upload agent documents" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'agent-documents');

-- Admins can view and delete agent documents
CREATE POLICY "Admins can view agent documents" ON storage.objects 
  FOR SELECT USING (bucket_id = 'agent-documents' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete agent documents" ON storage.objects 
  FOR DELETE USING (bucket_id = 'agent-documents' AND public.is_admin(auth.uid()));
