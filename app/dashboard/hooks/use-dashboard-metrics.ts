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
  employeeStats: {
    total: number;
    active: number;
    onLeave: number;
    terminated: number;
  };
  revenueByMonth: Array<{
    month: string;
    revenue: number;
  }>;
  employeeGrowth: Array<{
    month: string;
    count: number;
  }>;
  clientAcquisition: Array<{
    month: string;
    new: number;
    churned: number;
  }>;
  trends: {
    clients: {
      value: number;
      positive: boolean;
    };
    invoices: {
      value: number;
      positive: boolean;
    };
    revenue: {
      value: number;
      positive: boolean;
    };
    employees: {
      value: number;
      positive: boolean;
    };
  };
}

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalClients: 0,
    totalInvoices: 0,
    monthlyRevenue: { usd: 0, eur: 0, aoa: 0 },
    employeeStats: { total: 0, active: 0, onLeave: 0, terminated: 0 },
    revenueByMonth: [],
    employeeGrowth: [],
    clientAcquisition: [],
    trends: {
      clients: { value: 0, positive: true },
      invoices: { value: 0, positive: true },
      revenue: { value: 0, positive: true },
      employees: { value: 0, positive: true }
    }
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

        const startOfLastMonth = new Date(startOfMonth);
        startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

        // Get total clients and calculate trend
        const { count: currentClients, error: clientError } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        const { count: lastMonthClients } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .lt('created_at', startOfMonth.toISOString());

        if (clientError) throw clientError;

        // Get total invoices and calculate trend
        const { count: currentInvoices, error: invoiceError } = await supabase
          .from('invoices')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        const { count: lastMonthInvoices } = await supabase
          .from('invoices')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .lt('created_at', startOfMonth.toISOString());

        if (invoiceError) throw invoiceError;

        // Get employee stats
        const { data: employeeData, error: employeeError } = await supabase
          .from('employees')
          .select('status')
          .eq('user_id', user.id);

        if (employeeError) throw employeeError;

        const employeeStats = {
          total: employeeData?.length || 0,
          active: employeeData?.filter(e => e.status === 'active').length || 0,
          onLeave: employeeData?.filter(e => e.status === 'on_leave').length || 0,
          terminated: employeeData?.filter(e => e.status === 'terminated').length || 0
        };

        // Get monthly revenue data
        const { data: monthlyInvoices, error: revenueError } = await supabase
          .from('invoices')
          .select('total, total_usd, total_eur, total_aoa, currency, created_at')
          .eq('user_id', user.id)
          .eq('status', 'paid')
          .gte('created_at', startOfLastMonth.toISOString());

        if (revenueError) throw revenueError;

        // Calculate revenue by month
        const revenueByMonth = monthlyInvoices?.reduce((acc, invoice) => {
          const month = new Date(invoice.created_at).toLocaleString('default', { month: 'short' });
          const existingMonth = acc.find(m => m.month === month);
          if (existingMonth) {
            existingMonth.revenue += invoice.total_usd || 0;
          } else {
            acc.push({ month, revenue: invoice.total_usd || 0 });
          }
          return acc;
        }, [] as Array<{ month: string; revenue: number }>);

        // Calculate trends
        const clientTrend = lastMonthClients ? ((currentClients - lastMonthClients) / lastMonthClients) * 100 : 0;
        const invoiceTrend = lastMonthInvoices ? ((currentInvoices - lastMonthInvoices) / lastMonthInvoices) * 100 : 0;

        if (mounted) {
          setMetrics({
            totalClients: currentClients || 0,
            totalInvoices: currentInvoices || 0,
            monthlyRevenue: {
              usd: monthlyInvoices?.reduce((sum, inv) => sum + (inv.total_usd || 0), 0) || 0,
              eur: monthlyInvoices?.reduce((sum, inv) => sum + (inv.total_eur || 0), 0) || 0,
              aoa: monthlyInvoices?.reduce((sum, inv) => sum + (inv.total_aoa || 0), 0) || 0
            },
            employeeStats,
            revenueByMonth: revenueByMonth || [],
            employeeGrowth: [], // This would need historical employee data
            clientAcquisition: [], // This would need historical client data
            trends: {
              clients: { value: Math.abs(clientTrend), positive: clientTrend >= 0 },
              invoices: { value: Math.abs(invoiceTrend), positive: invoiceTrend >= 0 },
              revenue: { value: 0, positive: true }, // Would need historical data
              employees: { value: 0, positive: true } // Would need historical data
            }
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

  return { metrics, loading, error };
}