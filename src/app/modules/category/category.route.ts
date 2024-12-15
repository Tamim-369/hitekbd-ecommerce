import express from 'express';
import { CategoryController } from './category.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryValidation } from './category.validation';

const router = express.Router();
const rolesOfAccess = [USER_ROLES.ADMIN];
router.post(
  '/create',
  auth(...rolesOfAccess),
  validateRequest(CategoryValidation.createCategoryZodSchema),
  CategoryController.createCategory
);
router.get('/', CategoryController.getAllCategorys);
router.get('/:id', CategoryController.getCategoryById);
router.patch(
  '/:id',
  auth(...rolesOfAccess),
  validateRequest(CategoryValidation.updateCategoryZodSchema),
  CategoryController.updateCategory
);
router.delete(
  '/:id',
  auth(...rolesOfAccess),
  CategoryController.deleteCategory
);

export const CategoryRoutes = router;
