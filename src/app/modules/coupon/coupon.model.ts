import mongoose from 'mongoose';
import { COUPON_TYPE, DISCOUNT_TYPE } from '../../../enums/coupon';

const couponSchema = new mongoose.Schema(
  {
    promoCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    source: {
      type: String,
      enum: COUPON_TYPE,
      default: COUPON_TYPE.LYFT,
    },
    discountType: {
      type: String,
      enum: DISCOUNT_TYPE,
      default: DISCOUNT_TYPE.PERCENTAGE,
    },
    discountValue: {
      type: Number,
      default: 0,
    },

    expiredAt: {
      type: Date,
      required: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Coupon = mongoose.model('Coupon', couponSchema);
