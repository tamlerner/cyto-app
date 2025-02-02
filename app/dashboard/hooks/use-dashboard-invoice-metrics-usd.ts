'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';

interface DashboardInvoiceMetrics_usd {
  LastSixMo_Revenues: Array<{
    Date_str: string;
    Paid_Invoices: number;
    Sent_Overview_Invoices: number;
  }>;
}

export function useDashboardInvoiceMetrics_usd() {
  const [metrics_invoices_usd, setMetrics] = useState<DashboardInvoiceMetrics_usd>({
    LastSixMo_Revenues: [],
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

        const { data, error } = await supabase.rpc('get_paid_and_sent_amount_per_month_usd', { user_id: user.id });

        if (error) {
          throw error;
        }

        // Format the data into the desired format
        const formattedData: Array<{
          Date_str: string;
          Paid_Invoices: number;
          Sent_Overview_Invoices: number;
        }> = [];

        data.forEach((item: { month: string; paid_amount: number; sent_overdue_amount: number }) => {
          const month = new Date(item.month); // Convert the month string to a Date object
          const formattedMonth = month.toLocaleString('default', { month: 'short', year: '2-digit' }); // Format to 'mmm yy'
          
          formattedData.push({
            Date_str: formattedMonth,
            Paid_Invoices: item.paid_amount,
            Sent_Overview_Invoices: item.sent_overdue_amount,
          });
        });


        const reversedFormattedData = formattedData.reverse();

        if (mounted) {
          setMetrics({
            LastSixMo_Revenues: reversedFormattedData,
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
      
      supabase
        .channel('employees_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'employees', filter: `user_id=eq.${user?.id}` },
          () => loadMetrics()
        )
        .subscribe(),
    ];

    return () => {
      mounted = false;
      channels.forEach(channel => channel.unsubscribe());
    };
  }, [user]);

  return { metrics_invoices_usd, loading, error };
}