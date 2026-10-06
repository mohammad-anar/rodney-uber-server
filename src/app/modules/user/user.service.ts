import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { UserStatus } from '../../../enums/user';
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
  // Check if email already exists
  const isExistEmail = await User.findOne({
    email: payload.email.toLowerCase(),
  });
  if (isExistEmail) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exists!');
  }

  // Check if deviceId already registered
  if (payload.deviceId) {
    const isExistDevice = await User.findOne({ deviceId: payload.deviceId });
    if (isExistDevice) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'An account has already been registered on this device!',
      );
    }
  }

  const result = await User.create(payload);

  // Generate OTP and save authentication to DB
  const otp = generateOTP();
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };
  await User.findOneAndUpdate(
    { _id: result._id },
    { $set: { authentication } },
  );

  // Send verification email
  try {
    const values = {
      name: result.name,
      otp: otp,
      email: result.email!,
    };
    const createAccountTemplate = emailTemplate.createAccount(values);
    await emailHelper.sendEmail(createAccountTemplate);
  } catch (error) {
    // Account is created; OTP is saved in DB, so user can also use resend-otp
  }

  return result;
};
// get all users
const getAllUsers = async (query: IQueryParams) => {
  const modelQuery = User.find({
    role: { $ne: 'ADMIN' },
  }).select('-password');

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

  // if (existingUser?.profilePhoto && payload.profilePhoto) {
  //   if (extractPathFromUrl(existingUser?.profilePhoto)) {
  //     unlinkFile(extractPathFromUrl(existingUser?.profilePhoto));
  //   }
  // }

  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).select(
    '_id name email phone profilePhoto role status createdAt updatedAt',
  );
  return result;
};

// delete user
const deleteUser = async (id: string) => {
  const existingUser = await User.findById(id);

  if (existingUser?.profilePhoto) {
    if (extractPathFromUrl(existingUser?.profilePhoto)) {
      unlinkFile(extractPathFromUrl(existingUser?.profilePhoto));
    }
  }
  const result = await User.findByIdAndDelete(id);
  return result;
};

const getUserStats = async () => {
  // Total users
  const total = await User.countDocuments();

  // Active users
  const active = await User.countDocuments({ status: UserStatus.ACTIVE });

  // Blocked users
  const blocked = await User.countDocuments({ status: UserStatus.BLOCKED });

  // Deleted users
  const deleted = await User.countDocuments({ status: UserStatus.DELETED });

  return {
    total,
    active,
    blocked,
    deleted,
  };
};

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
};
