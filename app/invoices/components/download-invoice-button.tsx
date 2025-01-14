'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDownToLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generatePDF } from '@/lib/utils/invoice-utils';
import type { Invoice } from '@/lib/types';

interface DownloadInvoiceButtonProps {
  invoice: Invoice;
}

export function DownloadInvoiceButton({ invoice }: DownloadInvoiceButtonProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      
      // Generate the PDF blob
      const blob = await generatePDF(invoice);
      
      // Create the download URL
      const url = window.URL.createObjectURL(blob);
      
      // Create the filename using invoice number
      const filename = `invoice-${invoice.invoice_number}.pdf`;
      
      // Create and trigger download link
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: t('Invoices.DownloadSuccess'),
        description: t('Invoices.DownloadSuccessDescription'),
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: 'destructive',
        title: t('Invoices.DownloadError'),
        description: error instanceof Error ? error.message : t('Invoices.DownloadErrorDescription'),
      });
    } finally {
      setLoading(false);
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
      <ArrowDownToLine className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
    </Button>
  );
}