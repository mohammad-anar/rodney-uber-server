import express from 'express';
import { OrderController } from './order.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createOrderSchema } from './order.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  OrderController.getAllOrders,
);
router.get('/me', auth(USER_ROLES.USER), OrderController.getMyAllOrders);
router.post(
  '/',
  auth(USER_ROLES.USER),
  validateRequest(createOrderSchema),
  OrderController.createOrder,
);
router.get(
  '/:id',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  OrderController.getOrderById,
);
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  OrderController.updateOrder,
);
router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  OrderController.deleteOrder,
);

export const OrderRouter = router;
