-- Add response fields to contact_messages and quote_requests tables if they don't exist
-- This migration ensures the tables have fields for tracking admin responses

-- Alter contact_messages to add response tracking if needed
ALTER TABLE public.contact_messages
ADD COLUMN IF NOT EXISTS responded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS responded_at TIMESTAMPTZ;

-- Alter quote_requests to add response tracking if needed
ALTER TABLE public.quote_requests
ADD COLUMN IF NOT EXISTS responded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS responded_at TIMESTAMPTZ;

-- Ensure update_updated_at_column function exists (it should from earlier migrations)
-- This is a safety check

-- Update timestamp triggers if they don't exist
CREATE TRIGGER IF NOT EXISTS update_contact_messages_updated_at BEFORE UPDATE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER IF NOT EXISTS update_quote_requests_updated_at BEFORE UPDATE ON public.quote_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Ensure RLS Policies exist for contact_messages
CREATE POLICY IF NOT EXISTS "Anyone can submit contact message" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Admins can view contact messages" ON public.contact_messages FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY IF NOT EXISTS "Admins can update contact messages" ON public.contact_messages FOR UPDATE USING (public.is_admin(auth.uid()));

-- Ensure RLS Policies exist for quote_requests
CREATE POLICY IF NOT EXISTS "Anyone can submit quote request" ON public.quote_requests FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Admins can view quote requests" ON public.quote_requests FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY IF NOT EXISTS "Admins can update quote requests" ON public.quote_requests FOR UPDATE USING (public.is_admin(auth.uid()));

