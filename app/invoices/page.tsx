'use client';

import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/page-header';
import { InvoiceList } from './components/invoice-list';
import { CreateInvoiceDialog } from './components/create-invoice-dialog';

export default function InvoicesPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('Invoices')}
        description={t('Invoices.Description')}
        action={<CreateInvoiceDialog />}
      />
      <InvoiceList />
    </div>
  );
}