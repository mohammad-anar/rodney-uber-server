import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AnalyticsService } from "./analytics.services";
import sendResponse from "../../../shared/sendResponse";

const getDashboardAnalytics = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AnalyticsService.getDashboardAnalytics();

    sendResponse(res, {
      success: true,
      message: 'Dashboard analytics retrieve successfully',
      statusCode: 200,
      data: result,
    });
  },
);


export const AnalyticsController = { getDashboardAnalytics };