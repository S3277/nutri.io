/*
  # Update workout entries table

  1. Changes
    - Add type column with check constraint
    - Set default value to 'strength' for backward compatibility
    - Add check constraint to ensure valid types

  2. Notes
    - Uses IF NOT EXISTS to prevent errors if column already exists
    - Maintains existing data integrity
*/

DO $$ 
BEGIN
  -- Add type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'workout_entries' 
    AND column_name = 'type'
  ) THEN
    ALTER TABLE workout_entries 
    ADD COLUMN type TEXT NOT NULL DEFAULT 'strength'
    CHECK (type IN ('strength', 'cardio'));
  END IF;
END $$;