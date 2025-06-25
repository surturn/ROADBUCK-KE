import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProductImageUpload } from './ProductImageUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Product = Tables<'products'>;

interface ProductImageManagerProps {
  onImageUpdated?: () => void;
}

export const ProductImageManager: React.FC<ProductImageManagerProps> = ({ onImageUpdated }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        toast.error('Failed to load products');
        return;
      }

      setProducts(data || []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageUploaded = async (productId: string, imageUrl: string) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId ? { ...product, image_url: imageUrl } : product
      )
    );

    if (selectedProduct?.id === productId) {
      setSelectedProduct(prev => (prev ? { ...prev, image_url: imageUrl } : null));
    }

    if (onImageUpdated) onImageUpdated();
    await fetchProducts();
    toast.success('Image uploaded and saved successfully!');
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {selectedProduct ? (
        <>
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setSelectedProduct(null)}>
              ← Back to Product List
            </Button>
            <Button variant="outline" size="sm" onClick={fetchProducts}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <ProductImageUpload
            productId={selectedProduct.id}
            productName={selectedProduct.name || 'Unnamed Product'}
            currentImageUrl={selectedProduct.image_url || undefined}
            onImageUploaded={(url) => handleImageUploaded(selectedProduct.id, url)}
          />

          <Card>
            <CardHeader>
              <CardTitle>Current Product Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
                  {selectedProduct.image_url?.startsWith('http') ? (
                    <img
                      src={selectedProduct.image_url}
                      alt={selectedProduct.name || ''}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{selectedProduct.name}</h3>
                  <p className="text-sm text-gray-600">{selectedProduct.type}</p>
                  <p className="text-sm text-gray-700">{selectedProduct.description || 'No description'}</p>
                  {selectedProduct.image_url && (
                    <p className="text-xs text-gray-500 mt-2 break-all">
                      <a href={selectedProduct.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {selectedProduct.image_url}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Manage Product Images</CardTitle>
              <Button variant="outline" size="sm" onClick={fetchProducts}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="text-sm text-gray-600">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </div>

              <div className="grid gap-4 max-h-96 overflow-y-auto">
                {filteredProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                        {product.image_url?.startsWith('http') ? (
                          <img
                            src={product.image_url}
                            alt={product.name || ''}
                            className="w-full h-full object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.type}</p>
                        <p className="text-xs text-gray-500">
                          {product.image_url ? (
                            product.image_url.startsWith('http') ? (
                              <span className="text-green-600">✓ Has image</span>
                            ) : (
                              <span className="text-red-600">✗ Invalid URL</span>
                            )
                          ) : (
                            <span className="text-gray-400">No image</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setSelectedProduct(product)}
                      size="sm"
                      variant="outline"
                    >
                      Manage Image
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
