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
  
  const getAllOrders = async (queryFields: Record<string, any>): Promise<IOrder[]> => {
  const { search, page, limit } = queryFields;
    const query = search ? { $or: [{ phoneNumber: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { transactionID: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } }] } : {};
    let queryBuilder = Order.find(query);
  
    if (page && limit) {
      queryBuilder = queryBuilder.skip((page - 1) * limit).limit(limit);
    }
    delete queryFields.search;
    delete queryFields.page;
    delete queryFields.limit;
    queryBuilder.find(queryFields);
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
      false
    const isExistOrder = await getOrderById(id);
    if (!isExistOrder) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Order not found!');
    }
    false
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
        false
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
