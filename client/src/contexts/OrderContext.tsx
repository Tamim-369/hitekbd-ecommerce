import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Order } from '../types/order';
import { api } from '../utils/api';
import { useToast } from './ToastContext';

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  loadOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
}

export function OrderProvider({ children }: OrderProviderProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.orders.getAll();
      setOrders(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load orders';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.orders.update(orderId, { status });
      showSuccess('Order status updated successfully');
      await loadOrders();
    } catch (err) {
      showError('Failed to update order status');
      throw err;
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        loadOrders,
        updateOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
} 