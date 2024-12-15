import { Types } from 'mongoose';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface IOrderItem {
  productId: Types.ObjectId;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IOrder {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderWithUser extends Omit<IOrder, 'user'> {
  user: {
    _id: Types.ObjectId;
    name: string;
    email: string;
  };
}
