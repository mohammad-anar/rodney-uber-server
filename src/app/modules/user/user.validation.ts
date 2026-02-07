import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({ message: 'Name is required' }),
    email: z.email({ message: 'Email is required' }),
    phone: z.string().optional(),
    password: z
      .string({ message: 'Password is required' })
      .min(8, 'Password must be at least 8 characters'),
    profilePhoto: z.string().optional(),
    address: z.string().optional(),
  }),
});
const updateUserZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.email().optional(),
    phone: z.string().optional(),
    profilePhoto: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
};
