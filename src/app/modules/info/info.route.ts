import express from 'express';
import { InfoController } from './info.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { InfoValidation } from './info.validation';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.ADMIN),
  validateRequest(InfoValidation.createInfoZodSchema),
  InfoController.createInfo
);
router.get('/', InfoController.getAllInfos);
router.get('/:id', InfoController.getInfoById);
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN),
  validateRequest(InfoValidation.updateInfoZodSchema),
  InfoController.updateInfo
);
router.delete('/:id', auth(USER_ROLES.ADMIN), InfoController.deleteInfo);

export const InfoRoutes = router;
