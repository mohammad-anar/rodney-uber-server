import { IQueryParams } from '../../../types/pagination';
import QueryBuilder from '../../builder/QueryBuilder';
import { IUser } from './user.interface';
import { User } from './user.model';

// create users
const createUser = async (payload: IUser) => {
  const result = await User.create(payload);
  return result;
};
// get all users
const getAllUsers = async (query: IQueryParams) => {
  console.log('Get all users');
  const modelQuery = User.find().select('-password');

  const qb = new QueryBuilder(modelQuery, query);
  qb.search(['name', 'email']).sort().filter().paginate().fields();
  const result = await qb.modelQuery;
  const pagination = await qb.getPaginationInfo();
  return { meta: pagination, data: result };
};

// get user by id
const getUserById = async (id: string) => {
  const result = await User.findById(id).select('-password');
  return result;
};

// update user
const updateUser = async (id: string, payload: Partial<IUser>) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

// delete user
const deleteUser = async (id: string) => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
