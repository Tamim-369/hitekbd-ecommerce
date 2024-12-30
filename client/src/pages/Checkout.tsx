import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { useToast } from '../contexts/ToastContext';
import { ImageURL } from '../data/baseApi';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    transactionID: '',
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await api.user.getProfile();
        setProfileData(response);
        setFormData(prev => ({
          ...prev,
          phone: response.phone || '',
          address: response.address || '',
        }));
      } catch (error) {
        console.error('Error fetching profile:', error);
        showError('Failed to load profile data');
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user, showError]);

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = totalItems > 0 ? 110.0 : 0;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [user, items, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      const orderData = {
        user: user.id,
        product: items.map(item => item._id),
        amountPaid: total,
        phoneNumber: formData.phone,
        address: formData.address,
        transactionID: formData.transactionID,
      };
      //@ts-ignore
      await api.orders.create(orderData);
      showSuccess('Order placed successfully!');
      clearCart();
      navigate('/profile');
    } catch (error) {
      showError('Failed to place order. Please try again.');
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="mt-2 text-sm text-gray-500">
              Please complete your order by providing the required information.
            </p>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-4">
              {items.map(item => (
                <div
                  key={item._id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center">
                    <img
                      src={`${ImageURL}/${item.image[0]}`}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ৳{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">৳{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">৳{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-medium pt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">৳{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-4 py-2 bg-gray-50 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Delivery Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-4 py-2 bg-gray-50 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="transactionID"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    id="transactionID"
                    name="transactionID"
                    value={formData.transactionID}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your payment transaction ID"
                    className="mt-1 block w-full px-4 py-2 bg-gray-50 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Please complete your payment and enter the transaction ID
                    here.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full button-gradient text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
