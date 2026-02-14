import { z } from 'zod';
import mongoose from 'mongoose';

export const createCouponUsageSchema = z.object({
  email: z
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

export const updateCouponUsageSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().optional(),

  coupon: z
    .string()
    .refine(val => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid coupon ID',
    })
    .optional(),

  video: z
    .string()
    .refine(val => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid video ID',
    })
    .optional(),
});

