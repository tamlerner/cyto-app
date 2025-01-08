// /lib/types/invoice.ts

import { BaseEntity } from './base';

export interface InvoiceItem extends BaseEntity {
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  unit_price_usd?: number;
  unit_price_eur?: number;
  unit_price_aoa?: number;
  currency: 'USD' | 'EUR' | 'AOA';
  exchange_rate_usd_to_eur?: number;
  exchange_rate_usd_to_aoa?: number;
  exchange_rate_eur_to_aoa?: number;
  tax_rate: number;
  tax_amount: number;
  tax_exemption_reason?: string;
  subtotal: number;
  total_with_tax: number;
  subtotal_usd?: number;
  subtotal_eur?: number;
  subtotal_aoa?: number;
  total_with_tax_usd?: number;
  total_with_tax_eur?: number;
  total_with_tax_aoa?: number;
  vat_number?: string;
  intra_community_supply?: boolean;
  reverse_charge?: boolean;
  angolan_tax_regime?: string;
  angolan_tax_exemption_code?: string;
  discount_percentage?: number;
  discount_amount?: number;
  item_reference?: string;
  item_category?: string;
  unit_of_measure?: 'unit' | 'hour' | 'day' | 'kg' | 'meter';
}

export interface Invoice extends BaseEntity {
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
  subtotal_usd?: number;
  tax_total_usd?: number;
  total_usd?: number;
  subtotal_eur?: number;
  tax_total_eur?: number;
  total_eur?: number;
  subtotal_aoa?: number;
  tax_total_aoa?: number;
  total_aoa?: number;
  exchange_rate_usd_to_eur?: number;
  exchange_rate_usd_to_aoa?: number;
  exchange_rate_eur_to_aoa?: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'voided';
  notes?: string;
  language: 'en' | 'pt' | 'fr' | 'es';
  created_at: string;
  updated_at: string;
  client: {
    id: string;
    company_name: string;
    trade_name?: string;
    tax_id: string;
    headquarters_address: string;
    city: string;
    region: string;
    postal_code: string;
    country: string;
    email: string;
    phone_number?: string;
    website?: string;
    account_manager?: string;
    preferred_currency: 'USD' | 'EUR' | 'AOA';
  };
  company: {
    id: string;
    company_name: string;
    trade_name?: string;
    tax_id: string;
    economic_activity_code?: string;
    share_capital?: number;
    share_capital_currency: 'USD' | 'EUR' | 'AOA';
    commercial_registration_number?: number;
    commercial_registration_country?: string;
    headquarters_address: string;
    city: string;
    region: string;
    country: string;
    postal_code: string;
    phone_number?: string;
    website?: string;
    bank_name_usd?: string;
    bank_account_number_usd?: string;
    swift_code_usd?: string;
    bank_name_eur?: string;
    bank_account_number_eur?: string;
    swift_code_eur?: string;
    bank_name_aoa?: string;
    bank_account_number_aoa?: string;
    swift_code_aoa?: string;
    default_currency: 'USD' | 'EUR' | 'AOA';
  };
  items: InvoiceItem[];
}

export interface CreateInvoiceData {
  client_id: string;
  currency: 'USD' | 'EUR' | 'AOA';
  language: 'en' | 'pt' | 'fr' | 'es';
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