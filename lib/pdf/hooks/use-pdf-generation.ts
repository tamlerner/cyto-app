'use client';

import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { registerFonts } from '../utils';
import type { Invoice } from '@/lib/types';

interface UsePDFGenerationReturn {
  generatePDF: (invoice: Invoice & { items: any[]; client: any; company: any }) => Promise<Blob>;
  loading: boolean;
  error: Error | null;
}

export function usePDFGeneration(): UsePDFGenerationReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function generatePDF(invoice: Invoice & { items: any[]; client: any; company: any }): Promise<Blob> {
    if (typeof window === 'undefined') {
      throw new Error('PDF generation is only available in browser environment');
    }

    try {
      setLoading(true);
      setError(null);

      // Validate invoice data
      if (!invoice.client || !invoice.company) {
        throw new Error('Missing client or company information');
      }

      if (!Array.isArray(invoice.items) || invoice.items.length === 0) {
        throw new Error('No invoice items found');
      }

      // Register fonts
      await registerFonts();

      // Dynamically import PDF components
      const { InvoicePDF } = await import('../components/invoice-pdf');
      const element = InvoicePDF({ invoice, items: invoice.items });
      const document = await pdf(element).toBlob();
      
      return document;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to generate PDF');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { generatePDF, loading, error };
}