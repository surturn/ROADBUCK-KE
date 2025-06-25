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

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadProgress('Uploading image...');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase
        .storage
        .from('product-images')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      if (!imageUrl) throw new Error('Failed to get public URL');

      setUploadProgress('Saving to database...');

      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: imageUrl })  // ← FIELD FIXED HERE
        .eq('id', productId);

      if (updateError) throw updateError;

      setUploadProgress('Upload complete!');
      toast.success('Image uploaded and saved successfully!');
      onImageUploaded(imageUrl);

      setTimeout(() => {
        setPreviewUrl(null);
        setUploadProgress('');
      }, 2000);
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
      setUploadProgress('');
      setPreviewUrl(null);
    } finally {
      setUploading(false);
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
              <a
                href={currentImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm flex items-center mb-2"
              >
                View current image <ExternalLink className="h-3 w-3 ml-1" />
              </a>
              <div className="w-32 h-32 bg-white border rounded">
                <img
                  src={currentImageUrl}
                  alt="Current product"
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML =
                      '<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs">Failed to load</div>';
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
                  <>
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm">{uploadProgress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
                    </div>
                  </>
                )}
                {!uploading && uploadProgress === 'Upload complete!' && (
                  <div className="flex items-center justify-center text-green-600">
                    <Check className="h-4 w-4 mr-2" />
                    <span className="text-sm">Upload successful!</span>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Upload Product Image</p>
                <p className="text-sm text-gray-600 mb-4">JPG, PNG, WebP, or GIF. Max 5MB.</p>
              </>
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
