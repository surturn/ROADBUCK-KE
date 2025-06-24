
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Product = Tables<'products'>;

export const Products: React.FC = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'sw'>('en');

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
      subtitle: 'Browse our complete catalog of quality automotive parts'
    },
    sw: {
      title: 'Bidhaa Zetu',
      subtitle: 'Angalia katalogi yetu kamili ya vipengee vya ubora vya magari'
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t.title}
            </h1>
            <p className="text-xl text-gray-600">
              {t.subtitle}
            </p>
          </div>
          
          <ProductGrid 
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
          />
        </div>
      </main>
    </div>
  );
};
