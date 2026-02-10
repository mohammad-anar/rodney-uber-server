import { Request, Response } from 'express';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import { VideoService } from './video.services';
import sendResponse from '../../../shared/sendResponse';
import ApiError from '../../../errors/ApiError';

const createVideo = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const image = getSingleFilePath(req.files, 'image') as string;
  const media = getSingleFilePath(req.files, 'media') as string;
  if (!image || !media) {
    throw new ApiError(404, 'Thumbnail and Video file is required');
  }
  const thumbnail = `http://${config.ip_address}:${config.port}`.concat(image);
  const url = `http://${config.ip_address}:${config.port}`.concat(media);
  const result = await VideoService.createVideo({ ...payload, thumbnail, url });

  sendResponse(res, {
    success: true,
    message: 'Video uploaded successfully',
    statusCode: 201,
    data: result,
  });
});

export const VideoController = { createVideo };
