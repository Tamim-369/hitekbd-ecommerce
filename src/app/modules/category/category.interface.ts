import { Model, Types } from 'mongoose';
  
  export type ICategory = {
    name: string
  };
  
  export type CategoryModel = Model<ICategory>;
