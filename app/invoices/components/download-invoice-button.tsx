'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDownToLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generatePDF } from '@/lib/pdf/generate-pdf';
import type { Invoice, InvoiceItem } from '@/lib/types';

interface DownloadInvoiceButtonProps {
  invoice: Invoice & {
    items: InvoiceItem[];
    client: {
      company_name: string;
      tax_id: string;
      headquarters_address: string;
      city: string;
      region: string;
      postal_code: string;
      country: string;
      email: string;
    };
    company: {
      company_name: string;
      tax_id: string;
      headquarters_address: string;
      city: string;
      region: string;
      postal_code: string;
      country: string;
    };
  };
}

export function DownloadInvoiceButton({ invoice }: DownloadInvoiceButtonProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    if (loading) return;

    let step = 'start';
    try {
      setLoading(true);

      // Step 1: Validate Data
      step = 'validation';
      if (!invoice || !invoice.items || !invoice.client || !invoice.company) {
        throw new Error('Missing required invoice data');
      }

      // Log data before PDF generation
      console.log('Step 1 - Data Validation Passed:', {
        invoiceNumber: invoice.invoice_number,
        itemsCount: invoice.items.length,
        clientName: invoice.client.company_name,
        companyName: invoice.company.company_name
      });

      // Step 2: Generate PDF
      step = 'pdf-generation';
      const blob = await generatePDF({
        invoice,
        items: invoice.items
      });

      if (!blob) {
        throw new Error('PDF generation failed - no blob returned');
      }

      console.log('Step 2 - PDF Generated:', {
        blobSize: blob.size,
        type: blob.type
      });

      // Step 3: Create Download URL
      step = 'url-creation';
      const url = URL.createObjectURL(blob);
      console.log('Step 3 - URL Created');

      // Step 4: Trigger Download
      step = 'download';
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoice.invoice_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('Step 4 - Download Triggered');

      // Step 5: Cleanup
      step = 'cleanup';
      URL.revokeObjectURL(url);
      console.log('Step 5 - Cleanup Complete');

      toast({
        title: t('Invoices.DownloadSuccess'),
      });

    } catch (error) {
      console.error(`Error at step: ${step}`, {
        error,
        errorType: error?.constructor?.name,
        message: error instanceof Error ? error.message : 'Unknown error'
      });

      toast({
        variant: 'destructive',
        title: t('Invoices.DownloadError'),
        description: `Failed at ${step}: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDownload}
      disabled={loading}
      title={t('Invoices.Download')}
    >
      <ArrowDownToLine className="h-4 w-4" />
    </Button>
  );
}