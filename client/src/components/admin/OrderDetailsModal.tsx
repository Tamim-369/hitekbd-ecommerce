import { useState } from 'react';
import { X, Package, MapPin, CreditCard } from 'lucide-react';
import { Order } from '../../types/order';
import { useToast } from '../../contexts/ToastContext';
import StatusBadge from './StatusBadge';
import { useOrders } from '../../contexts/OrderContext';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onStatusUpdate: () => void;
}

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  onStatusUpdate,
}: OrderDetailsModalProps) {
  const [newStatus, setNewStatus] = useState<Order['status']>(order?.status || 'pending');
  const { showSuccess, showError } = useToast();
  const { updateOrderStatus } = useOrders();

  if (!isOpen || !order) return null;

  const handleStatusUpdate = async () => {
    try {
      await updateOrderStatus(order._id, newStatus);
      showSuccess('Order status updated successfully');
      onStatusUpdate();
      onClose();
    } catch (error) {
      showError('Failed to update order status');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Order Details #{order._id.slice(-6)}</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Customer Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">{order.userName}</p>
                <p className="text-sm text-gray-600">{order.userEmail}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <MapPin size={20} />
                Shipping Address
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">{order.shippingAddress.address}</p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </p>
                <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <CreditCard size={20} />
                Payment Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  Status: <span className="font-medium">{order.paymentStatus}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Total Amount: <span className="font-medium">৳{order.totalAmount.toFixed(2)}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-medium mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.title}</h4>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x ৳{item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    ৳{(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Status Update */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Update Status</h3>
              <div className="flex items-center gap-4">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as Order['status'])}
                  className="flex-1 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 