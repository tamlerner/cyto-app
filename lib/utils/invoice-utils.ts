export function calculateInvoiceTotals(items: { quantity: number; unit_price: number; tax_rate: number }[]) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const taxTotal = items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.unit_price;
    return sum + (itemTotal * item.tax_rate) / 100;
  }, 0);
  
  return {
    subtotal,
    tax_total: taxTotal,
    total: subtotal + taxTotal,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}-${random}`;
}