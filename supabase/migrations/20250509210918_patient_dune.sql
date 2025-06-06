/*
  # Smart Calorie Tracker Schema

  1. New Tables
    - profiles
      - User profile information including physical stats and goals
      - References auth.users for authentication
    - food_entries
      - Daily food entry logs with nutritional information
      - References profiles for user association

  2. Security
    - RLS enabled on both tables
    - Policies for user-specific CRUD operations
    
  3. Performance
    - Indexes on frequently queried columns
    - Optimized data types for storage
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text,
  height numeric,
  weight numeric,
  age integer,
  gender text,
  activity_level text,
  goal text,
  body_fat_percentage numeric,
  target_calories integer,
  current_calories integer,
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz DEFAULT timezone('utc'::text, now()),
  free_analysis_used boolean DEFAULT false,
  name text,
  weekly_activity integer,
  weight_change numeric
);

-- Create food entries table
CREATE TABLE IF NOT EXISTS food_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  calories integer NOT NULL,
  protein numeric NOT NULL,
  carbs numeric NOT NULL,
  fat numeric NOT NULL,
  meal_type text NOT NULL,
  date date DEFAULT CURRENT_DATE,
  image_url text,
  created_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Profiles policies
  DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  
  -- Food entries policies
  DROP POLICY IF EXISTS "Users can view own food entries" ON food_entries;
  DROP POLICY IF EXISTS "Users can insert own food entries" ON food_entries;
  DROP POLICY IF EXISTS "Users can update own food entries" ON food_entries;
  DROP POLICY IF EXISTS "Users can delete own food entries" ON food_entries;
END $$;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Food entries policies
CREATE POLICY "Users can view own food entries"
  ON food_entries
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own food entries"
  ON food_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own food entries"
  ON food_entries
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own food entries"
  ON food_entries
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_food_entries_user_id ON food_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_food_entries_date ON food_entries(date);
CREATE INDEX IF NOT EXISTS idx_food_entries_meal_type ON food_entries(meal_type);