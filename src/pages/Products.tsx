
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ProductGrid } from '@/components/products/ProductGrid';
import { BulkProductImport } from '@/components/products/BulkProductImport';
import { Button } from '@/components/ui/button';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { Upload, Grid } from 'lucide-react';

type Product = Tables<'products'>;

export const Products: React.FC = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'sw'>('en');
  const [showImport, setShowImport] = useState(false);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => [...prev, product]);
    toast.success(`${product.name} added to cart`);
  };

  const handleViewDetails = (product: Product) => {
    toast.info('Product details feature coming soon!');
  };

  const handleLanguageChange = (lang: 'en' | 'sw') => {
    setCurrentLanguage(lang);
    toast.success(`Language changed to ${lang === 'en' ? 'English' : 'Kiswahili'}`);
  };

  const translations = {
    en: {
      title: 'Our Products',
      subtitle: 'Browse our complete catalog of quality automotive parts',
      importProducts: 'Import Products',
      viewProducts: 'View Products'
    },
    sw: {
      title: 'Bidhaa Zetu',
      subtitle: 'Angalia katalogi yetu kamili ya vipengee vya ubora vya magari',
      importProducts: 'Leta Bidhaa',
      viewProducts: 'Angalia Bidhaa'
    }
  };

  const t = translations[currentLanguage];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemCount={cartItems.length}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {t.subtitle}
            </p>
            
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setShowImport(!showImport)}
                variant={showImport ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {t.importProducts}
              </Button>
              <Button
                onClick={() => setShowImport(false)}
                variant={!showImport ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <Grid className="h-4 w-4" />
                {t.viewProducts}
              </Button>
            </div>
          </div>
          
          {showImport ? (
            <BulkProductImport />
          ) : (
            <ProductGrid 
              onAddToCart={handleAddToCart}
              onViewDetails={handleViewDetails}
              currentLanguage={currentLanguage}
            />
          )}
        </div>
      </main>
    </div>
  );
};
