import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { NotificationService } from './notification.services';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

const getAllNotifications = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await NotificationService.getAllNotifications(query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Notifications retrieved successfully',
    data: result,
  });
});

export const NotificationController = { getAllNotifications };
