-- ============================================================
-- Public Share View: RLS Policies for Anonymous Read Access
-- ============================================================
-- These policies allow the Supabase `anon` role (used by the
-- NEXT_PUBLIC_SUPABASE_ANON_KEY) to SELECT rows from the
-- `lessons` and `vocabularies` tables.
--
-- This is REQUIRED for the /s/[id] public share view to work
-- when using the anon key instead of a service role key.
--
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Allow anonymous users to read any lesson (for share view)
CREATE POLICY "Allow anon select on lessons"
  ON public.lessons
  FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous users to read vocabularies (for the join in share view)
CREATE POLICY "Allow anon select on vocabularies"
  ON public.vocabularies
  FOR SELECT
  TO anon
  USING (true);
