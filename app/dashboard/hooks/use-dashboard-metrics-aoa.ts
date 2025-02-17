'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';

interface DashboardMetrics_aoa {
  thisMonthRevenue: number;
  thisMonthNewClients: number;
  thisMonthNewInvoices: number;
  activeEmployees: number;
  revenueByMonth:Array<{
    Date_str: string;
    Paid_Invoices: number;
    Sent_Invoices: number;
    Overdue_Invoices: number;
  }>;
  InvoiceSummary: {
    overdue: {
      total_count: number;
      total_amount: number;
    };
    paid: {
      total_count: number;
      total_amount: number;
    };
    sent: {
      total_count: number;
      total_amount: number;
    };
  }
  trends: {
    invoices: {
      value: number;
      positive: boolean;
    };
    revenue: {
      value: number;
      positive: boolean;
    };
    clients: {
      value: number;
      positive: boolean;
    };
    employees: {
      value: number;
      positive: boolean;
    };
    
  };
}

export function useDashboardMetrics_aoa() {
  const [metrics_aoa, setMetrics] = useState<DashboardMetrics_aoa>({
    thisMonthRevenue: 0,
    thisMonthNewClients: 0,
    thisMonthNewInvoices: 0,
    activeEmployees: 0,
    revenueByMonth: [],
    InvoiceSummary: {
      overdue: { total_count: 0, total_amount: 0 },
      paid: { total_count: 0, total_amount: 0 },
      sent: { total_count: 0, total_amount: 0 }
    },
    trends: {
      invoices: { value: 0, positive: true },
      revenue: { value: 0, positive: true },
      clients: { value: 0, positive: true },
      employees: { value: 0, positive: true },
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

        //
        //Fetch AOA Revenue data per month
        //
        const { data: revenueByMonthData, error: revenueByMonthDataError } = await supabase.rpc(
          'get_paid_sent_overdue_amount_per_month_aoa',
          { p_user_id: user.id }
        );
        
        if (revenueByMonthDataError) {
          throw revenueByMonthDataError;
        }
        
        // Transform the fetched data into the desired format
        const formattedRevenueByMonth = revenueByMonthData.map((entry: any) => ({
          Date_str: entry.month, // Keeping the month as is
          Paid_Invoices: parseFloat(entry.paid_amount), // Convert string to number
          Sent_Invoices: parseFloat(entry.sent_amount), // Convert string to number
          Overdue_Invoices: parseFloat(entry.overdue_amount), // Convert string to number
        }));

        // Get the latest and last month's revenues
        let latestMonth = formattedRevenueByMonth.find(item => item.Paid_Invoices > 0);
        let lastMonth = formattedRevenueByMonth.slice(0, formattedRevenueByMonth.indexOf(latestMonth)).find(item => item.Paid_Invoices > 0);

        // Store the results in variables
        let thisMonthRevenue = latestMonth ? latestMonth.Paid_Invoices : 0;

        let lastMonthRevenue = lastMonth ? lastMonth.Paid_Invoices : 0;
        let revenuesGrowth = (thisMonthRevenue && lastMonthRevenue) ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

        

        console.log("revenuesGrowth", revenuesGrowth)
        console.log("lastMonthRevenue", lastMonthRevenue)
        console.log("RevByMonth", formattedRevenueByMonth)

        //
        // Invoice summary
        //
        const { data: invoiceSummaryData, error: invoiceSummaryError } = await supabase.rpc(
          'get_aoa_invoice_summary',
          { p_user_id: user.id }
        );
        
        if (invoiceSummaryError) {
          throw invoiceSummaryError;
        }
        
        // Initialize formatted invoice summary with zero values
        const formattedInvoiceSummary = {
          overdue: {
            total_count: 0,
            total_amount: 0,
          },
          paid: {
            total_count: 0,
            total_amount: 0,
          },
          sent: {
            total_count: 0,
            total_amount: 0,
          },
        };
        
        // Debug: Log the data returned from the function to understand its structure
        console.log('Invoice Summary Data:', invoiceSummaryData);
        
        // Format the invoice summary data
        invoiceSummaryData.forEach((item: {
          invoice_status: 'overdue' | 'paid' | 'sent'; 
          invoice_count: number; 
          total_outstanding: string; 
        }) => {
          if (formattedInvoiceSummary[item.invoice_status]) {
            formattedInvoiceSummary[item.invoice_status].total_count = item.invoice_count;
            formattedInvoiceSummary[item.invoice_status].total_amount = parseFloat(item.total_outstanding);
          }
        });
        
        // Log the formatted data to verify
        console.log("Formatted Invoice Summary Data:", formattedInvoiceSummary);

        //
        // This Mo new clients and trends
        //
        const { data: clientData, error: clientError } = await supabase.rpc(
          'get_clients_per_month',
          { p_user_id: user.id }
        );
        
        if (clientError) {
          throw clientError;
        }

        // Destructure values from the clientData
        const thisMonthNewClients = clientData?.[0]?.current_month_clients || 0;
        const lastMonthNewClients = clientData?.[0]?.last_month_clients || 0;

        // Calculate growth percentage
        const newClientGrowthvsLastMo = lastMonthNewClients === 0 
          ? (thisMonthNewClients > 0 ? 100 : 0) 
          : ((thisMonthNewClients - lastMonthNewClients) / lastMonthNewClients) * 100;

        
        //
        // This Mo new invoices and trends
        //
        const { data: invoiceData, error: invoiceError } = await supabase.rpc(
          'get_invoices_per_month_aoa',
          { p_user_id: user.id }
        );
        
        if (invoiceError) {
          throw invoiceError;
        }

        // Destructure values from the clientData
        const thisMonthNewInvoices = invoiceData?.[0]?.current_month_invoices || 0;
        const lastMonthNewInvoices = invoiceData?.[0]?.last_month_invoices || 0;

        // Calculate growth percentage
        const newInvoiceGrowthvsLastMo = lastMonthNewInvoices === 0 
          ? (thisMonthNewInvoices > 0 ? 100 : 0) 
          : ((thisMonthNewInvoices - lastMonthNewInvoices) / lastMonthNewInvoices) * 100;

        //
        // active employees and trends
        //
        const { data: activeEmployeeCountData, error: activeEmployeeCountError } = await supabase.rpc('get_employee_counts', {
          user_uuid: user.id,
        });
      
        // Handle error if any
        if (activeEmployeeCountError) {
          throw activeEmployeeCountError;
        }
      
        // Debugging: log the raw response to check the structure
        console.log("Active Employee Count Data:", activeEmployeeCountData);
      
        // Extract values from the response, ensuring safe access
        const currentmonthactiveemployees = activeEmployeeCountData?.[0]?.currentmonthactiveemployees || 0;
        const lastmonthactiveemployees = activeEmployeeCountData?.[0]?.lastmonthactiveemployees || 0;
      
        // Debugging: log the extracted values
        console.log("Current Month Active Employees:", currentmonthactiveemployees);
        console.log("Last Month Active Employees:", lastmonthactiveemployees);
      
        // Calculate active employee growth
        let activeEmployeeGrowthvsLastMo = 0;
      
        // Check if there are last month employees to avoid division by zero
        if (lastmonthactiveemployees > 0) {
          activeEmployeeGrowthvsLastMo = ((currentmonthactiveemployees - lastmonthactiveemployees) * 100) / lastmonthactiveemployees;
        } else {
          activeEmployeeGrowthvsLastMo = 0; // If no employees last month, set growth to null
        }


        if (mounted) {
          setMetrics({
            revenueByMonth: formattedRevenueByMonth,
            thisMonthRevenue: thisMonthRevenue || 0,
            thisMonthNewClients: thisMonthNewClients || 0,
            thisMonthNewInvoices: thisMonthNewInvoices || 0,
            activeEmployees: currentmonthactiveemployees || 0,
            InvoiceSummary: formattedInvoiceSummary,
            trends: {
              invoices: { value: newInvoiceGrowthvsLastMo, positive: newInvoiceGrowthvsLastMo >= 0 },
              revenue: { value: revenuesGrowth, positive: revenuesGrowth >= 0 },
              clients: { value: newClientGrowthvsLastMo, positive: newClientGrowthvsLastMo >= 0 },
              employees: { value: activeEmployeeGrowthvsLastMo, positive: activeEmployeeGrowthvsLastMo >= 0 }, // Would need historical data
            }
          });
        }
      } catch (err) {
        console.error('Error loading AOA dashboard metrics:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load AOA metrics');
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

  return { metrics_aoa, loading, error };
}