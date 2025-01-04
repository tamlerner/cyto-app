'use client';

import { useState, useCallback } from 'react';
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
      email: string;
    };
    company: {
      company_name: string;
    };
  };
}

export function DownloadInvoiceButton({ invoice }: DownloadInvoiceButtonProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const downloadBlob = useCallback(async (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const filename = `invoice-${invoice.invoice_number}.pdf`;

    try {
      console.log('Starting download process for:', filename);
      
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      
      console.log('Triggering download...');
      link.click();
      
      document.body.removeChild(link);
      console.log('Download triggered successfully');
      
    } catch (downloadError) {
      console.error('Download process error:', downloadError);
      throw new Error('Failed to initiate download');
    } finally {
      try {
        URL.revokeObjectURL(url);
        console.log('URL revoked successfully');
      } catch (cleanupError) {
        console.error('Failed to revoke URL:', cleanupError);
      }
    }
  }, [invoice.invoice_number]);

  const handleDownload = async () => {
    if (loading) return;

    setLoading(true);
    console.log('Starting download process for invoice:', invoice.invoice_number);

    try {
      // Validate required data
      if (!invoice.items?.length) {
        throw new Error(t('Invoices.ErrorNoItems'));
      }

      console.log('Generating PDF...');
      const blob = await generatePDF({
        invoice,
        items: invoice.items
      });

      console.log('PDF generated, starting download...');
      await downloadBlob(blob);

      toast({
        title: t('Invoices.DownloadSuccess'),
        description: t('Invoices.DownloadSuccessMessage')
      });
      
    } catch (error) {
      console.error('Download process failed:', {
        error,
        errorType: error?.constructor?.name,
        message: error instanceof Error ? error.message : 'Unknown error',
      });

      toast({
        variant: 'destructive',
        title: t('Invoices.DownloadError'),
        description: error instanceof Error 
          ? error.message 
          : t('Invoices.GenericDownloadError')
      });
    } finally {
      setLoading(false);
      console.log('Download process completed');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDownload}
      disabled={loading}
      title={t('Invoices.Download')}
    >
      <ArrowDownToLine className={`h-4 w-4 ${loading ? 'opacity-50' : ''}`} />
      {loading && (
        <span className="sr-only">{t('Invoices.Downloading')}</span>
      )}
    </Button>
  );
}