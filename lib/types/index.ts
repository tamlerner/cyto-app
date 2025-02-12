export * from './base';
export * from './client';
export * from './product';
export * from './invoice';
export * from './invoice-company';

export interface CreateInvoiceData {
  client_id: string;
  issue_date: Date;
  due_date: Date;
  currency: 'USD' | 'EUR' | 'AOA';
  language: string;
  notes?: string;
  items: {
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
    tax_exemption_reason?: string;
  }[];
}
