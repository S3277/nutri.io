/*
  # Add target_calories column to profiles table

  1. Changes
    - Add target_calories column to profiles table
    - Ensure column naming consistency
    - Add check constraint for valid calorie values

  2. Notes
    - Using IF NOT EXISTS to prevent errors if column already exists
    - Adding check constraint to ensure valid calorie values (between 500 and 10000)
*/

DO $$ 
BEGIN
  -- Add target_calories column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'target_calories'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN target_calories INTEGER;

    -- Add check constraint for valid calorie values
    ALTER TABLE profiles 
    ADD CONSTRAINT profiles_target_calories_check 
    CHECK (target_calories >= 500 AND target_calories <= 10000);
  END IF;
END $$;