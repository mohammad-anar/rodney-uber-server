import { Model } from 'mongoose';
import { USER_ROLES, UserStatus } from '../../../enums/user';

export type IUser = {
  name: string;
  role: USER_ROLES;
  email?: string;
  phone: string;
  password: string;
  address?: string;
  image?: string;
  status: UserStatus;
  isVerified: boolean;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
