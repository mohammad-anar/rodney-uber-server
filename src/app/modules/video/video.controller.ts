import { Request, Response } from 'express';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { VideoService } from './video.services';

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
//
const getVideos = catchAsync(async (req: Request, res: Response) => {
  const result = await VideoService.getVideos();

  sendResponse(res, {
    success: true,
    message: 'Video retrieve successfully',
    statusCode: 201,
    data: result,
  });
});
//
const updateVideo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const image = getSingleFilePath(req.files, 'image') as string;
  const media = getSingleFilePath(req.files, 'media') as string;
  const updatePayload: any = {};
  if (image) {
    const thumbnail = `http://${config.ip_address}:${config.port}`.concat(
      image,
    );
    updatePayload.thumbnail = thumbnail;
  }

  if (media) {
    const url = `http://${config.ip_address}:${config.port}`.concat(media);
    updatePayload.url = url;
  }

  const result = await VideoService.updateVideo(id as string, {
    ...payload,
    ...updatePayload,
  });

  sendResponse(res, {
    success: true,
    message: 'Video updated successfully',
    statusCode: 200,
    data: result,
  });
});

const deleteVideo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await VideoService.deleteVideo(id as string);

  sendResponse(res, {
    success: true,
    message: 'Video deleted successfully',
    statusCode: 200,
    data: result,
  });
});

export const VideoController = {
  createVideo,
  getVideos,
  updateVideo,
  deleteVideo,
};
