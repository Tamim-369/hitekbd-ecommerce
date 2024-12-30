import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { ImageURL } from '../data/baseApi';

interface CartItemProps {
  _id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartItem({
  _id,
  title,
  price,
  image,
  quantity,
}: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0 relative w-full sm:w-24 aspect-square sm:h-24 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={`${ImageURL}/${image[0]}`}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">
                {title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                ৳{price.toFixed(2)} each
              </p>
            </div>
            <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-1">
              <p className="text-base sm:text-lg font-medium text-gray-900">
                ${(price * quantity).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Quantity Controls */}
            <div className="flex items-center border border-gray-200 rounded-lg shadow-sm">
              <button
                onClick={() => updateQuantity(_id, quantity - 1)}
                className="p-2 hover:bg-gray-50 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus
                  size={16}
                  className={quantity <= 1 ? 'text-gray-300' : 'text-gray-600'}
                />
              </button>
              <span className="w-12 text-center py-2 text-sm font-medium text-gray-900">
                {quantity}
              </span>
              <button
                onClick={() => updateQuantity(_id, quantity + 1)}
                className="p-2 hover:bg-gray-50 transition-colors"
              >
                <Plus size={16} className="text-gray-600" />
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeItem(_id)}
              className="text-red-600 hover:text-red-700 transition-colors flex items-center gap-1 text-sm"
            >
              <Trash2 size={16} />
              <span className="font-medium">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
