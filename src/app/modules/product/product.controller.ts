import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { ProductService } from './product.service';
import sendResponse from '../../../shared/sendResponse';
import { getSingleFilePath } from '../../../shared/getFilePath';
import config from '../../../config';

const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const image = getSingleFilePath(req.files, 'image') as string;
    const imageUrl = `http://${config.ip_address}:${config.port}`.concat(image);

    const result = await ProductService.createProduct({
      ...payload,
      image: imageUrl,
    });

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
      statusCode: 200,
      message: 'Products retrieved successfully',
      data: result,
    });
  },
);
const getProductById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await ProductService.getProductById(id as string);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Product retrieved successfully',
      data: result,
    });
  },
);
const updateProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const { id } = req.params;
    const image = getSingleFilePath(req.files, 'image') as string;
    const imageUrl = `http://${config.ip_address}:${config.port}`.concat(image);

    const payload = { ...body };
    if (image) {
      payload.image = imageUrl;
    }

    console.log(payload);
    const result = await ProductService.updateProduct(id as string, {
      ...payload,
    });

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: 'Products updated successfully',
      data: result,
    });
  },
);

const deleteProductById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await ProductService.deleteProduct(id as string);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Product deleted successfully',
      data: result,
    });
  },
);

export const ProductController = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProductById,
};
