
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'agent');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies table (insurance policies uploaded by admin)
CREATE TABLE public.insurance_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  policy_type TEXT NOT NULL,
  provider TEXT,
  premium_range TEXT,
  coverage_details TEXT,
  file_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.insurance_policies ENABLE ROW LEVEL SECURITY;

-- Create agent_commissions table
CREATE TABLE public.agent_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  policy_id UUID REFERENCES public.insurance_policies(id),
  customer_name TEXT,
  commission_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  commission_percentage DECIMAL(5,2),
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.agent_commissions ENABLE ROW LEVEL SECURITY;

-- Add id_document_url column to agent_applications
ALTER TABLE public.agent_applications ADD COLUMN id_document_url TEXT;

-- Add approved_by and approved_at to agent_applications
ALTER TABLE public.agent_applications ADD COLUMN approved_by UUID REFERENCES auth.users(id);
ALTER TABLE public.agent_applications ADD COLUMN approved_at TIMESTAMPTZ;

-- Create security definer functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_insurance_policies_updated_at BEFORE UPDATE ON public.insurance_policies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for agent ID documents
INSERT INTO storage.buckets (id, name, public) VALUES ('agent-documents', 'agent-documents', false);

-- RLS: profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS: user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.is_admin(auth.uid()));

-- RLS: insurance_policies
CREATE POLICY "Authenticated users can view active policies" ON public.insurance_policies FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Admins can manage policies" ON public.insurance_policies FOR ALL USING (public.is_admin(auth.uid()));

-- RLS: agent_commissions
CREATE POLICY "Agents can view own commissions" ON public.agent_commissions FOR SELECT USING (auth.uid() = agent_user_id);
CREATE POLICY "Admins can view all commissions" ON public.agent_commissions FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage commissions" ON public.agent_commissions FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update commissions" ON public.agent_commissions FOR UPDATE USING (public.is_admin(auth.uid()));

-- RLS: agent_applications (update existing - add SELECT for admins)
CREATE POLICY "Admins can view agent applications" ON public.agent_applications FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update agent applications" ON public.agent_applications FOR UPDATE USING (public.is_admin(auth.uid()));

-- RLS: quote_requests (add SELECT for admins)
CREATE POLICY "Admins can view quote requests" ON public.quote_requests FOR SELECT USING (public.is_admin(auth.uid()));

-- RLS: contact_messages (add SELECT for admins)
CREATE POLICY "Admins can view contact messages" ON public.contact_messages FOR SELECT USING (public.is_admin(auth.uid()));

-- Storage RLS: agent-documents
CREATE POLICY "Anyone can upload agent documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'agent-documents');
CREATE POLICY "Admins can view agent documents" ON storage.objects FOR SELECT USING (bucket_id = 'agent-documents' AND public.is_admin(auth.uid()));
