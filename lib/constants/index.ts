export const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'US Dollar ($)', symbol: '$' },
  { code: 'EUR', name: 'Euro (€)', symbol: '€' },
  { code: 'AOA', name: 'Angolan Kwanza (Kz)', symbol: 'Kz' },
] as const;

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Português' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
] as const;

export const UNITS_OF_MEASURE = [
  { code: 'unit', name: 'Unit' },
  { code: 'hour', name: 'Hour' },
  { code: 'day', name: 'Day' },
  { code: 'kg', name: 'Kilogram' },
  { code: 'meter', name: 'Meter' },
] as const;