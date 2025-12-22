-- Create thought_untangles table for storing user's untangle sessions
CREATE TABLE public.thought_untangles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  raw_input TEXT NOT NULL,
  analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.thought_untangles ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own untangles" 
ON public.thought_untangles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own untangles" 
ON public.thought_untangles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own untangles" 
ON public.thought_untangles 
FOR DELETE 
USING (auth.uid() = user_id);