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
import { DatePicker } from '@/components/ui/date-picker';
import { InvoiceItemForm } from './invoice-item-form';
import { InvoiceSummary } from './invoice-summary';
import { useClients } from '@/app/clients/hooks/use-clients';
import { SUPPORTED_CURRENCIES, SUPPORTED_LANGUAGES } from '@/lib/constants';
import { generateInvoiceNumber } from '@/lib/utils/invoice-utils';

const invoiceSchema = z.object({
  client_id: z.string().min(1, 'Required'),
  currency: z.string().min(1, 'Required'),
  language: z.string().min(1, 'Required'),
  issue_date: z.date(),
  due_date: z.date(),
  items: z.array(z.object({
    description: z.string().min(1, 'Required'),
    quantity: z.number().min(0.01, 'Must be greater than 0'),
    unit_price: z.number().min(0, 'Must be at least 0'),
    tax_rate: z.number().min(0, 'Must be at least 0'),
    tax_exemption_reason: z.string().optional(),
  })).min(1, 'At least one item is required'),
  notes: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface CreateInvoiceFormProps {
  onSuccess?: () => void;
}

export function CreateInvoiceForm({ onSuccess }: CreateInvoiceFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { clients } = useClients();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([{ id: '1' }]);

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      issue_date: new Date(),
      due_date: new Date(),
      currency: 'USD',
      language: 'en',
      items: [{ description: '', quantity: 1, unit_price: 0, tax_rate: 0 }],
    },
  });

  const currency = form.watch('currency');

  function addItem() {
    setItems([...items, { id: Math.random().toString() }]);
    form.setValue('items', [
      ...form.getValues('items'),
      { description: '', quantity: 1, unit_price: 0, tax_rate: 0 },
    ]);
  }

  function removeItem(index: number) {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);

    const formItems = form.getValues('items');
    formItems.splice(index, 1);
    form.setValue('items', formItems);
  }

  async function onSubmit(data: InvoiceFormData) {
    try {
      setLoading(true);
      console.log('Starting invoice creation with data:', data); // Debug log
      
      if (!user) {
        throw new Error('You must be logged in to create an invoice');
      }
  
      // Get default company first
      const { data: companyData, error: companyError } = await supabase
        .from('invoice_companies')
        .select('id')
        .eq('user_id', user.id)
        .single();
  
      if (companyError) {
        console.error('Company fetch error:', companyError);
        throw companyError;
      }
      if (!companyData) throw new Error('No company found');
  
      const invoice_number = generateInvoiceNumber();
      const { subtotal, tax_total, total } = calculateTotals(data.items);
  
      // First create the invoice
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number,
          client_id: data.client_id,
          company_id: companyData.id, // This was missing before
          issue_date: data.issue_date.toISOString(),
          due_date: data.due_date.toISOString(),
          currency: data.currency,
          language: data.language,
          subtotal,
          tax_total,
          total,
          notes: data.notes,
          status: 'draft',
          user_id: user.id
        })
        .select('*')  // Important: get back the created invoice
        .single();
  
      if (invoiceError) {
        console.error('Invoice creation error:', invoiceError);
        throw invoiceError;
      }
  
      if (!invoiceData) throw new Error('Failed to create invoice');
  
      console.log('Created invoice:', invoiceData); // Debug log
  
      // Then create all invoice items
      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(
          data.items.map(item => {
            const item_subtotal = item.quantity * item.unit_price;
            const item_tax = (item_subtotal * item.tax_rate) / 100;
            return {
              invoice_id: invoiceData.id,
              description: item.description,
              quantity: item.quantity,
              unit_price: item.unit_price,
              currency: data.currency,
              tax_rate: item.tax_rate,
              tax_amount: item_tax,
              subtotal: item_subtotal,
              total_with_tax: item_subtotal + item_tax,
              tax_exemption_reason: item.tax_exemption_reason,
              user_id: user.id
            };
          })
        );
  
      if (itemsError) {
        console.error('Items creation error:', itemsError);
        throw itemsError;
      }
  
      toast({
        title: t('Invoices.CreateSuccess'),
      });
      
      onSuccess?.();
      form.reset();
    } catch (error) {
      console.error('Final error:', error); // Debug log
      toast({
        variant: 'destructive',
        title: t('Invoices.CreateError'),
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Clients.CompanyName')}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('Invoices.SelectClient')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients?.map((client) => (
                    <SelectItem key={client.id} value={client.id || ''}>
                      {client.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Invoices.Currency')}</FormLabel>
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

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Invoices.Language')}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="issue_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Invoices.IssueDate')}</FormLabel>
                <DatePicker
                  date={field.value}
                  onSelect={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Invoices.DueDate')}</FormLabel>
                <DatePicker
                  date={field.value}
                  onSelect={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <InvoiceItemForm
              key={item.id}
              form={form}
              index={index}
              onRemove={() => removeItem(index)}
              isRemoveDisabled={items.length === 1}
              currency={currency}
            />
          ))}
          
          <Button type="button" variant="outline" onClick={addItem}>
            {t('Invoices.AddItem')}
          </Button>
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Invoices.Notes')}</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <div />
          <InvoiceSummary
            items={form.watch('items') || []}
            currency={currency}
          />
        </div>

        <div className="sticky bottom-0 bg-background pt-4 pb-2 border-t mt-6">
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? t('Invoices.Creating') : t('Invoices.Create')}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

function calculateTotals(items: any[]) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const tax_total = items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.unit_price;
    return sum + (itemTotal * item.tax_rate) / 100;
  }, 0);
  
  return {
    subtotal,
    tax_total,
    total: subtotal + tax_total,
  };
}