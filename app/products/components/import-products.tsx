'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Papa from 'papaparse';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, AlertCircle, Check, ChevronDown } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ImportProductsProps {
  onSuccess?: () => void;
}

const REQUIRED_FIELDS = [
  'item_description',
  'unit_price',
  'currency',
  'tax_rate'
] as const;

const ImportProducts: React.FC<ImportProductsProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateRow = (row: Record<string, any>, index: number) => {
    const errors: string[] = [];
    
    // Check required fields
    REQUIRED_FIELDS.forEach(field => {
      if (!row[field]) {
        errors.push(`Row ${index + 1}: Missing required field "${field}"`);
      }
    });

    // Validate numeric fields
    if (isNaN(Number(row.unit_price)) || Number(row.unit_price) < 0) {
      errors.push(`Row ${index + 1}: Unit price must be a number >= 0`);
    }

    if (isNaN(Number(row.tax_rate)) || Number(row.tax_rate) < 0) {
      errors.push(`Row ${index + 1}: Tax rate must be a number >= 0`);
    }

    // Validate currency
    if (!['USD', 'EUR', 'AOA'].includes(row.currency)) {
      errors.push(`Row ${index + 1}: Invalid currency. Must be USD, EUR, or AOA`);
    }

    // Validate tax exemption reason if tax_rate is 0
    if (Number(row.tax_rate) === 0 && !row.tax_exemption_reason) {
      errors.push(`Row ${index + 1}: Tax exemption reason is required when tax rate is 0`);
    }

    return errors;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setProgress(0);
    setValidationErrors([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          // Validate all rows first
          const allErrors: string[] = [];
          results.data.forEach((row, index) => {
            const rowErrors = validateRow(row, index);
            allErrors.push(...rowErrors);
          });

          if (allErrors.length > 0) {
            setValidationErrors(allErrors);
            setImporting(false);
            return;
          }

          // Process valid data
          const productsData = results.data.map(row => ({
            ...row,
            user_id: user?.id,
            unit_price: Number(row.unit_price),
            tax_rate: Number(row.tax_rate)
          }));

          // Insert in batches of 50
          const batchSize = 50;
          
          for (let i = 0; i < productsData.length; i += batchSize) {
            const batch = productsData.slice(i, i + batchSize);
            const { error } = await supabase
              .from('product_lines')
              .insert(batch);

            if (error) throw error;

            // Update progress
            const progress = Math.round(((i + batch.length) / productsData.length) * 100);
            setProgress(progress);
          }

          toast({
            title: t('Products.ImportSuccess'),
            description: `${productsData.length} products imported successfully`,
          });
          
          onSuccess?.();
        } catch (error) {
          console.error('Import error:', error);
          toast({
            variant: 'destructive',
            title: t('Products.ImportError'),
            description: error instanceof Error ? error.message : 'An error occurred'
          });
        } finally {
          setImporting(false);
          setProgress(0);
          event.target.value = '';
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        toast({
          variant: 'destructive',
          title: t('Products.ImportError'),
          description: 'Failed to parse CSV file'
        });
        setImporting(false);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          disabled={importing}
          onClick={() => document.getElementById('csvInput')?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          {importing ? t('Products.Importing') : t('Products.ImportCSV')}
        </Button>
        <input
          id="csvInput"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {importing && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground">
            {t('Products.ImportingProgress', { progress })}
          </p>
        </div>
      )}

      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('Products.ValidationErrors')}</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center gap-2">
              CSV Format Guide
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <div className="border rounded-md">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[200px]">Column Name</TableHead>
                  <TableHead className="w-[120px]">Required</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono text-sm">item_description</TableCell>
                  <TableCell><Badge>Required</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">Description of the product</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">unit_price</TableCell>
                  <TableCell><Badge>Required</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">Price per unit (must be ≥ 0)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">currency</TableCell>
                  <TableCell><Badge>Required</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">USD, EUR, or AOA</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">tax_rate</TableCell>
                  <TableCell><Badge>Required</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">Tax rate percentage (must be ≥ 0)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">tax_exemption_reason</TableCell>
                  <TableCell><Badge variant="outline">Conditional</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">Required if tax_rate is 0</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <Alert className="mt-4 bg-muted">
            <Check className="h-4 w-4" />
            <AlertTitle>Example Row</AlertTitle>
            <AlertDescription>
              <code className="block mt-2 p-3 bg-background rounded-md text-sm font-mono whitespace-nowrap overflow-x-auto">
                Product Description,100.00,USD,14,,
              </code>
            </AlertDescription>
          </Alert>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ImportProducts;