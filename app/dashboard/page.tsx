'use client';

import { useTranslation } from 'react-i18next';
import { BarChart3, Users, FileText, TrendingUp, ArrowUpRight, ArrowDownRight, Building2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardMetrics } from './hooks/use-dashboard-metrics';
import { MetricCard } from './components/metric-card';
import { ExchangeRatesGrid } from './components/exchange-rates/exchange-rates-grid';
import { formatCurrency } from '@/lib/utils/currency';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { metrics, loading, error } = useDashboardMetrics();

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
                label: 'vs last month'
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
                label: 'vs last month'
              }}
            />
            <MetricCard
              title={t('Dashboard.MonthlyRevenue')}
              value={formatCurrency(metrics.monthlyRevenue.usd, 'USD')}
              icon={BarChart3}
              trend={{
                value: metrics.trends.revenue.value,
                positive: metrics.trends.revenue.positive,
                label: 'vs last month'
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
                label: 'vs last month'
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8884d8" />
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
                  <span className="text-sm text-muted-foreground">Active</span>
                  <span className="font-medium">{metrics.employeeStats.active}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">On Leave</span>
                  <span className="font-medium">{metrics.employeeStats.onLeave}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-medium">{metrics.employeeStats.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Terminated</span>
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