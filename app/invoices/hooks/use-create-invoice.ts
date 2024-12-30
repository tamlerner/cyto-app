'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { generateInvoiceNumber } from '@/lib/utils/invoice-utils';
import type { CreateInvoiceData } from '@/lib/types';

export function useCreateInvoice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createInvoice(data: CreateInvoiceData) {
    setLoading(true);
    setError(null);

    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { subtotal, tax_total, total } = calculateTotals(data.items);
      const invoice_number = generateInvoiceNumber();

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Insert invoice
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number,
          client_id: data.client_id,
          issue_date: data.issue_date.toISOString(),
          due_date: data.due_date.toISOString(),
          subtotal,
          tax_total,
          total,
          notes: data.notes,
          status: 'draft',
          user_id: user.id
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;
      if (!invoiceData) throw new Error('Failed to create invoice');

      // Insert invoice items
      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(
          data.items.map(item => ({
            invoice_id: invoiceData.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            tax_rate: item.tax_rate,
            tax_exemption_reason: item.tax_exemption_reason,
            user_id: user.id
          }))
        );

      if (itemsError) throw itemsError;

      return invoiceData;
    } catch (err) {
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

function calculateTotals(items: CreateInvoiceData['items']) {
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