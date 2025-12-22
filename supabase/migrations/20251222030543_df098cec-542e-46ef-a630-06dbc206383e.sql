-- Add reminder_preferences column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS reminder_preferences jsonb DEFAULT '{"enabled": false, "time": "09:00", "timezone": "UTC"}'::jsonb;