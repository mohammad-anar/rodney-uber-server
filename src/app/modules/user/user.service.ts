import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import { sendOTPViaSMS } from '../../../helpers/twilioHelper';
import { IQueryParams } from '../category/category.interfaces';
import QueryBuilder from '../../builder/QueryBuilder';

// const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {
//   //set role
//   payload.role = USER_ROLES.USER;
//   const createUser = await User.create(payload);
//   if (!createUser) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
//   }

//   //send email
//   const otp = generateOTP();
//   const values = {
//     name: createUser.name,
//     otp: otp,
//     email: createUser.email!,
//   };
//   const createAccountTemplate = emailTemplate.createAccount(values);
//   emailHelper.sendEmail(createAccountTemplate);

//   //save to DB
//   const authentication = {
//     oneTimeCode: otp,
//     expireAt: new Date(Date.now() + 3 * 60000),
//   };
//   await User.findOneAndUpdate(
//     { _id: createUser._id },
//     { $set: { authentication } },
//   );

//   return createUser;
// };

const getAllUsers = async (query: IQueryParams) => {
  const modelQuery = User.find();

  const qb = new QueryBuilder(modelQuery, query);

  qb.search(['name', 'email']).filter().sort().paginate().fields();

  const orders = await qb.modelQuery;

  const paginationInfo = await qb.getPaginationInfo();

  return { meta: paginationInfo, data: orders };
};
const getUserById = async (id: string) => {
  const result = await User.findByIdAndDelete(id);

  return result;
};

const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {
  // create user
  const createUser = await User.create(payload);
  if (!createUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }

  // send SMS OTP
  if (!createUser.phone) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Phone number is required');
  }

  // await sendOTPViaSMS(createUser.phone);

  return createUser;
};

const getUserProfileFromDB = async (
  user: JwtPayload,
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>,
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.image) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

export const UserService = {
  getAllUsers,
  getUserById,
  createUserToDB,
  getUserProfileFromDB,
  updateProfileToDB,
};
