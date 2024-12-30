'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';

interface DashboardMetrics {
  totalClients: number;
  totalInvoices: number;
  monthlyRevenue: {
    usd: number;
    eur: number;
    aoa: number;
  };
}

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalClients: 0,
    totalInvoices: 0,
    monthlyRevenue: { usd: 0, eur: 0, aoa: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;

    async function loadMetrics() {
      try {
        if (!user) return;

        setLoading(true);
        setError(null);

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        // Get total clients
        const { count: clientCount, error: clientError } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (clientError) throw clientError;

        // Get total invoices
        const { count: invoiceCount, error: invoiceError } = await supabase
          .from('invoices')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (invoiceError) throw invoiceError;

        // Get monthly revenue
        const { data: monthlyInvoices, error: revenueError } = await supabase
          .from('invoices')
          .select('total, total_usd, total_eur, total_aoa, currency')
          .eq('user_id', user.id)
          .gte('created_at', startOfMonth.toISOString())
          .eq('status', 'paid');

        if (revenueError) throw revenueError;

        const monthlyRevenue = (monthlyInvoices || []).reduce(
          (acc, invoice) => ({
            usd: acc.usd + (invoice.total_usd || 0),
            eur: acc.eur + (invoice.total_eur || 0),
            aoa: acc.aoa + (invoice.total_aoa || 0),
          }),
          { usd: 0, eur: 0, aoa: 0 }
        );

        if (mounted) {
          setMetrics({
            totalClients: clientCount || 0,
            totalInvoices: invoiceCount || 0,
            monthlyRevenue,
          });
        }
      } catch (err) {
        console.error('Error loading dashboard metrics:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load metrics');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadMetrics();

    // Set up real-time subscriptions
    const channels = [
      supabase
        .channel('clients_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'clients', filter: `user_id=eq.${user?.id}` },
          () => loadMetrics()
        )
        .subscribe(),
      
      supabase
        .channel('invoices_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'invoices', filter: `user_id=eq.${user?.id}` },
          () => loadMetrics()
        )
        .subscribe(),
    ];

    return () => {
      mounted = false;
      channels.forEach(channel => channel.unsubscribe());
    };
  }, [user]);

  return { metrics, loading, error };
}