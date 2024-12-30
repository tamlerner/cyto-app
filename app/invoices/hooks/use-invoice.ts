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

        // Load invoice
        const { data: invoiceData, error: invoiceError } = await supabase
          .from('invoices')
          .select('*')
          .eq('id', id)
          .single();

        if (invoiceError) throw invoiceError;
        if (!invoiceData) throw new Error('Invoice not found');

        setInvoice(invoiceData);

        // Load invoice items
        const { data: itemsData, error: itemsError } = await supabase
          .from('invoice_items')
          .select('*')
          .eq('invoice_id', id)
          .order('created_at', { ascending: true });

        if (itemsError) throw itemsError;
        setItems(itemsData || []);

      } catch (err) {
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