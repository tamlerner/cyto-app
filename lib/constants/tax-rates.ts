export const TAX_RATES = [
  { value: 0, label: 'IVA 0%', requiresJustification: true },
  { value: 1, label: 'IVA taxa reduzida: 1%', requiresJustification: false },
  { value: 5, label: 'IVA taxa intermédia: 5%', requiresJustification: false },
  { value: 14, label: 'IVA taxa normal: 14%', requiresJustification: false },
] as const;