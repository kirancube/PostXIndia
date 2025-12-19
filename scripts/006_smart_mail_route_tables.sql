-- Create sorted_mail table for AI mail sorting results
CREATE TABLE IF NOT EXISTS public.sorted_mail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_name TEXT NOT NULL,
  full_address TEXT NOT NULL,
  street TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT NOT NULL,
  confidence DECIMAL,
  is_handwritten BOOLEAN DEFAULT false,
  sorting_center TEXT,
  route_code TEXT,
  priority TEXT,
  zone TEXT,
  estimated_delivery_days INTEGER,
  ocr_source TEXT,
  ocr_confidence DECIMAL,
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sorted_mail ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sorted_mail_select_own" ON public.sorted_mail FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sorted_mail_insert_own" ON public.sorted_mail FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_sorted_mail_user_id ON public.sorted_mail(user_id);
CREATE INDEX IF NOT EXISTS idx_sorted_mail_pincode ON public.sorted_mail(pincode);
CREATE INDEX IF NOT EXISTS idx_sorted_mail_created_at ON public.sorted_mail(created_at DESC);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert_own" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Create identity_verifications table
CREATE TABLE IF NOT EXISTS public.identity_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_number TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  verification_method TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  metadata JSONB
);

ALTER TABLE public.identity_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "identity_select_own" ON public.identity_verifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "identity_insert_own" ON public.identity_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create sorting_centers table for reference
CREATE TABLE IF NOT EXISTS public.sorting_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode_range_start TEXT,
  pincode_range_end TEXT,
  capacity_per_day INTEGER,
  coordinates POINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample sorting centers
INSERT INTO public.sorting_centers (name, code, city, state, pincode_range_start, pincode_range_end) VALUES
  ('Delhi Regional Sorting Center', 'DL-RSC-001', 'New Delhi', 'Delhi', '110001', '110096'),
  ('Mumbai Regional Sorting Center', 'MH-RSC-001', 'Mumbai', 'Maharashtra', '400001', '400104'),
  ('Bangalore Regional Sorting Center', 'KA-RSC-001', 'Bangalore', 'Karnataka', '560001', '560110'),
  ('Chennai Regional Sorting Center', 'TN-RSC-001', 'Chennai', 'Tamil Nadu', '600001', '600126'),
  ('Kolkata Regional Sorting Center', 'WB-RSC-001', 'Kolkata', 'West Bengal', '700001', '700159'),
  ('Hyderabad Regional Sorting Center', 'TS-RSC-001', 'Hyderabad', 'Telangana', '500001', '500095')
ON CONFLICT (code) DO NOTHING;
