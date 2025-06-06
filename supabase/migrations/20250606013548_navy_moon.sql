/*
  # Add name field to profiles table

  1. Changes
    - Add name column to profiles table
    - Make it optional to maintain compatibility with existing profiles
*/

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS name TEXT;