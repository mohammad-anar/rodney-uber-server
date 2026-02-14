import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRouter } from '../app/modules/user/user.route';
import { VideoRouter } from '../app/modules/video/video.routes';
import { HelpRouter } from '../app/modules/help/help.routes';
import { CouponRouter } from '../app/modules/coupon/coupon.routes';
import { CouponUsageRouter } from '../app/modules/couponUsage/couponUsage.routes';
import { RefreshTokenRouter } from '../app/modules/resetToken/refreshToken.service';
const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: UserRouter,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/refresh-token',
    route: RefreshTokenRouter,
  },
  {
    path: '/video',
    route: VideoRouter,
  },
  {
    path: '/coupon',
    route: CouponRouter,
  },
  {
    path: '/coupon-usage',
    route: CouponUsageRouter,
  },
  {
    path: '/help-request',
    route: HelpRouter,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
