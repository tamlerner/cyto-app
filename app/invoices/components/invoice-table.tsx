'use client';

import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils/currency';
import { DownloadInvoiceButton } from './download-invoice-button';
import { UpdateInvoiceStatus } from './update-invoice-status';
import { InvoicePreview } from './invoice-preview';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Check, ChevronDown, Filter, X } from 'lucide-react';
import type { Invoice } from '@/lib/types/invoice';

interface InvoiceTableProps {
  invoices: Invoice[];
  onStatusChange?: () => void;
}

export function InvoiceTable({ invoices, onStatusChange }: InvoiceTableProps) {
  const { t } = useTranslation();

  // State for filters
  const [issueDateStart, setIssueDateStart] = useState<Date | undefined>(undefined);
  const [issueDateEnd, setIssueDateEnd] = useState<Date | undefined>(undefined);
  const [dueDateStart, setDueDateStart] = useState<Date | undefined>(undefined);
  const [dueDateEnd, setDueDateEnd] = useState<Date | undefined>(undefined);
  const [minValue, setMinValue] = useState<string>('');
  const [maxValue, setMaxValue] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  
  // References to close popovers
  const issueDatePopoverRef = useRef<HTMLButtonElement>(null);
  const dueDatePopoverRef = useRef<HTMLButtonElement>(null);
  const valuePopoverRef = useRef<HTMLButtonElement>(null);
  const statusPopoverRef = useRef<HTMLButtonElement>(null);

  // Filter the invoices based on current filter settings
  const filteredInvoices = invoices.filter((invoice) => {
    // Date range filters - Issue Date
    if (issueDateStart && new Date(invoice.issue_date) < issueDateStart) {
      return false;
    }
    if (issueDateEnd) {
      // Set time to end of day for inclusive end date filtering
      const endDate = new Date(issueDateEnd);
      endDate.setHours(23, 59, 59, 999);
      if (new Date(invoice.issue_date) > endDate) {
        return false;
      }
    }

    // Date range filters - Due Date
    if (dueDateStart && new Date(invoice.due_date) < dueDateStart) {
      return false;
    }
    if (dueDateEnd) {
      // Set time to end of day for inclusive end date filtering
      const endDate = new Date(dueDateEnd);
      endDate.setHours(23, 59, 59, 999);
      if (new Date(invoice.due_date) > endDate) {
        return false;
      }
    }

    // Value range filters
    const numMinValue = minValue !== '' ? parseFloat(minValue) : null;
    const numMaxValue = maxValue !== '' ? parseFloat(maxValue) : null;
    
    if (numMinValue !== null && invoice.total < numMinValue) {
      return false;
    }
    if (numMaxValue !== null && invoice.total > numMaxValue) {
      return false;
    }

    // Status filter
    if (selectedStatus && invoice.status !== selectedStatus) {
      return false;
    }

    return true;
  });

  // Reset specific filter
  const resetIssueDateFilter = () => {
    setIssueDateStart(undefined);
    setIssueDateEnd(undefined);
    issueDatePopoverRef.current?.click();
  };

  const resetDueDateFilter = () => {
    setDueDateStart(undefined);
    setDueDateEnd(undefined);
    dueDatePopoverRef.current?.click();
  };

  const resetValueFilter = () => {
    setMinValue('');
    setMaxValue('');
    valuePopoverRef.current?.click();
  };

  const resetStatusFilter = () => {
    setSelectedStatus(null);
    statusPopoverRef.current?.click();
  };

  // Check if filters are active for showing filter indicator
  const isIssueDateFilterActive = issueDateStart || issueDateEnd;
  const isDueDateFilterActive = dueDateStart || dueDateEnd;
  const isValueFilterActive = minValue || maxValue;
  const isStatusFilterActive = selectedStatus !== null;

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('Invoices.Number')}</TableHead>
              <TableHead>{t('Clients.CompanyName')}</TableHead>
              
              {/* Issue Date Column with Filter */}
              <TableHead>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      ref={issueDatePopoverRef}
                      variant="ghost" 
                      className="p-0 font-medium text-sm h-auto w-full justify-start"
                    >
                      <div className="flex items-center gap-1">
                        {t('Invoices.IssueDate')}
                        <ChevronDown className="h-3 w-3" />
                        {isIssueDateFilterActive && (
                          <Filter className="h-3 w-3 text-primary" />
                        )}
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{t('Invoices.FilterByIssueDate')}</h4>
                        {isIssueDateFilterActive && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={resetIssueDateFilter}
                          >
                            <X className="h-3 w-3 mr-1" />
                            {t('Common.Clear')}
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">{t('Common.From')}</div>
                          <DatePicker 
                            {...({
                              date: issueDateStart,
                              onDateChange: setIssueDateStart
                            } as any)}
                          />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">{t('Common.To')}</div>
                          <DatePicker 
                            {...({
                              date: issueDateEnd,
                              onDateChange: setIssueDateEnd
                            } as any)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          size="sm" 
                          onClick={() => issueDatePopoverRef.current?.click()}
                        >
                          {t('Common.Apply')}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableHead>
              
              {/* Due Date Column with Filter */}
              <TableHead>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      ref={dueDatePopoverRef}
                      variant="ghost" 
                      className="p-0 font-medium text-sm h-auto w-full justify-start"
                    >
                      <div className="flex items-center gap-1">
                        {t('Invoices.DueDate')}
                        <ChevronDown className="h-3 w-3" />
                        {isDueDateFilterActive && (
                          <Filter className="h-3 w-3 text-primary" />
                        )}
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{t('Invoices.FilterByDueDate')}</h4>
                        {isDueDateFilterActive && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={resetDueDateFilter}
                          >
                            <X className="h-3 w-3 mr-1" />
                            {t('Common.Clear')}
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">{t('Common.From')}</div>
                          <DatePicker 
                            {...({
                              date: dueDateStart,
                              onDateChange: setDueDateStart
                            } as any)}
                          />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">{t('Common.To')}</div>
                          <DatePicker 
                            {...({
                              date: dueDateEnd,
                              onDateChange: setDueDateEnd
                            } as any)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          size="sm" 
                          onClick={() => dueDatePopoverRef.current?.click()}
                        >
                          {t('Common.Apply')}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableHead>
              
              {/* Value Column with Filter */}
              <TableHead>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      ref={valuePopoverRef}
                      variant="ghost" 
                      className="p-0 font-medium text-sm h-auto w-full justify-start"
                    >
                      <div className="flex items-center gap-1">
                        {t('Invoices.Total')}
                        <ChevronDown className="h-3 w-3" />
                        {isValueFilterActive && (
                          <Filter className="h-3 w-3 text-primary" />
                        )}
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{t('Invoices.FilterByValue')}</h4>
                        {isValueFilterActive && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={resetValueFilter}
                          >
                            <X className="h-3 w-3 mr-1" />
                            {t('Common.Clear')}
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">{t('Common.Min')}</div>
                          <Input
                            type="number"
                            value={minValue}
                            onChange={(e) => setMinValue(e.target.value)}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">{t('Common.Max')}</div>
                          <Input
                            type="number"
                            value={maxValue}
                            onChange={(e) => setMaxValue(e.target.value)}
                            placeholder="∞"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          size="sm" 
                          onClick={() => valuePopoverRef.current?.click()}
                        >
                          {t('Common.Apply')}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableHead>
              
              {/* Status Column with Filter */}
              <TableHead>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      ref={statusPopoverRef}
                      variant="ghost" 
                      className="p-0 font-medium text-sm h-auto w-full justify-start"
                    >
                      <div className="flex items-center gap-1">
                        {t('Invoices.Status.Label')}
                        <ChevronDown className="h-3 w-3" />
                        {isStatusFilterActive && (
                          <Filter className="h-3 w-3 text-primary" />
                        )}
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-60">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{t('Invoices.FilterByStatus')}</h4>
                        {isStatusFilterActive && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={resetStatusFilter}
                          >
                            <X className="h-3 w-3 mr-1" />
                            {t('Common.Clear')}
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Button 
                          variant={selectedStatus === null ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setSelectedStatus(null)}
                        >
                          {selectedStatus === null && <Check className="h-3 w-3 mr-2" />}
                          {t('Common.All')}
                        </Button>
                        <Button 
                          variant={selectedStatus === "draft" ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setSelectedStatus("draft")}
                        >
                          {selectedStatus === "draft" && <Check className="h-3 w-3 mr-2" />}
                          {t('Invoices.Status.Draft')}
                        </Button>
                        <Button 
                          variant={selectedStatus === "sent" ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setSelectedStatus("sent")}
                        >
                          {selectedStatus === "sent" && <Check className="h-3 w-3 mr-2" />}
                          {t('Invoices.Status.Sent')}
                        </Button>
                        <Button 
                          variant={selectedStatus === "paid" ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setSelectedStatus("paid")}
                        >
                          {selectedStatus === "paid" && <Check className="h-3 w-3 mr-2" />}
                          {t('Invoices.Status.Paid')}
                        </Button>
                        <Button 
                          variant={selectedStatus === "overdue" ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setSelectedStatus("overdue")}
                        >
                          {selectedStatus === "overdue" && <Check className="h-3 w-3 mr-2" />}
                          {t('Invoices.Status.Overdue')}
                        </Button>
                        <Button 
                          variant={selectedStatus === "voided" ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setSelectedStatus("voided")}
                        >
                          {selectedStatus === "voided" && <Check className="h-3 w-3 mr-2" />}
                          {t('Invoices.Status.Voided')}
                        </Button>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          size="sm" 
                          onClick={() => statusPopoverRef.current?.click()}
                        >
                          {t('Common.Apply')}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableHead>
              
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {t('Common.NoResults')}
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
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
                    <div className="flex items-center gap-2">
                      <InvoicePreview invoice={invoice} />
                      <DownloadInvoiceButton invoice={invoice} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {filteredInvoices.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {t('Invoices.Showing')} {filteredInvoices.length} {t('Invoices.Of')} {invoices.length} {t('Invoices.Invoices')}
        </div>
      )}
    </div>
  );
}