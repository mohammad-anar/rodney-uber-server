import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { AnalyticsServices } from './analytics.services';
import sendResponse from '../../../shared/sendResponse';

const getAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsServices.getAnalytics();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Analytics retrieved successfully',
    data: result,
  });
});

export const AnalyticsController = { getAnalytics };
