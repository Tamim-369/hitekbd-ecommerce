import { Model, Types } from 'mongoose';

interface ProductDetail {
  name: string;
  value: string;
}

export type IProducts = {
  title: string;
  description: string;
  image: Array<string>;
  details: ProductDetail[];
  price: number;
  discountedPrice: number;
  colors?: Array<string>;
  category: Types.ObjectId;
  stockAmount: number;
};

export type ProductsModel = Model<IProducts>;
