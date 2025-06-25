import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from './ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Product = Tables<'products'>;

interface ProductGridProps {
  onViewDetails?: (product: Product) => void;
  currentLanguage?: 'en' | 'sw';
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  onViewDetails,
  currentLanguage = 'en'
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const translations = {
    en: {
      searchPlaceholder: 'Search products...',
      noProducts: 'No products found',
      refreshProducts: 'Refresh Products',
      loadingProducts: 'Loading products...'
    },
    sw: {
      searchPlaceholder: 'Tafuta bidhaa...',
      noProducts: 'Hakuna bidhaa zilizopatikana',
      refreshProducts: 'Onyesha Bidhaa Upya',
      loadingProducts: 'Inapakia bidhaa...'
    }
  };

  const t = translations[currentLanguage];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        toast.error(currentLanguage === 'en' ? 'Failed to load products' : 'Imeshindwa kupakia bidhaa');
        return;
      }

      setProducts(data || []);
    } catch (error) {
      toast.error(currentLanguage === 'en' ? 'Failed to load products' : 'Imeshindwa kupakia bidhaa');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('product-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => fetchProducts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.type?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">{t.loadingProducts}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={fetchProducts} 
          variant="outline"
          size="default"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          {t.refreshProducts}
        </Button>
      </div>

      <div className="text-sm text-gray-600">
        {currentLanguage === 'en' ? 
          `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found` :
          `Bidhaa ${filteredProducts.length} zimepatikana`
        }
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t.noProducts}</p>
          <Button onClick={fetchProducts} className="mt-4">
            {t.refreshProducts}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};
