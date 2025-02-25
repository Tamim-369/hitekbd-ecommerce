import express from 'express';
import { CouponController } from './coupon.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CouponValidation } from './coupon.validation';

const router = express.Router();
const rolesOfAccess = [USER_ROLES.ADMIN] // all the user role who you want to give access to create, update and delete route
router.post(
  '/create',
  auth(...rolesOfAccess),
  validateRequest(CouponValidation.createCouponZodSchema),
  CouponController.createCoupon
);
router.get('/', CouponController.getAllCoupons);
router.get('/:id', CouponController.getCouponById);
router.patch(
  '/:id',
  auth(...rolesOfAccess),
  validateRequest(CouponValidation.updateCouponZodSchema),
  CouponController.updateCoupon
);
router.delete('/:id', auth(...rolesOfAccess), CouponController.deleteCoupon);

export const CouponRoutes = router;
