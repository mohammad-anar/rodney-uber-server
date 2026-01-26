import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    category: z.string().min(1, 'Category ID is required'),
    price: z
      .number({ message: 'Price must be a number' })
      .nonnegative('Price must be >= 0'),
    image: z.string('Image is required'),
  }),
});
