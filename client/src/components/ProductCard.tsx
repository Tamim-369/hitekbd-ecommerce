import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, Heart, ArrowBigRight, ArrowBigRightDashIcon, ArrowBigRightDash, Eye } from 'lucide-react';
import { ImageURL } from '../data/baseApi';
import { Link } from 'react-router-dom';
import { OptimizedImage } from './OptimizedImage';
import { api } from '../utils/api';
import { useState, useEffect } from 'react';

interface ProductCardProps {
  _id: string;
  title: string;
  price: number;
  image: string[];
  discountedPrice: number;
}

export default function ProductCard({
  _id,
  title,
  price,
  image,
  discountedPrice,
}: ProductCardProps) {
  const { addItem, isInCart } = useCart();
  const { showSuccess } = useToast();
  const { isAuthenticated } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    checkWishlistStatus();
  }, [_id]);

  const checkWishlistStatus = async () => {
    try {
      if (isAuthenticated) {
        const wishlist = await api.wishlist.get();
        setIsInWishlist(wishlist.some((item: any) => item._id === _id));
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleAddToCart = () => {
    addItem({
      _id,
      title,
      price: discountedPrice ? discountedPrice : price,
      image,
    });
    showSuccess(`${title} added to cart!`);
  };

  const handleWishlist = async () => {
    try {
      if (isInWishlist) {
        await api.wishlist.remove(_id);
        setIsInWishlist(false);
        showSuccess('Removed from wishlist');
      } else {
        await api.wishlist.add(_id);
        setIsInWishlist(true);
        showSuccess('Added to wishlist');
      }
    } catch (error) {
      console.error('Wishlist operation failed:', error);
    }
  };

  return (
    <div className={`group relative`}>
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <Link to={`/product/${_id}`}>
          {' '}
          <OptimizedImage
            src={`${ImageURL}/${image[0]}`}
            alt={title}
            className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
          />
        </Link>
        {discountedPrice && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
            -{price - discountedPrice} ৳
          </div>
        )}
        {isAuthenticated && (
          <button
            onClick={handleWishlist}
            className={`absolute top-2 left-2 p-1.5 sm:p-2 rounded-full ${isInWishlist ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
              } hover:scale-110 transition-all duration-200 shadow-md`}
          >
            <Heart
              size={16}
              className="sm:w-5 sm:h-5"
              fill={isInWishlist ? 'currentColor' : 'none'}
            />
          </button>
        )}
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700 font-medium">
            {title.toString().length > 47
              ? title.substring(1, 47) + '...'
              : title}
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold text-gray-900">
              ৳{discountedPrice ? discountedPrice : price.toFixed(2)}
            </p>
            {discountedPrice && (
              <p className="text-sm text-gray-500 line-through">
                ৳{price.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* {isInCart(_id) ? (
        <Link
          to="/cart"
          className="mt-2 w-full py-1 rounded-lg flex items-center justify-center gap-2 min-[680px]:text-sm min-[680px]:font-normal text-xs font-bold transition-all duration-200 bg-gradient-to-r from-[#37acfa] to-[#c937fb] text-white ring-[#dadada] ring-2"
        >
          View Cart
          <ArrowBigRight size={25} />
        </Link>
      ) : (
        <button
          onClick={handleAddToCart}
          className="mt-2 w-full py-2 rounded-lg button-gradient flex items-center justify-center gap-2 min-[680px]:text-sm min-[680px]:font-normal text-xs font-bold"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      )} */}
      <Link
        to={`/product/${_id}`}
        className="mt-2 w-full py-2 rounded-lg button-gradient flex items-center justify-center gap-2 min-[680px]:text-sm min-[680px]:font-normal text-xs font-bold"
      >
        <Eye size={18} className='mb-0.5' />
        View Details
      </Link>
    </div>
  );
}
