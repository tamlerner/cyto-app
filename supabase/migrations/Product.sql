/*
  # Create Products and Services Table
  
  1. New Tables
    - product_lines: Stores products and services with single price and currency
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - item_description (text)
      - unit_price (decimal)
      - currency (text)
      - tax_rate (decimal)
      - tax_exemption_reason (text, optional)
      - subtotal (decimal, computed)
      - total (decimal, computed)
      - created_at (timestamptz)
      - updated_at (timestamptz)
  
  2. Security
    - Enable RLS
    - Add policies for CRUD operations
    - Add updated_at trigger
*/

-- Create product_lines table
CREATE TABLE IF NOT EXISTS product_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_description TEXT NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL CHECK (unit_price >= 0),
    currency TEXT NOT NULL DEFAULT 'AOA' CHECK (currency IN ('AOA', 'USD', 'EUR')),
    tax_rate DECIMAL(5,2) NOT NULL CHECK (tax_rate IN (0, 1, 5, 14)),
    tax_exemption_reason TEXT,
    subtotal DECIMAL(15,2) GENERATED ALWAYS AS (unit_price) STORED,
    total DECIMAL(15,2) GENERATED ALWAYS AS (unit_price * (1 + tax_rate / 100)) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT tax_exemption_required CHECK (
        (tax_rate = 0 AND tax_exemption_reason IS NOT NULL) OR
        (tax_rate > 0 AND tax_exemption_reason IS NULL)
    )
);

-- Enable RLS
ALTER TABLE product_lines ENABLE ROW LEVEL SECURITY;

-- Create policies with unique names
CREATE POLICY "product_lines_select"
    ON product_lines FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "product_lines_insert"
    ON product_lines FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "product_lines_update"
    ON product_lines FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "product_lines_delete"
    ON product_lines FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_product_lines_updated_at
    BEFORE UPDATE ON product_lines
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();