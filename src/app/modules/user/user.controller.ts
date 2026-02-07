import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { UserService } from './user.service';
import sendResponse from '../../../shared/sendResponse';
import { getSingleFilePath } from '../../../shared/getFilePath';
import config from '../../../config';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const image = getSingleFilePath(req.files, 'image') as string;
  const url = `http://${config.ip_address}:${config.port}`.concat(image);
  const result = await UserService.createUser({
    ...payload,
    profilePhoto: url,
  });

  sendResponse(res, {
    success: true,
    message: 'User created',
    statusCode: 201,
    data: result,
  });
});
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await UserService.getAllUsers(query);

  sendResponse(res, {
    success: true,
    message: 'Users retrieve successfully',
    statusCode: 200,
    data: result,
  });
});
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.getUserById(id as string);

  sendResponse(res, {
    success: true,
    message: 'User retrieve successfully',
    statusCode: 200,
    data: result,
  });
});
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const image = getSingleFilePath(req.files, 'image') as string;
  const url = `http://${config.ip_address}:${config.port}`.concat(image);
  if (image) {
    payload.profilePhoto = url;
  }
  const result = await UserService.updateUser(id as string, payload);

  sendResponse(res, {
    success: true,
    message: 'User updated successfully',
    statusCode: 200,
    data: result,
  });
});
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.deleteUser(id as string);

  sendResponse(res, {
    success: true,
    message: 'User deleted successfully',
    statusCode: 200,
    data: result,
  });
});

export const UserController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
