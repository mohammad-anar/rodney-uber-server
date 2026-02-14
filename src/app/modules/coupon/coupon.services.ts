import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { IQueryParams } from '../../../types/pagination';
import QueryBuilder from '../../builder/QueryBuilder';
import { CouponUsage } from '../couponUsage/couponUsage.model';
import { ICoupon } from './coupon.interfaces';
import { Coupon } from './coupon.model';
import statusCode from 'http-status-codes';

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
    throw new ApiError(statusCode.NOT_FOUND, 'Not found!');
  }
  return result;
};

const getRandomCoupon = async (email: string, videoId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const coupons = await Coupon.aggregate([
      {
        $match: {
          isActive: true,
          expiredAt: { $gt: new Date() },
        },
      },
      { $sample: { size: 1 } },
    ]).session(session);

    if (!coupons.length) {
      throw new ApiError(statusCode.NOT_FOUND, 'No available coupon found');
    }

    const coupon = coupons[0];

    const alreadyUsed = await CouponUsage.findOne({
      email: email.toLowerCase(),
      video: videoId,
    }).session(session);

    if (alreadyUsed) {
      throw new ApiError(
        statusCode.BAD_REQUEST,
        'You have already claimed a coupon for this video',
      );
    }

    await CouponUsage.create(
      [
        {
          email: email.toLowerCase(),
          coupon: coupon._id,
          video: videoId,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return coupon;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
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
    throw new ApiError(statusCode.NOT_FOUND, 'Not found!');
  }
  return result;
};

export const CouponServices = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  getRandomCoupon,
  updateCoupon,
  deleteCoupon,
};
