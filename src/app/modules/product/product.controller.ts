import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { ProductService } from './product.service';
import sendResponse from '../../../shared/sendResponse';
import { getSingleFilePath } from '../../../shared/getFilePath';

const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const image = getSingleFilePath(req.files, 'image') as string;

    const result = await ProductService.createProduct({ ...payload, image });

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: 'Product created successfully',
      data: result,
    });
  },
);
const getAllProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const result = await ProductService.getAllProducts(query);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: 'Products retrieved successfully',
      data: result,
    });
  },
);

export const ProductController = { createProduct, getAllProducts };
