import { IErrorResponse } from '../types/error';
import {
  Order,
  CreateOrderDTO,
  UpdateOrderDTO,
  OrderStatus,
} from '../types/order';
import { Category } from '../types/category';
import { DashboardStats } from '../types/dashboard';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://api.hitekbd.com/api/v1';

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number | null;
  discountedPrice: number | null;
  category: string;
  stockAmount: number | null;
  colors: [
    {
      color: '';
      amount: 0;
    }
  ];
  image: string[];
  details: ProductDetail[];
}

export interface ProductDetail {
  name: string;
  value: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  profile?: string;
}

export interface UserWithStats {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'USER' | 'ADMIN';
  status: 'active' | 'blocked';
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

interface RequestOptions extends RequestInit {
  data?: any;
  body?: any;
}
type coupon = {
  _id: string;
  name: string;
  discountPrice: number;
};
class ApiError extends Error {
  statusCode: number;
  errorMessages: { path: string; message: string }[];

  constructor(response: IErrorResponse) {
    super(response.message);
    this.name = 'ApiError';
    this.statusCode = response.statusCode;
    this.errorMessages = response.errorMessages;
  }
}
type Banner = {
  _id: string;
  image: string[];
};

async function request<T = any>(
  endpoint: string,
  { data, body, headers: customHeaders, ...customConfig }: RequestOptions = {}
): Promise<T> {
  console.log('Request config:', {
    endpoint,
    method: customConfig.method,
    headers: customHeaders,
    data,
    body,
  });

  const config: RequestInit = {
    method: customConfig.method || (data || body ? 'POST' : 'GET'),
    body:
      body ||
      (data instanceof FormData
        ? data
        : data
        ? JSON.stringify(data)
        : undefined),
    headers: {
      ...(!(data instanceof FormData) && !body
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...customHeaders,
    },
    credentials: 'include',
    ...customConfig,
  };

  console.log('Final request config:', {
    url: `${API_URL}${endpoint}`,
    method: config.method,
    headers: config.headers,
    body: config.body instanceof FormData ? 'FormData' : config.body,
  });

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const responseData = await response.json();

    // console.log('Response:', responseData);

    if (!response.ok) {
      throw new ApiError(responseData);
    }

    return responseData.data;
  } catch (error) {
    console.error('Request error:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError({
      statusCode: 500,
      message: 'Network error or server is not responding',
      errorMessages: [
        {
          path: '',
          message: 'Unable to connect to server. Please try again later.',
        },
      ],
      success: false,
    });
  }
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request('/auth/login', { data: { email, password }, method: 'POST' }),
    signup: (data: {
      email: string;
      password: string;
      name: string;
      phone: string;
      address: string;
    }) => request('/user', { data, method: 'POST' }),
    verifyEmail: (email: string, oneTimeCode: number) =>
      request('/auth/verify-email', {
        data: { email, oneTimeCode },
        method: 'POST',
      }),
    forgotPassword: (email: string) =>
      request('/auth/forget-password', { data: { email }, method: 'POST' }),
    resetPassword: (
      token: string,
      newPassword: string,
      confirmPassword: string
    ) =>
      request('/auth/reset-password', {
        data: { newPassword, confirmPassword },
        headers: {
          'Content-Type': 'application/json',

          Authorization: `Bearer ${token}`,
        },
        method: 'POST',
      }),
    logout: () => {
      localStorage.removeItem('token');
      window.location.href = '/';
      return;
    },
    changePassword: (
      currentPassword: string,
      newPassword: string,
      confirmPassword: string
    ) =>
      request('/auth/change-password', {
        data: { currentPassword, newPassword, confirmPassword },
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
  },
  user: {
    getProfile: () =>
      request<User>('/user/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    updateProfile: (formData: FormData) =>
      request('/user', {
        method: 'PATCH',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
  },
  wishlist: {
    get: () =>
      request<string[]>('/user/wishlist', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    add: (productId: string) =>
      request(`/user/wishlist?id=${productId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    remove: (productId: string) =>
      request(`/user/wishlist?id=${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
  },
  products: {
    getAll: (query?: {
      category?: string;
      page?: number;
      limit?: number;
      minPrice?: number;
      maxPrice?: number;
    }) => {
      const queryString = query
        ? `?${new URLSearchParams(query as Record<string, string>).toString()}`
        : '';
      return request<Product[]>(`/products${queryString}`);
    },
    getById: (id: string) => request<Product>(`/products/${id}`),
    create: (formData: FormData) =>
      request<Product>('/products/create', {
        method: 'POST',
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    update: (id: string, formData: FormData) =>
      request<Product>(`/products/${id}`, {
        method: 'PATCH',
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    delete: (id: string) =>
      request<Product>(`/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
  },
  orders: {
    create: (data: CreateOrderDTO) =>
      request<Order>('/orders/create', {
        method: 'POST',
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    getAll: (query?: {
      search?: string;
      page?: number;
      limit?: number;
      status?: OrderStatus;
    }) => {
      const queryString = query
        ? `?${new URLSearchParams(query as Record<string, string>).toString()}`
        : '';
      return request<Order[]>(`/orders${queryString}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    },
    getMyOrders: () =>
      request<Order[]>('/orders/my', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    getById: (id: string) =>
      request<Order>(`/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    update: (id: string, data: UpdateOrderDTO) =>
      request<Order>(`/orders/${id}`, {
        method: 'PATCH',
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    delete: (id: string) =>
      request<Order>(`/orders/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
  },
  categorys: {
    getAll: () => request<Category[]>('/category'),
    create: (data: any) =>
      request<Category>('/category/create', {
        method: 'POST',
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    update: (data: any, id: string) =>
      request<Category>(`/category/${id}`, {
        method: 'PATCH',
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    delete: (id: string) =>
      request<void>(`/category/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
  },
  banners: {
    getAll: () => request<Banner[]>('/banners'),
    create: (data: any) =>
      request<Banner>('/banners/create', {
        method: 'POST',
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    update: (data: any, id: string) =>
      request<Banner>(`/banners/${id}`, {
        method: 'PATCH',
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    delete: (id: string) =>
      request<void>(`/banners/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
  },
  coupon: {
    getAll: () => request<coupon[]>('/coupon'),
    create: (data: any) =>
      request<coupon>('/coupon/create', {
        method: 'POST',
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    update: (data: any, id: string) =>
      request<coupon>(`/coupon/${id}`, {
        method: 'PATCH',
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    delete: (id: string) =>
      request<void>(`/coupon/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
  },
  reviews: {
    getAll: (productId: string) =>
      request(`/review?product=${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    getAllAdmin: () =>
      request('/review', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    create: (data: { description: string; star: number; product: string }) =>
      request('/review/create', {
        data,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    update: (id: string, data: { description: string; star: number }) =>
      request(`/review/${id}`, {
        data,
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    delete: (id: string) =>
      request(`/review/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
  },
  baseURL: API_URL,
  admin: {
    getDashboardStats: () =>
      request<DashboardStats>('/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    getAllUsers: () =>
      request<UserWithStats[]>('/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    getUser: (id: string) =>
      request<UserWithStats>(`/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    createUser: (data: Partial<UserWithStats>) =>
      request<UserWithStats>('/admin/users', {
        method: 'POST',
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    updateUser: (id: string, data: Partial<UserWithStats>) =>
      request<UserWithStats>(`/admin/users/${id}`, {
        method: 'PATCH',
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    deleteUser: (id: string) =>
      request<void>(`/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    updateUserStatus: (id: string, status: string) =>
      request<UserWithStats>(`/admin/users/${id}/status`, {
        method: 'PATCH',
        data: { status },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
  },
};
