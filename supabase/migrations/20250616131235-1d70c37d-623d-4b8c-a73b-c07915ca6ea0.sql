
-- Check if RLS is enabled and disable it for the feedback table since this is a public feedback form
ALTER TABLE public.feedback DISABLE ROW LEVEL SECURITY;

-- Also disable RLS for related tables to ensure the feedback submission works completely
ALTER TABLE public.feedback_issues DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_images DISABLE ROW LEVEL SECURITY;

-- Optional: If you want to keep RLS enabled but allow public access, you can use these policies instead:
-- (Uncomment the lines below if you prefer to keep RLS enabled with public access)

-- ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public feedback submissions" ON public.feedback FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow public feedback viewing" ON public.feedback FOR SELECT USING (true);

-- ALTER TABLE public.feedback_issues ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public feedback issues" ON public.feedback_issues FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow public feedback issues viewing" ON public.feedback_issues FOR SELECT USING (true);

-- ALTER TABLE public.feedback_images ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public feedback images" ON public.feedback_images FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow public feedback images viewing" ON public.feedback_images FOR SELECT USING (true);
