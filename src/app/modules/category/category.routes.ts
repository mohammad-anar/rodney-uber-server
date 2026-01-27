import express from 'express';
import { CategoryController } from './category.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryValidation } from './category.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

router.get('/', CategoryController.getAllCategories);
router.post(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  validateRequest(CategoryValidation.createCategoryZodSchema),
  CategoryController.createCategory,
);
router.get('/:id', CategoryController.getCategoryById);
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  validateRequest(CategoryValidation.updateCategoryZodSchema),
  CategoryController.updateCategory,
);
router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  CategoryController.deleteCategory,
);

export const CategoryRouter = router;
