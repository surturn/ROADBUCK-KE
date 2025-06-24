
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

interface WhatsAppChatProps {
  phoneNumber: string;
  message?: string;
  currentLanguage?: 'en' | 'sw';
}

export const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ 
  phoneNumber, 
  message = '',
  currentLanguage = 'en' 
}) => {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const translations = {
    en: {
      title: 'Chat with us on WhatsApp',
      subtitle: 'Get instant support and quick responses',
      buttonText: 'Start WhatsApp Chat',
      defaultMessage: 'Hello! I would like to inquire about your products and services.'
    },
    sw: {
      title: 'Piga simu nasi kupitia WhatsApp',
      subtitle: 'Pata msaada wa haraka na majibu ya haraka',
      buttonText: 'Anza Mazungumzo ya WhatsApp',
      defaultMessage: 'Hujambo! Ningependa kuuliza kuhusu bidhaa na huduma zenu.'
    }
  };

  const t = translations[currentLanguage];
  const finalMessage = message || t.defaultMessage;

  return (
    <Card className="bg-green-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-green-800">
          <MessageCircle className="h-5 w-5" />
          <span>{t.title}</span>
        </CardTitle>
        <p className="text-green-600">{t.subtitle}</p>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleWhatsAppClick}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          {t.buttonText}
        </Button>
        <p className="text-sm text-gray-600 mt-2">
          {currentLanguage === 'en' ? 'Default message:' : 'Ujumbe wa kawaida:'} "{finalMessage}"
        </p>
      </CardContent>
    </Card>
  );
};
