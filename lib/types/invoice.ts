import { BaseEntity } from './base';

export interface InvoiceItem extends BaseEntity {
  invoice_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  tax_exemption_reason?: string;
}

// in /lib/types/invoice.ts

export interface Invoice {
  id: string;
  user_id: string;
  invoice_number: string;
  client_id: string;
  company_id: string;
  issue_date: string;
  due_date: string;
  currency: 'USD' | 'EUR' | 'AOA';
  subtotal: number;
  tax_total: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'voided';
  notes?: string;
  language: 'en' | 'pt' | 'fr' | 'es';
  created_at: string;
  updated_at: string;
  client?: {
    company_name: string;
    email: string;
  };
  company?: {
    company_name: string;
  };
}

export interface CreateInvoiceData {
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