import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CouponUsage } from './couponUsage.model';
import { CouponUsageService } from './couponUsage.services';

const checkEmailUsage = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  const result = await CouponUsageService.checkEmailUsage(email);

  sendResponse(res, {
    success: true,
    message: 'Email is eligible to claim coupon.',
    statusCode: 200,
    data: result,
  });
});

export const CouponUsageController = { checkEmailUsage };
