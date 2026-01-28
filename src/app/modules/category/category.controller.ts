import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import { CategoryService } from './category.services';
import sendResponse from '../../../shared/sendResponse';
import config from '../../../config';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;
  const image = getSingleFilePath(req.files, 'image') as string;
  const imageUrl = `http://${config.ip_address}:${config.port}`.concat(image);

  const result = await CategoryService.createCategory({
    name,
    image: imageUrl,
  });

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Category created successfully.',
    data: result,
  });
});
//
const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getAllCategories(req.query);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'All categories retrieve successfully',
    data: result,
  });
});
//
const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.getCategoryById(id as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Category retrieve successfully',
    data: result,
  });
});
const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const image = getSingleFilePath(req.files, 'image') as string;
  const imageUrl = `http://${config.ip_address}:${config.port}`.concat(image);
  const payload: { name?: string; image?: string } = {};
  if (name) {
    payload.name = name;
  }
  if (image) {
    payload.image = imageUrl;
  }
  const result = await CategoryService.updateCategory(id as string, payload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Category updated successfully',
    data: result,
  });
});
const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.deleteCategory(id as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Category deleted successfully',
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
