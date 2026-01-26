import { z } from 'zod';

const createCategoryZodSchema = z.object({
  body: z.object({
    name: z.string({ message: 'Name is required' }),
  }),
});

export const CategoryValidation = {
  createCategoryZodSchema,
};
