'use client';

import { useState } from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PDFPreview } from '@/components/invoices/pdf-viewer';
import type { Invoice } from '@/lib/types';

export function InvoicePreview({ invoice }: { invoice: Invoice }) {
  const [isOpen, setIsOpen] = useState(false);

  // Safety check
  if (!invoice || !invoice.client || !invoice.company || !invoice.items) {
    console.error('Missing required invoice data:', {
      hasInvoice: !!invoice,
      hasClient: !!invoice?.client,
      hasCompany: !!invoice?.company,
      hasItems: !!invoice?.items
    });
    return null;
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        title="Preview Invoice"
      >
        <Eye className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              Preview Invoice #{invoice.invoice_number}
            </DialogTitle>
            <DialogDescription>
              Preview of invoice before downloading
            </DialogDescription>
          </DialogHeader>
          <PDFPreview invoice={invoice} />
        </DialogContent>
      </Dialog>
    </>
  );
}