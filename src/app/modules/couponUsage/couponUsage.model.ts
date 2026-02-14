import { Schema, model } from 'mongoose';

const couponUsageSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    coupon: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon',
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
    },
  },
  { timestamps: true },
);

couponUsageSchema.index({ email: 1, video: 1 }, { unique: true });

export const CouponUsage = model('CouponUsage', couponUsageSchema);
