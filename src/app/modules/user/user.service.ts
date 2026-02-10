import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile, { extractPathFromUrl } from '../../../shared/unlinkFile';
import { IQueryParams } from '../../../types/pagination';
import generateOTP from '../../../util/generateOTP';
import QueryBuilder from '../../builder/QueryBuilder';
import { IUser } from './user.interface';
import { User } from './user.model';

// create users
const createUser = async (payload: IUser) => {
  const result = await User.create(payload);

  //send email
  const otp = generateOTP();
  const values = {
    name: result.name,
    otp: otp,
    email: result.email!,
  };
  const createAccountTemplate = await emailTemplate.createAccount(values);
  await emailHelper.sendEmail(createAccountTemplate);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };
  await User.findOneAndUpdate(
    { _id: result._id },
    { $set: { authentication } },
  );
  return result;
};
// get all users
const getAllUsers = async (query: IQueryParams) => {
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
  const existingUser = await User.findById(id);

  if (existingUser?.profilePhoto && payload.profilePhoto) {
    unlinkFile(extractPathFromUrl(existingUser?.profilePhoto));
  }

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
