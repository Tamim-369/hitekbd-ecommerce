import { Schema, model } from 'mongoose';
import { IOrder } from './order.interface';
import { STATUS } from '../../../enums/order';

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: [
      { type: Schema.Types.ObjectId, ref: 'Products', required: true }
    ],
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

export const Order = model<IOrder>('Order', orderSchema);
