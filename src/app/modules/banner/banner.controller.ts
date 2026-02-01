import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { BannerServices } from './banner.services';
import sendResponse from '../../../shared/sendResponse';
import { getSingleFilePath } from '../../../shared/getFilePath';
import config from '../../../config';

const createBanner = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const image = getSingleFilePath(req.files, 'image') as string;
  const imageUrl = `http://${config.ip_address}:${config.port}`.concat(image);
  const result = await BannerServices.createBanner({
    ...payload,
    image: imageUrl,
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Banner created successfully.',
    data: result,
  });
});

const getAllBanners = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await BannerServices.getAllBanners(query);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Banners retrieved successfully.',
    data: result,
  });
});
const getBannerById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BannerServices.getBannerById(id as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Banner retrieved successfully.',
    data: result,
  });
});
const updateBanner = catchAsync(async (req: Request, res: Response) => {
  type Payload = {
    name?: string;
    image?: string;
  };
  const { id } = req.params;
  const data = req.body;
  const image = getSingleFilePath(req.files, 'image') as string;
  const imageUrl = `http://${config.ip_address}:${config.port}`.concat(image);
  const payload: { name?: string; image?: string } = {};
  if (data) {
    for (const key of Object.keys(data) as (keyof Payload)[]) {
      payload[key] = data[key];
    }
  }
  if (image) {
    payload.image = imageUrl;
  }

  const result = await BannerServices.updateBanner(id as string, payload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Banner updated successfully.',
    data: result,
  });
});

const deleteBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BannerServices.deleteBanner(id as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Banner deleted successfully.',
    data: result,
  });
});

export const BannerController = {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
};
