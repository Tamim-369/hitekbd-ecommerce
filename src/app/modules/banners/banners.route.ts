import express from 'express';
import { BannersController } from './banners.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BannersValidation } from './banners.validation';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.ADMIN),
  validateRequest(BannersValidation.createBannersZodSchema),
  BannersController.createBanners
);
router.get('/', BannersController.getAllBannerss);
router.get('/:id', BannersController.getBannersById);
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN),
  validateRequest(BannersValidation.updateBannersZodSchema),
  BannersController.updateBanners
);
router.delete('/:id', auth(USER_ROLES.ADMIN), BannersController.deleteBanners);

export const BannersRoutes = router;
