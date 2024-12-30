import { SUPPORTED_CURRENCIES } from '@/lib/constants';

export function formatCurrency(amount: number, currencyCode: string = 'AOA'): string {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
  if (!currency) {
    throw new Error(`Unsupported currency: ${currencyCode}`);
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
}