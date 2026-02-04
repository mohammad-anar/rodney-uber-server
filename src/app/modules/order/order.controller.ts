import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import { OrderService } from './order.services';
import sendResponse from '../../../shared/sendResponse';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await OrderService.createOrder(payload);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Order created successfully.',
    data: result,
  });
});
const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await OrderService.getAllOrders(query);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Orders retrieved successfully.',
    data: result,
  });
});
const getMyAllOrders = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const query = req.query;
  const result = await OrderService.getMyAllOrders(query, user.phone);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'My orders retrieved successfully.',
    data: result,
  });
});
const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OrderService.getOrderById(id as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Order retrieved successfully.',
    data: result,
  });
});
const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await OrderService.updateOrder(id as string, payload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Order updated successfully.',
    data: result,
  });
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OrderService.deleteOrder(id as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Order deleted successfully.',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrders,
  getMyAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
