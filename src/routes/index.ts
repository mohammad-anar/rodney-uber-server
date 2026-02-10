import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRouter } from '../app/modules/user/user.route';
import { VideoRouter } from '../app/modules/video/video.routes';
import { HelpRouter } from '../app/modules/help/help.routes';
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
    path: '/video',
    route: VideoRouter,
  },
  {
    path: '/help-request',
    route: HelpRouter,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
