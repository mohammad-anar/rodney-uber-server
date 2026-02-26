import express from 'express';
import { CouponUsageController } from './couponUsage.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post('/check-email', CouponUsageController.checkEmailUsage);
router.post('/verify-email', CouponUsageController.verifyEmail);
router.get(
  '/',
  auth(USER_ROLES.ADMIN),
  CouponUsageController.getVideoCompletionLogs,
);

export const CouponUsageRouter = router;
