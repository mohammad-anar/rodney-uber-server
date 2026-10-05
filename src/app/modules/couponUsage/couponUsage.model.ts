import { Schema, model } from 'mongoose';

const couponUsageSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    deviceId: {
      type: String,
      trim: true,
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
    claimedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true },
);

couponUsageSchema.index({ user: 1, createdAt: -1 });
couponUsageSchema.index({ deviceId: 1, createdAt: -1 });
couponUsageSchema.index({ email: 1, createdAt: -1 });

export const CouponUsage = model('CouponUsage', couponUsageSchema);
