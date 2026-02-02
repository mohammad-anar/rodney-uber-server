import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
const router = express.Router();

router
  .route('/profile')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
    UserController.getUserProfile,
  )
  .patch(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
    fileUploadHandler(),
    validateRequest(UserValidation.updateUserZodSchema),
    UserController.updateProfile,
  );

router
  .route('/')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    UserController.getAllUsers,
  )
  .post(
    validateRequest(UserValidation.createUserZodSchema),
    UserController.createUser,
  );

router
  .route('/:id')

  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    UserController.getUserById,
  )

export const UserRoutes = router;
