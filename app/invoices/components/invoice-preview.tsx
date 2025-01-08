'use client';

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
  if (!invoice?.client || !invoice?.company) {
    console.error('Missing required invoice data:', { invoice });
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      title="Preview Invoice"
    >
      <Eye className="h-4 w-4" />
    </Button>
  );
}
