import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CouponUsageService } from './couponUsage.services';

const checkEmailUsage = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  const result = await CouponUsageService.checkEmailUsage(email);

  sendResponse(res, {
    success: true,
    message: result.message,
    statusCode: 200,
    data: result,
  });
});
const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { email, oneTimeCode } = req.body;

  const result = await CouponUsageService.verifyEmail(email, oneTimeCode);

  sendResponse(res, {
    success: true,
    message: result.message,
    statusCode: 200,
    data: result,
  });
});

const getVideoCompletionLogs = catchAsync(
  async (req: Request, res: Response) => {
    const query = req.query;

    const result = await CouponUsageService.getVideoCompletionLogs(query);

    sendResponse(res, {
      success: true,
      message: 'Email is eligible to claim coupon.',
      statusCode: 200,
      data: result,
    });
  },
);

export const CouponUsageController = {
  checkEmailUsage,
  verifyEmail,
  getVideoCompletionLogs,
};
