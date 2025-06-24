
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Download, FileText, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

type Document = Tables<'documents'>;

interface DocumentsListProps {
  currentLanguage: 'en' | 'sw';
}

export const DocumentsList: React.FC<DocumentsListProps> = ({ currentLanguage }) => {
  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Document[];
    }
  });

  const handleDownload = (document: Document) => {
    try {
      const link = document.createElement('a');
      link.href = document.file_url;
      link.download = document.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(currentLanguage === 'en' ? 'Download started' : 'Upakuzi umeanza');
    } catch (error) {
      toast.error(currentLanguage === 'en' ? 'Download failed' : 'Upakuzi umeshindwa');
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return mb > 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      currentLanguage === 'en' ? 'en-US' : 'sw-KE'
    );
  };

  const translations = {
    en: {
      noDocuments: 'No documents available',
      loading: 'Loading documents...',
      download: 'Download',
      uploadedOn: 'Uploaded on',
      fileSize: 'File size'
    },
    sw: {
      noDocuments: 'Hakuna nyaraka zinazopatikana',
      loading: 'Inapakia nyaraka...',
      download: 'Pakua',
      uploadedOn: 'Ilipakiwa',
      fileSize: 'Ukubwa wa faili'
    }
  };

  const t = translations[currentLanguage];

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{t.loading}</p>
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{t.noDocuments}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((document) => (
        <Card key={document.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-start space-x-3">
              <FileText className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="font-semibold text-lg leading-tight break-words">
                  {document.title}
                </h3>
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mt-2">
                  {document.category}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {document.description && (
              <p className="text-gray-600 text-sm line-clamp-3">
                {document.description}
              </p>
            )}
            
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <Calendar className="h-3 w-3" />
                <span>{t.uploadedOn} {formatDate(document.created_at)}</span>
              </div>
              {document.file_size && (
                <div className="flex items-center space-x-2">
                  <Download className="h-3 w-3" />
                  <span>{t.fileSize}: {formatFileSize(document.file_size)}</span>
                </div>
              )}
            </div>

            <Button 
              onClick={() => handleDownload(document)}
              className="w-full"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              {t.download}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
