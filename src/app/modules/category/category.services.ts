import ApiError from '../../../errors/ApiError';
import { ICategory } from './category.interfaces';
import { StatusCodes } from 'http-status-codes';
import { Category } from './category.model';

const createCategory = async (payload: ICategory) => {
  console.log(payload);
  const { name, image } = payload;
  const isExistCategory = await Category.findOne({ name });
  console.log(isExistCategory);
  if (isExistCategory) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'A category with this name already exist!',
    );
  }

  const category = await Category.create({ name, image });

  return category;
};

export const CategoryService = { createCategory };
