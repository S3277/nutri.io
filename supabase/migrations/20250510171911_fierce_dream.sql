/*
  # Create food entries table

  1. New Tables
    - `food_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, not null) - References profiles.id
      - `name` (text, not null) - Name of the food
      - `calories` (integer, not null)
      - `protein` (numeric, not null) - in grams
      - `carbs` (numeric, not null) - in grams
      - `fat` (numeric, not null) - in grams
      - `meal_type` (text, not null) - 'breakfast', 'lunch', 'dinner', or 'snack'
      - `date` (date, not null) - Date of consumption
      - `image_url` (text) - Optional URL to food image
      - `created_at` (timestamptz, not null)
  
  2. Security
    - Enable RLS on `food_entries` table
    - Add policy for authenticated users to select their own entries
    - Add policy for authenticated users to insert their own entries
    - Add policy for authenticated users to delete their own entries
*/

CREATE TABLE IF NOT EXISTS food_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein NUMERIC NOT NULL,
  carbs NUMERIC NOT NULL,
  fat NUMERIC NOT NULL,
  meal_type TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for faster queries by user_id and date
CREATE INDEX IF NOT EXISTS food_entries_user_date_idx ON food_entries (user_id, date);

ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;

-- Policy for users to select their own food entries
CREATE POLICY "Users can view their own food entries"
  ON food_entries
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy for users to insert their own food entries
CREATE POLICY "Users can insert their own food entries"
  ON food_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy for users to delete their own food entries
CREATE POLICY "Users can delete their own food entries"
  ON food_entries
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());