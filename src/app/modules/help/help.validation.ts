import { z } from 'zod';

export const createHelpRequestSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(3, 'Full name must be at least 3 characters')
      .max(100, 'Full name is too long'),

    email: z.email('Invalid email address'),

    description: z
      .string()
      .min(10, 'Description must be at least 10 characters')
      .max(2000, 'Description is too long'),

    helpAmount: z.coerce.number().min(0, 'Help amount cannot be negative'),
    supportingDocument: z.array(z.url()).optional(),
  }),
});

export const updateHelpRequestSchema = z.object({
  body: z.object({
    fullName: z.string().min(3).max(100).optional(),

    email: z.email().optional(),

    description: z.string().min(10).max(2000).optional(),

    helpAmount: z.coerce.number().min(0).optional(),

    supportingDocument: z.array(z.string().url()).optional(),
  }),
});
