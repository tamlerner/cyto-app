export const CURRENCY_PAIRS = [
  { from: 'AOA', to: 'EUR' },
  { from: 'AOA', to: 'USD' },
  { from: 'EUR', to: 'USD' },
  { from: 'EUR', to: 'AOA' },
  { from: 'USD', to: 'AOA' },
] as const;

export type CurrencyPair = typeof CURRENCY_PAIRS[number];