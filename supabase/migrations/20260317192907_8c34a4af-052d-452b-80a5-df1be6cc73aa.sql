
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  mobile text,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id text UNIQUE NOT NULL DEFAULT ('CIL-' || LPAD(FLOOR(RANDOM() * 1000000)::text, 6, '0')),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reference_no text,
  company text,
  full_name text,
  mobile text,
  email text,
  address text,
  complaint_details text NOT NULL,
  status text DEFAULT 'Pending' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert complaints" ON public.complaints
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Anyone can view complaints" ON public.complaints
  FOR SELECT TO anon, authenticated USING (true);

INSERT INTO storage.buckets (id, name, public) VALUES ('complaint-documents', 'complaint-documents', true);

CREATE POLICY "Anyone can upload complaint docs" ON storage.objects
  FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'complaint-documents');

CREATE POLICY "Anyone can view complaint docs" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'complaint-documents');
