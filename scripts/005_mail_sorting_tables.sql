-- Mail Items Table for AI Sorting System
CREATE TABLE IF NOT EXISTS mail_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Address Information
  recipient_name TEXT NOT NULL,
  full_address TEXT NOT NULL,
  pincode TEXT NOT NULL,
  city TEXT,
  state TEXT,
  landmark TEXT,
  
  -- Classification
  is_handwritten BOOLEAN DEFAULT false,
  sorting_center TEXT NOT NULL,
  route_code TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('express', 'standard', 'economy')) DEFAULT 'standard',
  zone TEXT CHECK (zone IN ('Metro', 'Urban', 'Rural', 'Remote')) DEFAULT 'Urban',
  
  -- OCR & Processing Metrics
  ocr_text TEXT,
  ocr_source TEXT,
  confidence_score DECIMAL(3,2) DEFAULT 0.00,
  processing_time_ms INTEGER,
  
  -- Status Tracking
  status TEXT CHECK (status IN ('pending', 'sorted', 'dispatched', 'delivered')) DEFAULT 'pending',
  tracking_number TEXT UNIQUE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_mail_items_user_id ON mail_items(user_id);
CREATE INDEX IF NOT EXISTS idx_mail_items_pincode ON mail_items(pincode);
CREATE INDEX IF NOT EXISTS idx_mail_items_status ON mail_items(status);
CREATE INDEX IF NOT EXISTS idx_mail_items_created_at ON mail_items(created_at DESC);

-- RLS Policies
ALTER TABLE mail_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mail items"
  ON mail_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mail items"
  ON mail_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mail items"
  ON mail_items FOR UPDATE
  USING (auth.uid() = user_id);
