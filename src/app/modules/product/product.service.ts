import ApiError from '../../../errors/ApiError';
import QueryBuilder from '../../builder/QueryBuilder';
import { IQueryParams } from '../category/category.interfaces';
import { Category } from '../category/category.model';
import { IProduct } from './product.interface';
import { Product } from './product.model';
import httpStatus from 'http-status-codes';

const createProduct = async (payload: IProduct) => {
  const category = await Category.findById(payload.category);

  if (!category) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category not found!');
  }
  const product = await Product.create(payload);

  if (!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product not created');
  }

  return product;
};

const getAllProducts = async (query: IQueryParams) => {
  const modelQuery = Product.find();

  const qb = new QueryBuilder(modelQuery, query);

  qb.search(['title', 'description']).filter().sort().paginate().fields();

  const categories = await qb.modelQuery;
  const paginationInfo = await qb.getPaginationInfo();

  return { meta: paginationInfo, data: categories };
};

export const ProductService = { createProduct, getAllProducts };
