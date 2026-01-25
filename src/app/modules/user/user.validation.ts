import { z } from 'zod';

const createUserZodSchema = z.object({
    name: z.string({ message: 'Name is required' }),
    email: z.string({ message: 'Email is required' }),
    phone: z.string().optional(),
    password: z.string({ message: 'Password is required' }),
    address: z.string().optional(),
});

const updateUserZodSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().optional(),
  address: z.string().optional(),
  image: z.string().optional(),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
};
