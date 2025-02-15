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
  const total = subtotal + shipping

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
        items: items.map(item => ({
          productId: item._id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image[0],
          color: item.color?.toString() || '',
        })),
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
                    Please make your payment via bKash to the number 01942374953 and enter the transaction ID below.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-3.5 rounded-xl overflow-hidden group bg-gradient-to-r from-[#37c3fa] to-[#ce62f2] transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {/* Button content with icon */}
                <div className="relative flex items-center justify-center gap-2 text-white font-medium">
                  {loading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                      <span>Place Order</span>
                    </>
                  )}
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
