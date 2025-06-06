/*
  # Add type column to workout_entries table

  1. Changes
    - Add 'type' column to workout_entries table with type 'text'
    - Set default value to 'strength' for backward compatibility
    - Add check constraint to ensure valid types
    - Make column non-nullable
    
  2. Security
    - No changes to RLS policies needed
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'workout_entries' 
    AND column_name = 'type'
  ) THEN
    ALTER TABLE workout_entries 
    ADD COLUMN type text NOT NULL DEFAULT 'strength'
    CHECK (type IN ('strength', 'cardio'));
  END IF;
END $$;