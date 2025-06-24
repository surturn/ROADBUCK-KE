
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2, Check, AlertCircle, ExternalLink } from 'lucide-react';
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
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('Starting file upload for:', file.name, 'Size:', file.size);
    setUploadProgress('Starting upload...');

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
      setUploadProgress('Uploading to storage...');

      // Upload file to Supabase Storage
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

      setUploadProgress('Getting public URL...');

      // Get public URL
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const imageUrl = data.publicUrl;
      console.log('Generated public URL:', imageUrl);

      setUploadProgress('Updating database...');

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
      setUploadProgress('Upload complete!');
      
      toast.success('Image uploaded successfully!');
      onImageUploaded(imageUrl);
      
      // Clear preview after successful upload
      setTimeout(() => {
        setPreviewUrl(null);
        setUploadProgress('');
      }, 2000);

    } catch (error) {
      console.error('Complete error object:', error);
      
      let errorMessage = 'Failed to upload image';
      if (error?.message) {
        errorMessage += `: ${error.message}`;
      }
      
      toast.error(errorMessage);
      setPreviewUrl(null);
      setUploadProgress('');
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Upload Image for {productName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentImageUrl && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium mb-2">Current Image:</p>
              <div className="flex items-center space-x-2">
                <a 
                  href={currentImageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline text-sm flex items-center"
                >
                  View current image <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
              <div className="mt-2 w-32 h-32 bg-white border rounded">
                <img 
                  src={currentImageUrl} 
                  alt="Current product" 
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '';
                    target.alt = 'Failed to load current image';
                    target.className = 'w-full h-full flex items-center justify-center text-gray-400 text-xs';
                  }}
                />
              </div>
            </div>
          )}
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {previewUrl ? (
              <div className="space-y-4">
                <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded" />
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm">{uploadProgress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
                    </div>
                  </div>
                )}
                {!uploading && uploadProgress === 'Upload complete!' && (
                  <div className="flex items-center justify-center text-green-600">
                    <Check className="h-4 w-4 mr-2" />
                    <span className="text-sm">Upload successful!</span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Upload New Product Image</p>
                <p className="text-sm text-gray-600 mb-4">
                  JPG, PNG, WebP, or GIF. Maximum size 5MB.
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Image will be stored securely and a public URL will be generated automatically.
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

          {uploadProgress && !uploading && uploadProgress !== 'Upload complete!' && (
            <div className="flex items-center justify-center text-red-600">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">{uploadProgress}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
