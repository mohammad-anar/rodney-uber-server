import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import { CategoryService } from './category.services';
import sendResponse from '../../../shared/sendResponse';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;
  const image = getSingleFilePath(req.files, 'image') as string;

  const result = await CategoryService.createCategory({ name, image });

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Category created successfully.',
    data: result,
  });
});

export const CategoryController = { createCategory };
