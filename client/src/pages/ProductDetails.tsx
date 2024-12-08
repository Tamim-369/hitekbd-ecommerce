import { useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import {
  ShoppingCart,
  Package,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { api, Product } from '../utils/api';
import { Spinner } from '../components/Spinner';
import { ImageURL } from '../data/baseApi';

export default function ProductDetails() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.products.getById(id!);
        setProduct(data);
      } catch (err) {
        setError('Failed to load product details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      _id: product._id,
      title: product.title,
      price: product.discountedPrice
        ? parseFloat(product.discountedPrice)
        : parseFloat(product.price),
      image: product.image[0],
    });
  };

  const nextImage = () => {
    if (!product) return;
    setSelectedImage(prev =>
      prev === product.image.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    if (!product) return;
    setSelectedImage(prev =>
      prev === 0 ? product.image.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {error || 'Product not found'}
          </h2>
        </div>
      </div>
    );
  }

  const discountPercentage =
    product.price && product.discountedPrice
      ? Math.round(
          ((parseFloat(product.price) - parseFloat(product.discountedPrice)) /
            parseFloat(product.price)) *
            100
        )
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-6">
          {/* Main Image with Navigation */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
            <img
              src={`${ImageURL}/${product.image[selectedImage]}`}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.image.length > 1 && (
              <>
                {/* Previous Button */}
                <button
                  onClick={previousImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-800" />
                </button>
                {/* Next Button */}
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="h-6 w-6 text-gray-800" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Navigation */}
          {product.image.length > 0 && (
            <div className="grid grid-cols-5 gap-4">
              {product.image.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden bg-gray-100 ${
                    selectedImage === index
                      ? 'ring-2 ring-indigo-600'
                      : 'hover:opacity-75'
                  }`}
                >
                  <img
                    src={`${ImageURL}/${img}`}
                    alt={`${product.title} - View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {selectedImage === index && (
                    <div className="absolute inset-0 bg-indigo-600/10" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>
            <p className="text-lg text-gray-600">{product.description}</p>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-bold text-gray-900">
              ৳{parseFloat(product.discountedPrice).toFixed(2)}
            </span>
            {discountPercentage > 0 && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  ৳{parseFloat(product.price).toFixed(2)}
                </span>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  {discountPercentage}% OFF
                </span>
              </>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {parseInt(product.stockAmount) > 0 ? (
              <>
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-green-600 font-medium">
                  In Stock ({product.stockAmount} available)
                </span>
              </>
            ) : (
              <>
                <Package className="h-5 w-5 text-red-500" />
                <span className="text-red-600 font-medium">Out of Stock</span>
              </>
            )}
          </div>

          {/* Product Details */}
          {product.details.length > 1 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Product Details
              </h3>
              <div className="prose prose-sm text-gray-600">
                {Array.isArray(product.details) ? (
                  product.details.map((detail: any, index: number) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <span className="font-medium">{detail.name}:</span>
                      <span>{detail.value}</span>
                    </div>
                  ))
                ) : (
                  <p>No details available</p>
                )}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={parseInt(product.stockAmount) === 0}
            className="w-full md:w-auto px-6 py-2 rounded-lg font-semibold flex items-center justify-center gap-3 disabled:bg-gray-400 disabled:cursor-not-allowed button-gradient"
          >
            <ShoppingCart className="h-5 w-5" />
            {parseInt(product.stockAmount) === 0
              ? 'Out of Stock'
              : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
