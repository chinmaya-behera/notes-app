/*
  # Initial Schema Setup for Notes App

  1. New Tables
    - `notes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `content` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `notes` table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  content text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own notes
CREATE POLICY "Users can read own notes" 
  ON notes 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for users to insert their own notes
CREATE POLICY "Users can create notes" 
  ON notes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own notes
CREATE POLICY "Users can update own notes" 
  ON notes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy for users to delete their own notes
CREATE POLICY "Users can delete own notes" 
  ON notes 
  FOR DELETE 
  USING (auth.uid() = user_id);