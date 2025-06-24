
-- Drop all existing policies on storage.objects for the product-images bucket
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete product images" ON storage.objects;

-- Create completely open policies that don't reference any other tables
CREATE POLICY "Allow all operations on product images" ON storage.objects
  FOR ALL USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');
