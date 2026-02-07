import mongoose from 'mongoose';
import { USER_ROLES, UserStatus } from '../../../enums/user';
import bcrypt from 'bcryptjs';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import config from '../../../config';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    profilePhoto: {
      type: String,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: USER_ROLES.USER,
    },
    status: {
      type: String,
      enum: UserStatus,
      default: UserStatus.ACTIVE,
    },

    address: {
      type: String,
      trim: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },
    authentication: {
      type: {
        isResetPassword: {
          type: Boolean,
          default: false,
        },
        oneTimeCode: {
          type: Number,
          default: null,
        },
        expireAt: {
          type: Date,
          default: null,
        },
      },
      select: 0,
    },
  },
  { timestamps: true, versionKey: false },
);

userSchema.statics.isExistUserById = async (id: string) => {
  const isExist = await User.findById(id);
  return isExist;
};

//check user
userSchema.pre('save', async function () {
  //check user
  const isExist = await User.findOne({ email: this.email });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exist!');
  }


  //password hash
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
});

export const User = mongoose.model('User', userSchema);
