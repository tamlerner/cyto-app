'use client';

import { useTranslation } from 'react-i18next';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { useClients } from '@/app/clients/hooks/use-clients';
import { SUPPORTED_CURRENCIES, SUPPORTED_LANGUAGES } from '@/lib/constants';
import type { UseFormReturn } from 'react-hook-form';
import type { InvoiceFormData } from '../../types';

interface InvoiceFormFieldsProps {
  form: UseFormReturn<InvoiceFormData>;
}

export function InvoiceFormFields({ form }: InvoiceFormFieldsProps) {
  const { t } = useTranslation();
  const { clients } = useClients();

  return (
    <>
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
                  <SelectItem key={client.id} value={client.id}>
                    {client.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            </FormItem>
          )}
        />
      </div>
    </>
  );
}