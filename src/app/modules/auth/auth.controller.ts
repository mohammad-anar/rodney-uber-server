import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';

const verifyPhoneToDB = catchAsync(async (req: Request, res: Response) => {
  const { phone, otp } = req.body;
  const result = await AuthService.verifyPhoneToDB({ phone, oneTimeCode: otp });

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: result.message,
    data: result.data,
  });
});

const resendVerifyPhone = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phone } = req.body;
    const result = await AuthService.resendVerifyPhone(phone);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Email resend successfully',
      data: result,
    });
  },
);

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { phone, password } = req.body;
  const result = await AuthService.loginUserFromDB({ phone, password });

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User logged in successfully.',
    data: { accessToken: result.accessToken },
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const email = req.body.email;
  const result = await AuthService.forgetPasswordToDB(email);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message:
      'Please check your email. We have sent you a one-time passcode (OTP).',
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  const { ...resetData } = req.body;
  const result = await AuthService.resetPasswordToDB(token!, resetData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Your password has been successfully reset.',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { ...passwordData } = req.body;
  await AuthService.changePasswordToDB(user, passwordData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Your password has been successfully changed',
  });
});

export const AuthController = {
  // verifyEmail,
  // resendVerifyEmail,
  resendVerifyPhone,
  verifyPhoneToDB,
  loginUser,
  forgetPassword,
  resetPassword,
  changePassword,
};
