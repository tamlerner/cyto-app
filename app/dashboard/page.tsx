'use client';

import { useTranslation } from 'react-i18next';
import { BarChart3, Users, FileText, TrendingUp, ArrowUpRight, ArrowDownRight, Building2, Plus } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardMetrics } from './hooks/use-dashboard-metrics';
import { useDashboardInvoiceMetrics_usd } from './hooks/use-dashboard-invoice-metrics-usd';
import { useDashboardMetrics_aoa } from './hooks/use-dashboard-metrics-aoa';
import { MetricCard } from './components/metric-card';
import { formatCurrency } from '@/lib/utils/currency';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { BarChart, Bar, XAxis, YAxis, TooltipProps, CartesianGrid, LabelList, ResponsiveContainer, Legend } from 'recharts';
import HorizontalStackChart from './components/HorizontalStackChart';
import BarChartRevByMonth from './components/BarChartRevByMonth';
import InvoiceSummaryTable from './components/InvoiceSummaryTable';


export default function DashboardPage() {
  const { t } = useTranslation();
  const { metrics, loading, error } = useDashboardMetrics();
  const { metrics_aoa} = useDashboardMetrics_aoa();
  const { metrics_invoices_usd } = useDashboardInvoiceMetrics_usd();
  const formatNumber = (num: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num);
  const formatLabel = (value: number) => (value === 0 ? "" : formatNumber(value));
  const CustomTooltip_FormatNumbers: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ background: "#fff", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
          <p>{`Month: ${payload[0].payload.month}`}</p>
          <p style={{ color: "#576ddb" }}>{`Total Invoiced Amount: ${formatNumber(payload[0].value as number)}`}</p>
          <p style={{ color: "#4CBB17" }}>{`Paid Amount: ${formatNumber(payload[1].value as number)}`}</p>
        </div>
      );
    }
    return null;
  };

  //data to render invoice breakdown per status chart
  const invoiceSummaryDataCount = [
    { name: 'Invoices', 
      paid: metrics_invoices_usd.InvoiceSummary.paid.total_count, 
      sent:  metrics_invoices_usd.InvoiceSummary.sent.total_count, 
      overdue: metrics_invoices_usd.InvoiceSummary.overdue.total_count },
  ];

  // Transform the data into a format where each category is a separate entry
  const transformedData = [
    { name: 'Paid', value: invoiceSummaryDataCount[0].paid },
    { name: 'Sent', value: invoiceSummaryDataCount[0].sent },
    { name: 'Overdue', value: invoiceSummaryDataCount[0].overdue },
  ];

  console.log('Invoice Summary Data:', invoiceSummaryDataCount);


  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t('Dashboard')}
          description={t('Dashboard.Description')}
        />
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <PageHeader
        title={t('Dashboard')}
        description={t('Dashboard.Description')}
        action={
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="relative group">
                <Plus className="mr-2 h-4 w-4" />
                {t('Dashboard.NewPayment')}
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
                  {t('Coming Soon! 🚀')}
                </span>
              </Button>
            </TooltipTrigger>
          </Tooltip>
        }
      />
      
      <div className="grid gap-4 md:grid-cols-4">
        {loading ? (
          <>
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
          </>
        ) : (
          <>
            <MetricCard
              title={t('Dashboard.TotalClients')}
              value={metrics_aoa.thisMonthNewClients.toString()}
              icon={Users}
              href="/clients"
              trend={{
                value: metrics_aoa.trends.clients.value,
                positive: metrics_aoa.trends.clients.positive,
                label: t('Dashboard.VsLastMonth')
              }}
            />
            <MetricCard
              title={t('Dashboard.TotalInvoices')}
              value={metrics_aoa.thisMonthNewInvoices.toString()}
              icon={FileText}
              href="/invoices"
              trend={{
                value: metrics_aoa.trends.invoices.value,
                positive: metrics_aoa.trends.invoices.positive,
                label: t('Dashboard.VsLastMonth')
              }}
            />
            <MetricCard
              title={t('Dashboard.MonthlyRevenue')}
              value={formatCurrency(metrics_aoa.thisMonthRevenue, 'AOA')}
              icon={BarChart3}
              trend={{
                value: metrics_aoa.trends.revenue.value,
                positive: metrics_aoa.trends.revenue.positive,
                label: t('Dashboard.VsLastMonth')
              }}
            />
            <MetricCard
              title={t('Dashboard.ActiveEmployees')}
              value={metrics_aoa.activeEmployees.toString()}
              icon={Users}
              href="/payroll/employees"
              trend={{
                value: metrics_aoa.trends.employees.value,
                positive: metrics_aoa.trends.employees.positive,
                label: t('Dashboard.VsLastMonth')
              }}
            />
          </>
        )}
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {loading ? (
            <>
              <Skeleton className="h-[120px]" />
              <Skeleton className="h-[120px]" />
              <Skeleton className="h-[120px]" />
              <Skeleton className="h-[120px]" />
            </>
          ) : (
            <>
              {/* Existing MetricCards... */}
            </>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
        {/* Invoice Summary Card */}
        <Card className="bg-transparent shadow-none">
          <CardHeader>
            <CardTitle>Invoice Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <InvoiceSummaryTable />
            </div>
            {/* Horizontal Stacked Bar Chart */}
            <div className="mt-8">
              <HorizontalStackChart />
            </div>
          </CardContent>
        </Card>

        {/* Employee Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Dashboard.EmployeeStats')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('Dashboard.EmployeeStatus.Active')}
                  </span>
                  <span className="font-medium">{metrics.employeeStats.active}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('Dashboard.EmployeeStatus.OnLeave')}
                  </span>
                  <span className="font-medium">{metrics.employeeStats.onLeave}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('Dashboard.EmployeeStatus.Total')}
                  </span>
                  <span className="font-medium">{metrics.employeeStats.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('Dashboard.EmployeeStatus.Terminated')}
                  </span>
                  <span className="font-medium">{metrics.employeeStats.terminated}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>


      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue Trends */}
        {/* Revenue Trends */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Dashboard.RevenueTrends')}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Horizontal Stacked Bar Chart */}
              <div className="mt-8"> {/* Adding margin for spacing */}
                <BarChartRevByMonth />
              </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}