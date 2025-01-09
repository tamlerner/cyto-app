import { PDFViewer } from '@react-pdf/renderer';
import { ErrorBoundary } from 'react-error-boundary';
import type { Invoice } from '@/lib/types';
import InvoicePDF from './invoice-pdf';

function PDFErrorFallback({error}: {error: Error}) {
  return (
    <div className="text-red-500 p-4">
      <p>Error generating PDF:</p>
      <pre className="text-sm mt-2">{error.message}</pre>
    </div>
  );
}

export function PDFPreview({ invoice }: { invoice: Invoice }) {
  // Add console log to check the data structure
  console.log('Invoice data for PDF:', JSON.stringify(invoice, null, 2));

  return (
    <div className="flex-1 h-full">
      <ErrorBoundary FallbackComponent={PDFErrorFallback}>
        {/* Add specific dimensions and remove className */}
        <PDFViewer 
          width="100%" 
          height="600px" 
          showToolbar={false}
        >
          <InvoicePDF 
            invoice={{
              ...invoice,
              // Ensure all required properties have default values
              currency: invoice.currency || 'USD',
              status: invoice.status || 'draft',
              language: invoice.language || 'en',
              subtotal: Number(invoice.subtotal) || 0,
              tax_total: Number(invoice.tax_total) || 0,
              total: Number(invoice.total) || 0,
              items: invoice.items?.map(item => ({
                ...item,
                quantity: Number(item.quantity) || 0,
                unit_price: Number(item.unit_price) || 0,
                tax_rate: Number(item.tax_rate) || 0,
                total_with_tax: Number(item.total_with_tax) || 0
              })) || []
            }} 
          />
        </PDFViewer>
      </ErrorBoundary>
    </div>
  );
}