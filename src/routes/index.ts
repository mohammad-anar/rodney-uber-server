import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRouter } from '../app/modules/user/user.route';
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
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
