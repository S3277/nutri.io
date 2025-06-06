-- Add membership_type to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS membership_type TEXT DEFAULT 'free' CHECK (membership_type IN ('free', 'pro'));

-- Add analysis_count to track number of analyses for free users
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS analysis_count INTEGER DEFAULT 0;