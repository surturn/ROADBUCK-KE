
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
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
        return;
      }

      console.log('Fetched products:', data);
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUploaded = async (productId: string, imageUrl: string) => {
    console.log('Image uploaded for product:', productId, 'URL:', imageUrl);
    
    // Update the local state immediately
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, Image_url: imageUrl }
        : product
    ));
    
    // Update selected product if it's the one being edited
    if (selectedProduct?.id === productId) {
      setSelectedProduct(prev => prev ? { ...prev, Image_url: imageUrl } : null);
    }
    
    // Notify parent component that an image was updated
    if (onImageUpdated) {
      onImageUpdated();
    }
    
    // Refresh products data to make sure we have the latest
    await fetchProducts();
    
    toast.success('Image uploaded and product updated successfully!');
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
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => setSelectedProduct(null)}
            >
              ← Back to Product List
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchProducts}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          
          <ProductImageUpload
            productId={selectedProduct.id}
            productName={selectedProduct.Name || 'Unnamed Product'}
            currentImageUrl={selectedProduct.Image_url || undefined}
            onImageUploaded={(imageUrl) => handleImageUploaded(selectedProduct.id, imageUrl)}
          />
          
          {/* Show current product info with image preview */}
          <Card>
            <CardHeader>
              <CardTitle>Current Product Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                  {selectedProduct.Image_url && selectedProduct.Image_url.startsWith('http') ? (
                    <img 
                      src={selectedProduct.Image_url} 
                      alt={selectedProduct.Name || ''} 
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<div class="text-gray-400 flex items-center justify-center w-full h-full"><svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/></svg></div>';
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{selectedProduct.Name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{selectedProduct.Type}</p>
                  <p className="text-sm text-gray-700">{selectedProduct.Description || 'No description'}</p>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">
                      Image URL: {selectedProduct.Image_url ? (
                        <a href={selectedProduct.Image_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                          {selectedProduct.Image_url}
                        </a>
                      ) : 'No image'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Manage Product Images</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={fetchProducts}
                >
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
                        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                          {product.Image_url && product.Image_url.startsWith('http') ? (
                            <img 
                              src={product.Image_url} 
                              alt={product.Name || ''} 
                              className="w-full h-full object-cover rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.innerHTML = '<div class="text-gray-400 flex items-center justify-center w-full h-full"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/></svg></div>';
                              }}
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{product.Name}</h3>
                          <p className="text-sm text-gray-600">{product.Type}</p>
                          <p className="text-xs text-gray-500">
                            {product.Image_url ? (
                              product.Image_url.startsWith('http') ? (
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
        </>
      )}
    </div>
  );
};
