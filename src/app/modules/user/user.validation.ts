import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({ message: 'Name is required' }),
    email: z.email().optional(),
    phone: z.string({ message: 'Phone number is required' }),
    password: z
      .string({ message: 'Password is required' })
      .min(8, 'Password must be at least 8 characters'),
    address: z.string().optional(),
  }),
});

export const UserValidation = {
  createUserZodSchema,
};
