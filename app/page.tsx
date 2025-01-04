'use client';

import { useTranslation } from 'react-i18next';
import { CreateInvoiceDialog } from './invoices/components/create-invoice-dialog';
import { InvoiceList } from './invoices/components/invoice-list';

export default function InvoicesPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          {t('Invoices.Title', 'Invoices')}
        </h1>
        <CreateInvoiceDialog />
      </div>
      <InvoiceList />
    </div>
  );
}