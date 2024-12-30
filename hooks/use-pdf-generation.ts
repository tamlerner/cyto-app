'use client';

import { useState } from 'react';
import { generatePDF } from '@/lib/pdf/generate-pdf';
import { registerFonts } from '@/lib/pdf/utils/fonts';
import type { Invoice } from '@/lib/types';

export function usePDFGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function generateInvoicePDF(invoice: Invoice & { items: any[]; client: any; company: any }) {
    if (typeof window === 'undefined') {
      throw new Error('PDF generation is only available in browser environment');
    }

    try {
      setLoading(true);
      setError(null);

      // Register fonts before generating PDF
      await registerFonts();

      const blob = await generatePDF({ invoice, items: invoice.items });
      return blob;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to generate PDF');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { generatePDF: generateInvoicePDF, loading, error };
}