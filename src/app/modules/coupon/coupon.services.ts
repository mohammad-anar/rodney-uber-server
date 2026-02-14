import { IQueryParams } from '../../../types/pagination';
import QueryBuilder from '../../builder/QueryBuilder';
import { ICoupon } from './coupon.interfaces';
import { Coupon } from './coupon.model';

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
