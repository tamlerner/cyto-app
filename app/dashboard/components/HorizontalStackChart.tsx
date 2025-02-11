import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LabelList } from 'recharts';import { useDashboardInvoiceMetrics_usd } from '../hooks/use-dashboard-invoice-metrics-usd';

const HorizontalStackChart: React.FC = () => {
  const { metrics_invoices_usd } = useDashboardInvoiceMetrics_usd();

  const data = [{
    name: 'Invoices Summary', 
    paid: metrics_invoices_usd.InvoiceSummary.paid.total_count || 0, 
    sent: metrics_invoices_usd.InvoiceSummary.sent.total_count || 0,
    overdue: metrics_invoices_usd.InvoiceSummary.overdue.total_count || 0
  }];

  return (
    <ResponsiveContainer width="100%" height={100}>
      <BarChart data={data} layout="vertical">
        <XAxis 
          type="number" 
          tick={{ fontSize: 14 }} 
          domain={[0, 'dataMax']} 
          hide={true} // Hides the X-axis
        />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 14 }} width={150} hide={true} />
        {/* Tooltip is removed to disable hover effect */}
        <Legend />
        <Bar 
          dataKey="paid" 
          stackId="a" 
          fill="#4CBB17" 
          radius={[10, 0, 0, 10]} 
        >
          <LabelList dataKey="paid" position="center" fontSize={12} fill="#FFFFFF" />
        </Bar>
        <Bar 
          dataKey="sent" 
          stackId="a" 
          fill="#576edb"
        >
          <LabelList dataKey="sent" position="center" fontSize={12} fill="#FFFFFF" />
        </Bar>
        <Bar 
          dataKey="overdue" 
          stackId="a" 
          fill="#FF5733"
          radius={[0, 10, 10, 0]} 
        >
          <LabelList dataKey="overdue" position="center" fontSize={12} fill="#FFFFFF" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>



  );
};

export default HorizontalStackChart;