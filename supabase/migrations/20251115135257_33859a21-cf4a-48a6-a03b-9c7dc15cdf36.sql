-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-images', 'portfolio-images', true);

-- Storage policies for admin
CREATE POLICY "Admins can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'portfolio-images' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'portfolio-images' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'portfolio-images' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Anyone can view images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'portfolio-images');

-- Create sections table for all content blocks
CREATE TABLE public.sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  title_ru TEXT,
  title_en TEXT,
  description_ru TEXT,
  description_en TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sections"
ON public.sections
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage sections"
ON public.sections
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create portfolio categories table
CREATE TABLE public.portfolio_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ru TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  main_image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.portfolio_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
ON public.portfolio_categories
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage categories"
ON public.portfolio_categories
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create portfolio images table
CREATE TABLE public.portfolio_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.portfolio_categories(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  title_ru TEXT,
  title_en TEXT,
  description_ru TEXT,
  description_en TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view portfolio images"
ON public.portfolio_images
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage portfolio images"
ON public.portfolio_images
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sections_updated_at
BEFORE UPDATE ON public.sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.portfolio_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_portfolio_images_updated_at
BEFORE UPDATE ON public.portfolio_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();