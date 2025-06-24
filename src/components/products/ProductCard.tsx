
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Info } from 'lucide-react';
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
  return (
    <Card className="h-full flex flex-col">
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
            <Info className="h-8 w-8 mb-2" />
            <p className="text-sm">No description available</p>
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
