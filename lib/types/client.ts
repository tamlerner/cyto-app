import { BaseEntity } from './base';

export interface Client extends BaseEntity {
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
}