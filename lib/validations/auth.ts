import * as z from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  countryCode: z.string().min(1, 'Country code is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z].*[A-Z]/, 'Password must contain at least 2 uppercase letters')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least 1 special character'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;