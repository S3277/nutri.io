/*
  # Add saved workouts table

  1. New Tables
    - `saved_workouts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `name` (text)
      - `date` (date)
      - `total_weight` (numeric)
      - `total_xp` (numeric)
      - `entries` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `saved_workouts` table
    - Add policies for authenticated users to:
      - Insert their own workouts
      - View their own workouts
      - Delete their own workouts
*/

CREATE TABLE IF NOT EXISTS saved_workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  total_weight numeric NOT NULL,
  total_xp numeric NOT NULL,
  entries jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE saved_workouts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can insert their own workouts"
  ON saved_workouts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own workouts"
  ON saved_workouts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts"
  ON saved_workouts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_saved_workouts_user_id ON saved_workouts(user_id);
CREATE INDEX idx_saved_workouts_date ON saved_workouts(date);