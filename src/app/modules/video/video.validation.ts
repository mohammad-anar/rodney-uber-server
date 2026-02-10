import { z } from 'zod';

export const createVideoSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, 'Title must be at least 3 characters')
      .max(150, 'Title is too long'),

    description: z.string().max(1000, 'Description is too long').optional(),

    duration: z.number().positive('Duration must be greater than 0'),

    isActive: z.boolean().optional().default(false),
  }),
});
export const updateVideoSchema = z.object({
  body: z.object({
    title: z.string().optional(),

    description: z.string().max(1000, 'Description is too long').optional(),

    duration: z.number().positive('Duration must be greater than 0').optional(),

    isActive: z.boolean().optional().default(false),
  }),
});
