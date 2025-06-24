
-- First, let's see what columns actually exist and work with those
-- Add the 'type' column since it doesn't exist yet
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS type TEXT;

-- The products table seems to have different column names than expected
-- Let's work with the existing structure and rename/modify as needed
-- Based on the schema, the table should have these columns that we want to keep:
-- We'll assume 'name' might be missing, so let's add it if it doesn't exist
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS name TEXT;

-- Drop all the columns we don't need (using IF EXISTS to avoid errors)
ALTER TABLE public.products DROP COLUMN IF EXISTS price;
ALTER TABLE public.products DROP COLUMN IF EXISTS category;
ALTER TABLE public.products DROP COLUMN IF EXISTS features;
ALTER TABLE public.products DROP COLUMN IF EXISTS image_url;
ALTER TABLE public.products DROP COLUMN IF EXISTS is_active;
ALTER TABLE public.products DROP COLUMN IF EXISTS specifications;
ALTER TABLE public.products DROP COLUMN IF EXISTS created_at;
ALTER TABLE public.products DROP COLUMN IF EXISTS updated_at;

-- Make sure our required columns have proper constraints
ALTER TABLE public.products ALTER COLUMN name SET NOT NULL;
ALTER TABLE public.products ALTER COLUMN description DROP NOT NULL;
ALTER TABLE public.products ALTER COLUMN type DROP NOT NULL;
