import ApiError from '../../../errors/ApiError';
import { IQueryParams } from '../../../types/pagination';
import QueryBuilder from '../../builder/QueryBuilder';
import { CouponUsage } from '../couponUsage/couponUsage.model';
import { ICoupon } from './coupon.interfaces';
import { Coupon } from './coupon.model';
import { User } from '../user/user.model';
import { Video } from '../video/video.model';
import { StatusCodes } from 'http-status-codes';

const CLAIM_INTERVAL_DAYS = 30;
const CLAIM_INTERVAL_MS = CLAIM_INTERVAL_DAYS * 24 * 60 * 60 * 1000;

// Create coupon
const createCoupon = async (payload: ICoupon) => {
  const result = await Coupon.create(payload);
  return result;
};

const getAllCoupons = async (query: IQueryParams) => {
  const modelQuery = Coupon.find();

  const qb = new QueryBuilder(modelQuery, query);

  qb.search(['promoCode']).sort().filter().paginate().fields();

  const result = await qb.modelQuery;

  const pagination = await qb.getPaginationInfo();

  return { meta: pagination, data: result };
};

const getCouponById = async (id: string) => {
  const result = await Coupon.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Coupon not found!');
  }
  return result;
};

// Check if user is eligible to claim a coupon (30-day lifecycle)
const getClaimStatus = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  // Find most recent coupon claim for this user, email, or deviceId
  const queryConditions: any[] = [
    { user: user._id },
    { email: user.email.toLowerCase() },
  ];
  if (user.deviceId) {
    queryConditions.push({ deviceId: user.deviceId });
  }

  const lastUsage = await CouponUsage.findOne({
    $or: queryConditions,
  })
    .sort({ createdAt: -1 })
    .populate('coupon');

  if (!lastUsage) {
    return {
      canClaim: true,
      lastClaimedAt: null,
      nextAvailableDate: null,
      daysRemaining: 0,
      lastCoupon: null,
    };
  }

  const lastClaimDate = lastUsage.claimedAt || lastUsage.createdAt || new Date();
  const nextAvailableDate = new Date(
    new Date(lastClaimDate).getTime() + CLAIM_INTERVAL_MS,
  );
  const now = new Date();

  if (now < nextAvailableDate) {
    const diffMs = nextAvailableDate.getTime() - now.getTime();
    const daysRemaining = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    return {
      canClaim: false,
      lastClaimedAt: lastClaimDate,
      nextAvailableDate,
      daysRemaining,
      lastCoupon: lastUsage.coupon,
    };
  }

  return {
    canClaim: true,
    lastClaimedAt: lastClaimDate,
    nextAvailableDate: null,
    daysRemaining: 0,
    lastCoupon: lastUsage.coupon,
  };
};

// Claim a random coupon with 1-month lifecycle constraint
const claimCoupon = async (userId: string, videoId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  // 1. Verify 30-day lifecycle eligibility
  const status = await getClaimStatus(userId);
  if (!status.canClaim) {
    const formattedDate = status.nextAvailableDate
      ? status.nextAvailableDate.toISOString().split('T')[0]
      : '';
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `You can only claim 1 promo code every 30 days. Next promo code available in ${status.daysRemaining} day(s) (on ${formattedDate}).`,
    );
  }

  // 2. Verify video exists
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Video not found');
  }

  // 3. Find an active, non-expired coupon
  const coupons = await Coupon.aggregate([
    {
      $match: {
        isActive: true,
        expiredAt: { $gt: new Date() },
      },
    },
    { $sample: { size: 1 } },
  ]);

  if (!coupons.length) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'No available promo code found at this time. Please try again later.',
    );
  }

  const coupon = coupons[0];

  // 4. Record usage in database
  const usage = await CouponUsage.create({
    user: user._id,
    email: user.email.toLowerCase(),
    deviceId: user.deviceId,
    coupon: coupon._id,
    video: videoId,
    claimedAt: new Date(),
  });

  return {
    coupon,
    claimedAt: usage.claimedAt,
    nextClaimAvailableDate: new Date(Date.now() + CLAIM_INTERVAL_MS),
  };
};

const getRandomCoupon = async (email: string, videoId: string) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (user) {
    return claimCoupon(user._id.toString(), videoId);
  }

  // Fallback for direct email queries if user not yet linked
  const coupons = await Coupon.aggregate([
    {
      $match: {
        isActive: true,
        expiredAt: { $gt: new Date() },
      },
    },
    { $sample: { size: 1 } },
  ]);

  if (!coupons.length) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'No available coupon found');
  }

  return coupons[0];
};

const updateCoupon = async (id: string, payload: Partial<ICoupon>) => {
  const result = await Coupon.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteCoupon = async (id: string) => {
  const result = await Coupon.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Not found!');
  }
  return result;
};

export const CouponServices = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  getClaimStatus,
  claimCoupon,
  getRandomCoupon,
  updateCoupon,
  deleteCoupon,
};

