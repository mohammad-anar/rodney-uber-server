import { ICoupon } from './coupon.interfaces';
import { Coupon } from './coupon.model';

// Create coupon
const createCoupon = async (payload: ICoupon) => {
  const result = await Coupon.create(payload);
  return result;
};
const getAllCoupons = async () => {};
const getCouponById = async () => {};
const updateCoupon = async () => {};
const deleteCoupon = async () => {};

export const CouponServices = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
};
