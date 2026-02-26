import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import { IQueryParams } from '../../../types/pagination';
import generateOTP from '../../../util/generateOTP';
import QueryBuilder from '../../builder/QueryBuilder';
import { CheckEmail } from '../auth/checkEmail.model';
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

  const otp = generateOTP();
  const value = {
    otp,
    email,
  };

  const checkEmail = emailTemplate.resetPassword(value);
  emailHelper.sendEmail(checkEmail);

  await CheckEmail.create({
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60 * 1000),
  });

  return {
    success: true,
    message: 'OTP sent to email successfully',
  };
};

// verify otp for email verification
const verifyEmail = async (email: string, oneTimeCode: number) => {
  const checkEmail = await CheckEmail.findOne({ oneTimeCode });

  if (!checkEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid OTP');
  }

  if (checkEmail.expireAt < new Date()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'OTP has expired');
  }

  if (checkEmail.oneTimeCode !== oneTimeCode) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect OTP');
  }

  await CheckEmail.deleteOne({ _id: checkEmail._id });

  return {
    success: true,
    message: 'Email is eligible to claim coupon.',
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

export const CouponUsageService = {
  checkEmailUsage,
  verifyEmail,
  getVideoCompletionLogs,
};
