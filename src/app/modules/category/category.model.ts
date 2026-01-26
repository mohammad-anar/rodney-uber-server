import { Model, model, Schema } from 'mongoose';
import { ICategory } from './category.interfaces';

const categorySchema = new Schema<ICategory, any>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Category: Model<ICategory> = model<ICategory, any>(
  'Category',
  categorySchema,
);
