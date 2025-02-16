import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const { items, totalItems } = useCart();
  const navigate = useNavigate();

  const subtotal = items.reduce(
    (sum, item: any) => sum + item.price * item.quantity,
    0
  );
  const shipping = totalItems > 0 ? 110.0 : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mb-4 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-8 px-4">
            Looks like you haven't added any items yet.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-6 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </h1>
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={20} className="mr-1" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 space-y-8 lg:space-y-0">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 sm:p-6">
                <div className="divide-y divide-gray-200">
                  {items.map((item: any) => (
                    <CartItem key={item._id} {...item} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-4">
              <CartSummary
                subtotal={subtotal}
                shipping={shipping}
                total={total}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
