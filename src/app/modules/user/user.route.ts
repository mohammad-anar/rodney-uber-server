import express from 'express';
import { UserController } from './user.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = express.Router();

router.get('/', UserController.getAllUsers);
router.post(
  '/',
  fileUploadHandler(),
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUser,
);
router.get(
  '/:id',

  UserController.getUserById,
);
router.patch(
  '/:id',
  fileUploadHandler(),
  validateRequest(UserValidation.updateUserZodSchema),
  UserController.updateUser,
);
router.delete('/:id', UserController.deleteUser);

export const UserRouter = router;
