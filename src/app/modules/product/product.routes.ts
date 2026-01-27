import express from 'express';
import { ProductController } from './product.controller';
import validateRequest from '../../middlewares/validateRequest';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { createProductSchema, updateProductSchema } from './product.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.get('/', ProductController.getAllProducts);
router.post(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  validateRequest(createProductSchema),
  ProductController.createProduct,
);
router.get('/:id', ProductController.getProductById);
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  validateRequest(updateProductSchema),
  ProductController.updateProduct,
);
router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  ProductController.deleteProductById,
);

export const ProductRouter = router;
