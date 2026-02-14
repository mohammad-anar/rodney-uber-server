import { Types } from 'mongoose';

export interface ICouponUsage {
  email: string;
  coupon: Types.ObjectId;
  video: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
