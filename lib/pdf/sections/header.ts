'use client';

import type { jsPDF } from 'jspdf';

export function drawHeader(doc: jsPDF, companyInfo: any, invoiceDetails: any) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = margin;

  // Company header
  doc.setFontSize(24);
  doc.setFont('Helvetica', 'bold');
  doc.text('INVOICE', margin, yPos);
  yPos += 15;

  // Company info
  doc.setFontSize(12);
  doc.setFont('Helvetica', 'normal');
  doc.text('From:', margin, yPos);
  yPos += 7;

  const companyLines = [
    companyInfo.company_name || 'N/A',
    companyInfo.tax_id || 'N/A',
    companyInfo.headquarters_address || 'N/A',
    `${companyInfo.city || 'N/A'}, ${companyInfo.region || 'N/A'}`,
    `${companyInfo.postal_code || 'N/A'}, ${companyInfo.country || 'N/A'}`,
  ];

  companyLines.forEach(line => {
    doc.text(line, margin, yPos);
    yPos += 6;
  });

  // Invoice details
  doc.text(`Invoice Number: ${invoiceDetails.number}`, pageWidth - margin - 80, margin, { align: 'right' });
  doc.text(`Date: ${invoiceDetails.date}`, pageWidth - margin - 80, margin + 7, { align: 'right' });
  doc.text(`Due Date: ${invoiceDetails.dueDate}`, pageWidth - margin - 80, margin + 14, { align: 'right' });

  return yPos;
}