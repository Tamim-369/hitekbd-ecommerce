import { Types } from 'mongoose';

export interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  recentOrders: {
    _id: string;
    userName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }[];
  topProducts: {
    _id: string;
    title: string;
    totalSales: number;
    revenue: number;
  }[];
  salesByMonth: {
    month: string;
    orders: number;
    revenue: number;
  }[];
}

export interface SalesData {
  _id: {
    year: number;
    month: number;
  };
  orders: number;
  revenue: number;
}

export interface IUserWithStats {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'USER' | 'ADMIN';
  status: 'active' | 'blocked';
  totalOrders: number;
  totalSpent: number;
  createdAt: Date;
}

export interface ICreateUser {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'USER' | 'ADMIN';
  status: 'active' | 'blocked';
  password: string;
}

export interface IUpdateUser {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: 'USER' | 'ADMIN';
  status?: 'active' | 'blocked';
} 