-- Drop existing table if it exists
DROP TABLE IF EXISTS profiles CASCADE;

-- Recreate profiles table with correct schema
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  height NUMERIC CHECK (height >= 100 AND height <= 250),
  weight NUMERIC CHECK (weight >= 30 AND weight <= 300),
  age INTEGER CHECK (age >= 18 AND age <= 100),
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  weekly_activity INTEGER CHECK (weekly_activity >= 0 AND weekly_activity <= 7),
  goal TEXT CHECK (goal IN ('lose', 'maintain', 'gain')),
  weight_change NUMERIC,
  target_calories INTEGER CHECK (target_calories >= 500 AND target_calories <= 10000),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);