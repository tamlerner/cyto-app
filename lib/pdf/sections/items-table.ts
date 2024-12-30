'use client';

import type { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency } from '../utils/format';

export function drawItemsTable(doc: jsPDF, items: any[], currency: string, startY: number) {
  try {
    (doc as any).autoTable({
      startY,
      head: [['Description', 'Quantity', 'Unit Price', 'Tax Rate', 'Total']],
      body: items.map(item => [
        item.description || 'N/A',
        (item.quantity || 0).toString(),
        formatCurrency(item.unit_price || 0, currency),
        `${item.tax_rate || 0}%`,
        formatCurrency((item.quantity || 0) * (item.unit_price || 0), currency),
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [40, 40, 40],
        fontStyle: 'bold',
      },
      theme: 'grid',
    });

    return (doc as any).lastAutoTable.finalY;
  } catch (error) {
    console.error('Error generating items table:', error);
    throw new Error('Failed to generate items table');
  }
}