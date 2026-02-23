import ApiError from '../../../errors/ApiError';
import { IQueryParams } from '../../../types/pagination';
import QueryBuilder from '../../builder/QueryBuilder';
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
const getVideoCompletionLogs = async (query: IQueryParams) => {
  const modelQuery = CouponUsage.find();

  const qb = new QueryBuilder(modelQuery, query);
  qb.search(['email'])
    .sort()
    .filter()
    .paginate()
    .fields()
    .populate(['coupon'], {
      coupon: '',
    });
  const result = await qb.modelQuery;
  const pagination = await qb.getPaginationInfo();
  return { meta: pagination, data: result };
};

export const CouponUsageService = { checkEmailUsage, getVideoCompletionLogs };
