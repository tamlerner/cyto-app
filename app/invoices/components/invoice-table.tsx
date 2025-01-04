'use client';

import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { ArrowDownToLine } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils/currency';
import { DownloadInvoiceButton } from './download-invoice-button';
import { UpdateInvoiceStatus } from './update-invoice-status';
import type { Invoice } from '@/lib/types/invoice';

interface InvoiceTableProps {
  invoices: Invoice[];
  onStatusChange?: () => void;
}

export function InvoiceTable({ invoices, onStatusChange }: InvoiceTableProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('Invoices.Number')}</TableHead>
            <TableHead>{t('Clients.CompanyName')}</TableHead>
            <TableHead>{t('Invoices.IssueDate')}</TableHead>
            <TableHead>{t('Invoices.DueDate')}</TableHead>
            <TableHead>{t('Invoices.Total')}</TableHead>
            <TableHead>{t('Invoices.Status.Label')}</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">
                {invoice.invoice_number}
              </TableCell>
              <TableCell>{invoice.client?.company_name}</TableCell>
              <TableCell>
                {format(new Date(invoice.issue_date), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell>
                {format(new Date(invoice.due_date), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell>
                {formatCurrency(invoice.total, invoice.currency)}
              </TableCell>
              <TableCell>
                <UpdateInvoiceStatus
                  invoiceId={invoice.id}
                  currentStatus={invoice.status}
                  onStatusChange={onStatusChange}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  asChild
                >
                  <DownloadInvoiceButton invoice={invoice} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}