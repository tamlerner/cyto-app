export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          company_name: string
          trade_name: string | null
          tax_id: string
          headquarters_address: string
          city: string
          region: string
          postal_code: string
          country: string
          email: string
          phone_number: string | null
          website: string | null
          account_manager: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          company_name: string
          trade_name?: string | null
          tax_id: string
          headquarters_address: string
          city: string
          region: string
          postal_code: string
          country: string
          email: string
          phone_number?: string | null
          website?: string | null
          account_manager?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          company_name?: string
          trade_name?: string | null
          tax_id?: string
          headquarters_address?: string
          city?: string
          region?: string
          postal_code?: string
          country?: string
          email?: string
          phone_number?: string | null
          website?: string | null
          account_manager?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      invoice_companies: {
        Row: {
          id: string
          company_name: string
          trade_name: string | null
          tax_id: string
          economic_activity_code: string | null
          share_capital: number | null
          commercial_registration_number: number | null
          commercial_registration_country: string | null
          headquarters_address: string
          city: string
          region: string
          country: string
          postal_code: string
          phone_number: string | null
          website: string | null
          bank_name: string | null
          bank_account_number: string | null
          swift_code: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          company_name: string
          trade_name?: string | null
          tax_id: string
          economic_activity_code?: string | null
          share_capital?: number | null
          commercial_registration_number?: number | null
          commercial_registration_country?: string | null
          headquarters_address: string
          city: string
          region: string
          country: string
          postal_code: string
          phone_number?: string | null
          website?: string | null
          bank_name?: string | null
          bank_account_number?: string | null
          swift_code?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          company_name?: string
          trade_name?: string | null
          tax_id?: string
          economic_activity_code?: string | null
          share_capital?: number | null
          commercial_registration_number?: number | null
          commercial_registration_country?: string | null
          headquarters_address?: string
          city?: string
          region?: string
          country?: string
          postal_code?: string
          phone_number?: string | null
          website?: string | null
          bank_name?: string | null
          bank_account_number?: string | null
          swift_code?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
    }
  }
}