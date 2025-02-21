import { Model, Types } from 'mongoose';
  
  export type IBanner = {
    image: string
  };
  
  export type BannerModel = Model<IBanner>;
