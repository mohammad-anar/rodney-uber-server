import { Types } from 'mongoose';

export interface IProduct {
  title: string;
  description: string;
  category: Types.ObjectId;
  image: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}
