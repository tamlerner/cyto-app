'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { CreateInvoiceForm } from './components/invoice-form';
import { InvoiceList } from './components/invoice-list';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useInvoices } from './hooks/use-invoices'; // Import the useInvoices hook


export default function InvoicesPage() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { invoices, loading, error, loadInvoices } = useInvoices(); // Destructure loadInvoices from the hook
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null); // State for notification message

  const handleRefresh = async () => {
    console.log('Refresh button clicked');
    try {
      await loadInvoices(); // Call loadInvoices on click
      toast({
        title: t('Invoices.RefreshSuccess'), // Show success message
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: t('Invoices.RefreshError'), // Show error message
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('Invoices')}
        description={t('Invoices.Description')}
        action={
          <div className="flex items-center space-x-2"> {/* Flex container for buttons */}
            {/* Refresh Button */}
            <Button onClick={handleRefresh} style={{ marginRight: '10px' }}> {/* Call handleRefresh on click */}
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('Invoices.Create')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-4">
                  <DialogTitle>{t('Invoices.Create')}</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto px-6">
                  <CreateInvoiceForm onSuccess={() => setOpen(false)} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        }
      />
      <InvoiceList invoices={invoices} />
    </div>
  );
}