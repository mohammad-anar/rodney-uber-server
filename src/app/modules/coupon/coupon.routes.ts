import express from 'express';
import { CouponController } from './coupon.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { claimCouponSchema } from './coupon.validation';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.get(
  '/claim-status',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  CouponController.getClaimStatus,
);
router.post(
  '/claim',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  validateRequest(claimCouponSchema),
  CouponController.claimCoupon,
);
router.post(
  '/random',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  CouponController.getRandomCoupon,
);
router.get('/', auth(USER_ROLES.ADMIN), CouponController.getAllCoupons);
router.post('/', auth(USER_ROLES.ADMIN), CouponController.createCoupon);
router.get('/:id', auth(USER_ROLES.ADMIN), CouponController.getCouponById);
router.patch('/:id', auth(USER_ROLES.ADMIN), CouponController.updateCoupon);
router.delete('/:id', auth(USER_ROLES.ADMIN), CouponController.deleteCoupon);

export const CouponRouter = router;

