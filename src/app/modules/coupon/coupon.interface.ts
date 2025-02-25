import { Model, Types } from 'mongoose';

export type ICoupon = {
  name: string;
  discountPrice: number;
};

export type CouponModel = Model<ICoupon>;
