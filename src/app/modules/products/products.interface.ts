import { Model, Types } from 'mongoose';
  
  export type IProducts = {
    title: string;
  description: string;
  image: Array<string>;
  details: Array<Object>;
  price: number;
  discountedPrice: number;
  stockAmount: number
  };
  
  export type ProductsModel = Model<IProducts>;
