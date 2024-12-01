import { Model, Types } from 'mongoose';

export type IProducts = {
  images: string;
  title: string;
  description: string;
  price: number;
  discountedPrice: number;
  features: Array<string>
};

export type ProductsModel = Model<IProducts>;
