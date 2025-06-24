
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Product = Tables<'products'>;

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  currency?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-4">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-48 object-cover rounded-md mb-2"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
          <Badge variant={product.is_active ? 'default' : 'secondary'}>
            {product.is_active ? 'Available' : 'Out of Stock'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-sm text-gray-600 mb-2">{product.category}</p>
        {product.description && (
          <p className="text-sm text-gray-700 line-clamp-3 mb-3">
            {product.description}
          </p>
        )}
        
        {product.features && product.features.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-600 mb-1">Features:</p>
            <div className="flex flex-wrap gap-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {product.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onViewDetails?.(product)}
        >
          <Eye className="h-4 w-4 mr-1" />
          Details
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={() => onAddToCart?.(product)}
          disabled={!product.is_active}
        >
          <ShoppingCart className="h-4 w-4 mr-1" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
