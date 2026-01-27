import ApiError from '../../../errors/ApiError';
import { ICategory, IQueryParams } from './category.interfaces';
import { StatusCodes } from 'http-status-codes';
import { Category } from './category.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createCategory = async (payload: ICategory) => {
  const { name, image } = payload;
  const isExistCategory = await Category.findOne({ name });
  if (isExistCategory) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'A category with this name already exist!',
    );
  }

  const category = await Category.create({ name, image });

  return category;
};

//
const getAllCategories = async (query: IQueryParams) => {
  const modelQuery = Category.find();

  const qb = new QueryBuilder(modelQuery, query);

  qb.search(['name']).filter().sort().paginate().fields();

  const categories = await qb.modelQuery;
  const paginationInfo = await qb.getPaginationInfo();

  return { meta: paginationInfo, data: categories };
};
//
const getCategoryById = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Category not found');
  }
  return category;
};
//
const updateCategory = async (
  id: string,
  payload: { name?: string; image?: string },
) => {
  const updatedCategory = await Category.findOneAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updateCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Category not found');
  }

  return updatedCategory;
};
const deleteCategory = async (id: string) => {
  const deleteCategory = await Category.findByIdAndDelete(id);

  return deleteCategory;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
