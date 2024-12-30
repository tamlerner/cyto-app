'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';
import { InvoiceStatusBadge } from './invoice-status-badge';

interface UpdateInvoiceStatusProps {
  invoiceId: string;
  currentStatus: string;
  onStatusChange?: () => void;
}

export function UpdateInvoiceStatus({ 
  invoiceId, 
  currentStatus,
  onStatusChange 
}: UpdateInvoiceStatusProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);

  async function updateStatus(newStatus: string) {
    if (updating || newStatus === currentStatus) return;

    try {
      setUpdating(true);

      const { error } = await supabase
        .from('invoices')
        .update({ status: newStatus })
        .eq('id', invoiceId);

      if (error) throw error;

      toast({
        title: t('Invoices.StatusUpdateSuccess'),
      });

      onStatusChange?.();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('Invoices.StatusUpdateError'),
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setUpdating(false);
    }
  }

  return (
    <Select
      value={currentStatus}
      onValueChange={updateStatus}
      disabled={updating}
    >
      <SelectTrigger className="h-8">
        <SelectValue>
          <InvoiceStatusBadge status={currentStatus} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="draft">
          <InvoiceStatusBadge status="draft" />
        </SelectItem>
        <SelectItem value="sent">
          <InvoiceStatusBadge status="sent" />
        </SelectItem>
        <SelectItem value="paid">
          <InvoiceStatusBadge status="paid" />
        </SelectItem>
        <SelectItem value="overdue">
          <InvoiceStatusBadge status="overdue" />
        </SelectItem>
        <SelectItem value="voided">
          <InvoiceStatusBadge status="voided" />
        </SelectItem>
      </SelectContent>
    </Select>
  );
}