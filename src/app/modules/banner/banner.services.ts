import QueryBuilder from '../../builder/QueryBuilder';
import { IQueryParams } from '../category/category.interfaces';
import { IBanner } from './banner.interfaces';
import { Banner } from './banner.model';

const createBanner = async (payload: IBanner) => {
  const result = await Banner.create(payload);

  return result;
};

const getAllBanners = async (query: IQueryParams) => {
  const modelQuery = Banner.find();

  const qb = new QueryBuilder(modelQuery, query);

  qb.search(['title', 'description']).filter().sort().paginate().fields();

  const orders = await qb.modelQuery;

  const paginationInfo = await qb.getPaginationInfo();

  return { meta: paginationInfo, data: orders };
};
const getBannerById = async (id: string) => {
  const result = await Banner.findByIdAndDelete(id);

  return result;
};

const updateBanner = async (id: string, payload: Partial<IBanner>) => {
  console.log(id, payload);
  const result = await Banner.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};
const deleteBanner = async (id: string) => {
  const result = await Banner.findByIdAndDelete(id);

  return result;
};

export const BannerServices = {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
};
