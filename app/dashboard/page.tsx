'use client';

import { useTranslation } from 'react-i18next';
import { BarChart3, Users, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardMetrics } from './hooks/use-dashboard-metrics';
import { MetricCard } from './components/metric-card';
import { ExchangeRatesGrid } from './components/exchange-rates/exchange-rates-grid';
import { formatCurrency } from '@/lib/utils/currency';

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
      
      <div className="grid gap-4 md:grid-cols-3">
        {loading ? (
          <>
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
            />
            <MetricCard
              title={t('Dashboard.TotalInvoices')}
              value={metrics.totalInvoices.toString()}
              icon={FileText}
              href="/invoices"
            />
            <MetricCard
              title={t('Dashboard.MonthlyRevenue')}
              value={formatCurrency(metrics.monthlyRevenue.usd, 'USD')}
              icon={BarChart3}
            />
          </>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">{t('Dashboard.ExchangeRates')}</h2>
        <ExchangeRatesGrid />
      </div>
    </div>
  );
}