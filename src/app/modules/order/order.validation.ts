import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    productId: z.string({
      message: 'Product ID is required',
    }),
    user: z.object({
      name: z.string({
        message: 'User name is required',
      }),
      phone: z.string({
        message: 'User phone is required',
      }),
    }),
  }),
});
