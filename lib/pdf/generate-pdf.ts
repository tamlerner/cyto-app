'use client';

import { pdf, createElement } from '@react-pdf/renderer';
import { InvoiceDocument } from './components/invoice-document';
import type { Invoice } from '@/lib/types';

interface GeneratePDFOptions {
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
  };
  items: any[];
}

export async function generatePDF({ invoice, items }: GeneratePDFOptions): Promise<Blob> {
  try {
    // Validate input data
    if (!invoice || !items?.length) {
      throw new Error('Invalid invoice data');
    }

    // Validate required nested objects
    if (!invoice.client || !invoice.company) {
      throw new Error('Missing client or company information');
    }

    // Validate required fields
    const requiredFields = [
      'company_name',
      'tax_id',
      'headquarters_address',
      'city',
      'region',
      'postal_code',
      'country'
    ];

    for (const field of requiredFields) {
      if (!invoice.client[field]) {
        throw new Error(`Missing client ${field}`);
      }
      if (!invoice.company[field]) {
        throw new Error(`Missing company ${field}`);
      }
    }

    // Validate items data
    for (const item of items) {
      if (!item.description || typeof item.quantity !== 'number' || typeof item.unit_price !== 'number') {
        throw new Error('Invalid item data');
      }
    }

    // Create document with error boundary
    let document;
    try {
      document = createElement(InvoiceDocument, { 
        invoice, 
        items 
      });
    } catch (error) {
      console.error('Failed to create PDF document:', error);
      throw new Error('Failed to create PDF document');
    }

    // Generate PDF with timeout
    try {
      const blob = await Promise.race([
        pdf(document).toBlob(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('PDF generation timeout')), 30000)
        )
      ]);

      if (!(blob instanceof Blob)) {
        throw new Error('Invalid PDF output');
      }

      return blob;
    } catch (error) {
      console.error('Failed to generate PDF blob:', error);
      throw new Error('Failed to generate PDF file');
    }
  } catch (error) {
    console.error('PDF generation failed:', {
      error,
      invoice: {
        id: invoice?.id,
        hasItems: Boolean(items?.length),
        hasClient: Boolean(invoice?.client),
        hasCompany: Boolean(invoice?.company)
      }
    });
    throw error;
  }
}