-- Add onboarding columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS goals text[] DEFAULT '{}';

-- Update existing profiles to mark as completed (they're existing users)
UPDATE public.profiles SET onboarding_completed = true WHERE onboarding_completed IS NULL;