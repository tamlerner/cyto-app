'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DivideIcon as LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  href?: string;
  trend?: {
    value: number;
    positive: boolean;
    label: string;
  };
}

export function MetricCard({ title, value, icon: Icon, href, trend }: MetricCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <Card
      onClick={handleClick}
      className={`${href ? 'cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg' : ''}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">
            {trend.positive ? (
              <ArrowUpRight className="w-3 h-3 inline text-green-500" />
            ) : (
              <ArrowDownRight className="w-3 h-3 inline text-red-500" />
            )}
            <span className={trend.positive ? 'text-green-500' : 'text-red-500'}>
              {trend.value}%
            </span>
            {' '}
            <span className="text-muted-foreground">{trend.label}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}