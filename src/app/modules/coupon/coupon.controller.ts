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
    message: 'Coupons retrieve successfully',
    statusCode: 200,
    data: result,
  });
});
const getCouponById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await CouponServices.getCouponById(id as string);

  sendResponse(res, {
    success: true,
    message: 'Coupon retrieve successfully',
    statusCode: 200,
    data: result,
  });
});
const getRandomCoupon = catchAsync(async (req: Request, res: Response) => {
  const { email, videoId } = req.body;

  const result = await CouponServices.getRandomCoupon(email, videoId);

  sendResponse(res, {
    success: true,
    message: 'Coupon retrieve successfully',
    statusCode: 200,
    data: result,
  });
});
const updateCoupon = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await CouponServices.updateCoupon(id as string, payload);

  sendResponse(res, {
    success: true,
    message: 'Coupon updated successfully',
    statusCode: 200,
    data: result,
  });
});
const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await CouponServices.deleteCoupon(id as string);

  sendResponse(res, {
    success: true,
    message: 'Coupon deleted successfully',
    statusCode: 200,
    data: result,
  });
});

export const CouponController = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  getRandomCoupon,
};
