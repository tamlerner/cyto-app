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

  useEffect(() => {
    let mounted = true;

    async function loadInvoices() {
      try {
        setLoading(true);
        setError(null);

        if (!user) {
          setInvoices([]);
          return;
        }

        const { data, error: fetchError } = await supabase
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
            ),
            items:invoice_items(*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        
        if (mounted) {
          setInvoices(data || []);
        }
      } catch (err) {
        console.error('Error loading invoices:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load invoices');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadInvoices();

    // Set up real-time subscription
    const channel = supabase
      .channel('invoices_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'invoices',
          filter: `user_id=eq.${user?.id}`
        }, 
        () => {
          loadInvoices();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      channel.unsubscribe();
    };
  }, [user]);

  return { invoices, loading, error };
}