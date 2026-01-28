import { Types } from 'mongoose';

export interface IUserInfo {
  name: string;
  phone: string;
}

export interface IOrder {
  productId: Types.ObjectId;
  user: IUserInfo;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
}