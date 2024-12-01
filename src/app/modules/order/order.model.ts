import { Schema, model } from 'mongoose';
import { IOrder, OrderModel } from './order.interface';

const orderSchema = new Schema<IOrder, OrderModel>({
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  amountPaid: { type: Number, required: true }
}, { timestamps: true });

export const Order = model<IOrder, OrderModel>('Order', orderSchema);
