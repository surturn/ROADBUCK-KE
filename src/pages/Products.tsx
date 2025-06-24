
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ProductGrid } from '@/components/products/ProductGrid';
import { BulkProductImport } from '@/components/products/BulkProductImport';
import { AddProductForm } from '@/components/products/AddProductForm';
import { ProductImageManager } from '@/components/products/ProductImageManager';
import { Button } from '@/components/ui/button';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { Upload, Grid, Plus, ImageIcon } from 'lucide-react';

type Product = Tables<'products'>;

export const Products: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'sw'>('en');
  const [activeView, setActiveView] = useState<'products' | 'import' | 'add' | 'images'>('products');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleViewDetails = (product: Product) => {
    toast.info('Product details feature coming soon!');
  };

  const handleLanguageChange = (lang: 'en' | 'sw') => {
    setCurrentLanguage(lang);
    toast.success(`Language changed to ${lang === 'en' ? 'English' : 'Kiswahili'}`);
  };

  const handleImageUpdated = () => {
    // Force refresh of the product grid when an image is updated
    setRefreshKey(prev => prev + 1);
  };

  const handleViewChange = (view: 'products' | 'import' | 'add' | 'images') => {
    setActiveView(view);
    // If switching back to products view, refresh the data
    if (view === 'products') {
      setRefreshKey(prev => prev + 1);
    }
  };

  const translations = {
    en: {
      title: 'Our Products',
      subtitle: 'Browse our complete catalog of products',
      importProducts: 'Import Products',
      viewProducts: 'View Products',
      addProduct: 'Add Product',
      manageImages: 'Manage Images'
    },
    sw: {
      title: 'Bidhaa Zetu',
      subtitle: 'Angalia katalogi yetu kamili ya bidhaa',
      importProducts: 'Leta Bidhaa',
      viewProducts: 'Angalia Bidhaa',
      addProduct: 'Ongeza Bidhaa',
      manageImages: 'Simamia Picha'
    }
  };

  const t = translations[currentLanguage];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemCount={0}
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
            
            <div className="flex justify-center gap-4 flex-wrap">
              <Button
                onClick={() => handleViewChange('products')}
                variant={activeView === 'products' ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <Grid className="h-4 w-4" />
                {t.viewProducts}
              </Button>
              <Button
                onClick={() => handleViewChange('add')}
                variant={activeView === 'add' ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {t.addProduct}
              </Button>
              <Button
                onClick={() => handleViewChange('images')}
                variant={activeView === 'images' ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                {t.manageImages}
              </Button>
              <Button
                onClick={() => handleViewChange('import')}
                variant={activeView === 'import' ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {t.importProducts}
              </Button>
            </div>
          </div>
          
          {activeView === 'products' && (
            <ProductGrid 
              key={refreshKey}
              onViewDetails={handleViewDetails}
              currentLanguage={currentLanguage}
            />
          )}
          {activeView === 'add' && <AddProductForm />}
          {activeView === 'images' && (
            <ProductImageManager onImageUpdated={handleImageUpdated} />
          )}
          {activeView === 'import' && <BulkProductImport />}
        </div>
      </main>
    </div>
  );
};
