import express from 'express';
import { OrderController } from './order.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidation } from './order.validation';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  validateRequest(OrderValidation.createOrderZodSchema),
  OrderController.createOrder
);
router.get('/', OrderController.getAllOrders);
router.get('/:id', OrderController.getOrderById);
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  validateRequest(OrderValidation.updateOrderZodSchema),
  OrderController.updateOrder
);
router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  OrderController.deleteOrder
);

export const OrderRoutes = router;
