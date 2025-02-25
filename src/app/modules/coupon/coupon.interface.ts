import { Model, Types } from 'mongoose';
  
  export type ICoupon = {
    name: string;
  description: string
  };
  
  export type CouponModel = Model<ICoupon>;
