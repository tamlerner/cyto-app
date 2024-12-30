'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  href?: string;
}

export function MetricCard({ title, value, icon: Icon, href }: MetricCardProps) {
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
      </CardContent>
    </Card>
  );
}