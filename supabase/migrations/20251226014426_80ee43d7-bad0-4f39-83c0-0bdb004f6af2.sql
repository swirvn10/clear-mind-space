-- Create subscriptions table for tracking user tiers
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'premium')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trialing')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create usage tracking table
CREATE TABLE public.usage_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  chat_count INTEGER NOT NULL DEFAULT 0,
  journal_count INTEGER NOT NULL DEFAULT 0,
  untangle_count INTEGER NOT NULL DEFAULT 0,
  voice_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- Subscription policies
CREATE POLICY "Users can view their own subscription"
ON public.subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
ON public.subscriptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
ON public.subscriptions FOR UPDATE
USING (auth.uid() = user_id);

-- Usage tracking policies
CREATE POLICY "Users can view their own usage"
ON public.usage_tracking FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage"
ON public.usage_tracking FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage"
ON public.usage_tracking FOR UPDATE
USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_usage_tracking_updated_at
BEFORE UPDATE ON public.usage_tracking
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to get or create today's usage record
CREATE OR REPLACE FUNCTION public.get_or_create_daily_usage(p_user_id uuid)
RETURNS public.usage_tracking
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  usage_record public.usage_tracking;
BEGIN
  SELECT * INTO usage_record
  FROM public.usage_tracking
  WHERE user_id = p_user_id AND date = CURRENT_DATE;
  
  IF NOT FOUND THEN
    INSERT INTO public.usage_tracking (user_id, date)
    VALUES (p_user_id, CURRENT_DATE)
    RETURNING * INTO usage_record;
  END IF;
  
  RETURN usage_record;
END;
$$;

-- Function to increment usage
CREATE OR REPLACE FUNCTION public.increment_usage(
  p_user_id uuid,
  p_feature text,
  p_amount integer DEFAULT 1
)
RETURNS public.usage_tracking
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  usage_record public.usage_tracking;
BEGIN
  -- Ensure record exists
  PERFORM public.get_or_create_daily_usage(p_user_id);
  
  -- Update the appropriate counter
  IF p_feature = 'chat' THEN
    UPDATE public.usage_tracking
    SET chat_count = chat_count + p_amount, updated_at = now()
    WHERE user_id = p_user_id AND date = CURRENT_DATE
    RETURNING * INTO usage_record;
  ELSIF p_feature = 'journal' THEN
    UPDATE public.usage_tracking
    SET journal_count = journal_count + p_amount, updated_at = now()
    WHERE user_id = p_user_id AND date = CURRENT_DATE
    RETURNING * INTO usage_record;
  ELSIF p_feature = 'untangle' THEN
    UPDATE public.usage_tracking
    SET untangle_count = untangle_count + p_amount, updated_at = now()
    WHERE user_id = p_user_id AND date = CURRENT_DATE
    RETURNING * INTO usage_record;
  ELSIF p_feature = 'voice' THEN
    UPDATE public.usage_tracking
    SET voice_seconds = voice_seconds + p_amount, updated_at = now()
    WHERE user_id = p_user_id AND date = CURRENT_DATE
    RETURNING * INTO usage_record;
  END IF;
  
  RETURN usage_record;
END;
$$;