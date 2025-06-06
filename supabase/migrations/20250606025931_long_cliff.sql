/*
  # Add level tracking to workout entries

  1. Changes
    - Add user_level and user_xp columns to saved_workouts table
    - These columns will store the user's current level and XP when saving a workout
    - This ensures historical workouts show the correct level progression

  2. Security
    - Maintain existing RLS policies
*/

DO $$ 
BEGIN
  -- Add user_level column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'saved_workouts' 
    AND column_name = 'user_level'
  ) THEN
    ALTER TABLE saved_workouts 
    ADD COLUMN user_level INTEGER NOT NULL DEFAULT 1;
  END IF;

  -- Add user_xp column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'saved_workouts' 
    AND column_name = 'user_xp'
  ) THEN
    ALTER TABLE saved_workouts 
    ADD COLUMN user_xp NUMERIC NOT NULL DEFAULT 0;
  END IF;
END $$;