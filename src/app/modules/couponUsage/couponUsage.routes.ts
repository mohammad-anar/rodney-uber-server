import express from 'express';
import { CouponUsageController } from './couponUsage.controller';

const router = express.Router();

router.post('/check-email', CouponUsageController.checkEmailUsage);

export const CouponUsageRouter = router;
