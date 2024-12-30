export function calculateExchangeRate(
  rates: Record<string, number>,
  fromCurrency: string,
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) return 1;
  
  if (rates[fromCurrency] && rates[toCurrency]) {
    return rates[toCurrency] / rates[fromCurrency];
  }
  
  return 0;
}