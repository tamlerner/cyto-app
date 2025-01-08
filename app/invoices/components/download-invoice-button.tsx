'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDownToLine } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DownloadInvoiceButtonProps {
  invoice: any; // Simplified to any for demonstration
}

export function DownloadInvoiceButton({ invoice }: DownloadInvoiceButtonProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false); // This state is not used in the current implementation

 
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {}} // Removed functionality
      disabled={loading}
      title={t('Invoices.Download')}
    >
      <ArrowDownToLine className="h-4 w-4" />
    </Button>
  );
}