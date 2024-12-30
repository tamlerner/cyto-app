'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDownToLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generatePDF } from '@/lib/pdf/generate-pdf';
import type { Invoice } from '@/lib/types';

interface DownloadInvoiceButtonProps {
  invoice: Invoice & {
    items: any[];
    client: any;
    company: any;
  };
}

export function DownloadInvoiceButton({ invoice }: DownloadInvoiceButtonProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    if (loading) return;

    if (!invoice || !invoice.items) {
      toast({
        variant: 'destructive',
        title: t('Invoices.DownloadError'),
        description: 'Invalid invoice data'
      });
      return;
    }

    let url: string | null = null;

    try {
      setLoading(true);

      // Log data before generation
      console.log('Starting PDF generation with:', {
        hasInvoice: Boolean(invoice),
        itemsCount: invoice.items?.length,
        hasClient: Boolean(invoice.client),
        hasCompany: Boolean(invoice.company)
      });

      // Generate PDF
      const blob = await generatePDF({
        invoice,
        items: invoice.items
      });

      if (!blob) {
        throw new Error('PDF generation returned no data');
      }

      console.log('PDF generated successfully:', { blobSize: blob.size });

      // Create download URL
      url = URL.createObjectURL(blob);

      // Create and trigger download
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.download = `invoice-${invoice.invoice_number}.pdf`;
      
      // Add to document, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: t('Invoices.DownloadSuccess'),
        description: t('Invoices.DownloadSuccessMessage')
      });
    } catch (error) {
      console.error('Download process failed:', {
        error,
        errorType: error?.constructor?.name,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });

      toast({
        variant: 'destructive',
        title: t('Invoices.DownloadError'),
        description: error instanceof Error ? error.message : 'Failed to download invoice'
      });
    } finally {
      // Cleanup URL if it was created
      if (url) {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          console.error('Failed to revoke URL:', e);
        }
      }
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