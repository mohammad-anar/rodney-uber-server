import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { CouponServices } from './coupon.services';
import sendResponse from '../../../shared/sendResponse';

const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await CouponServices.createCoupon(payload);

  sendResponse(res, {
    success: true,
    message: 'Coupon created successfully',
    statusCode: 201,
    data: result,
  });
});
const getAllCoupons = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await CouponServices.getAllCoupons(query);

  sendResponse(res, {
    success: true,
    message: 'Coupon retrieve successfully',
    statusCode: 200,
    data: result,
  });
});

export const CouponController = { createCoupon, getAllCoupons };
