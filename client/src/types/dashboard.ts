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