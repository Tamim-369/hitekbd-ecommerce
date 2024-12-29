import express from 'express';
import { ProductsController } from './products.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProductsValidation } from './products.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.ADMIN),
  fileUploadHandler(),
  ProductsController.createProducts
);
router.get('/', ProductsController.getAllProductss);
router.get('/:id', ProductsController.getProductsById);
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN),
  fileUploadHandler(),
  ProductsController.updateProducts
);
router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN),
  ProductsController.deleteProducts
);

export const ProductsRoutes = router;
