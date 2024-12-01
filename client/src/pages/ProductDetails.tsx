import { useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart } from 'lucide-react';
import { featuredProducts, latestProducts } from '../data/products';

export default function ProductDetails() {
  const { id } = useParams();
  const { addItem } = useCart();
  const product = [...featuredProducts, ...latestProducts].find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.discount && (
              <>
                <span className="text-lg text-gray-500 line-through">
                  ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                </span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>
          <button 
            onClick={handleAddToCart}
            className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart size={20} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}