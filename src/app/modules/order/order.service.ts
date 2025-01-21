import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Order } from './order.model';
import { IOrder } from './order.interface';
import { STATUS } from '../../../enums/order';
import { Products } from '../products/products.model';

const createOrder = async (payload: IOrder): Promise<IOrder> => {
  const productArray = payload.items;
  await Promise.all(
    productArray.map(async (item: any) => {
      const product = await Products.findById(item.productId);
      if (product) {
        product.stockAmount -= item.quantity;
        if (product.colors) {
          const colorIndex = product?.colors?.findIndex(
            (color: any) => color.color === item.color
          );
          if (colorIndex !== -1) {
            product.colors![colorIndex].amount -= item.quantity;
          }
        }
        await product.save();
      }
    })
  );
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
      .populate('product')
      .sort({ createdAt: -1 });

    return orders;
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to fetch orders'
    );
  }
};

const getOrderById = async (id: string): Promise<IOrder | null> => {
  const result = await Order.findById(id)
    .populate('user', 'name email')
    .populate('product');

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found!');
  }
  return result;
};

const updateOrder = async (
  id: string,
  payload: Partial<IOrder>
): Promise<IOrder | null> => {
  const isExistOrder = await getOrderById(id);
  if (!isExistOrder) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found!');
  }

  const result = await Order.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .populate('user', 'name email')
    .populate('product');

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update order!');
  }
  return result;
};

const deleteOrder = async (id: string): Promise<IOrder | null> => {
  const isExistOrder = await getOrderById(id);
  if (!isExistOrder) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found!');
  }

  const result = await Order.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete order!');
  }
  return result;
};

const updateOrderStatus = async (
  id: string,
  status: keyof typeof STATUS
): Promise<IOrder> => {
  //@ts-ignore
  if (!Object.values(STATUS).includes(status)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid status');
  }

  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate('user', 'name email')
    .populate('product');

  if (!order) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  return order;
};

const getMyOrdersFromDB = async (id: string) => {
  const orders = await Order.find({ user: id }).populate('product user');
  return orders;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  getMyOrdersFromDB,
};
