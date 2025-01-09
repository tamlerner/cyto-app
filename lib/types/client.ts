import { BaseEntity } from './base';

export interface Client {
  id: string; // UUID
  user_id: string; // UUID
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
  preferred_currency: string; // TEXT with CHECK
  created_at: string; // TIMESTAMPTZ
  updated_at: string; // TIMESTAMPTZ
}