-- Enable RLS on all feedback-related tables
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_rewards ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access for feedback submission
-- Anyone can insert feedback
CREATE POLICY "Anyone can submit feedback"
ON public.feedback
FOR INSERT
WITH CHECK (true);

-- Anyone can view feedback (useful for admin dashboard)
CREATE POLICY "Anyone can view feedback"
ON public.feedback
FOR SELECT
USING (true);

-- Anyone can insert feedback images
CREATE POLICY "Anyone can submit feedback images"
ON public.feedback_images
FOR INSERT
WITH CHECK (true);

-- Anyone can view feedback images
CREATE POLICY "Anyone can view feedback images"
ON public.feedback_images
FOR SELECT
USING (true);

-- Anyone can insert feedback issues
CREATE POLICY "Anyone can submit feedback issues"
ON public.feedback_issues
FOR INSERT
WITH CHECK (true);

-- Anyone can view feedback issues
CREATE POLICY "Anyone can view feedback issues"
ON public.feedback_issues
FOR SELECT
USING (true);

-- Anyone can submit customer rewards
CREATE POLICY "Anyone can submit customer rewards"
ON public.customer_rewards
FOR INSERT
WITH CHECK (true);

-- Anyone can view customer rewards
CREATE POLICY "Anyone can view customer rewards"
ON public.customer_rewards
FOR SELECT
USING (true);

-- Set up storage policies for feedback-images bucket
CREATE POLICY "Anyone can upload feedback images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'feedback-images');

CREATE POLICY "Anyone can view feedback images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'feedback-images');