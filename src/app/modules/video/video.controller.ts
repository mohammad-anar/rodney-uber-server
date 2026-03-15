import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { VideoService } from './video.services';
import { Video } from './video.model';

const createVideo = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const image = getSingleFilePath(req.files, 'image') as string;
  const media = getSingleFilePath(req.files, 'media') as string;
  if (!image || !media) {
    throw new ApiError(404, 'Thumbnail and Video file is required');
  }
  const thumbnail = `https://api.zeroproofdrive.org`.concat(image);
  const url = `https://api.zeroproofdrive.org`.concat(media);
  const result = await VideoService.createVideo({ ...payload, thumbnail, url });

  sendResponse(res, {
    success: true,
    message: 'Video uploaded successfully',
    statusCode: 201,
    data: result,
  });
});

const getVideos = catchAsync(async (req: Request, res: Response) => {
  const result = await VideoService.getVideos();

  sendResponse(res, {
    success: true,
    message: 'Video retrieve successfully',
    statusCode: 200,
    data: result,
  });
});

const streamVideo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    throw new ApiError(404, 'Video not found');
  }

  // Extract the filename from the URL (e.g., https://api.zeroproofdrive.org/uploads/media/media-1742084794218.mp4)
  let videoPath = '';
  try {
    const url = new URL(video.url);
    const fileName = path.basename(url.pathname);
    videoPath = path.join(process.cwd(), 'uploads', 'media', fileName);
  } catch (error) {
    // If URL is not valid, try to use it as a relative path
    videoPath = path.join(process.cwd(), video.url);
  }

  console.log('Attempting to stream video from path:', videoPath);

  if (!fs.existsSync(videoPath)) {
    console.error('Video file not found at:', videoPath);
    throw new ApiError(404, 'Video file not found on server');
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res
        .status(416)
        .send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
      return;
    }

    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});
//
const updateVideo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const image = getSingleFilePath(req.files, 'image') as string;
  const media = getSingleFilePath(req.files, 'media') as string;
  const updatePayload: any = {};
  if (image) {
    const thumbnail = `https://api.zeroproofdrive.org`.concat(image);
    updatePayload.thumbnail = thumbnail;
  }

  if (media) {
    const url = `https://api.zeroproofdrive.org`.concat(media);
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
  streamVideo,
};
