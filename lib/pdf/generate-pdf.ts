'use client';

import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { InvoiceDocument } from './components/invoice-document';
import type { Invoice, InvoiceItem } from '@/lib/types';

interface GeneratePDFProps {
  invoice: Invoice & {
    client: {
      company_name: string;
      tax_id: string;
      headquarters_address: string;
      city: string;
      region: string;
      postal_code: string;
      country: string;
      email: string;
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
  };
  items: InvoiceItem[];
}

export async function generatePDF({ invoice, items }: GeneratePDFProps): Promise<Blob> {
  if (!invoice || !items) {
    throw new Error('Missing required invoice data');
  }

  console.log('Starting PDF generation with data:', {
    invoiceNumber: invoice.invoice_number,
    itemsCount: items.length,
    hasClient: !!invoice.client,
    hasCompany: !!invoice.company
  });

  try {
    // Create the PDF document using React.createElement to avoid JSX parsing issues
    const document = React.createElement(InvoiceDocument, {
      invoice,
      items
    }) as React.ReactElement;
    
    // Generate the blob
    const blob = await pdf(document).toBlob();

    if (!blob) {
      throw new Error('PDF generation returned empty blob');
    }

    console.log('PDF generated successfully', {
      blobSize: blob.size,
      type: blob.type
    });
    
    return blob;
  } catch (err) {
    console.error('PDF Generation Error:', {
      error: err,
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      data: {
        hasInvoice: !!invoice,
        hasItems: !!items,
        itemsLength: items?.length
      }
    });
    throw err instanceof Error ? err : new Error('Failed to generate PDF');
  }
}
