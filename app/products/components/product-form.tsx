'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Form,
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { TAX_RATES } from '@/lib/constants/tax-rates';
import { SUPPORTED_CURRENCIES } from '@/lib/constants';
import { ProductTotals } from './product-totals';
import { useEditProduct } from '../hooks/use-edit-product';
import type { Product } from '@/lib/types/product';

const productSchema = z.object({
  item_description: z.string().min(1, 'Required'),
  unit_price: z.number().min(0, 'Must be at least 0'),
  currency: z.enum(['AOA', 'USD', 'EUR']),
  tax_rate: z.number().min(0, 'Must be at least 0'),
  tax_exemption_reason: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product;
  onSuccess?: () => void;
  mode?: 'create' | 'edit';
}

export function ProductForm({ initialData, onSuccess, mode = 'create' }: ProductFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { editProduct } = useEditProduct();
  const [loading, setLoading] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      item_description: '',
      unit_price: 0,
      currency: 'AOA',
      tax_rate: 14,
    },
  });

  const taxRate = form.watch('tax_rate');
  const unitPrice = form.watch('unit_price');
  const currency = form.watch('currency');
  const showJustification = Number(taxRate) === 0;

  async function onSubmit(data: ProductFormData) {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('You must be logged in to add a product');
      }

      if (mode === 'edit' && initialData) {
        await editProduct(initialData.id, data);
        toast({
          title: t('Products.EditSuccess'),
        });
      } else {
        const { error } = await supabase.from('product_lines').insert([
          {
            ...data,
            user_id: user.id,
          },
        ]);

        if (error) throw error;

        toast({
          title: t('Products.AddSuccess'),
        });
      }
      
      onSuccess?.();
      if (mode === 'create') {
        form.reset();
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: mode === 'edit' ? t('Products.EditError') : t('Products.AddError'),
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Form fields remain the same */}
        <FormField
          control={form.control}
          name="item_description"
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="unit_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Products.UnitPrice')}</FormLabel>
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

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Products.Currency')}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SUPPORTED_CURRENCIES.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tax_rate"
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

        {showJustification && (
          <FormField
            control={form.control}
            name="tax_exemption_reason"
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
        )}

        <div className="grid grid-cols-2 gap-4">
          <div />
          <ProductTotals
            unitPrice={unitPrice}
            taxRate={taxRate}
            currency={currency}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? t('Form.Saving') : mode === 'edit' ? t('Form.Save') : t('Form.Create')}
          </Button>
        </div>
      </form>
    </Form>
  );
}