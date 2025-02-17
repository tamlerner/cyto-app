import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LabelList } from 'recharts';
import { useDashboardMetrics_aoa } from '../hooks/use-dashboard-metrics-aoa';

// Custom label component
const CustomLabel = (props) => {
  const { x, y, value, fill } = props;
  if (!value) return null; // Avoid displaying empty labels

  return (
    <text 
      x={x + 20} // Shift to the right
      y={y - 10} // Shift upwards
      fill={fill} // Match bar color
      fontSize={12}
      textAnchor="middle"
      transform={`rotate(-45, ${x + 10}, ${y - 10})`} // Rotate -45 degrees
    >
      {value.toLocaleString()} {/* Format number with comma separators */}
    </text>
  );
};

const BarChartRevByMonth: React.FC = () => {
  const { metrics_aoa } = useDashboardMetrics_aoa();
  const data = metrics_aoa.revenueByMonth;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={[...data].reverse()}>
        {/* X-axis: Months */}
        <XAxis 
          dataKey="Date_str" 
          tick={{ fontSize: 14 }} 
        />

        {/* Y-axis: Invoice Amounts */}
        <YAxis 
          tick={{ fontSize: 14 }} 
          tickFormatter={(value) => value.toLocaleString()} 
        />

        {/* Tooltip for hover details */}
        
        
        {/* Legend with formatted labels */}
        <Legend formatter={(value) => value.replace(/_/g, ' ')} />

        {/* Paid invoices bar */}
        <Bar dataKey="Paid_Invoices" fill="#4CBB17" radius={[5, 5, 0, 0]}>
          <LabelList dataKey="Paid_Invoices" content={(props) => <CustomLabel {...props} fill="#666666" />} />
        </Bar>

        {/* Sent invoices bar */}
        <Bar dataKey="Sent_Invoices" fill="#576edb" radius={[5, 5, 0, 0]}>
          <LabelList dataKey="Sent_Invoices" content={(props) => <CustomLabel {...props} fill="#666666" />} />
        </Bar>

        {/* Overdue invoices bar */}
        <Bar dataKey="Overdue_Invoices" fill="#FF5733" radius={[5, 5, 0, 0]}>
          <LabelList dataKey="Overdue_Invoices" content={(props) => <CustomLabel {...props} fill="#666666" />} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartRevByMonth;
