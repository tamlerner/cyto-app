'use client';

import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/currency';
import { calculateInvoiceTotals } from '@/lib/utils/invoice-utils';

interface InvoiceSummaryProps {
  items: Array<{
    quantity: number;
    unit_price: number;
    tax_rate: number;
  }>;
  currency: string;
}

export function InvoiceSummary({ items, currency }: InvoiceSummaryProps) {
  const { t } = useTranslation();
  const { subtotal, tax_total, total } = calculateInvoiceTotals(items);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('Invoices.Subtotal')}</span>
            <span>{formatCurrency(subtotal, currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('Invoices.TaxTotal')}</span>
            <span>{formatCurrency(tax_total, currency)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>{t('Invoices.Total')}</span>
            <span>{formatCurrency(total, currency)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}