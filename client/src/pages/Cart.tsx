import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';

export default function Cart() {
  const { items, totalItems } = useCart();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = totalItems > 0 ? 15.00 : 0;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any items yet.</p>
        <button
          onClick={() => window.history.back()}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-indigo-600 flex items-center gap-1"
          >
            <ArrowLeft size={20} />
            <span>Continue Shopping</span>
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-8">Shopping Cart</h2>
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <CartItem key={item.id} {...item} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <CartSummary
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
}