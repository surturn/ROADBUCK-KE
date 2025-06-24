
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProductImageUpload } from './ProductImageUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Image as ImageIcon } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Product = Tables<'products'>;

export const ProductImageManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('Name', { ascending: true });

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

  const handleImageUploaded = (productId: string, imageUrl: string) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, Image_url: imageUrl }
        : product
    ));
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter(product =>
    product.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.Type?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="space-y-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedProduct(null)}
          >
            ← Back to Product List
          </Button>
          
          <ProductImageUpload
            productId={selectedProduct.id}
            productName={selectedProduct.Name || 'Unnamed Product'}
            currentImageUrl={selectedProduct.Image_url || undefined}
            onImageUploaded={(imageUrl) => handleImageUploaded(selectedProduct.id, imageUrl)}
          />
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Manage Product Images</CardTitle>
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

                <div className="grid gap-4">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                          {product.Image_url && product.Image_url.startsWith('http') ? (
                            <img 
                              src={product.Image_url} 
                              alt={product.Name || ''} 
                              className="w-full h-full object-cover rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.innerHTML = '<div class="text-gray-400"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/></svg></div>';
                              }}
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{product.Name}</h3>
                          <p className="text-sm text-gray-600">{product.Type}</p>
                          <p className="text-xs text-gray-500">
                            {product.Image_url ? (
                              product.Image_url.startsWith('http') ? 'Has image' : 'Invalid URL'
                            ) : 'No image'}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setSelectedProduct(product)}
                        size="sm"
                      >
                        Upload Image
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
