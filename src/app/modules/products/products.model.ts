import { Schema, model } from 'mongoose';
import { IProducts, ProductsModel } from './products.interface';

const productsSchema = new Schema<IProducts, ProductsModel>({
  images: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  features: {type: [String], required: true }
}, { timestamps: true });

export const Products = model<IProducts, ProductsModel>('Products', productsSchema);
