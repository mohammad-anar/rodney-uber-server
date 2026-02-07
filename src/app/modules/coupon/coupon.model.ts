import mongoose from 'mongoose';
import { COUPON_TYPE } from '../../../enums/coupon';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    codeType: {
      type: String,
      enum: COUPON_TYPE,
      default: COUPON_TYPE.LYFT,
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
  { timestamps: true },
);

export const Coupon = mongoose.model('Coupon', couponSchema);
