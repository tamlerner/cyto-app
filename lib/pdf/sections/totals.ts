'use client';

import type { jsPDF } from 'jspdf';
import { formatCurrency } from '../utils/format';

export function drawTotals(doc: jsPDF, invoice: any, startY: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = startY + 10;

  const totalsInfo = [
    ['Subtotal:', formatCurrency(invoice.subtotal || 0, invoice.currency)],
    ['Tax Total:', formatCurrency(invoice.tax_total || 0, invoice.currency)],
    ['Total:', formatCurrency(invoice.total || 0, invoice.currency)],
  ];

  totalsInfo.forEach(([label, value]) => {
    doc.text(label, pageWidth - margin - 80, yPos);
    doc.text(value, pageWidth - margin, yPos, { align: 'right' });
    yPos += 7;
  });

  return yPos;
}