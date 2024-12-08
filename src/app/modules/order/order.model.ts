import { Schema, model } from 'mongoose';
import { IOrder, OrderModel } from './order.interface';
import { STATUS } from '../../../enums/order';

const orderSchema = new Schema<IOrder, OrderModel>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
      required: true,
    },
    amountPaid: { type: Number, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    transactionID: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.PENDING,
    },
  },
  { timestamps: true }
);

export const Order = model<IOrder, OrderModel>('Order', orderSchema);
