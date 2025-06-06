/*
  # Update profiles table constraints

  1. Changes
    - Add missing columns
    - Update constraints
    - Fix column types
    - Add check constraints for valid values

  2. Security
    - Maintain existing RLS policies
*/

-- Add check constraints for gender and goal
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_gender_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_gender_check 
  CHECK (gender = ANY (ARRAY['male'::text, 'female'::text, 'other'::text]));

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_weight_goal_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_weight_goal_check 
  CHECK (goal = ANY (ARRAY['lose'::text, 'maintain'::text, 'gain'::text]));

-- Update column constraints
ALTER TABLE profiles 
  ALTER COLUMN height TYPE numeric USING height::numeric,
  ALTER COLUMN weight TYPE numeric USING weight::numeric,
  ALTER COLUMN age TYPE integer USING age::integer,
  ALTER COLUMN weekly_activity TYPE integer USING weekly_activity::integer,
  ALTER COLUMN target_calories TYPE integer USING target_calories::integer;

-- Add check constraints for numeric values
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_height_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_height_check 
  CHECK (height >= 100 AND height <= 250);

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_weight_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_weight_check 
  CHECK (weight >= 30 AND weight <= 300);

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_age_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_age_check 
  CHECK (age >= 18 AND age <= 100);

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_weekly_activity_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_weekly_activity_check 
  CHECK (weekly_activity >= 0 AND weekly_activity <= 7);

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_target_calories_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_target_calories_check 
  CHECK (target_calories >= 500 AND target_calories <= 10000);

-- Add check constraint for meal types in food_entries
ALTER TABLE food_entries DROP CONSTRAINT IF EXISTS food_entries_meal_type_check;
ALTER TABLE food_entries ADD CONSTRAINT food_entries_meal_type_check 
  CHECK (meal_type = ANY (ARRAY['breakfast'::text, 'lunch'::text, 'dinner'::text, 'snack'::text]));