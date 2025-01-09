import { BaseEntity } from './base';

export interface InvoiceCompany {
  id: string; // UUID
  user_id: string; // UUID
  company_name: string;
  trade_name?: string;
  tax_id: string;
  economic_activity_code?: string;
  share_capital?: number; // DECIMAL(15,2)
  share_capital_currency: string; // TEXT with CHECK
  commercial_registration_number?: number; // INTEGER
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
  default_currency: string; // TEXT with CHECK
  created_at: string; // TIMESTAMPTZ
  updated_at: string; // TIMESTAMPTZ
}