import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const AddProductForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    image_url: '',
    category_id: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('product_categories').select('id, name');
      if (error) {
        toast.error('Failed to fetch categories');
      } else {
        setCategories(data || []);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFormData(prev => ({
        ...prev,
        image: selectedFile.name
      }));
    }
  };

  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    const filePath = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) {
      toast.error(`Image upload failed: ${error.message}`);
      return null;
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl || null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.category_id) {
      toast.error('Please fill in the required fields');
      return;
    }

    setIsSubmitting(true);

    let imageUrl = formData.image_url;

    if (file) {
      const uploadedUrl = await uploadImageToSupabase(file);
      if (!uploadedUrl) {
        setIsSubmitting(false);
        return;
      }
      imageUrl = uploadedUrl;
    }

    try {
      const { error } = await supabase.from('products').insert({
        Name: formData.name.trim(),
        Description: formData.description.trim() || null,
        Image: file?.name || formData.image || null,
        Image_url: imageUrl || null,
        Category_id: formData.category_id
      });

      if (error) {
        toast.error(`Failed to add product: ${error.message}`);
      } else {
        toast.success(`Product "${formData.name}" added successfully!`);
        setFormData({
          name: '',
          description: '',
          image: '',
          image_url: '',
          category_id: ''
        });
        setFile(null);
      }
    } catch (err) {
      toast.error(`Error adding product: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Product
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Brake Pads"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Product details"
              rows={3}
            />
          </div>

              <div>
              <Label htmlFor="category">Product Category *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) =>
                setFormData(prev => ({ ...prev, category_id: value }))
                }
              >
                <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                {categories.length > 0 ? (
                  categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                  ))
                ) : (
                  <>
                  <SelectItem value="wheel balancer">wheel balancer</SelectItem>
                  <SelectItem value="wheel changer">wheel changer</SelectItem>
                  <SelectItem value="lifts">lifts</SelectItem>
                  </>
                )}
                </SelectContent>
              </Select>
              </div>

          <div>
            <Label htmlFor="image">Upload Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {file && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: <strong>{file.name}</strong>
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="image_url">Or Paste Image URL</Label>
            <Input
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              placeholder="https://cdn.example.com/image.png"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Add Product
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
