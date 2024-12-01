import { Model, Types } from 'mongoose';

export type IOrder = {
  customer: Types.ObjectId;
  product: Types.ObjectId;
  amountPaid: number
};

export type OrderModel = Model<IOrder>;
