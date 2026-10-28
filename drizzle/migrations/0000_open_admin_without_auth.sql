GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_categories, public.portfolio_images, public.sections TO anon, authenticated;
CREATE POLICY "Public can manage categories" ON public.portfolio_categories FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can manage images" ON public.portfolio_images FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can manage sections" ON public.sections FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can upload portfolio media" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'portfolio-images');
CREATE POLICY "Public can update portfolio media" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'portfolio-images');
CREATE POLICY "Public can delete portfolio media" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'portfolio-images');