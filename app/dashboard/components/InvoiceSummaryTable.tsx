import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LabelList } from 'recharts';
import { useDashboardMetrics_aoa } from '../hooks/use-dashboard-metrics-aoa';

const InvoiceSummaryTable: React.FC = () => {
  const { metrics_aoa } = useDashboardMetrics_aoa();

  const data = [{
    name: 'Invoices Summary', 
    paid: metrics_aoa.InvoiceSummary.paid.total_count || 0, 
    sent: metrics_aoa.InvoiceSummary.sent.total_count || 0,
    overdue: metrics_aoa.InvoiceSummary.overdue.total_count || 0
  }];

  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-300 pb-2">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className="text-sm text-muted-foreground">Number of Invoices</span>
            <span className="text-sm text-muted-foreground">Amount Outstanding</span>
        </div>

        {(["paid", "sent", "overdue"] as const).map((status) => (
            <div key={status} className="flex items-center justify-between border-b border-gray-100 py-2">
                <span className="capitalize">{status}</span>
                <span className="font-medium text-center">
                    {new Intl.NumberFormat("en-US").format(
                        metrics_aoa.InvoiceSummary[status].total_count
                    )}
                </span>
                <span className="font-medium">
                    {new Intl.NumberFormat('pt-AO', {
                        style: 'currency',
                        currency: 'AOA',
                    }).format(metrics_aoa.InvoiceSummary[status].total_amount)}
                </span>
            </div>
        ))}
    </div>

  );
};

export default InvoiceSummaryTable;