import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
  discount?: number;
}

export default function ProductCard({
  id,
  title,
  price,
  image,
  discount,
}: ProductCardProps) {
  const { addItem } = useCart();
  const { showSuccess } = useToast();

  const handleAddToCart = () => {
    addItem({ id, title, price, image });
    showSuccess(`${title} added to cart!`);
  };

  return (
    <div className="group relative">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
        />
        {discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
            -{discount}%
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700 font-medium">{title}</h3>
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold text-gray-900">
              ${price.toFixed(2)}
            </p>
            {discount && (
              <p className="text-sm text-gray-500 line-through">
                ${(price / (1 - discount / 100)).toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={handleAddToCart}
        className="mt-2 w-full py-2 rounded-lg button-gradient flex items-center justify-center gap-2 min-[680px]:text-sm min-[680px]:font-normal text-xs font-bold"
      >
        <ShoppingCart size={18} />
        Add to Cart
      </button>
    </div>
  );
}
