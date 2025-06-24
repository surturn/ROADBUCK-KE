
-- First, let's drop the existing policies that might be causing issues
DROP POLICY IF EXISTS "Everyone can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;

-- Create simpler, more permissive policies for the product-images bucket
-- Allow public access to view product images
CREATE POLICY "Public can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Allow anyone to upload product images (you can make this more restrictive later)
CREATE POLICY "Anyone can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');

-- Allow anyone to update product images
CREATE POLICY "Anyone can update product images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images');

-- Allow anyone to delete product images
CREATE POLICY "Anyone can delete product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images');
