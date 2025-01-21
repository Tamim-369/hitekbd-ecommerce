import { Schema, Types, model } from 'mongoose';
import { IProducts, ProductsModel } from './products.interface';

const productsSchema = new Schema<IProducts, ProductsModel>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: [String], required: true },
    details: { type: [Object], required: true },
    price: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    colors: {
      type: [
        {
          color: { type: String, required: true },
          amount: { type: Number, required: true },
        },
      ],
      required: false,
    },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    stockAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Products = model<IProducts, ProductsModel>(
  'Products',
  productsSchema
);
