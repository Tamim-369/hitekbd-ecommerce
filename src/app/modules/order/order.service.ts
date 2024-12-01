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

const getAllOrders = async (search: string, page: number | null, limit: number | null): Promise<IOrder[]> => {
  const query = search ? { $or: [] } : {};
  let queryBuilder = Order.find(query);

  if (page && limit) {
    queryBuilder = queryBuilder.skip((page - 1) * limit).limit(limit);
  }

  return await queryBuilder;
};


const getOrderById = async (id: string): Promise<IOrder | null> => {
  const result = await Order.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Order not found!');
  }
  return result;
};

const updateOrder = async (id: string, payload: IOrder): Promise<IOrder | null> => {
  const isExistOrder = await getOrderById(id);
  if (!isExistOrder) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Order not found!');
  }
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
  const result = await Order.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete order!');
  }
  return result;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
