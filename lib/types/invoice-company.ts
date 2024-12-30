import { BaseEntity } from './base';

export interface InvoiceCompany extends BaseEntity {
  company_name: string;
  trade_name?: string;
  tax_id: string;
  economic_activity_code?: string;
  share_capital?: number;
  commercial_registration_number?: number;
  commercial_registration_country?: string;
  headquarters_address: string;
  city: string;
  region: string;
  country: string;
  postal_code: string;
  phone_number?: string;
  website?: string;
  bank_name?: string;
  bank_account_number?: string;
  swift_code?: string;
}