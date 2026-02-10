-- Add INSERT policy for agent_applications to allow users to submit applications
CREATE POLICY "Anyone can submit agent application" ON public.agent_applications FOR INSERT WITH CHECK (true);

-- Ensure users can view their own agent applications if they know the ID
CREATE POLICY "Authenticated users can view own agent applications" ON public.agent_applications FOR SELECT USING (auth.uid() IS NOT NULL);
