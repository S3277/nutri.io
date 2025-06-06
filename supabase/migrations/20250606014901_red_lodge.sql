/*
  # Add workout entries table

  1. New Tables
    - `workout_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `exercise_name` (text)
      - `sets` (jsonb array of weight and reps)
      - `date` (date)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS workout_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  sets JSONB NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE workout_entries ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own entries
CREATE POLICY "Users can view their own workout entries"
  ON workout_entries
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy for users to insert their own entries
CREATE POLICY "Users can insert their own workout entries"
  ON workout_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy for users to delete their own entries
CREATE POLICY "Users can delete their own workout entries"
  ON workout_entries
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_workout_entries_user_date ON workout_entries(user_id, date);