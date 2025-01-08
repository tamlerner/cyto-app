'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Invoice, InvoiceItem } from '@/lib/types/invoice';

interface UseInvoiceReturn {
  invoice: Invoice | null;
  items: InvoiceItem[];
  loading: boolean;
  error: string | null;
}

export function useInvoice(id: string): UseInvoiceReturn {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInvoice() {
      try {
        if (!supabase) {
          throw new Error('Supabase client not initialized');
        }

        // Load invoice with client and company details
        const { data: invoiceData, error: invoiceError } = await supabase
          .from('invoices')
          .select(`
            *,
            client:clients(
              id,
              company_name,
              email,
              tax_id,
              headquarters_address,
              city,
              region,
              postal_code,
              country
            ),
            company:invoice_companies(
              id,
              company_name,
              tax_id,
              headquarters_address,
              city,
              region,
              postal_code,
              country
            )
          `)
          .eq('id', id)
          .single();

        if (invoiceError) throw invoiceError;
        if (!invoiceData) throw new Error('Invoice not found');

        setInvoice(invoiceData);

        // Load invoice items with all details
        const { data: itemsData, error: itemsError } = await supabase
          .from('invoice_items')
          .select(`
            *,
            unit_price,
            currency,
            tax_rate,
            tax_amount,
            subtotal,
            total_with_tax,
            tax_exemption_reason,
            unit_of_measure
          `)
          .eq('invoice_id', id)
          .order('created_at', { ascending: true });

        if (itemsError) throw itemsError;
        setItems(itemsData || []);

      } catch (err) {
        console.error('Error loading invoice:', err);
        const message = err instanceof Error ? err.message : 'Failed to load invoice';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadInvoice();
  }, [id]);

  return { invoice, items, loading, error };
}
