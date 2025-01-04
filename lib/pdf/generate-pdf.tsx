'use client';

import { pdf } from '@react-pdf/renderer';
import { InvoiceDocument } from './components/invoice-document';
import type { Invoice, InvoiceItem } from '@/lib/types';

// PDF-specific company info type that matches InvoiceDocument requirements
interface PDFCompanyInfo {
  company_name: string;
  tax_id: string;
  headquarters_address: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
}

// PDF-specific client info type that includes email
interface PDFClientInfo extends PDFCompanyInfo {
  email: string;
}

// Complete invoice type for PDF generation
interface PDFInvoice extends Omit<Invoice, 'client' | 'company'> {
  client: PDFClientInfo;
  company: PDFCompanyInfo;
}

// Input type for the generate function
interface GeneratePDFOptions {
  invoice: Invoice & {
    client: {
      company_name: string;
      email: string;
    };
    company: {
      company_name: string;
    };
  };
  items: InvoiceItem[];
}

function createPDFCompanyInfo(companyName: string): PDFCompanyInfo {
  return {
    company_name: companyName,
    tax_id: 'N/A',
    headquarters_address: 'N/A',
    city: 'N/A',
    region: 'N/A',
    postal_code: 'N/A',
    country: 'N/A'
  };
}

function createPDFClientInfo(client: { company_name: string; email: string }): PDFClientInfo {
  return {
    ...createPDFCompanyInfo(client.company_name),
    email: client.email
  };
}

export async function generatePDF({ invoice, items }: GeneratePDFOptions): Promise<Blob> {
  try {
    // Validate inputs
    if (!invoice?.client?.company_name || !invoice?.client?.email) {
      throw new Error('Invalid client information');
    }

    if (!invoice?.company?.company_name) {
      throw new Error('Invalid company information');
    }

    if (!items?.length) {
      throw new Error('No invoice items provided');
    }

    // Transform to PDF format
    const pdfInvoice: PDFInvoice = {
      ...invoice,
      client: createPDFClientInfo(invoice.client),
      company: createPDFCompanyInfo(invoice.company.company_name)
    };

    // Generate PDF
    console.log('Generating PDF with data:', {
      invoiceNumber: pdfInvoice.invoice_number,
      clientName: pdfInvoice.client.company_name,
      companyName: pdfInvoice.company.company_name,
      itemsCount: items.length
    });

    const blob = await pdf(
      <InvoiceDocument 
        invoice={pdfInvoice}
        items={items}
      />
    ).toBlob();

    if (!blob || blob.size === 0) {
      throw new Error('Generated PDF blob is empty');
    }

    console.log('PDF generated successfully:', {
      blobSize: blob.size,
      type: blob.type
    });

    return blob;

  } catch (error) {
    console.error('Download process failed:', {
      error,
      errorType: error?.constructor?.name,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error instanceof Error ? error : new Error('PDF generation failed');
  }
}