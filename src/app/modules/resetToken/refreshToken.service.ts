import express, { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import { jwtHelper } from '../../../helpers/jwtHelper';
import config from '../../../config';
import { Secret, SignOptions } from 'jsonwebtoken';

const router = express.Router();

router.get(
  '/',
  catchAsync(async (req: Request, res: Response) => {
    // You can get refresh token from header OR cookie
    const tokenWithBearer = req.headers.authorization;
    const cookieToken = req.cookies?.refreshToken;

    let refreshToken: string | undefined;

    if (tokenWithBearer?.startsWith('Bearer ')) {
      refreshToken = tokenWithBearer.split(' ')[1];
    } else if (cookieToken) {
      refreshToken = cookieToken;
    }

    if (!refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'No refresh token found');
    }

    let verifiedUser;

    try {
      // ✅ VERIFY using REFRESH SECRET (NOT access secret)
      verifiedUser = jwtHelper.verifyToken(
        refreshToken,
        config.jwt.jwt_refresh_secret as Secret,
      );
    } catch (error) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Invalid or expired refresh token',
      );
    }

    // Remove JWT internal fields
    const { iat, exp, ...payload } = verifiedUser;

    // ✅ Create NEW ACCESS TOKEN using ACCESS SECRET
    const newAccessToken = jwtHelper.createToken(
      payload,
      config.jwt.jwt_secret as Secret, // access secret
      config.jwt.jwt_expire_in as SignOptions['expiresIn'], 
    );

    sendResponse(res, {
      success: true,
      message: 'Access token retrieve successfully',
      statusCode: 200,
      data: {
        accessToken: newAccessToken,
      },
    });
  }),
);

export const RefreshTokenRouter = router;
