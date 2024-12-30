'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { InvoiceCompany } from '@/lib/types';

export function useCompanies() {
  const [companies, setCompanies] = useState<InvoiceCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCompanies() {
      try {
        const { data, error: supabaseError } = await supabase
          .from('invoice_companies')
          .select('*')
          .order('created_at', { ascending: false });

        if (supabaseError) throw supabaseError;
        setCompanies(data || []);
      } catch (err) {
        console.error('Error loading companies:', err);
        setError(err instanceof Error ? err.message : 'Failed to load companies');
      } finally {
        setLoading(false);
      }
    }

    loadCompanies();
  }, []);

  return { companies, loading, error };
}