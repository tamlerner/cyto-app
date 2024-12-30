import { BaseEntity } from './base';

export interface InvoiceItem extends BaseEntity {
  invoice_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  tax_exemption_reason?: string;
}

export interface Invoice extends BaseEntity {
  invoice_number: string;
  client_id: string;
  issue_date: Date;
  due_date: Date;
  subtotal: number;
  tax_total: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
}

export interface CreateInvoiceData {
  client_id: string;
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