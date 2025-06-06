/*
  # Add saved workouts table

  1. New Tables
    - `saved_workouts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `date` (date)
      - `total_weight` (numeric)
      - `total_xp` (numeric)
      - `entries` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS saved_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  total_weight NUMERIC NOT NULL,
  total_xp NUMERIC NOT NULL,
  entries JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE saved_workouts ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own saved workouts
CREATE POLICY "Users can view their own saved workouts"
  ON saved_workouts
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy for users to insert their own saved workouts
CREATE POLICY "Users can insert their own saved workouts"
  ON saved_workouts
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_saved_workouts_user_date ON saved_workouts(user_id, date);