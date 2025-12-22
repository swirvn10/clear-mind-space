-- Add streak tracking columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS streak_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_active_date date;

-- Create a function to update user streak
CREATE OR REPLACE FUNCTION public.update_user_streak(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_streak integer;
  last_date date;
  today date := CURRENT_DATE;
BEGIN
  -- Get current streak info
  SELECT streak_count, last_active_date INTO current_streak, last_date
  FROM profiles WHERE id = p_user_id;
  
  -- If no record or null values, initialize
  IF current_streak IS NULL THEN
    current_streak := 0;
  END IF;
  
  -- Check if already active today
  IF last_date = today THEN
    RETURN current_streak;
  END IF;
  
  -- Check if streak continues (yesterday) or resets
  IF last_date = today - 1 THEN
    current_streak := current_streak + 1;
  ELSE
    current_streak := 1;
  END IF;
  
  -- Update the profile
  UPDATE profiles 
  SET streak_count = current_streak, 
      last_active_date = today,
      updated_at = now()
  WHERE id = p_user_id;
  
  RETURN current_streak;
END;
$$;