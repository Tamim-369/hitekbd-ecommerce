import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { ProductsRoutes } from '../app/modules/products/products.route';
import { OrderRoutes } from '../app/modules/order/order.route';
import { InfoRoutes } from '../app/modules/info/info.route';
import { BannersRoutes } from '../app/modules/banners/banners.route';
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
    path: '/banners',
    route: BannersRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
