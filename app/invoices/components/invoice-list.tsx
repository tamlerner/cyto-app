'use client';

import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInvoices } from '../hooks/use-invoices';
import { InvoiceTable } from './invoice-table';
import { Skeleton } from '@/components/ui/skeleton';

export function InvoiceList() {
  const { t } = useTranslation();
  const { invoices, loading, error } = useInvoices();

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!invoices.length) {
    return (
      <div className="rounded-md border p-4 text-center text-muted-foreground">
        {t('Invoices.NoInvoices')}
      </div>
    );
  }

  return <InvoiceTable invoices={invoices} />;
}