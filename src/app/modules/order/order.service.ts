import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Order } from './order.model';
import { IOrder } from './order.interface';

const createOrder = async (payload: IOrder): Promise<IOrder> => {
  const result = await Order.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create order!');
  }
  return result;
};

const getAllOrders = async () => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate({
        path: 'product',
        ref: 'Products',
        select: 'title price image'
      })
      .sort({ createdAt: -1 });

    return orders;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to fetch orders');
  }
};

const getOrderById = async (id: string): Promise<IOrder | null> => {
  const result = await Order.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Order not found!');
  }
  return result;
};

const updateOrder = async (
  id: string,
  payload: IOrder
): Promise<IOrder | null> => {
  false;
  const isExistOrder = await getOrderById(id);
  if (!isExistOrder) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Order not found!');
  }
  false;
  const result = await Order.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update order!');
  }
  return result;
};

const deleteOrder = async (id: string): Promise<IOrder | null> => {
  const isExistOrder = await getOrderById(id);
  if (!isExistOrder) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Order not found!');
  }
  false;
  const result = await Order.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete order!');
  }
  return result;
};

const updateOrderStatus = async (id: string, status: string): Promise<IOrder> => {
  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!order) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  return order;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
};
