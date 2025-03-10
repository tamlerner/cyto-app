'use client';

import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { useClients } from '@/app/clients/hooks/use-clients';
import { SUPPORTED_CURRENCIES, SUPPORTED_LANGUAGES } from '@/lib/constants';
import { Plus } from 'lucide-react'; // Icon for "+ Create New Client"
import type { InvoiceFormData } from '../../types';

export function InvoiceFormFields() {
  const { t } = useTranslation();
  const { clients } = useClients();
  const { control } = useFormContext<InvoiceFormData>();

  return (
    <>
      {/* Client Selection */}
      <FormField
        control={control}
        name="client_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('Clients.CompanyName')}</FormLabel>
            <Select
              onValueChange={(value) => {
                if (value === 'new') {
                  window.location.href = '/clients'; // Redirect to the create new client page
                } else {
                  field.onChange(value);
                }
              }}
              value={field.value}
            >
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
                <SelectSeparator className="my-2" />
                <SelectItem value="new" className="text-primary font-medium">
                  <Plus className="mr-2 h-4 w-4 inline" />
                  {t('Clients.CreateNew')}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      {/* Currency and Language */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
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
          control={control}
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

      {/* Issue Date and Due Date */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="issue_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Invoices.IssueDate')}</FormLabel>
              <FormControl>
                <DatePicker date={field.value} onSelect={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Invoices.DueDate')}</FormLabel>
              <FormControl>
                <DatePicker date={field.value} onSelect={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
