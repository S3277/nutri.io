/*
  # Create profiles table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - References auth.users
      - `email` (text, not null)
      - `height` (numeric, not null) - in cm
      - `weight` (numeric, not null) - in kg
      - `age` (integer, not null)
      - `gender` (text, not null)
      - `weeklyActivity` (integer, not null) - days per week
      - `weightGoal` (text, not null) - 'lose', 'maintain', or 'gain'
      - `weightChange` (numeric) - kg per week, null for 'maintain'
      - `dailyCalories` (integer, not null) - calculated target calories
      - `createdAt` (timestamptz, not null)
      - `updatedAt` (timestamptz, not null)
  
  2. Security
    - Enable RLS on `profiles` table
    - Add policy for authenticated users to select their own profile
    - Add policy for authenticated users to insert their own profile
    - Add policy for authenticated users to update their own profile
*/

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  height NUMERIC NOT NULL,
  weight NUMERIC NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  "weeklyActivity" INTEGER NOT NULL,
  "weightGoal" TEXT NOT NULL,
  "weightChange" NUMERIC,
  "dailyCalories" INTEGER NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to select their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy for users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy for users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);