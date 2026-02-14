import { COUPON_TYPE, DISCOUNT_TYPE } from '../../../enums/coupon';

export interface ICoupon {
  promoCode: string;
  source: COUPON_TYPE;
  discountType: DISCOUNT_TYPE;
  discountValue: number;
  expiredAt: Date;
  isActive?: boolean;
}
