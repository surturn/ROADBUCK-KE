
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Shield, Users, Globe } from 'lucide-react';

export const About: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'sw'>('en');

  const handleLanguageChange = (lang: 'en' | 'sw') => {
    setCurrentLanguage(lang);
  };

  const translations = {
    en: {
      title: 'About ROADBUCK Kenya',
      subtitle: 'Your trusted partner for automotive excellence in Kenya',
      story: {
        title: 'Our Story',
        content: 'ROADBUCK Kenya was founded with a mission to provide high-quality automotive parts and accessories to vehicle owners across Kenya. We understand the importance of reliable transportation in Kenya\'s growing economy, and we\'re committed to keeping your vehicles running smoothly.'
      },
      mission: {
        title: 'Our Mission',
        content: 'To be Kenya\'s leading supplier of quality automotive parts, providing exceptional service and value to our customers while supporting the growth of Kenya\'s automotive industry.'
      },
      values: [
        {
          icon: Shield,
          title: 'Quality Assurance',
          description: 'We source only genuine and high-quality parts from trusted manufacturers worldwide.'
        },
        {
          icon: Truck,
          title: 'Reliable Delivery',
          description: 'Fast and secure delivery across all 47 counties in Kenya through our logistics network.'
        },
        {
          icon: Users,
          title: 'Customer First',
          description: 'Our experienced team provides expert advice and personalized service to every customer.'
        },
        {
          icon: Globe,
          title: 'Local Impact',
          description: 'Supporting Kenya\'s automotive industry and contributing to economic growth nationwide.'
        }
      ]
    },
    sw: {
      title: 'Kuhusu ROADBUCK Kenya',
      subtitle: 'Mshirika wako wa kuaminika kwa ubora wa magari Kenya',
      story: {
        title: 'Hadithi Yetu',
        content: 'ROADBUCK Kenya ilianzishwa na dhamira ya kutoa vipengee vya hali ya juu vya magari na vifaa vya ziada kwa wamiliki wa magari kote Kenya. Tunaelewa umuhimu wa usafiri wa kuaminika katika uchumi wa Kenya unaokua, na tumejitolea kuweka magari yenu yakiendelea vizuri.'
      },
      mission: {
        title: 'Dhamira Yetu',
        content: 'Kuwa msambazaji mkuu wa Kenya wa vipengee vya ubora vya magari, kutoa huduma bora na thamani kwa wateja wetu huku tukiunga mkono ukuaji wa tasnia ya magari ya Kenya.'
      },
      values: [
        {
          icon: Shield,
          title: 'Uhakikisho wa Ubora',
          description: 'Tunapata tu vipengee halisi na vya ubora kutoka kwa wazalishaji wa kuaminika duniani kote.'
        },
        {
          icon: Truck,
          title: 'Utoaji wa Kuaminika',
          description: 'Utoaji wa haraka na salama katika kaunti zote 47 za Kenya kupitia mtandao wetu wa mizigo.'
        },
        {
          icon: Users,
          title: 'Mteja wa Kwanza',
          description: 'Timu yetu ya kisabisabi inatoa ushauri wa kitaalamu na huduma ya kibinafsi kwa kila mteja.'
        },
        {
          icon: Globe,
          title: 'Athari za Ndani',
          description: 'Kuunga mkono tasnia ya magari ya Kenya na kuchangia ukuaji wa kiuchumi kote nchini.'
        }
      ]
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
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.subtitle}
            </p>
          </div>

          {/* Story Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t.story.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {t.story.content}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t.mission.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {t.mission.content}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {t.values.map((value, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <value.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <CardTitle>{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
