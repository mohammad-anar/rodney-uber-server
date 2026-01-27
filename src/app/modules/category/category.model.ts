import { Model, model, Schema } from 'mongoose';
import { Product } from '../product/product.model';
import { ICategory } from './category.interfaces';

const categorySchema = new Schema<ICategory, any>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

categorySchema.pre('findOneAndDelete', async function (next: any) {
  try {
    const filter = this.getFilter();
    const category = await Category.findOne(filter);

    if (!category) {
      return next();
    }

    const product = await Product.findOne({ category: category._id });
    if (product) {
      const err = new Error(
        'Cannot delete category because it is used by one or more products.',
      );
      return next(err);
    }

    next();
  } catch (error) {
    next(error);
  }
});

export const Category: Model<ICategory> = model<ICategory, any>(
  'Category',
  categorySchema,
);
