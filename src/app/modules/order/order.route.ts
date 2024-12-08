import express from 'express';
import { OrderController } from './order.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidation } from './order.validation';

const router = express.Router();
const rolesOfAccess = [USER_ROLES.ADMIN, USER_ROLES.USER];
router.post(
  '/create',
  auth(...rolesOfAccess),
  validateRequest(OrderValidation.createOrderZodSchema),
  OrderController.createOrder
);
router.get('/', auth(...rolesOfAccess), OrderController.getAllOrders);
router.get('/:id', auth(...rolesOfAccess), OrderController.getOrderById);
router.patch(
  '/:id',
  auth(...rolesOfAccess),
  validateRequest(OrderValidation.updateOrderZodSchema),
  OrderController.updateOrder
);
router.delete('/:id', auth(...rolesOfAccess), OrderController.deleteOrder);

export const OrderRoutes = router;
