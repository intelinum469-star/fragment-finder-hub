-- Add media_type column to portfolio_images table
ALTER TABLE public.portfolio_images 
ADD COLUMN media_type text DEFAULT 'image' CHECK (media_type IN ('image', 'video'));

-- Update existing records to have 'image' type
UPDATE public.portfolio_images 
SET media_type = 'image' 
WHERE media_type IS NULL;