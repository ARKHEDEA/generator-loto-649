-- Create table for storing historical lottery draws
CREATE TABLE public.lottery_draws (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  draw_date DATE NOT NULL UNIQUE,
  numbers INTEGER[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public read access for this app)
ALTER TABLE public.lottery_draws ENABLE ROW LEVEL SECURITY;

-- Allow public read access (no auth needed for personal app)
CREATE POLICY "Anyone can read lottery draws" 
ON public.lottery_draws 
FOR SELECT 
USING (true);

-- Allow insert/update from service role (edge functions)
CREATE POLICY "Service role can manage draws" 
ON public.lottery_draws 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create index for faster date queries
CREATE INDEX idx_lottery_draws_date ON public.lottery_draws(draw_date DESC);

-- Create table for AI predictions
CREATE TABLE public.lottery_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  draw_date DATE NOT NULL,
  predicted_numbers INTEGER[] NOT NULL,
  confidence INTEGER NOT NULL DEFAULT 70,
  reasoning TEXT,
  actual_numbers INTEGER[],
  matches INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lottery_predictions ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read predictions" 
ON public.lottery_predictions 
FOR SELECT 
USING (true);

-- Service role can manage
CREATE POLICY "Service role can manage predictions" 
ON public.lottery_predictions 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE INDEX idx_lottery_predictions_date ON public.lottery_predictions(draw_date DESC);

-- Enable pg_cron and pg_net for scheduled updates
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;