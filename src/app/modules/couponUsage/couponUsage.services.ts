import ApiError from '../../../errors/ApiError';
import { CouponUsage } from './couponUsage.model';
import httpStatus from 'http-status-codes';

const checkEmailUsage = async (email: string) => {
  const normalizedEmail = email.toLowerCase();

  const exists = await CouponUsage.exists({ email: normalizedEmail });
  console.log(exists);

  if (exists) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This email has already claimed a coupon.',
    );
  }

  return {
    used: false,
  };
};

export const CouponUsageService = { checkEmailUsage };
