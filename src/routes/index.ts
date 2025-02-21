import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { ProductsRoutes } from '../app/modules/products/products.route';
import { OrderRoutes } from '../app/modules/order/order.route';
import { InfoRoutes } from '../app/modules/info/info.route';
import { BannersRoutes } from '../app/modules/banners/banners.route';
import { CategoryRoutes } from '../app/modules/category/category.route';
import { ReviewRoutes } from '../app/modules/review/review.route';
import { BannerRoutes } from '../app/modules/banner/banner.route';

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
    path: '/products',
    route: ProductsRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
  {
    path: '/infos',
    route: InfoRoutes,
  },

  {
    path: '/category',
    route: CategoryRoutes,
  },
  {
    path: '/review',
    route: ReviewRoutes,
  },
  {
    path: '/banners',
    route: BannerRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
