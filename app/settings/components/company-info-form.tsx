'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';

// Types
type BankAccount = {
  currency: 'USD' | 'EUR' | 'AOA';
  bankName: string;
  accountNumber: string;
  swiftCode: string;
};

interface AddressResult {
  display_name: string;
  address: {
    fulladdress: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
  };
}

const companyFormSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  trade_name: z.string().optional(),
  tax_id: z.string().min(1, 'Tax ID is required'),
  economic_activity_code: z.string().optional(),
  share_capital: z.string().optional(),
  share_capital_currency: z.enum(['USD', 'EUR', 'AOA']).default('USD'),
  commercial_registration_number: z.string().optional(),
  commercial_registration_country: z.string().optional(),
  phone_country: z.string().optional(),
  phone_number: z.string().optional(),
  headquarters_address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  region: z.string().min(1, 'Region is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  website: z.string().url().optional().or(z.literal('')),
  default_currency: z.enum(['USD', 'EUR', 'AOA']).default('USD'),
});

const countryCodes = [
  { code: 'AO', flag: '🇦🇴', dial: '+244', name: 'Angola' },
  { code: 'FR', flag: '🇫🇷', dial: '+33', name: 'France' },
  { code: 'PT', flag: '🇵🇹', dial: '+351', name: 'Portugal' },
  { code: 'US', flag: '🇺🇸', dial: '+1', name: 'United States' },
  { code: 'GB', flag: '🇬🇧', dial: '+44', name: 'United Kingdom' },
  { code: 'DE', flag: '🇩🇪', dial: '+49', name: 'Germany' },
].sort((a, b) => a.name.localeCompare(b.name));

