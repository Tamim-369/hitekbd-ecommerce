import express from 'express';
import { AdminController } from './admin.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidation } from './admin.validation';

const router = express.Router();

router.get(
  '/dashboard',
  auth(USER_ROLES.ADMIN),
  AdminController.getDashboardStats
);

router.get('/users', auth(USER_ROLES.ADMIN), AdminController.getAllUsers);
router.get('/users/:id', auth(USER_ROLES.ADMIN), AdminController.getUser);
router.post(
  '/users',
  auth(USER_ROLES.ADMIN),
  validateRequest(AdminValidation.createUserZodSchema),
  AdminController.createUser
);
router.patch(
  '/users/:id',
  auth(USER_ROLES.ADMIN),
  validateRequest(AdminValidation.updateUserZodSchema),
  AdminController.updateUser
);
router.delete('/users/:id', auth(USER_ROLES.ADMIN), AdminController.deleteUser);
router.patch(
  '/users/:id/status',
  auth(USER_ROLES.ADMIN),
  validateRequest(AdminValidation.updateUserStatusZodSchema),
  AdminController.updateUserStatus
);

export const AdminRoutes = router;
