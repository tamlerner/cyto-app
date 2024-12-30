'use client';

import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface InvoiceStatusBadgeProps {
  status: string;
  className?: string;
}

export function InvoiceStatusBadge({ status, className }: InvoiceStatusBadgeProps) {
  const { t } = useTranslation();

  return (
    <Badge 
      variant={getStatusVariant(status)}
      className={cn(getStatusClasses(status), className)}
    >
      {t(`Invoices.Status.${status}`)}
    </Badge>
  );
}

function getStatusVariant(status: string): "default" | "success" | "destructive" | "secondary" | "outline" {
  switch (status) {
    case 'paid':
      return 'success';
    case 'overdue':
      return 'destructive';
    case 'voided':
      return 'outline';
    case 'sent':
      return 'default';
    default:
      return 'secondary';
  }
}

function getStatusClasses(status: string): string {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'overdue':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'voided':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600';
    case 'sent':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
}