import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

interface CategoryFilterProps {
  categories: { id: string; name: string }[];
  selectedCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
  productCount?: number;
  currentLanguage?: 'en' | 'sw';
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onCategoryChange,
  productCount = 0,
  currentLanguage = 'en'
}) => {
  const translations = {
    en: {
      allCategories: 'All Categories',
      filterByCategory: 'Filter by Category',
      clearFilter: 'Clear Filter',
      products: 'products',
      showing: 'Showing'
    },
    sw: {
      allCategories: 'Makundi Yote',
      filterByCategory: 'Chuja kwa Kundi',
      clearFilter: 'Futa Kichujio',
      products: 'bidhaa',
      showing: 'Inaonyesha'
    }
  };

  const t = translations[currentLanguage];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={selectedCategoryId} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t.filterByCategory} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">{t.allCategories}</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCategoryId !== 'all' && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              {categories.find(cat => cat.id === selectedCategoryId)?.name || 'Unknown'}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => onCategoryChange('all')}
                aria-label={t.clearFilter}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-600">
        {t.showing} {productCount} {t.products}
        {selectedCategoryId !== 'all' &&
          ` in "${categories.find(cat => cat.id === selectedCategoryId)?.name || 'Unknown'}"`}
      </div>
    </div>
  );
};
