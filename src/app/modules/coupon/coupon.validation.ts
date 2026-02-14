import { z } from 'zod';
import { COUPON_TYPE, DISCOUNT_TYPE } from '../../../enums/coupon';

export const createCouponSchema = z
  .object({
    promoCode: z
      .string()
      .min(3, 'Promo code must be at least 3 characters')
      .max(50, 'Promo code is too long')
      .trim(),

    source: z.enum(COUPON_TYPE, {
      message: 'Coupon source is required',
    }),

    discountType: z.enum(DISCOUNT_TYPE, {
      message: 'Discount type is required',
    }),

    discountValue: z
      .number({
        message: 'Discount value is required',
      })
      .positive('Discount value must be greater than 0'),

    expiredAt: z.coerce.date({
      message: 'Expiration date is required',
    }),

    isActive: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.discountType === DISCOUNT_TYPE.PERCENTAGE &&
      data.discountValue > 100
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Percentage discount cannot be more than 100%',
        path: ['discountValue'],
      });
    }
  });

export const updateCouponSchema = z
  .object({
    promoCode: z
      .string()
      .min(3, 'Promo code must be at least 3 characters')
      .max(50, 'Promo code is too long')
      .trim()
      .optional(),

    source: z.enum(COUPON_TYPE).optional(),

    discountType: z.enum(DISCOUNT_TYPE).optional(),

    discountValue: z
      .number({
        message: 'Discount value must be a number',
      })
      .positive('Discount value must be greater than 0')
      .optional(),

    expiredAt: z.coerce.date().optional(),

    isActive: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.discountType === DISCOUNT_TYPE.PERCENTAGE &&
      data.discountValue &&
      data.discountValue > 100
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Percentage discount cannot be more than 100%',
        path: ['discountValue'],
      });
    }
  });
