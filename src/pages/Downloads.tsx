
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { DocumentsList } from '@/components/documents/DocumentsList';
import { AdminDocumentManager } from '@/components/documents/AdminDocumentManager';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { auth } from '@/lib/auth';
import { Download, FileText } from 'lucide-react';

export const Downloads: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'sw'>('en');
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if current user is admin
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const user = await auth.getCurrentUser();
      if (user) {
        const profile = await auth.getProfile(user.id);
        setIsAdmin(profile?.role === 'admin');
        return { user, profile };
      }
      return null;
    }
  });

  const handleLanguageChange = (lang: 'en' | 'sw') => {
    setCurrentLanguage(lang);
  };

  const translations = {
    en: {
      title: 'Downloads',
      subtitle: 'Access manuals, documentation, and resources',
      adminPanel: 'Admin Document Management'
    },
    sw: {
      title: 'Mipakuzi',
      subtitle: 'Pata miongozo, nyaraka, na rasilimali',
      adminPanel: 'Usimamizi wa Nyaraka wa Msimamizi'
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
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Download className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t.title}
            </h1>
            <p className="text-xl text-gray-600">
              {t.subtitle}
            </p>
          </div>

          {/* Admin Panel - Only visible to admins */}
          {isAdmin && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-2" />
                {t.adminPanel}
              </h2>
              <AdminDocumentManager currentLanguage={currentLanguage} />
            </div>
          )}

          {/* Documents List */}
          <DocumentsList currentLanguage={currentLanguage} />
        </div>
      </main>
    </div>
  );
};
