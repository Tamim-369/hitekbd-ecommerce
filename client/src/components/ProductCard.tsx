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
    <div className="group relative bg-white rounded-2xl p-3 transition-all duration-300 hover:shadow-xl hover:shadow-[#37c3fa]/10">
      {/* Main image container */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
        <Link to={`/product/${_id}`}>
          <img
            src={`${ImageURL}/${image[0]}`}
            alt={title}
            className="h-full w-full object-cover object-center transform transition-transform duration-500 group-hover:scale-110"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Discount badge */}
        {discountedPrice && (
          <div className="absolute top-1 sm:top-3 right-0 sm:right-3 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#37c3fa] to-[#ce62f2] text-white text-xs sm:text-sm font-medium transform -rotate-12 shadow-lg sm:scale-100 scale-75 ">
            -{price - discountedPrice}৳
          </div>
        )}

        {/* Wishlist button */}
        {isAuthenticated && (
          <button
            onClick={handleWishlist}
            className={`absolute top-3 left-3 p-2 sm:p-2.5 rounded-full transition-all duration-300 
              ${isInWishlist
                ? 'bg-gradient-to-r from-[#37c3fa] to-[#ce62f2] text-white scale-110'
                : 'bg-white/90 text-gray-600 hover:scale-110 hover:shadow-lg'}`}
          >
            <Heart
              size={16}
              className="transition-transform duration-300 w-3 h-3 sm:w-[18px] sm:h-[18px]"
              fill={isInWishlist ? 'currentColor' : 'none'}
            />
          </button>
        )}
      </div>

      {/* Product info */}
      <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
        <h3 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 min-h-[32px] sm:min-h-[40px]">
          {title}
        </h3>

        <div className="flex items-baseline gap-2">
          <p className="text-base sm:text-lg font-bold bg-gradient-to-r from-[#37c3fa] to-[#ce62f2] bg-clip-text text-transparent">
            ৳{discountedPrice ? discountedPrice : price.toFixed(2)}
          </p>
          {discountedPrice && (
            <p className="text-xs sm:text-sm text-gray-400 line-through">
              ৳{price.toFixed(2)}
            </p>
          )}
        </div>
      </div>

      {/* View details button */}
      <Link
        to={`/product/${_id}`}
        className="mt-2 sm:mt-4 w-full py-1.5 sm:py-2.5 rounded-lg bg-gradient-to-r from-[#37c3fa] to-[#ce62f2] text-white flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#37c3fa]/20 group-hover:scale-[1.02]"
      >
        <Eye
          size={14}
          className="transition-transform duration-300 group-hover:scale-110 sm:w-[18px] sm:h-[18px]"
        />
        View Details
      </Link>
    </div>
  );
}
