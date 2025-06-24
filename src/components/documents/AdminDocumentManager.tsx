
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Trash2, Edit, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

type Document = Tables<'documents'>;

interface AdminDocumentManagerProps {
  currentLanguage: 'en' | 'sw';
}

export const AdminDocumentManager: React.FC<AdminDocumentManagerProps> = ({ currentLanguage }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'manual',
    file: null as File | null
  });

  const queryClient = useQueryClient();

  // Fetch all documents (including inactive ones for admin)
  const { data: documents, isLoading } = useQuery({
    queryKey: ['admin-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Document[];
    }
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!formData.file) throw new Error('No file selected');

      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      // Upload file to storage
      const fileExt = formData.file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, formData.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Insert document record
      const { error: insertError } = await supabase
        .from('documents')
        .insert({
          title: formData.title,
          description: formData.description,
          file_name: formData.file.name,
          file_url: publicUrl,
          file_size: formData.file.size,
          file_type: formData.file.type,
          category: formData.category,
          uploaded_by: user.data.user.id
        });

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      toast.success(currentLanguage === 'en' ? 'Document uploaded successfully' : 'Nyaraka imepakiwa kikamilifu');
      setFormData({ title: '', description: '', category: 'manual', file: null });
      queryClient.invalidateQueries({ queryKey: ['admin-documents'] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast.error(currentLanguage === 'en' ? 'Upload failed' : 'Upakiaji umeshindwa');
    }
  });

  // Toggle active status mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('documents')
        .update({ is_active: !isActive })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-documents'] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (document: Document) => {
      // Delete from storage first
      const fileName = document.file_url.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('documents')
          .remove([fileName]);
      }

      // Delete from database
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', document.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(currentLanguage === 'en' ? 'Document deleted successfully' : 'Nyaraka imefutwa kikamilifu');
      queryClient.invalidateQueries({ queryKey: ['admin-documents'] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: () => {
      toast.error(currentLanguage === 'en' ? 'Delete failed' : 'Kufuta kumeshindwa');
    }
  });

  const handleUpload = async () => {
    if (!formData.title.trim() || !formData.file) {
      toast.error(currentLanguage === 'en' ? 'Please fill all required fields' : 'Jaza uga zote zinazohitajika');
      return;
    }

    setIsUploading(true);
    try {
      await uploadMutation.mutateAsync();
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return mb > 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
  };

  const translations = {
    en: {
      uploadNew: 'Upload New Document',
      title: 'Title',
      description: 'Description',
      category: 'Category',
      selectFile: 'Select File',
      upload: 'Upload',
      allDocuments: 'All Documents',
      fileName: 'File Name',
      size: 'Size',
      status: 'Status',
      actions: 'Actions',
      active: 'Active',
      inactive: 'Inactive',
      delete: 'Delete',
      toggleStatus: 'Toggle Status'
    },
    sw: {
      uploadNew: 'Pakia Nyaraka Mpya',
      title: 'Kichwa',
      description: 'Maelezo',
      category: 'Kategoria',
      selectFile: 'Chagua Faili',
      upload: 'Pakia',
      allDocuments: 'Nyaraka Zote',
      fileName: 'Jina la Faili',
      size: 'Ukubwa',
      status: 'Hali',
      actions: 'Vitendo',
      active: 'Hai',
      inactive: 'Haikai',
      delete: 'Futa',
      toggleStatus: 'Badilisha Hali'
    }
  };

  const t = translations[currentLanguage];

  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>{t.uploadNew}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t.title} *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder={t.title}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">{t.category}</label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="specification">Specification</SelectItem>
                  <SelectItem value="catalog">Catalog</SelectItem>
                  <SelectItem value="guide">Guide</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t.description}</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={t.description}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t.selectFile} *</label>
            <Input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
            />
          </div>

          <Button onClick={handleUpload} disabled={isUploading} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : t.upload}
          </Button>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t.allDocuments}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.title}</TableHead>
                  <TableHead>{t.fileName}</TableHead>
                  <TableHead>{t.size}</TableHead>
                  <TableHead>{t.status}</TableHead>
                  <TableHead>{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents?.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium">{document.title}</TableCell>
                    <TableCell>{document.file_name}</TableCell>
                    <TableCell>{formatFileSize(document.file_size)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        document.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {document.is_active ? t.active : t.inactive}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleActiveMutation.mutate({ id: document.id, isActive: document.is_active ?? false })}
                        >
                          {document.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(document)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
