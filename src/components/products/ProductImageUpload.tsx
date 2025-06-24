
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductImageUploadProps {
  productId: string;
  productName: string;
  currentImageUrl?: string;
  onImageUploaded: (imageUrl: string) => void;
}

export const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  productId,
  productName,
  currentImageUrl,
  onImageUploaded
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('Starting file upload for:', file.name, 'Size:', file.size);

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      console.log('Uploading file to path:', filePath);
      console.log('File details:', { name: fileName, type: file.type, size: file.size });

      // Upload file to Supabase Storage with explicit options
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      console.log('Upload result:', { data: uploadData, error: uploadError });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const imageUrl = data.publicUrl;
      console.log('Generated public URL:', imageUrl);

      // Update product in database
      const { error: updateError } = await supabase
        .from('products')
        .update({ Image_url: imageUrl })
        .eq('id', productId);

      if (updateError) {
        console.error('Database update error:', updateError);
        throw updateError;
      }

      console.log('Successfully updated product with image URL');
      toast.success('Image uploaded successfully!');
      onImageUploaded(imageUrl);
    } catch (error) {
      console.error('Complete error object:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      let errorMessage = 'Failed to upload image';
      if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      
      toast.error(errorMessage);
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Upload Image for {productName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentImageUrl && (
          <div className="text-sm text-gray-600">
            Current image: <a href={currentImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View current image</a>
          </div>
        )}
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {previewUrl ? (
            <div className="space-y-4">
              <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded" />
              {uploading && (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Uploading...</span>
                </div>
              )}
            </div>
          ) : (
            <div>
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Upload Product Image</p>
              <p className="text-sm text-gray-600 mb-4">
                JPG, PNG, or WebP. Max size 5MB.
              </p>
            </div>
          )}
          
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="max-w-xs mx-auto"
          />
        </div>
      </CardContent>
    </Card>
  );
};
