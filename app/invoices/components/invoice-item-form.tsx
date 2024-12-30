'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TAX_RATES } from '@/lib/constants/tax-rates';
import { SUPPORTED_CURRENCIES } from '@/lib/constants';
import { useProducts } from '@/app/products/hooks/use-products';
import type { UseFormReturn } from 'react-hook-form';

interface InvoiceItemFormProps {
  form: UseFormReturn<any>;
  index: number;
  onRemove: () => void;
  isRemoveDisabled: boolean;
  currency: string;
}

export function InvoiceItemForm({
  form,
  index,
  onRemove,
  isRemoveDisabled,
  currency,
}: InvoiceItemFormProps) {
  const { t } = useTranslation();
  const { products } = useProducts();
  const taxRate = form.watch(`items.${index}.tax_rate`);
  const showJustification = Number(taxRate) === 0;
  const currencySymbol = SUPPORTED_CURRENCIES.find(c => c.code === currency)?.symbol || '';

  function handleProductSelect(productId: string) {
    const product = products.find(p => p.id === productId);
    if (product) {
      form.setValue(`items.${index}.description`, product.item_description);
      form.setValue(`items.${index}.unit_price`, product.unit_price);
      form.setValue(`items.${index}.tax_rate`, product.tax_rate);
      form.setValue(`items.${index}.tax_exemption_reason`, product.tax_exemption_reason);
    }
  }

  return (
    <div className="grid grid-cols-12 gap-4 p-4 border rounded-lg">
      <div className="col-span-12">
        <FormField
          control={form.control}
          name={`items.${index}.product_id`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Invoices.SelectProduct')}</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleProductSelect(value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('Invoices.SelectOrCreate')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.item_description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-12">
        <FormField
          control={form.control}
          name={`items.${index}.description`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Products.ItemDescription')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-4">
        <FormField
          control={form.control}
          name={`items.${index}.quantity`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Invoices.Quantity')}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-4">
        <FormField
          control={form.control}
          name={`items.${index}.unit_price`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Products.UnitPrice')} ({currencySymbol})</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-4">
        <FormField
          control={form.control}
          name={`items.${index}.tax_rate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Products.TaxRate')}</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TAX_RATES.map((rate) => (
                    <SelectItem key={rate.value} value={rate.value.toString()}>
                      {rate.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {showJustification && (
        <div className="col-span-12">
          <FormField
            control={form.control}
            name={`items.${index}.tax_exemption_reason`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Products.TaxExemptionReason')}</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      <div className="col-span-12 flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={isRemoveDisabled}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}