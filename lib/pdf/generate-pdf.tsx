'use client';

import { pdf } from '@react-pdf/renderer';
import { InvoiceDocument } from './components/invoice-document';
import type { Invoice, InvoiceItem } from '@/lib/types';

// Define the nested types first
interface CompanyInfo {
  company_name: string;
  tax_id: string;
  headquarters_address: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
}

// Define the extended Invoice type with nested objects
interface InvoiceWithDetails extends Invoice {
  client: CompanyInfo;
  company: CompanyInfo;
}

// Define the PDF generation options interface
interface GeneratePDFOptions {
  invoice: InvoiceWithDetails;
  items: InvoiceItem[];
}

export async function generatePDF({ invoice, items }: GeneratePDFOptions): Promise<Blob> {
  try {
    console.log('Starting PDF generation with:', {
      invoiceNumber: invoice.invoice_number,
      itemsCount: items.length
    });

    if (!invoice || !items?.length) {
      console.log('Validation failed: missing invoice or items');
      throw new Error('Invalid invoice data');
    }

    console.log('Generating PDF blob...');
    const blob = await pdf(<InvoiceDocument invoice={invoice} items={items} />).toBlob();
    
    console.log('PDF generated successfully:', {
      blobSize: blob.size,
      type: blob.type
    });

    return blob;
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
}