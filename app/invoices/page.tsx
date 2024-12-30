'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { CreateInvoiceForm } from './components/invoice-form';
import { InvoiceList } from './components/invoice-list';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function InvoicesPage() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('Invoices')}
        description={t('Invoices.Description')}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('Invoices.Create')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
              <DialogHeader className="p-6 pb-4">
                <DialogTitle>{t('Invoices.Create')}</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto px-6">
                <CreateInvoiceForm onSuccess={() => setOpen(false)} />
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <InvoiceList />
    </div>
  );
}