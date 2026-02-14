import express from 'express';
import { CouponController } from './coupon.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  CouponController.getAllCoupons,
);
router.post('/', auth(USER_ROLES.ADMIN), CouponController.createCoupon);
router.get(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  CouponController.getCouponById,
);
router.patch('/:id', auth(USER_ROLES.ADMIN), CouponController.updateCoupon);
router.delete('/:id', auth(USER_ROLES.ADMIN), CouponController.deleteCoupon);

export const CouponRouter = router;
