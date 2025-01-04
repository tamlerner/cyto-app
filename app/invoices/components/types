'use client';

export interface InvoiceFormData {
  client_id: string;
  currency: string;
  language: string;
  issue_date: Date;
  due_date: Date;
  items: {
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
    tax_exemption_reason?: string;
  }[];
  notes?: string;
}