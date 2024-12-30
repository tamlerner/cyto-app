import { BaseEntity } from './base';

export interface Product extends BaseEntity {
  item_description: string;
  unit_price: number;
  currency: 'AOA' | 'USD' | 'EUR';
  tax_rate: number;
  tax_exemption_reason?: string;
  subtotal: number;
  total: number;
}

export interface CreateProductData {
  item_description: string;
  unit_price: number;
  currency: 'AOA' | 'USD' | 'EUR';
  tax_rate: number;
  tax_exemption_reason?: string;
}