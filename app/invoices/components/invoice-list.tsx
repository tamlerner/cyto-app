'use client';

import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInvoices } from '../hooks/use-invoices';
import { InvoiceTable } from './invoice-table';
import { Skeleton } from '@/components/ui/skeleton';

export function InvoiceList({ invoices }) {
  const { t } = useTranslation();
  const { loading, error } = useInvoices();

  if (loading) {
    return <Skeleton className="h-20 w-full" />;
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