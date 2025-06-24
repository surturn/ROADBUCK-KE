
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Info, Image } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Product = Tables<'products'>;

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log('Image failed to load:', product.Image_url);
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent) {
      parent.innerHTML = `
        <div class="w-full h-full bg-gray-100 flex items-center justify-center">
          <div class="text-center text-gray-400">
            <svg class="h-12 w-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p class="text-sm">Failed to load image</p>
          </div>
        </div>
      `;
    }
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', product.Image_url);
  };

  // Check if we have a valid image URL - more comprehensive validation
  const hasValidImageUrl = product.Image_url && 
    product.Image_url.trim() !== '' && 
    product.Image_url !== 'null' && 
    product.Image_url !== 'undefined' &&
    (product.Image_url.startsWith('http://') || 
     product.Image_url.startsWith('https://') ||
     product.Image_url.startsWith('/'));

  return (
    <Card className="h-full flex flex-col shadow-sm hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-gray-50">
        {hasValidImageUrl ? (
          <img
            src={product.Image_url}
            alt={product.Name || 'Product image'}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Image className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">No image available</p>
              {product.Image_url && product.Image_url !== 'null' && product.Image_url !== 'undefined' && (
                <p className="text-xs mt-1 px-2 break-all">
                  URL: {product.Image_url.substring(0, 40)}...
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{product.Name}</CardTitle>
          {product.Type && (
            <Badge variant="outline" className="ml-2 flex-shrink-0">
              {product.Type}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 flex-grow">
        {product.Description && (
          <p className="text-sm text-gray-700 line-clamp-4">
            {product.Description}
          </p>
        )}
        
        {!product.Description && (
          <div className="flex items-center justify-center h-20 text-gray-400">
            <div className="text-center">
              <Info className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">No description available</p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onViewDetails?.(product)}
        >
          <Eye className="h-4 w-4 mr-1" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
