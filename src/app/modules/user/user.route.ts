import express from 'express';
import { UserController } from './user.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.get('/', auth(USER_ROLES.ADMIN), UserController.getAllUsers);
router.post(
  '/',
  fileUploadHandler(),
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUser,
);
router.get('/stats', auth(USER_ROLES.ADMIN), UserController.getUserStats);
router.get('/:id', auth(USER_ROLES.ADMIN), UserController.getUserById);
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  fileUploadHandler(),
  validateRequest(UserValidation.updateUserZodSchema),
  UserController.updateUser,
);
router.delete('/:id', UserController.deleteUser);

export const UserRouter = router;
