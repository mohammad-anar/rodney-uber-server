import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { BannerController } from './banner.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { createBannerSchema } from './banner.validation';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  BannerController.getAllBanners,
);
router.post(
  '/',
  fileUploadHandler(),
  validateRequest(createBannerSchema),
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  BannerController.createBanner,
);
router.get(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  BannerController.getBannerById,
);
router.patch(
  '/:id',
  fileUploadHandler(),
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  BannerController.updateBanner,
);

router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  BannerController.deleteBanner,
);

export const BannerRouter = router;
