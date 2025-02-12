import { useState } from 'react';
import { supabase, handleSupabaseError } from '@/lib/supabase/client';
import { generateInvoiceNumber } from '@/lib/utils/invoice-utils';
import type { CreateInvoiceData } from '@/lib/types';

// Constants
const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'AOA'] as const;
const SUPPORTED_LANGUAGES = ['en', 'pt', 'fr', 'es'] as const;

// Types
interface ExchangeRates {
  USD_EUR: number;
  USD_AOA: number;
  EUR_AOA: number;
}

interface ValidationError extends Error {
  field?: string;
}

// Validation functions
function validateInvoiceData(data: CreateInvoiceData) {
  if (!data.client_id) {
    const error = new Error('Client ID is required') as ValidationError;
    error.field = 'client_id';
    throw error;
  }

  if (!SUPPORTED_CURRENCIES.includes(data.currency as any)) {
    const error = new Error(`Invalid currency. Supported currencies are: ${SUPPORTED_CURRENCIES.join(', ')}`) as ValidationError;
    error.field = 'currency';
    throw error;
  }

  if (!SUPPORTED_LANGUAGES.includes(data.language as any)) {
    const error = new Error(`Invalid language. Supported languages are: ${SUPPORTED_LANGUAGES.join(', ')}`) as ValidationError;
    error.field = 'language';
    throw error;
  }

  if (!data.items?.length) {
    const error = new Error('At least one invoice item is required') as ValidationError;
    error.field = 'items';
    throw error;
  }

  data.items.forEach((item, index) => {
    if (!item.description) {
      const error = new Error(`Item ${index + 1}: Description is required`) as ValidationError;
      error.field = `items.${index}.description`;
      throw error;
    }

    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      const error = new Error(`Item ${index + 1}: Quantity must be a positive number`) as ValidationError;
      error.field = `items.${index}.quantity`;
      throw error;
    }

    if (typeof item.unit_price !== 'number' || item.unit_price < 0) {
      const error = new Error(`Item ${index + 1}: Unit price must be a non-negative number`) as ValidationError;
      error.field = `items.${index}.unit_price`;
      throw error;
    }

    if (typeof item.tax_rate !== 'number' || item.tax_rate < 0) {
      const error = new Error(`Item ${index + 1}: Tax rate must be a non-negative number`) as ValidationError;
      error.field = `items.${index}.tax_rate`;
      throw error;
    }
  });
}

// Utility functions
function formatNumber(num: number, decimals: number = 6): number {
  return Number(Number(num).toFixed(decimals));
}

function formatDate(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date provided');
  }
  return date.toISOString();
}

