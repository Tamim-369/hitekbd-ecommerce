import { useEffect, useState } from 'react';
import { Card } from '../../components/admin/Card';
import { ShoppingBag, Users, DollarSign, TrendingUp, Package } from 'lucide-react';
import { DashboardStats } from '../../types/dashboard';
import { api } from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DashboardSkeleton } from '../../components/admin/DashboardSkeleton';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    recentOrders: [],
    topProducts: [],
    salesByMonth: [],
  });

  const { showError } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const data = await api.admin.getDashboardStats();
      setStats(data);
    } catch (error) {
      showError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card 
          title="Total Products"
          value={stats.totalProducts}
          icon={<ShoppingBag />}
          trend={+5}
        />
        <Card 
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users />}
          trend={+12}
        />
        <Card 
          title="Total Revenue"
          value={stats.totalRevenue}
          icon={<DollarSign />}
          trend={+8}
          prefix="৳"
        />
        <Card 
          title="Total Orders"
          value={stats.totalOrders}
          icon={<TrendingUp />}
          trend={-3}
        />
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.salesByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="orders"
                stroke="#8884d8"
                name="Orders"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#82ca9d"
                name="Revenue"
                formatter={(value) => `৳${(value || 0).toFixed(2)}`}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Package className="text-gray-400 mr-2" size={16} />
                          <span className="text-sm text-gray-900">
                            #{order._id?.slice(-6) || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.userName || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{order.userEmail || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ৳{(order.totalAmount || 0).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Top Products</h2>
            <div className="space-y-4">
              {stats.topProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {product.title || 'N/A'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {product.totalSales || 0} sales
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ৳{(product.revenue || 0).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 