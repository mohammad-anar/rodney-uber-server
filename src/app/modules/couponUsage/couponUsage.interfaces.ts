import { Types } from 'mongoose';

export interface ICouponUsage {
  user: Types.ObjectId;
  email: string;
  deviceId?: string;
  coupon: Types.ObjectId;
  video: Types.ObjectId;
  claimedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
