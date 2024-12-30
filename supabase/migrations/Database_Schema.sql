/*
  # Complete Database Schema with Multi-Currency Support and Default Companies
  
  Features:
  1. Multi-currency support (USD, EUR, AOA)
  2. Automatic default company creation
  3. Row Level Security
  4. Currency conversion calculations
  5. Automatic timestamps
  6. Client accessibility rules
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to create default company
CREATE OR REPLACE FUNCTION create_default_company()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO invoice_companies (
    user_id,
    company_name,
    tax_id,
    headquarters_address,
    city,
    region,
    country,
    postal_code,
    default_currency,
    share_capital_currency,
    bank_name_usd,
    bank_account_number_usd,
    bank_name_eur,
    bank_account_number_eur,
    bank_name_aoa,
    bank_account_number_aoa
  ) VALUES (
    NEW.id,
    'My Company',
    'Default Tax ID',
    'Default Address',
    'Default City',
    'Default Region',
    'Default Country',
    '00000',
    'USD',
    'USD',
    'Default USD Bank',
    'Default USD Account',
    'Default EUR Bank',
    'Default EUR Account',
    'Default AOA Bank',
    'Default AOA Account'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS invoice_items;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS invoice_companies;
DROP TABLE IF EXISTS clients;

-- Create clients table with currency preferences
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    trade_name TEXT,
    tax_id TEXT NOT NULL,
    headquarters_address TEXT NOT NULL,
    city TEXT NOT NULL,
    region TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_number TEXT,
    website TEXT,
    account_manager TEXT,
    preferred_currency TEXT NOT NULL DEFAULT 'USD' CHECK (preferred_currency IN ('USD', 'EUR', 'AOA')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create invoice companies table with multi-currency banking
CREATE TABLE invoice_companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    trade_name TEXT,
    tax_id TEXT NOT NULL,
    economic_activity_code TEXT,
    share_capital DECIMAL(15,2),
    share_capital_currency TEXT NOT NULL DEFAULT 'USD' CHECK (share_capital_currency IN ('USD', 'EUR', 'AOA')),
    commercial_registration_number INTEGER,
    commercial_registration_country TEXT,
    headquarters_address TEXT NOT NULL,
    city TEXT NOT NULL,
    region TEXT NOT NULL,
    country TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    phone_number TEXT,
    website TEXT,
    bank_name_usd TEXT,
    bank_account_number_usd TEXT,
    swift_code_usd TEXT,
    bank_name_eur TEXT,
    bank_account_number_eur TEXT,
    swift_code_eur TEXT,
    bank_name_aoa TEXT,
    bank_account_number_aoa TEXT,
    swift_code_aoa TEXT,
    default_currency TEXT NOT NULL DEFAULT 'USD' CHECK (default_currency IN ('USD', 'EUR', 'AOA')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create invoices table with multi-currency support
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    invoice_number TEXT UNIQUE NOT NULL,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
    company_id UUID REFERENCES invoice_companies(id) ON DELETE CASCADE NOT NULL,
    issue_date TIMESTAMPTZ NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'EUR', 'AOA')),
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
    tax_total DECIMAL(15,2) NOT NULL DEFAULT 0,
    total DECIMAL(15,2) NOT NULL DEFAULT 0,
    subtotal_usd DECIMAL(15,2),
    tax_total_usd DECIMAL(15,2),
    total_usd DECIMAL(15,2),
    subtotal_eur DECIMAL(15,2),
    tax_total_eur DECIMAL(15,2),
    total_eur DECIMAL(15,2),
    subtotal_aoa DECIMAL(15,2),
    tax_total_aoa DECIMAL(15,2),
    total_aoa DECIMAL(15,2),
    exchange_rate_usd_to_eur DECIMAL(15,6),
    exchange_rate_usd_to_aoa DECIMAL(15,6),
    exchange_rate_eur_to_aoa DECIMAL(15,6),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
    notes TEXT,
    language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'pt', 'fr', 'es')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create invoice items table with multi-currency support
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    quantity DECIMAL(15,2) NOT NULL DEFAULT 0,
    unit_price_usd DECIMAL(15,2),
    unit_price_eur DECIMAL(15,2),
    unit_price_aoa DECIMAL(15,2),
    unit_price DECIMAL(15,2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'EUR', 'AOA')),
    exchange_rate_usd_to_eur DECIMAL(15,6),
    exchange_rate_usd_to_aoa DECIMAL(15,6),
    exchange_rate_eur_to_aoa DECIMAL(15,6),
    tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    tax_exemption_reason TEXT,
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_with_tax DECIMAL(15,2) NOT NULL DEFAULT 0,
    subtotal_usd DECIMAL(15,2),
    subtotal_eur DECIMAL(15,2),
    subtotal_aoa DECIMAL(15,2),
    total_with_tax_usd DECIMAL(15,2),
    total_with_tax_eur DECIMAL(15,2),
    total_with_tax_aoa DECIMAL(15,2),
    vat_number TEXT,
    intra_community_supply BOOLEAN DEFAULT FALSE,
    reverse_charge BOOLEAN DEFAULT FALSE,
    angolan_tax_regime TEXT,
    angolan_tax_exemption_code TEXT,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    item_reference TEXT,
    item_category TEXT,
    unit_of_measure TEXT DEFAULT 'unit' CHECK (unit_of_measure IN ('unit', 'hour', 'day', 'kg', 'meter')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own clients" ON clients;
DROP POLICY IF EXISTS "Users can insert own clients" ON clients;
DROP POLICY IF EXISTS "Users can update own clients" ON clients;
DROP POLICY IF EXISTS "Users can delete own clients" ON clients;

-- Create updated policies for clients
CREATE POLICY "Users can read own clients"
    ON clients
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id 
        OR 
        auth.uid() IN (
            SELECT user_id 
            FROM invoice_companies 
            WHERE id IN (
                SELECT company_id 
                FROM invoices 
                WHERE client_id = clients.id
            )
        )
    );

CREATE POLICY "Users can insert own clients"
    ON clients
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients"
    ON clients
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients"
    ON clients
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create policies for invoice_companies
CREATE POLICY "Users can read own invoice companies"
    ON invoice_companies
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own invoice companies"
    ON invoice_companies
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoice companies"
    ON invoice_companies
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own invoice companies"
    ON invoice_companies
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create policies for invoices
CREATE POLICY "Users can read own invoices"
    ON invoices
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own invoices"
    ON invoices
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoices"
    ON invoices
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own invoices"
    ON invoices
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create policies for invoice items
CREATE POLICY "Users can read own invoice items"
    ON invoice_items
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own invoice items"
    ON invoice_items
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoice items"
    ON invoice_items
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own invoice items"
    ON invoice_items
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create function for currency calculations
CREATE OR REPLACE FUNCTION calculate_invoice_item_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate subtotal in invoice currency
    NEW.subtotal = NEW.quantity * NEW.unit_price;
    NEW.discount_amount = (NEW.subtotal * NEW.discount_percentage / 100);
    NEW.subtotal = NEW.subtotal - NEW.discount_amount;
    NEW.tax_amount = NEW.subtotal * (NEW.tax_rate / 100);
    NEW.total_with_tax = NEW.subtotal + NEW.tax_amount;
    
    -- Calculate amounts in USD
    IF NEW.currency = 'USD' THEN
        NEW.subtotal_usd = NEW.subtotal;
        NEW.total_with_tax_usd = NEW.total_with_tax;
    ELSIF NEW.currency = 'EUR' THEN
        NEW.subtotal_usd = NEW.subtotal / NEW.exchange_rate_usd_to_eur;
        NEW.total_with_tax_usd = NEW.total_with_tax / NEW.exchange_rate_usd_to_eur;
    ELSIF NEW.currency = 'AOA' THEN
        NEW.subtotal_usd = NEW.subtotal / NEW.exchange_rate_usd_to_aoa;
        NEW.total_with_tax_usd = NEW.total_with_tax / NEW.exchange_rate_usd_to_aoa;
    END IF;
    
    -- Calculate amounts in EUR
    IF NEW.currency = 'EUR' THEN
        NEW.subtotal_eur = NEW.subtotal;
        NEW.total_with_tax_eur = NEW.total_with_tax;
    ELSIF NEW.currency = 'USD' THEN
        NEW.subtotal_eur = NEW.subtotal * NEW.exchange_rate_usd_to_eur;
        NEW.total_with_tax_eur = NEW.total_with_tax * NEW.exchange_rate_usd_to_eur;
    ELSIF NEW.currency = 'AOA' THEN
        NEW.subtotal_eur = NEW.subtotal / NEW.exchange_rate_eur_to_aoa;
        NEW.total_with_tax_eur = NEW.total_with_tax / NEW.exchange_rate_eur_to_aoa;
    END IF;
    
    -- Calculate amounts in AOA
    IF NEW.currency = 'AOA' THEN
        NEW.subtotal_aoa = NEW.subtotal;
        NEW.total_with_tax_aoa = NEW.total_with_tax;
    ELSIF NEW.currency = 'USD' THEN
        NEW.subtotal_aoa = NEW.subtotal * NEW.exchange_rate_usd_to_aoa;
        NEW.total_with_tax_aoa = NEW.total_with_tax * NEW.exchange_rate_usd_to_aoa;
    ELSIF NEW.currency = 'EUR' THEN
        NEW.subtotal_aoa = NEW.subtotal * NEW.exchange_rate_eur_to_aoa;
        NEW.total_with_tax_aoa = NEW.total_with_tax * NEW.exchange_rate_eur_to_aoa;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update invoice totals
CREATE OR REPLACE FUNCTION update_invoice_totals()
RETURNS TRIGGER AS $$
BEGIN
    WITH invoice_totals AS (
        SELECT 
            invoice_id,
            SUM(subtotal) as subtotal,
            SUM(tax_amount) as tax_total,
            SUM(total_with_tax) as total,
            SUM(subtotal_usd) as subtotal_usd,
            SUM(total_with_tax_usd) as total_usd,
            SUM(subtotal_eur) as subtotal_eur,
            SUM(total_with_tax_eur) as total_eur,
            SUM(subtotal_aoa) as subtotal_aoa,
            SUM(total_with_tax_aoa) as total_aoa
        FROM invoice_items
        WHERE invoice_id = NEW.invoice_id
        GROUP BY invoice_id
    )
    UPDATE invoices
    SET 
        subtotal = it.subtotal,
        tax_total = it.tax_total,
        total = it.total,
        subtotal_usd = it.subtotal_usd,
        total_usd = it.total_usd,
        subtotal_eur = it.subtotal_eur,
        total_eur = it.total_eur,
        subtotal_aoa = it.subtotal_aoa,
        total_aoa = it.total_aoa,
        updated_at = NOW()
    FROM invoice_totals it
    WHERE invoices.id = it.invoice_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to get default company for a user
CREATE OR REPLACE FUNCTION get_default_company(user_uuid UUID)
RETURNS UUID AS $$
DECLARE
    company_id UUID;
BEGIN
    SELECT id INTO company_id
    FROM invoice_companies
    WHERE user_id = user_uuid
    ORDER BY created_at ASC
    LIMIT 1;
    
    RETURN company_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to ensure invoice has company_id
CREATE OR REPLACE FUNCTION ensure_invoice_company_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.company_id IS NULL THEN
        NEW.company_id := get_default_company(NEW.user_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_company();

-- Create triggers
CREATE TRIGGER calculate_invoice_item_totals_trigger
    BEFORE INSERT OR UPDATE ON invoice_items
    FOR EACH ROW
    EXECUTE FUNCTION calculate_invoice_item_totals();

CREATE TRIGGER update_invoice_totals_trigger
    AFTER INSERT OR UPDATE OR DELETE ON invoice_items
    FOR EACH ROW
    EXECUTE FUNCTION update_invoice_totals();

CREATE TRIGGER ensure_invoice_company_id_trigger
    BEFORE INSERT ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION ensure_invoice_company_id();

-- Create updated_at triggers
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoice_companies_updated_at
    BEFORE UPDATE ON invoice_companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoice_items_updated_at
    BEFORE UPDATE ON invoice_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create default companies for existing users
DO $$
BEGIN
  INSERT INTO invoice_companies (
    user_id,
    company_name,
    tax_id,
    headquarters_address,
    city,
    region,
    country,
    postal_code,
    default_currency,
    share_capital_currency,
    bank_name_usd,
    bank_account_number_usd,
    bank_name_eur,
    bank_account_number_eur,
    bank_name_aoa,
    bank_account_number_aoa
  )
  SELECT 
    id,
    'My Company',
    'Default Tax ID',
    'Default Address',
    'Default City',
    'Default Region',
    'Default Country',
    '00000',
    'USD',
    'USD',
    'Default USD Bank',
    'Default USD Account',
    'Default EUR Bank',
    'Default EUR Account',
    'Default AOA Bank',
    'Default AOA Account'
  FROM auth.users u
  WHERE NOT EXISTS (
    SELECT 1 
    FROM invoice_companies ic 
    WHERE ic.user_id = u.id
  );
END $$;

-- Create or replace view for accessible clients with company information
CREATE OR REPLACE VIEW accessible_clients AS
    SELECT 
        c.*,
        ic.company_name as invoice_company_name
    FROM clients c
    LEFT JOIN invoices i ON c.id = i.client_id
    LEFT JOIN invoice_companies ic ON i.company_id = ic.id
    WHERE 
        c.user_id = auth.uid()
        OR 
        ic.user_id = auth.uid();

-- Grant access to the view
GRANT SELECT ON accessible_clients TO authenticated;