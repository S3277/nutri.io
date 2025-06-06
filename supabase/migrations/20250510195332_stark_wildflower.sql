/*
  # Add body analysis table

  1. New Tables
    - `body_analysis`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `body_composition` (jsonb)
      - `recommendations` (jsonb)
      - `areas` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS body_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  body_composition JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  areas JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE body_analysis ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own analysis
CREATE POLICY "Users can view their own analysis"
  ON body_analysis
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy for users to insert their own analysis
CREATE POLICY "Users can insert their own analysis"
  ON body_analysis
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_body_analysis_user_id ON body_analysis(user_id);