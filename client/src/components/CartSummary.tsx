import { useNavigate } from 'react-router-dom';

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
}

export default function CartSummary({
  subtotal,
  shipping,
  total,
}: CartSummaryProps) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Order Summary
      </h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">৳{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">৳{shipping.toFixed(2)}</span>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-lg font-semibold text-gray-900">
              ৳{total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={() => navigate('/checkout')}
          className="w-full px-6 py-3 rounded-xl font-semibold text-white
    bg-gradient-to-r from-[#37c3fa] to-[#c937fb]
    shadow-lg hover:shadow-xl hover:opacity-95
    transform transition-all duration-200 hover:-translate-y-0.5
    focus:outline-none focus:ring-2 focus:ring-[#37c3fa] focus:ring-opacity-50"
        >
          Proceed to Checkout
        </button>
      </div>
      <p className="mt-4 text-sm text-gray-500 text-center">
        Shipping and taxes calculated at checkout
      </p>
    </div>
  );
}
