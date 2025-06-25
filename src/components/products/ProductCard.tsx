import React, { useState } from 'react';
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
  const [hasImageError, setHasImageError] = useState(false);

  const handleImageError = () => {
    setHasImageError(true);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', product.Image_url);
  };

  const hasValidImageUrl = product.Image_url &&
    product.Image_url.trim() !== '' &&
    product.Image_url !== 'null' &&
    product.Image_url !== 'undefined' &&
    (product.Image_url.startsWith('http://') ||
      product.Image_url.startsWith('https://') ||
      product.Image_url.startsWith('/'));

  return (
    <Card className="h-full flex flex-col shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-gray-50">
        {hasValidImageUrl && !hasImageError ? (
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
              <p className="text-sm">
                {hasImageError ? 'Image not available' : 'No image provided'}
              </p>
              {product.Image_url && !hasValidImageUrl && (
                <p className="text-xs mt-1 px-2 break-all opacity-60" title={product.Image_url}>
                  Invalid URL
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
        {product.Description ? (
          <p className="text-sm text-gray-700 line-clamp-4">
            {product.Description}
          </p>
        ) : (
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