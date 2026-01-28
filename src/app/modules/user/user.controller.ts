import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';
import { USER_ROLES } from '../../../enums/user';
import config from '../../../config';
import { IUser } from './user.interface';
import ApiError from '../../../errors/ApiError';

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, phone, password } = req.body;
    const role = USER_ROLES.USER;
    const result = await UserService.createUserToDB({
      name,
      phone,
      password,
      role,
      isVerified: true,
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User created successfully',
      data: result,
    });
  },
);

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getUserProfileFromDB(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

//update profile
const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const data = req.body;
  const image = getSingleFilePath(req.files, 'image');

  const payload: Partial<IUser> = {};

  const allowedFields: (keyof IUser)[] = ['name', 'email', 'address', 'status'];

  allowedFields.forEach(field => {
    if (data?.[field] !== undefined) {
      payload[field] = data[field];
    }
  });

  if (image) {
    payload.image = `http://${config.ip_address}:${config.port}${image}`;
  }

  // 🔒 prevent empty updates
  if (Object.keys(payload).length === 0) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'No valid fields provided for update',
    );
  }

  const result = await UserService.updateProfileToDB(user, payload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile updated successfully',
    data: result,
  });
});


export const UserController = {
  createUser,
  getUserProfile,
  updateProfile,
};