export function useCreateInvoice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchExchangeRates(): Promise<ExchangeRates> {
    try {
      // TODO: Replace with actual API call
      return {
        USD_EUR: 0.85,
        USD_AOA: 825.0,
        EUR_AOA: 971.0
      };
    } catch (err) {
      console.error('Error fetching exchange rates:', err);
      throw new Error('Failed to fetch exchange rates. Please try again later.');
    }
  }

  async function getOrCreateCompany(userId: string) {
    // First try to get existing company
    const { data: existingCompany, error: fetchError } = await supabase
      .from('invoice_companies')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching company:', fetchError);
      throw new Error(handleSupabaseError(fetchError));
    }

    if (existingCompany) {
      return existingCompany;
    }

    // If no company exists, create one
    const { data: newCompany, error: createError } = await supabase
      .from('invoice_companies')
      .insert({
        user_id: userId,
        company_name: 'My Company',
        tax_id: 'Default Tax ID',
        headquarters_address: 'Default Address',
        city: 'Default City',
        region: 'Default Region',
        country: 'Default Country',
        postal_code: '00000',
        default_currency: 'USD',
        share_capital_currency: 'USD',
        bank_name_usd: 'Default USD Bank',
        bank_account_number_usd: 'Default USD Account',
        bank_name_eur: 'Default EUR Bank',
        bank_account_number_eur: 'Default EUR Account',
        bank_name_aoa: 'Default AOA Bank',
        bank_account_number_aoa: 'Default AOA Account'
      })
      .select('id')
      .single();

    if (createError) {
      console.error('Error creating company:', createError);
      throw new Error(handleSupabaseError(createError));
    }

    if (!newCompany) {
      throw new Error('Failed to create default company');
    }

    return newCompany;
  }

  function calculateTotals(items: CreateInvoiceData['items']) {
    try {
      const subtotal = formatNumber(items.reduce((sum, item) => 
        sum + (Number(item.quantity) * Number(item.unit_price)), 0));
      
      const tax_total = formatNumber(items.reduce((sum, item) => {
        const itemTotal = Number(item.quantity) * Number(item.unit_price);
        return sum + (itemTotal * Number(item.tax_rate)) / 100;
      }, 0));
      
      return {
        subtotal,
        tax_total,
        total: formatNumber(subtotal + tax_total)
      };
    } catch (err) {
      console.error('Error calculating totals:', err);
      throw new Error('Failed to calculate invoice totals');
    }
  }

  function convertAmounts(
    sourceCurrency: string,
    amounts: { subtotal: number; tax_total: number; total: number },
    rates: ExchangeRates
  ) {
    try {
      let subtotal_usd: number;
      let tax_total_usd: number;
      let total_usd: number;

      // Convert to USD first
      switch (sourceCurrency) {
        case 'USD':
          subtotal_usd = amounts.subtotal;
          tax_total_usd = amounts.tax_total;
          total_usd = amounts.total;
          break;
        case 'EUR':
          subtotal_usd = amounts.subtotal * (1 / rates.USD_EUR);
          tax_total_usd = amounts.tax_total * (1 / rates.USD_EUR);
          total_usd = amounts.total * (1 / rates.USD_EUR);
          break;
        case 'AOA':
          subtotal_usd = amounts.subtotal / rates.USD_AOA;
          tax_total_usd = amounts.tax_total / rates.USD_AOA;
          total_usd = amounts.total / rates.USD_AOA;
          break;
        default:
          throw new Error(`Unsupported currency: ${sourceCurrency}`);
      }

      return {
        subtotal_usd: formatNumber(subtotal_usd),
        tax_total_usd: formatNumber(tax_total_usd),
        total_usd: formatNumber(total_usd),
        subtotal_eur: formatNumber(subtotal_usd * rates.USD_EUR),
        tax_total_eur: formatNumber(tax_total_usd * rates.USD_EUR),
        total_eur: formatNumber(total_usd * rates.USD_EUR),
        subtotal_aoa: formatNumber(subtotal_usd * rates.USD_AOA),
        tax_total_aoa: formatNumber(tax_total_usd * rates.USD_AOA),
        total_aoa: formatNumber(total_usd * rates.USD_AOA)
      };
    } catch (err) {
      console.error('Error converting amounts:', err);
      throw new Error('Failed to convert amounts between currencies');
    }
  }

  async function createInvoice(data: CreateInvoiceData) {
    setLoading(true);
    setError(null);

    try {
      console.log('Starting invoice creation with data:', data);

      validateInvoiceData(data);

      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No authenticated user');

      const exchangeRates = await fetchExchangeRates();
      console.log('Exchange rates:', exchangeRates);

      const companyData = await getOrCreateCompany(user.id);
      console.log('Company data:', companyData);

      const { subtotal, tax_total, total } = calculateTotals(data.items);
      const convertedAmounts = convertAmounts(data.currency, { subtotal, tax_total, total }, exchangeRates);

      const invoicePayload = {
        invoice_number: generateInvoiceNumber(),
        client_id: data.client_id,
        company_id: companyData.id,
        issue_date: formatDate(data.issue_date),
        due_date: formatDate(data.due_date),
        currency: data.currency,
        language: data.language,
        subtotal,
        tax_total,
        total,
        ...convertedAmounts,
        exchange_rate_usd_to_eur: formatNumber(exchangeRates.USD_EUR),
        exchange_rate_usd_to_aoa: formatNumber(exchangeRates.USD_AOA),
        exchange_rate_eur_to_aoa: formatNumber(exchangeRates.EUR_AOA),
        notes: data.notes || '',
        status: 'draft',
        user_id: user.id
      };

      console.log('Invoice payload:', invoicePayload);

      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert(invoicePayload)
        .select()
        .single();

      if (invoiceError) {
        console.error('Invoice creation error:', invoiceError);
        throw new Error(handleSupabaseError(invoiceError));
      }

      if (!invoiceData) throw new Error('Failed to create invoice');

      const invoiceItems = data.items.map(item => ({
        invoice_id: invoiceData.id,
        description: item.description,
        quantity: formatNumber(item.quantity),
        unit_price: formatNumber(item.unit_price),
        currency: data.currency,
        exchange_rate_usd_to_eur: formatNumber(exchangeRates.USD_EUR),
        exchange_rate_usd_to_aoa: formatNumber(exchangeRates.USD_AOA),
        exchange_rate_eur_to_aoa: formatNumber(exchangeRates.EUR_AOA),
        tax_rate: formatNumber(item.tax_rate),
        tax_exemption_reason: item.tax_exemption_reason || null,
        user_id: user.id,
        unit_of_measure: 'unit',
        intra_community_supply: false,
        reverse_charge: false,
        discount_percentage: 0,
        discount_amount: 0
      }));

      console.log('Invoice items payload:', invoiceItems);

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(invoiceItems);

      if (itemsError) {
        console.error('Invoice items creation error:', itemsError);
        throw new Error(handleSupabaseError(itemsError));
      }

      return invoiceData;
    } catch (err) {
      console.error('Detailed error:', err);
      const message = err instanceof Error ? err.message : 'Failed to create invoice';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    createInvoice,
    loading,
    error
  };
}