import { z } from 'zod';
import mongoose from 'mongoose';

export const createCouponUsageSchema = z.object({
  email: z
    .string({
      message: 'Email is required',
    })
    .email('Invalid email address')
    .toLowerCase(),

  coupon: z
    .string({
      message: 'Coupon ID is required',
    })
    .refine(val => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid coupon ID',
    }),

  video: z
    .string({
      message: 'Video ID is required',
    })
    .refine(val => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid video ID',
    }),
});
