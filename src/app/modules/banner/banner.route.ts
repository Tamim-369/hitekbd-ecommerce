import express from 'express';
import { BannerController } from './banner.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { BannerValidation } from './banner.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
const router = express.Router();
const rolesOfAccess = [USER_ROLES.ADMIN];
router.post(
  '/create',
  auth(...rolesOfAccess),
  fileUploadHandler(),
  BannerController.createBanner
);
router.get('/', BannerController.getAllBanners);
router.get('/:id', BannerController.getBannerById);
router.patch(
  '/:id',
  auth(...rolesOfAccess),
  fileUploadHandler(),

  BannerController.updateBanner
);
router.delete('/:id', auth(...rolesOfAccess), BannerController.deleteBanner);

export const BannerRoutes = router;
