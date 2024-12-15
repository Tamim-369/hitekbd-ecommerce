export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface Order {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateOrderDTO = Omit<Order, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateOrderDTO = Partial<Order>; 