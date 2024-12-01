import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface CartItemProps {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartItem({ id, title, price, image, quantity }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="py-6 flex">
      <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="ml-4 flex-1 flex flex-col">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-lg font-medium text-gray-900">
            ${(price * quantity).toFixed(2)}
          </p>
        </div>
        <p className="mt-1 text-sm text-gray-500">${price.toFixed(2)} each</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => updateQuantity(id, quantity - 1)}
              className="p-2 hover:bg-gray-50"
              disabled={quantity <= 1}
            >
              <Minus size={16} className="text-gray-600" />
            </button>
            <span className="px-4 py-2 text-gray-900">{quantity}</span>
            <button
              onClick={() => updateQuantity(id, quantity + 1)}
              className="p-2 hover:bg-gray-50"
            >
              <Plus size={16} className="text-gray-600" />
            </button>
          </div>
          <button
            onClick={() => removeItem(id)}
            className="text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <Trash2 size={16} />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
}