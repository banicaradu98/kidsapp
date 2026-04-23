-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS contact_messages (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text NOT NULL,
  email      text NOT NULL,
  subject    text NOT NULL,
  message    text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public contact form)
CREATE POLICY "Anyone can insert contact_messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- Only service role can read (admin reads via adminClient which bypasses RLS)
-- No SELECT policy needed — adminClient uses service role key
