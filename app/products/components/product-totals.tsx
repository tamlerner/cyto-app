'use client';

import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/currency';

interface ProductTotalsProps {
  unitPrice: number;
  taxRate: number;
  currency: string;
}

export function ProductTotals({ unitPrice, taxRate, currency }: ProductTotalsProps) {
  const { t } = useTranslation();
  
  const subtotal = unitPrice;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('Products.Subtotal')}</span>
            <span>{formatCurrency(subtotal, currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('Products.TaxAmount')}</span>
            <span>{formatCurrency(taxAmount, currency)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>{t('Products.Total')}</span>
            <span>{formatCurrency(total, currency)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}