import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({ message: 'Name is required' }),
    email: z
      .string({ message: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    deviceId: z
      .string({ message: 'Device ID is required' })
      .min(1, 'Device ID is required'),
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
    email: z
      .string()
      .email({ message: 'Invalid email address' })
      .optional(),
    deviceId: z.string().optional(),
    phone: z.string().optional(),
    profilePhoto: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
};
