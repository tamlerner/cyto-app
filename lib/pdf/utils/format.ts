'use client';

export function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${amount} ${currency}`;
  }
}

export function validateInvoiceData(invoice: any, items: any[]) {
  if (!invoice) throw new Error('Invoice data is required');
  if (!items?.length) throw new Error('Invoice items are required');
  if (!invoice.company) throw new Error('Company information is missing');
  if (!invoice.client) throw new Error('Client information is missing');
}