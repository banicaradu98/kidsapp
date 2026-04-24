-- Rulează în Supabase SQL Editor
-- Adaugă coloanele noi în tabela profiles

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS newsletter_consent BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS newsletter_consent_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS paused_at TIMESTAMPTZ;

-- Constraint pentru account_status
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_account_status_check;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_account_status_check
  CHECK (account_status IN ('active', 'paused', 'deleted'));
