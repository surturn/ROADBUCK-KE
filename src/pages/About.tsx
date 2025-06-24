
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Shield, Users, Globe, Mail, Phone } from 'lucide-react';

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
      team: {
        title: 'Meet Our Team',
        subtitle: 'The passionate professionals behind ROADBUCK Kenya',
        members: [
          {
            name: 'John Kamau',
            role: 'Managing Director',
            bio: 'With over 15 years in the automotive industry, John leads our vision to transform Kenya\'s automotive parts supply chain.',
            email: 'john@roadbuck.ke',
            phone: '+254 700 123 456'
          },
          {
            name: 'Sarah Wanjiku',
            role: 'Head of Operations',
            bio: 'Sarah ensures smooth operations across all our locations, bringing 10 years of logistics and supply chain expertise.',
            email: 'sarah@roadbuck.ke',
            phone: '+254 700 123 457'
          },
          {
            name: 'David Ochieng',
            role: 'Technical Director',
            bio: 'David leads our technical team with deep knowledge of automotive systems and parts compatibility.',
            email: 'david@roadbuck.ke',
            phone: '+254 700 123 458'
          },
          {
            name: 'Grace Njeri',
            role: 'Customer Relations Manager',
            bio: 'Grace ensures every customer receives exceptional service and support throughout their journey with us.',
            email: 'grace@roadbuck.ke',
            phone: '+254 700 123 459'
          }
        ]
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
      team: {
        title: 'Kutana na Timu Yetu',
        subtitle: 'Wataalamu wenye shauku nyuma ya ROADBUCK Kenya',
        members: [
          {
            name: 'John Kamau',
            role: 'Mkurugenzi Mkuu',
            bio: 'Akiwa na uzoefu wa zaidi ya miaka 15 katika tasnia ya magari, John anaongoza maono yetu ya kubadilisha mnyororo wa ugavi wa vipengee vya magari Kenya.',
            email: 'john@roadbuck.ke',
            phone: '+254 700 123 456'
          },
          {
            name: 'Sarah Wanjiku',
            role: 'Mkuu wa Shughuli',
            bio: 'Sarah anahakikisha shughuli za uongozi katika maeneo yetu yote, akileta uzoefu wa miaka 10 wa mizigo na mnyororo wa ugavi.',
            email: 'sarah@roadbuck.ke',
            phone: '+254 700 123 457'
          },
          {
            name: 'David Ochieng',
            role: 'Mkurugenzi wa Kiufundi',
            bio: 'David anaongoza timu yetu ya kiufundi na maarifa makubwa ya mifumo ya magari na ulinganifu wa vipengee.',
            email: 'david@roadbuck.ke',
            phone: '+254 700 123 458'
          },
          {
            name: 'Grace Njeri',
            role: 'Meneja wa Mahusiano ya Wateja',
            bio: 'Grace anahakikisha kila mteja anapokea huduma bora na msaada katika safari yao nasi.',
            email: 'grace@roadbuck.ke',
            phone: '+254 700 123 459'
          }
        ]
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

          {/* Team Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.team.title}</h2>
              <p className="text-xl text-gray-600">{t.team.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {t.team.members.map((member, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="h-10 w-10 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-blue-600 font-medium">{member.role}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{member.phone}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
