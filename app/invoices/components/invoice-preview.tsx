
'use client';

import { useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { InvoiceDocument } from '@/lib/pdf/components/invoice-document';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import type { Invoice } from '@/lib/types';

interface InvoicePreviewProps {
  invoice: Invoice & {
    client: {
      company_name: string;
      tax_id: string;
      headquarters_address: string;
      city: string;
      region: string;
      postal_code: string;
      country: string;
    };
    company: {
      company_name: string;
      tax_id: string;
      headquarters_address: string;
      city: string;
      region: string;
      postal_code: string;
      country: string;
    };
    items: any[];
  };
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const [open, setOpen] = useState(false);

  if (!invoice?.client || !invoice?.company) {
    console.error('Missing required invoice data:', { invoice });
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="Preview Invoice"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Invoice Preview</DialogTitle>
        </DialogHeader>
        <div className="flex-1 w-full h-full min-h-0">
          <PDFViewer width="100%" height="100%" className="rounded-md">
            <InvoiceDocument invoice={invoice} items={invoice.items} />
          </PDFViewer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
