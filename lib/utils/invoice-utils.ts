import React from 'react';
import { pdf } from '@react-pdf/renderer';
import type { Invoice } from '@/lib/types';
// Change this line to use default import
import InvoicePDF from '@/components/invoices/invoice-pdf';
import { createElement } from 'react';

export function calculateInvoiceTotals(items: { quantity: number; unit_price: number; tax_rate: number }[]) {
  const subtotal = items.reduce((sum, item) => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unit_price) || 0;
    return sum + (quantity * unitPrice);
  }, 0);

  const taxTotal = items.reduce((sum, item) => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unit_price) || 0;
    const taxRate = Number(item.tax_rate) || 0;
    const itemTotal = quantity * unitPrice;
    return sum + (itemTotal * taxRate / 100);
  }, 0);
  
  return {
    subtotal,
    tax_total: taxTotal,
    total: subtotal + taxTotal,
  };
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const numAmount = Number(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(numAmount);
}

export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}-${random}`;
}


export async function generatePDF(invoice: Invoice): Promise<Blob> {
  try {
    // Use React.createElement instead of JSX
    const doc = React.createElement(InvoicePDF, { invoice });
    const blob = await pdf(doc).toBlob();
    return blob;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
}