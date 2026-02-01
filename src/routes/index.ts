import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { CategoryRouter } from '../app/modules/category/category.routes';
import { ProductRouter } from '../app/modules/product/product.routes';
import { OrderRouter } from '../app/modules/order/order.routes';
import { AnalyticsRoutes } from '../app/modules/analytics/analytics.routes';
import { BannerRouter } from '../app/modules/banner/banner.routes';
const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/category',
    route: CategoryRouter,
  },
  {
    path: '/product',
    route: ProductRouter,
  },
  {
    path: '/order',
    route: OrderRouter,
  },
  {
    path: '/analytics',
    route: AnalyticsRoutes,
  },
  {
    path: '/banners',
    route: BannerRouter,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
