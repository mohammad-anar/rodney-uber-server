import express from 'express';
import { CouponController } from './coupon.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post('/', auth(USER_ROLES.ADMIN), CouponController.createCoupon);

export const CouponRouter = router;
