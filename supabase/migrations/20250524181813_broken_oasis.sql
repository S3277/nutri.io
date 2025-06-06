/*
  # Add workout schedule table

  1. New Tables
    - `workout_schedule`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `exercise_name` (text)
      - `sets` (integer)
      - `reps` (text)
      - `day_of_week` (integer, 0-6)
      - `week_number` (integer, 1-4)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
    - Create indexes for performance
*/

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

ALTER TABLE workout_schedule ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own schedule
CREATE POLICY "Users can view their own schedule"
  ON workout_schedule
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy for users to insert their own schedule
CREATE POLICY "Users can insert their own schedule"
  ON workout_schedule
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy for users to update their own schedule
CREATE POLICY "Users can update their own schedule"
  ON workout_schedule
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Policy for users to delete their own schedule
CREATE POLICY "Users can delete their own schedule"
  ON workout_schedule
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_workout_schedule_user_id ON workout_schedule(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_schedule_week_day ON workout_schedule(user_id, week_number, day_of_week);