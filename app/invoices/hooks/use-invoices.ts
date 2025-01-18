'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import type { Invoice } from '@/lib/types/invoice';

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadInvoices = async () => {
    let mounted = true;
    console.log('loadInvoices called');
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        console.log('No user found, setting invoices to empty');
        setInvoices([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('invoices')
        .select(`
          *,
          client:clients (
            company_name,
            tax_id,
            headquarters_address,
            city,
            region,
            postal_code,
            country,
            email
          ),
          company:invoice_companies (
            company_name,
            tax_id,
            headquarters_address,
            city,
            region,
            postal_code,
            country
          ),
          items:invoice_items (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      if (mounted) {
        console.log('Fetched invoices:', data);
        setInvoices(data || []);
        console.log('Invoices state updated:', data || []);
      }
    } catch (err) {
      console.error('Error loading invoices:', err);
      if (mounted) {
        setError(err instanceof Error ? err.message : 'Failed to load invoices');
      }
    } finally {
      if (mounted) {
        setLoading(false);
        console.log('Loading finished');
      }
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [user]);

  return { invoices, loading, error, loadInvoices };
}
