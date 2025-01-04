import * as z from 'zod';

export const invoiceSchema = z.object({
  client_id: z.string().min(1, 'Required'),
  currency: z.enum(['USD', 'EUR', 'AOA']),
  language: z.enum(['en', 'pt', 'fr', 'es']),
  issue_date: z.date(),
  due_date: z.date(),
  items: z.array(z.object({
    description: z.string().min(1, 'Required'),
    quantity: z.number().min(0.01, 'Must be greater than 0'),
    unit_price: z.number().min(0, 'Must be at least 0'),
    tax_rate: z.number().min(0, 'Must be at least 0'),
    tax_exemption_reason: z.string().optional(),
  })).min(1, 'At least one item is required'),
  notes: z.string().optional(),
});