export function CompanyInfoForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [addressSearchOpen, setAddressSearchOpen] = useState(false);
  const [addressResults, setAddressResults] = useState<AddressResult[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(companyFormSchema),
    defaultValues: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return getDefaultFormValues();

        const { data, error } = await supabase
          .from('invoice_companies')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          loadBankAccounts(data);
          return formatFormData(data);
        }

        return getDefaultFormValues();
      } catch (error) {
        console.error('Error loading company data:', error);
        return getDefaultFormValues();
      }
    }
  });

  const getDefaultFormValues = () => ({
    default_currency: 'USD' as const,
    share_capital_currency: 'USD' as const,
    phone_country: '',
    phone_number: '',
  });

  const loadBankAccounts = (data: any) => {
    const accounts: BankAccount[] = [];
    ['USD', 'EUR', 'AOA'].forEach(currency => {
      const lower = currency.toLowerCase();
      if (data[`bank_name_${lower}`]) {
        accounts.push({
          currency: currency as 'USD' | 'EUR' | 'AOA',
          bankName: data[`bank_name_${lower}`] || '',
          accountNumber: data[`bank_account_number_${lower}`] || '',
          swiftCode: data[`swift_code_${lower}`] || ''
        });
      }
    });
    setBankAccounts(accounts);
  };

  const formatFormData = (data: any) => {
    const phoneNumber = data?.phone_number || '';
    const [countryCode, number] = phoneNumber.includes(' ') 
      ? phoneNumber.split(' ', 2) 
      : ['', phoneNumber];

    return {
      ...data,
      phone_country: countryCode || '',
      phone_number: number || '',
      default_currency: data?.default_currency || 'USD',
      share_capital_currency: data?.share_capital_currency || 'USD'
    };
  };

  
  const addBankAccount = () => {
    if (bankAccounts.length >= 3) return;
    setBankAccounts([...bankAccounts, { 
      currency: 'USD', 
      bankName: '', 
      accountNumber: '', 
      swiftCode: '' 
    }]);
  };

  const removeBankAccount = (index: number) => {
    setBankAccounts(bankAccounts.filter((_, i) => i !== index));
  };

  const handleBankAccountChange = (index: number, field: keyof BankAccount, value: string) => {
    const newAccounts = [...bankAccounts];
    newAccounts[index] = { ...newAccounts[index], [field]: value };
    setBankAccounts(newAccounts);
  };

  const onSubmit = async (values: z.infer<typeof companyFormSchema>) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Prepare bank account data
      const bankData: Record<string, string> = {};
      bankAccounts.forEach(account => {
        const currency = account.currency.toLowerCase();
        bankData[`bank_name_${currency}`] = account.bankName;
        bankData[`bank_account_number_${currency}`] = account.accountNumber;
        bankData[`swift_code_${currency}`] = account.swiftCode;
      });

      // Combine phone number
      const fullPhoneNumber = values.phone_country && values.phone_number 
        ? `${values.phone_country} ${values.phone_number}`
        : '';

      const { error } = await supabase
        .from('invoice_companies')
        .update({
          ...values,
          phone_number: fullPhoneNumber,
          ...bankData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: t('Success'),
        description: t('Messages.CompanyUpdateSuccessMessage'),
      });
    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        variant: 'destructive',
        title: t('Messages.Error'),
        description: error instanceof Error ? error.message : 'Failed to update company info',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">{t('Settings.Company.Sections.BasicInfo')}</h3>

          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Settings.Company.Fields.CompanyName')}</FormLabel>
                <FormControl>
                  <Input {...field} className="max-w-xl" />
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
                <FormLabel>{t('Settings.Company.Fields.TradeName')}</FormLabel>
                <FormControl>
                  <Input {...field} className="max-w-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tax_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Settings.Company.Fields.TaxID')}</FormLabel>
                <FormControl>
                  <Input {...field} className="max-w-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="economic_activity_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Settings.Company.Fields.EconomicCode')}</FormLabel>
                <FormControl>
                  <Input {...field} className="max-w-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4 max-w-xl">
            <FormField
              control={form.control}
              name="share_capital"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Settings.Company.Fields.ShareCapital')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="share_capital_currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Settings.Company.Fields.Currency')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('Settings.Company.Fields.SelectCurrency')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="AOA">AOA</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">{t('Settings.Company.Sections.Contact')}</h3>

          
          <div className="space-y-4 max-w-xl">
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="phone_country"
                render={({ field }) => (
                  <FormItem className="w-[180px]">
                    <FormLabel>{t('Settings.Company.Fields.PhoneCountry')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('Settings.Company.Fields.PhoneCountry')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countryCodes.map((country) => (
                          <SelectItem key={country.code} value={country.dial}>
                            {country.flag} {country.dial}
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
                name="phone_number"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t('Settings.Company.Fields.PhoneNumber')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Settings.Company.Fields.Website')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-4">
           <h3 className="text-lg font-medium border-b pb-2">{t('Settings.Company.Sections.Address')}</h3>
          
          <div className="space-y-4 max-w-xl">
            <FormField
              control={form.control}
              name="headquarters_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Settings.Company.Fields.Address')}</FormLabel>
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
                    <FormLabel>{t('Settings.Company.Fields.City')}</FormLabel>
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
                    <FormLabel>{t('Settings.Company.Fields.Region')}</FormLabel>
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
                    <FormLabel>{t('Settings.Company.Fields.PostalCode')}</FormLabel>
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
                    <FormLabel>{t('Settings.Company.Fields.Country')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Banking Information */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
           <h3 className="text-lg font-medium">{t('Settings.Company.Sections.Banking')}</h3>

            <Button 
              type="button" 
              variant="outline" 
              onClick={addBankAccount}
              disabled={bankAccounts.length >= 3}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('Settings.Company.Actions.AddBank')}
            </Button>
          </div>
          
          <div className="space-y-4">
            {bankAccounts.map((account, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <Select 
                    value={account.currency}
                    onValueChange={(value: 'USD' | 'EUR' | 'AOA') => 
                      handleBankAccountChange(index, 'currency', value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t('Settings.Company.Fields.SelectCurrency')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="AOA">AOA</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBankAccount(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <Input
                  placeholder={t('Settings.BankName')}
                  value={account.bankName}
                  onChange={(e) => handleBankAccountChange(index, 'bankName', e.target.value)}
                />

                <Input
                  placeholder={t('Settings.Company.Fields.AccountNumber')}
                  value={account.accountNumber}
                  onChange={(e) => handleBankAccountChange(index, 'accountNumber', e.target.value)}
                />

                <Input
                  placeholder={t('Settings.Company.Fields.SwiftCode')}
                  value={account.swiftCode}
                  onChange={(e) => handleBankAccountChange(index, 'swiftCode', e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t('Settings.Company.Actions.Saving') : t('Settings.Company.Actions.SaveChanges')}
</Button>
      </form>
    </Form>
  );
}