
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Shield, Headphones, Globe } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Product = Tables<'products'>;

export const Home: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'sw'>('en');

  const handleViewDetails = (product: Product) => {
    toast.info('Product details feature coming soon!');
  };

  const handleLanguageChange = (lang: 'en' | 'sw') => {
    setCurrentLanguage(lang);
    toast.success(`Language changed to ${lang === 'en' ? 'English' : 'Kiswahili'}`);
  };

  const translations = {
    en: {
      hero: {
        title: 'Quality Auto Parts for Kenya',
        subtitle: 'ROADBUCK Kenya provides premium automotive parts and accessories with reliable delivery across the country.',
        cta: 'Shop Now'
      },
      features: [
        {
          icon: Truck,
          title: 'Fast Delivery',
          description: 'Quick delivery across Kenya with trusted logistics partners'
        },
        {
          icon: Shield,
          title: 'Quality Guarantee',
          description: 'All parts come with warranty and quality assurance'
        },
        {
          icon: Headphones,
          title: '24/7 Support',
          description: 'Expert customer support available round the clock'
        },
        {
          icon: Globe,
          title: 'Nationwide Coverage',
          description: 'Serving customers across all counties in Kenya'
        }
      ],
      sections: {
        features: 'Why Choose ROADBUCK Kenya',
        products: 'Featured Products'
      }
    },
    sw: {
      hero: {
        title: 'Vipengee vya Ubora vya Magari kwa Kenya',
        subtitle: 'ROADBUCK Kenya inatoa vipengee vya hali ya juu vya magari na vifaa vya ziada na utoaji wa kuaminika kote nchini.',
        cta: 'Nunua Sasa'
      },
      features: [
        {
          icon: Truck,
          title: 'Utoaji wa Haraka',
          description: 'Utoaji wa haraka kote Kenya na washirika wa uhamiaji wa kuaminika'
        },
        {
          icon: Shield,
          title: 'Dhamana ya Ubora',
          description: 'Vipengee vyote vinakuja na dhamana na uhakikisho wa ubora'
        },
        {
          icon: Headphones,
          title: 'Msaada wa Saa 24/7',
          description: 'Msaada wa mteja wa kitaalamu unapatikana kila wakati'
        },
        {
          icon: Globe,
          title: 'Ufuatiliaji wa Kitaifa',
          description: 'Kutumikia wateja kote kaunti zote za Kenya'
        }
      ],
      sections: {
        features: 'Kwa Nini Uchague ROADBUCK Kenya',
        products: 'Bidhaa Zilizoteuliwa'
      }
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
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {t.hero.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                {t.hero.subtitle}
              </p>
              <Link to="/products">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  {t.hero.cta}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t.sections.features}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {t.features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t.sections.products}
            </h2>
            
            <ProductGrid 
              onViewDetails={handleViewDetails}
              currentLanguage={currentLanguage}
            />
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ROADBUCK Kenya</h3>
              <p className="text-gray-300">
                Your trusted partner for quality automotive parts and accessories across Kenya.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <p className="text-gray-300">Email: info@roadbuck.co.ke</p>
              <p className="text-gray-300">Phone: +254700000000</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Payment Methods</h4>
              <p className="text-gray-300">M-Pesa | Bank Transfer | Cash on Delivery</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              © 2024 ROADBUCK Kenya. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
