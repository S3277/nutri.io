/*
  # Create complete database schema
  
  1. Tables
    - profiles
    - food_entries
    - body_analysis
    - workout_schedule
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users
    
  3. Performance
    - Create indexes
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
    -- Profiles policies
    DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
    
    -- Food entries policies
    DROP POLICY IF EXISTS "Users can view their own food entries" ON food_entries;
    DROP POLICY IF EXISTS "Users can insert their own food entries" ON food_entries;
    DROP POLICY IF EXISTS "Users can update their own food entries" ON food_entries;
    DROP POLICY IF EXISTS "Users can delete their own food entries" ON food_entries;
    
    -- Body analysis policies
    DROP POLICY IF EXISTS "Users can view their own analysis" ON body_analysis;
    DROP POLICY IF EXISTS "Users can insert their own analysis" ON body_analysis;
    
    -- Workout schedule policies
    DROP POLICY IF EXISTS "Users can view their own schedule" ON workout_schedule;
    DROP POLICY IF EXISTS "Users can insert their own schedule" ON workout_schedule;
    DROP POLICY IF EXISTS "Users can update their own schedule" ON workout_schedule;
    DROP POLICY IF EXISTS "Users can delete their own schedule" ON workout_schedule;
END $$;

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
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

-- Food entries table
CREATE TABLE IF NOT EXISTS food_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein NUMERIC NOT NULL,
  carbs NUMERIC NOT NULL,
  fat NUMERIC NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Body analysis table
CREATE TABLE IF NOT EXISTS body_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  body_composition JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  areas JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Workout schedule table
CREATE TABLE IF NOT EXISTS workout_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  sets INTEGER NOT NULL,
  reps TEXT NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 4),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_schedule ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Food entries policies
CREATE POLICY "Users can view their own food entries"
  ON food_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own food entries"
  ON food_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own food entries"
  ON food_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own food entries"
  ON food_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Body analysis policies
CREATE POLICY "Users can view their own analysis"
  ON body_analysis FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analysis"
  ON body_analysis FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Workout schedule policies
CREATE POLICY "Users can view their own schedule"
  ON workout_schedule FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own schedule"
  ON workout_schedule FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedule"
  ON workout_schedule FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own schedule"
  ON workout_schedule FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_food_entries_user_date ON food_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_food_entries_meal_type ON food_entries(meal_type);
CREATE INDEX IF NOT EXISTS idx_body_analysis_user_id ON body_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_schedule_user_id ON workout_schedule(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_schedule_week_day ON workout_schedule(user_id, week_number, day_of_week);