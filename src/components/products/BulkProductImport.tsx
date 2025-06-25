import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductRow {
  name: string;
  description?: string;
  type?: string;
  image?: string;
  image_url?: string;
}

interface ImportResult {
  success: boolean;
  message: string;
  data?: ProductRow;
}

export const BulkProductImport: React.FC = () => {
  const [csvData, setCsvData] = useState<ProductRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<ImportResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv') {
      toast.error('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    const requiredFields = ['name'];
    const missingFields = requiredFields.filter(field => !headers.includes(field));

    if (missingFields.length > 0) {
      toast.error(`Missing required columns: ${missingFields.join(', ')}`);
      return;
    }

    const data: ProductRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map(v => v.trim().replace(/^"(.*)"$/, '$1'));
      const row: Partial<ProductRow> = {};

      headers.forEach((header, index) => {
        const value = values[index] || '';
        switch (header) {
          case 'name':
          case 'description':
          case 'type':
          case 'model': // alias for type
          case 'image':
          case 'image_url':
            row[header === 'model' ? 'type' : header] = value;
            break;
        }
      });

      if (row.name) data.push(row as ProductRow);
    }

    setCsvData(data);
    toast.success(`Parsed ${data.length} products from CSV`);
  };

  const handleBulkImport = async () => {
    if (csvData.length === 0) {
      toast.error('No data to import');
      return;
    }

    setImporting(true);
    setImportResults([]);

    const results: ImportResult[] = [];

    for (const product of csvData) {
      try {
        const { data, error } = await supabase
          .from('products')
          .insert({
            name: product.name,
            description: product.description || null,
            type: product.type || null,
            image: product.image || null,
            image_url: product.image_url || null
          })
          .select()
          .single();

        if (error) {
          results.push({ success: false, message: `Failed to import "${product.name}": ${error.message}`, data: product });
        } else {
          results.push({ success: true, message: `Imported "${product.name}"`, data: product });
        }
      } catch (err) {
        results.push({ success: false, message: `Error importing "${product.name}": ${err}`, data: product });
      }
    }

    setImportResults(results);
    setImporting(false);
    setShowResults(true);

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    if (successCount > 0) toast.success(`Successfully imported ${successCount} products`);
    if (failCount > 0) toast.error(`${failCount} products failed`);
  };

  const resetImport = () => {
    setCsvData([]);
    setImportResults([]);
    setShowResults(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Product Import
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Upload CSV File</p>
            <p className="text-sm text-gray-600 mb-4">
              Required: name<br />
              Optional: description, type/model, image, image_url
            </p>
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="max-w-xs mx-auto"
            />
          </div>

          {csvData.length > 0 && !showResults && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">{csvData.length} products ready</p>
                <div className="space-x-2">
                  <Button variant="outline" onClick={resetImport}>Reset</Button>
                  <Button onClick={handleBulkImport} disabled={importing}>
                    {importing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Import Products
                  </Button>
                </div>
              </div>

              <div className="max-h-96 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Image URL</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {csvData.slice(0, 10).map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="truncate max-w-xs">{product.description || 'N/A'}</TableCell>
                        <TableCell>{product.type || 'N/A'}</TableCell>
                        <TableCell className="truncate">{product.image_url || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle>Import Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-auto">
              {importResults.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 p-2 rounded ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
                >
                  {result.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <span className="text-sm">{result.message}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button onClick={resetImport} className="w-full">Import More Products</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
