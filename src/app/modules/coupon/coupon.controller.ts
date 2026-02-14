import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { CouponServices } from './coupon.services';
import sendResponse from '../../../shared/sendResponse';

const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await CouponServices.createCoupon(payload);

  sendResponse(res, {
    success: true,
    message: 'Video uploaded successfully',
    statusCode: 201,
    data: result,
  });
});

export const CouponController = { createCoupon };
