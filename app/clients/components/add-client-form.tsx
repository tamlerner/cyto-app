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
import { useToast } from '@/hooks/use-toast';
import { SUPPORTED_CURRENCIES } from '@/lib/constants';

const clientSchema = z.object({
  company_name: z.string().min(1, 'Required'),
  trade_name: z.string().optional(),
  tax_id: z.string().min(1, 'Required'),
  headquarters_address: z.string().min(1, 'Required'),
  city: z.string().min(1, 'Required'),
  region: z.string().min(1, 'Required'),
  postal_code: z.string().min(1, 'Required'),
  country: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  account_manager: z.string().optional(),
  preferred_currency: z.enum(['USD', 'EUR', 'AOA']).default('USD'),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface AddClientFormProps {
  onSuccess?: () => void;
}

export function AddClientForm({ onSuccess }: AddClientFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      company_name: '',
      trade_name: '',
      tax_id: '',
      headquarters_address: '',
      city: '',
      region: '',
      postal_code: '',
      country: '',
      email: '',
      phone_number: '',
      website: '',
      account_manager: '',
      preferred_currency: 'USD',
    },
  });

  async function onSubmit(data: ClientFormData) {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('You must be logged in to add a client');
      }

      const { error } = await supabase.from('clients').insert([
        {
          ...data,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      toast({
        title: t('Clients.AddSuccess'),
      });
      
      onSuccess?.();
      form.reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('Clients.AddError'),
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Clients.CompanyName')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trade_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Clients.TradeName')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tax_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Clients.TaxId')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Clients.Email')}</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="headquarters_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Clients.Headquarters')}</FormLabel>
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
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Clients.City')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Clients.Region')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Clients.PostalCode')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Clients.Country')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Clients.Phone')}</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Clients.Website')}</FormLabel>
                <FormControl>
                  <Input type="url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="account_manager"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Clients.AccountManager')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferred_currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Clients.PreferredCurrency')}</FormLabel>
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

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? t('Form.Saving') : t('Form.Save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}