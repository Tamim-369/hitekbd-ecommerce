import { Products } from '../products/products.model';
import { User } from '../user/user.model';
import { Order } from '../order/order.model';
import { DashboardStats, SalesData, IUserWithStats, ICreateUser, IUpdateUser } from './admin.interface';
import { OrderWithUser } from '../order/order.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Types } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

const getDashboardStats = async (): Promise<DashboardStats> => {
  // Get total counts
  const [totalProducts, totalUsers, totalOrders] = await Promise.all([
    Products.countDocuments(),
    User.countDocuments(),
    Order.countDocuments(),
  ]);

  // Get total revenue
  const revenueData = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
      },
    },
  ]);
  const totalRevenue = revenueData[0]?.totalRevenue || 0;

  // Get recent orders with user details
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate<{ user: { name: string; email: string } }>('user', 'name email')
    .lean<OrderWithUser[]>();

  // Get top products
  const topProducts = await Order.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.productId',
        totalSales: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    {
      $project: {
        _id: 1,
        title: '$product.title',
        totalSales: 1,
        revenue: 1,
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 5 },
  ]);

  // Get sales by month for the current year
  const currentYear = new Date().getFullYear();
  const salesByMonth = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${currentYear}-01-01`),
          $lte: new Date(`${currentYear}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        orders: { $sum: 1 },
        revenue: { $sum: '$totalAmount' },
      },
    },
    { $sort: { '_id.month': 1 } },
  ]);

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const formattedSalesData = salesByMonth.map((data: SalesData) => ({
    month: monthNames[data._id.month - 1],
    orders: data.orders,
    revenue: data.revenue,
  }));

  return {
    totalProducts,
    totalUsers,
    totalRevenue,
    totalOrders,
    recentOrders: recentOrders.map(order => ({
      _id: order._id.toString(),
      userName: order.user.name,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
    })),
    topProducts,
    salesByMonth: formattedSalesData,
  };
};

const getAllUsers = async (): Promise<IUserWithStats[]> => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'user',
          as: 'orders',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          phone: 1,
          address: 1,
          role: 1,
          status: 1,
          createdAt: 1,
          totalOrders: { $size: '$orders' },
          totalSpent: {
            $sum: '$orders.totalAmount',
          },
        },
      },
    ])

    return users;
  } catch (error) {
    console.error('Error in getAllUsers:', error); // Debug log
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to fetch users');
  }
};

const getUser = async (id: string): Promise<IUserWithStats> => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const [userWithStats] = await User.aggregate([
    { $match: { _id: new Types.ObjectId(id) } },
    {
      $lookup: {
        from: 'orders',
        localField: '_id',
        foreignField: 'user',
        as: 'orders',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        phone: 1,
        address: 1,
        role: 1,
        status: 1,
        createdAt: 1,
        totalOrders: { $size: '$orders' },
        totalSpent: {
          $sum: '$orders.totalAmount',
        },
      },
    },
  ]);

  return userWithStats;
};

const createUser = async (payload: ICreateUser): Promise<IUserWithStats> => {
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  const user = await User.create({
    ...payload,
    password: hashedPassword,
  });

  return {
    ...user.toObject(),
    totalOrders: 0,
    totalSpent: 0,
  };
};

const updateUser = async (
  id: string,
  payload: IUpdateUser
): Promise<IUserWithStats> => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const updatedUser = await User.findByIdAndUpdate(id, payload, { new: true });
  if (!updatedUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update user');
  }

  return getUser(id);
};

const deleteUser = async (id: string): Promise<void> => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  if (user.role === 'ADMIN') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot delete admin user');
  }

  await User.findByIdAndDelete(id);
};

const updateUserStatus = async (
  id: string,
  status: 'active' | 'blocked'
): Promise<IUserWithStats> => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  if (user.role === 'ADMIN') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot update admin user status');
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  if (!updatedUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update user status');
  }

  return getUser(id);
};

export const AdminService = {
  getDashboardStats,
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
}; 