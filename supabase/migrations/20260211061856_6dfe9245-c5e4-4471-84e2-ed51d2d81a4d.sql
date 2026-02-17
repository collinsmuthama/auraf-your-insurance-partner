
-- Add service_provider column to quote_requests
ALTER TABLE public.quote_requests ADD COLUMN service_provider text;

-- Create edge function for generating signed URLs for private bucket documents
-- (handled in code instead)
