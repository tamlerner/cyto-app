'use client';

import { useTranslation } from 'react-i18next';
import { BarChart3, Users, FileText, TrendingUp, ArrowUpRight, ArrowDownRight, Building2, Plus } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardMetrics } from './hooks/use-dashboard-metrics';
import { useDashboardInvoiceMetrics_usd } from './hooks/use-dashboard-invoice-metrics-usd';
import { MetricCard } from './components/metric-card';
import { ExchangeRatesGrid } from './components/exchange-rates/exchange-rates-grid';
import { formatCurrency } from '@/lib/utils/currency';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  TooltipProps,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { metrics, loading, error } = useDashboardMetrics();
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
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {t('ComingSoon')}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('ComingSoon')}</p>
            </TooltipContent>
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
              value={metrics.totalClients.toString()}
              icon={Users}
              href="/clients"
              trend={{
                value: metrics.trends.clients.value,
                positive: metrics.trends.clients.positive,
                label: t('Dashboard.VsLastMonth')
              }}
            />
            <MetricCard
              title={t('Dashboard.TotalInvoices')}
              value={metrics.totalInvoices.toString()}
              icon={FileText}
              href="/invoices"
              trend={{
                value: metrics.trends.invoices.value,
                positive: metrics.trends.invoices.positive,
                label: t('Dashboard.VsLastMonth')
              }}
            />
            <MetricCard
              title={t('Dashboard.MonthlyRevenue')}
              value={formatCurrency(metrics.monthlyRevenue.usd, 'USD')}
              icon={BarChart3}
              trend={{
                value: metrics.trends.revenue.value,
                positive: metrics.trends.revenue.positive,
                label: t('Dashboard.VsLastMonth')
              }}
            />
            <MetricCard
              title={t('Dashboard.ActiveEmployees')}
              value={metrics.employeeStats.active.toString()}
              icon={Users}
              href="/payroll/employees"
              trend={{
                value: metrics.trends.employees.value,
                positive: metrics.trends.employees.positive,
                label: t('Dashboard.VsLastMonth')
              }}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Trends */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Dashboard.RevenueTrends')}</CardTitle>
            </CardHeader>
            <CardContent>
            <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={metrics_invoices_usd.LastSixMo_Revenues}
              margin={{ top: 20, right: 30, bottom: 20, left: 40 }}
            >
              <CartesianGrid stroke="#d3d3d3" vertical={false} strokeWidth={0.5}/>
              
              {/* Update XAxis to use Date_str */}
              <XAxis dataKey="Date_str" />
              
              <YAxis tickFormatter={formatNumber} />
              <Tooltip content={<CustomTooltip_FormatNumbers />} />
              <Legend />
              
              {/* Update Bar dataKey to Revenue */}
              <Bar dataKey="Paid_Invoices" fill="#4CBB17" radius={[5, 5, 0, 0]} name="Paid Amount" isAnimationActive={true}>
                <LabelList dataKey="Paid_Invoices" position="top" fill="#4CBB17" formatter={formatLabel} />
              </Bar>
              <Bar dataKey="Sent_Overview_Invoices" fill="#576edb" radius={[5, 5, 0, 0]} name="Sent & Overdue Amount" isAnimationActive={true}>
                <LabelList dataKey="Sent_Overview_Invoices" position="top" fill="#576edb" formatter={formatLabel} />
              </Bar>
            </BarChart>

            </ResponsiveContainer>

            </CardContent>
        </Card>

        {/* Employee Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Dashboard.EmployeeStats')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
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
              </div>
              <div className="space-y-2">
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

        {/* Exchange Rates */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>{t('Dashboard.ExchangeRates')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ExchangeRatesGrid />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}