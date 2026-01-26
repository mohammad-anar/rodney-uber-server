import express from 'express';
import { ProductController } from './product.controller';
import validateRequest from '../../middlewares/validateRequest';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { createProductSchema } from './product.validation';

const router = express.Router();

router.get('/', ProductController.getAllProducts);
router.post(
  '/',
  fileUploadHandler(),
  validateRequest(createProductSchema),
  ProductController.createProduct,
);

export const ProductRouter = router;
