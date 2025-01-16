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

interface ImportClientsProps {
  onSuccess?: () => void;
}

const REQUIRED_FIELDS = [
  'company_name',
  'tax_id',
  'headquarters_address',
  'city',
  'region',
  'postal_code',
  'country',
  'email'
] as const;

const ImportClients: React.FC<ImportClientsProps> = ({ onSuccess }) => {
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

    // Validate email format
    if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errors.push(`Row ${index + 1}: Invalid email format`);
    }

    // Validate website format if provided
    if (row.website && row.website !== '') {
      try {
        new URL(row.website);
      } catch {
        errors.push(`Row ${index + 1}: Invalid website URL`);
      }
    }

    // Validate currency
    if (row.preferred_currency && !['USD', 'EUR', 'AOA'].includes(row.preferred_currency)) {
      errors.push(`Row ${index + 1}: Invalid currency. Must be USD, EUR, or AOA`);
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
          const clientsData = results.data.map(row => ({
            ...row,
            user_id: user?.id,
            preferred_currency: row.preferred_currency || 'USD'
          }));

          // Insert in batches of 50
          const batchSize = 50;
          
          for (let i = 0; i < clientsData.length; i += batchSize) {
            const batch = clientsData.slice(i, i + batchSize);
            const { error } = await supabase
              .from('clients')
              .insert(batch);

            if (error) throw error;

            // Update progress
            const progress = Math.round(((i + batch.length) / clientsData.length) * 100);
            setProgress(progress);
          }

          toast({
            title: t('Clients.ImportSuccess'),
            description: `${clientsData.length} clients imported successfully`,
          });
          
          onSuccess?.();
        } catch (error) {
          console.error('Import error:', error);
          toast({
            variant: 'destructive',
            title: t('Clients.ImportError'),
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
          title: t('Clients.ImportError'),
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
          {importing ? t('Clients.Importing') : t('Clients.ImportCSV')}
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
            {t('Clients.ImportingProgress', { progress })}
          </p>
        </div>
      )}

      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('Clients.ValidationErrors')}</AlertTitle>
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
                  <TableCell className="font-mono text-sm">company_name</TableCell>
                  <TableCell><Badge>Required</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">Legal name of the company</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">trade_name</TableCell>
                  <TableCell><Badge variant="outline">Optional</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">Trading or brand name</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">tax_id</TableCell>
                  <TableCell><Badge>Required</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">Tax identification number</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">headquarters_address</TableCell>
                  <TableCell><Badge>Required</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">Primary business address</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">city</TableCell>
                  <TableCell><Badge>Required</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">City of business location</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">region</TableCell>
                  <TableCell><Badge>Required</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">State/Province/Region</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">postal_code</TableCell>
                  <TableCell><Badge>Required</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">ZIP or postal code</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">country</TableCell>
                  <TableCell><Badge>Required</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">Country of registration</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">email</TableCell>
                  <TableCell><Badge>Required</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">Primary contact email</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">phone_number</TableCell>
                  <TableCell><Badge variant="outline">Optional</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">Contact phone number</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">website</TableCell>
                  <TableCell><Badge variant="outline">Optional</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">Company website URL</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">account_manager</TableCell>
                  <TableCell><Badge variant="outline">Optional</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">Assigned account manager</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">preferred_currency</TableCell>
                  <TableCell><Badge variant="outline">Optional</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">USD, EUR, or AOA (defaults to USD)</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <Alert className="mt-4 bg-muted">
            <Check className="h-4 w-4" />
            <AlertTitle>Example Row</AlertTitle>
            <AlertDescription>
              <code className="block mt-2 p-3 bg-background rounded-md text-sm font-mono whitespace-nowrap overflow-x-auto">
                Acme Inc,Acme,12345,123 Business St,New York,NY,10001,USA,contact@acme.com,+1234567890,https://acme.com,John Doe,USD
              </code>
            </AlertDescription>
          </Alert>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ImportClients;