'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useCreateInvoice } from '../../hooks/use-create-invoice';
import { InvoiceFormFields } from './invoice-form-fields';
import { InvoiceItemsList } from './invoice-items-list';
import { InvoiceSummary } from '../invoice-summary';
import { invoiceSchema } from '../../schemas/invoice-schema';
import { Button } from '@/components/ui/button';
import type { InvoiceFormData } from '../../types';

interface CreateInvoiceFormProps {
  onSuccess?: () => void;
}

export function CreateInvoiceForm({ onSuccess }: CreateInvoiceFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { createInvoice, loading } = useCreateInvoice();
  const [items, setItems] = useState([{ id: '1' }]);

  const methods = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      issue_date: new Date(),
      due_date: new Date(),
      currency: 'USD',
      language: 'en',
      items: [{ description: '', quantity: 1, unit_price: 0, tax_rate: 0 }],
    },
  });

  const currency = methods.watch('currency');

  async function onSubmit(data: InvoiceFormData) {
    try {
      await createInvoice(data);
      toast({ title: t('Invoices.CreateSuccess') });
      onSuccess?.();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('Invoices.CreateError'),
        description: error instanceof Error ? error.message : undefined,
      });
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <InvoiceFormFields />
        <InvoiceItemsList
          items={items}
          setItems={setItems}
          currency={currency}
        />
        <InvoiceSummary
          items={methods.watch('items') || []}
          currency={currency}
        />
        <div className="sticky bottom-0 bg-background pt-4 pb-2 border-t mt-6">
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? t('Invoices.Creating') : t('Invoices.Create')}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}