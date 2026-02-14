import ApiError from '../../../errors/ApiError';
import { IQueryParams } from '../../../types/pagination';
import QueryBuilder from '../../builder/QueryBuilder';
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
  updateCoupon,
  deleteCoupon,
};
