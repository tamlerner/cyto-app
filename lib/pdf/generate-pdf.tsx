// /lib/pdf/generate-pdf.ts
import { pdf, Document } from '@react-pdf/renderer';
import { InvoiceDocument } from './components/invoice-document';

export async function generatePDF({ invoice, items }: GeneratePDFOptions): Promise<Blob> {
  try {
    console.log('Starting PDF generation with:', {
      invoiceNumber: invoice.invoice_number,
      itemsCount: items.length
    });

    // Validate input data
    if (!invoice || !items?.length) {
      console.log('Validation failed: missing invoice or items');
      throw new Error('Invalid invoice data');
    }

    console.log('Generating PDF blob...');
    // Use the component directly without createElement
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