
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { WhatsAppChat } from '@/components/chat/WhatsAppChat';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

export const Contact: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'sw'>('en');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // TODO: Replace with your actual WhatsApp business number
  const whatsappNumber = '254700000000'; // Replace this with your actual WhatsApp business number

  const handleLanguageChange = (lang: 'en' | 'sw') => {
    setCurrentLanguage(lang);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const translations = {
    en: {
      title: 'Contact Us',
      subtitle: 'Get in touch with our team for any inquiries or support',
      form: {
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        message: 'Message',
        submit: 'Send Message'
      },
      info: {
        title: 'Contact Information',
        email: 'info@roadbuck.co.ke',
        phone: '+254 700 000 000',
        address: 'Nairobi, Kenya',
        hours: 'Mon - Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 4:00 PM\nSun: Closed'
      }
    },
    sw: {
      title: 'Wasiliana Nasi',
      subtitle: 'Wasiliana na timu yetu kwa maswali yoyote au msaada',
      form: {
        name: 'Jina Kamili',
        email: 'Anwani ya Barua Pepe',
        phone: 'Nambari ya Simu',
        message: 'Ujumbe',
        submit: 'Tuma Ujumbe'
      },
      info: {
        title: 'Maelezo ya Mawasiliano',
        email: 'info@roadbuck.co.ke',
        phone: '+254 700 000 000',
        address: 'Nairobi, Kenya',
        hours: 'Jumatatu - Ijumaa: 8:00 AM - 6:00 PM\nJumamosi: 9:00 AM - 4:00 PM\nJumapili: Imefungwa'
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
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t.title}
            </h1>
            <p className="text-xl text-gray-600">
              {t.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.form.name}
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.form.email}
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.form.phone}
                    </label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.form.message}
                    </label>
                    <Textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    {t.form.submit}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information and WhatsApp */}
            <div className="space-y-6">
              {/* WhatsApp Chat Component */}
              <WhatsAppChat 
                phoneNumber={whatsappNumber}
                currentLanguage={currentLanguage}
              />

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.info.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span>{t.info.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span>{t.info.phone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span>{t.info.address}</span>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-1" />
                    <div className="whitespace-pre-line">{t.info.hours}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
