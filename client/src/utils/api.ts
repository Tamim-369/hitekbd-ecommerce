import { IResponse } from '../types/responseType';
import { IErrorResponse } from '../types/error';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export interface Product {
  _id: string;
  title: string;
  description: string;
  image: string[];
  details: string;
  price: string;
  discountedPrice: string;
  stockAmount: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  profile?: string;
}

export interface Order {
  _id?: string;
  user: string;
  product: string[];
  amountPaid: number;
  phoneNumber: string;
  address: string;
  transactionID: string;
  status?: string;
}

interface RequestOptions extends RequestInit {
  data?: any;
}

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

async function request<T = any>(
  endpoint: string,
  { data, headers: customHeaders, ...customConfig }: RequestOptions = {}
): Promise<T> {
  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders,
    },
    credentials: 'include',
    ...customConfig,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const responseData = await response.json();

    if (!response.ok) {
      // Handle API error response
      throw new ApiError(responseData);
    }

    return responseData.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Handle network or other errors
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
    ) => {
      console.log(token);
      request('/auth/reset-password', {
        data: { newPassword, confirmPassword },
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    },

    logout: () => {
      localStorage.removeItem('token');
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
  products: {
    getAll: () => request<Product[]>('/products'),
    getById: (id: string) => request<Product>(`/products/${id}`),
    create: (formData: FormData) =>
      request<Product>('/products', {
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    update: (id: string, formData: FormData) =>
      request<Product>(`/products/${id}`, {
        method: 'PATCH',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    delete: (id: string) =>
      request<Product>(`/products/${id}`, {
        method: 'DELETE',
      }),
  },
  orders: {
    create: (data: Omit<Order, '_id'>) =>
      request<Order>('/orders/create', {
        method: 'POST',
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    getAll: (query?: { search?: string; page?: number; limit?: number }) => {
      const queryString = query
        ? `?${new URLSearchParams(query as Record<string, string>).toString()}`
        : '';
      return request<Order[]>(`/orders${queryString}`);
    },
    getById: (id: string) => request<Order>(`/orders/${id}`),
    update: (id: string, data: Partial<Order>) =>
      request<Order>(`/orders/${id}`, {
        method: 'PATCH',
        data,
      }),
    delete: (id: string) =>
      request<Order>(`/orders/${id}`, {
        method: 'DELETE',
      }),
  },
};
