import { Model, Types } from 'mongoose';
import { STATUS } from '../../../enums/order';

export type IOrder = {
  user: Types.ObjectId;
  product: [Types.ObjectId];
  amountPaid: number;
  phoneNumber: string;
  address: string;
  transactionID: string;
  status?: STATUS.CANCELLED | STATUS.DELIVERED | STATUS.PENDING;
};

export type OrderModel = Model<IOrder>;
