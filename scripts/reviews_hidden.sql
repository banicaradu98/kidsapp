-- Rulează în Supabase SQL Editor
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false;
