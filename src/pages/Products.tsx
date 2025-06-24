
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ProductGrid } from '@/components/products/ProductGrid';
import { BulkProductImport } from '@/components/products/BulkProductImport';
import { AddProductForm } from '@/components/products/AddProductForm';
import { Button } from '@/components/ui/button';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { Upload, Grid, Plus } from 'lucide-react';

type Product = Tables<'products'>;

export const Products: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'sw'>('en');
  const [activeView, setActiveView] = useState<'products' | 'import' | 'add'>('products');

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
      subtitle: 'Browse our complete catalog of products',
      importProducts: 'Import Products',
      viewProducts: 'View Products',
      addProduct: 'Add Product'
    },
    sw: {
      title: 'Bidhaa Zetu',
      subtitle: 'Angalia katalogi yetu kamili ya bidhaa',
      importProducts: 'Leta Bidhaa',
      viewProducts: 'Angalia Bidhaa',
      addProduct: 'Ongeza Bidhaa'
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
                onClick={() => setActiveView('products')}
                variant={activeView === 'products' ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <Grid className="h-4 w-4" />
                {t.viewProducts}
              </Button>
              <Button
                onClick={() => setActiveView('add')}
                variant={activeView === 'add' ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {t.addProduct}
              </Button>
              <Button
                onClick={() => setActiveView('import')}
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
              onViewDetails={handleViewDetails}
              currentLanguage={currentLanguage}
            />
          )}
          {activeView === 'add' && <AddProductForm />}
          {activeView === 'import' && <BulkProductImport />}
        </div>
      </main>
    </div>
  );
};
