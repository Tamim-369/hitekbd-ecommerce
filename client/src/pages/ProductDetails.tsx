import { useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import {
  ShoppingCart,
  Package,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { api, Product } from '../utils/api';
import { Spinner } from '../components/Spinner';
import { ImageURL } from '../data/baseApi';
import ProductContainer from '../components/ProductContainer';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface Review {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  description: string;
  star: number;
  createdAt: string;
}

export default function ProductDetails() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'similar' | 'reviews'>('similar');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ description: '', star: 5 });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReview, setEditingReview] = useState<{ id: string; description: string; star: number } | null>(null);
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.products.getById(id!);
        setProduct(data);

        // Fetch suggested products and reviews
        if (data) {
          try {
            const [productsRes, reviewsRes] = await Promise.all([
              api.products.getAll({ category: data.category }),
              api.reviews.getAll(data._id)
            ]);
            console.log('Similar products:', reviews);
            // Filter out the current product and limit to 4 products
            const filtered = productsRes
              .filter(p => p._id !== data._id)
              .slice(0, 4);
              
            setSuggestedProducts(filtered);
            setReviews(reviewsRes || []);

            // If no similar products, switch to reviews tab
            if (filtered.length === 0) {
              setActiveTab('reviews');
            }
          } catch (err) {
            console.error('Error fetching additional data:', err);
            setReviewsError('Failed to load reviews. Please try again later.');
          }
        }
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
        ? parseFloat(product.discountedPrice.toString())
        : parseFloat(product.price.toString()),
      image: product.image,
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

  const handleDeleteReview = async (reviewId: string) => {
    setDeleteReviewId(reviewId);
  };

  const confirmDelete = async () => {
    if (!deleteReviewId) return;
    
    try {
      setIsDeleting(true);
      await api.reviews.delete(deleteReviewId);
      showSuccess('Review deleted successfully');
      // Refresh reviews after deletion
      if (product) {
        const updatedReviews = await api.reviews.getAll(product._id);
        setReviews(updatedReviews || []);
      }
    } catch (err: any) {
      console.error('Error deleting review:', err);
      showError(err?.message || 'Failed to delete review');
    } finally {
      setIsDeleting(false);
      setDeleteReviewId(null);
    }
  };

  const handleEditReview = (review: any) => {
    setEditingReview({
      id: review._id,
      description: review.description,
      star: review.star
    });
    setNewReview({
      description: review.description,
      star: review.star
    });
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showError('Please login to submit a review');
      return;
    }
    if (!product) return;

    if (!newReview.description.trim()) {
      showError('Please write a review before submitting');
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewsError(null);

      if (editingReview) {
        await api.reviews.update(editingReview.id, {
          description: newReview.description,
          star: newReview.star
        });
      } else {
        await api.reviews.create({
          description: newReview.description,
          star: newReview.star,
          product: product._id
        });
      }
      
      // Refresh reviews
      const updatedReviews = await api.reviews.getAll(product._id);
      setReviews(updatedReviews || []);
      
      setNewReview({ description: '', star: 5 });
      setEditingReview(null);
      showSuccess(`Review ${editingReview ? 'updated' : 'submitted'} successfully`);
      setIsReviewModalOpen(false);
    } catch (err: any) {
      console.error('Error with review:', err);
      showError(err?.message || `Failed to ${editingReview ? 'update' : 'submit'} review. Please try again.`);
    } finally {
      setSubmittingReview(false);
    }
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
        <title>Product Not Found</title>
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
          ((parseFloat(product.price.toString()) - parseFloat(product.discountedPrice.toString())) /
            parseFloat(product.price.toString())) *
            100
        )
      : 0;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {product && (
        <SEO 
          title={product.title}
          description={product.description}
          image={`${ImageURL}/${product.image[0]}`}
          url={window.location.href}
        />
      )}
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
              <div className="grid grid-cols-5 gap-4">
                {product.image.map((img, index) => {
                  return (
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
                  )
                })}
              </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <p className="text-lg text-gray-600 whitespace-pre-wrap">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold text-gray-900">
                ৳{parseFloat(product.discountedPrice.toString()).toFixed(2)}
              </span>
              {discountPercentage > 0 && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ৳{parseFloat(product.price.toString()).toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {parseInt(product.stockAmount.toString()) > 0 ? (
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
            <button
              onClick={handleAddToCart}
              disabled={parseInt(product.stockAmount.toString()) === 0}
              className="w-full md:w-auto px-6 py-2 rounded-lg font-semibold flex items-center justify-center gap-3 disabled:bg-gray-400 disabled:cursor-not-allowed button-gradient"
            >
              <ShoppingCart className="h-5 w-5" />
              {parseInt(product.stockAmount.toString()) === 0
                ? 'Out of Stock'
                : 'Add to Cart'}
            </button>
            {/* Product Details */}
            {product.details.length > 0 && (
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
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200">
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex justify-between items-center">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {suggestedProducts.length > 0 && (
                <button
                  onClick={() => setActiveTab('similar')}
                  className={`${
                    activeTab === 'similar'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Similar Products
                </button>
              )}
              <button
                onClick={() => setActiveTab('reviews')}
                className={`${
                  activeTab === 'reviews'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Reviews
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'similar' && suggestedProducts.length > 0 && (
          <div>
            <ProductContainer>
              {suggestedProducts.map((suggestedProduct) => (
                <ProductCard
                  key={suggestedProduct._id}
                  _id={suggestedProduct._id}
                  title={suggestedProduct.title}
                  price={Number(suggestedProduct.price)}
                  discountedPrice={Number(suggestedProduct.discountedPrice)}
                  image={suggestedProduct.image}
                />
              ))}
            </ProductContainer>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Customer Reviews</h2>
                {reviews.length > 0 && (
                  <div className="mt-2 flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`h-5 w-5 ${
                            index < Math.round(reviews.reduce((acc, review) => acc + review.star, 0) / reviews.length)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          } fill-current`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>
              {user ? (
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Write a Review
                </button>
              ) : (
                <a
                  href="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Login to Review
                </a>
              )}
            </div>

            {reviewsError ? (
              <div className="text-center py-8 bg-red-50 rounded-lg">
                <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading reviews</h3>
                <p className="mt-1 text-sm text-gray-500">{reviewsError}</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Star className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Be the first to review this product
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Rating distribution */}
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Rating Distribution</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviews.filter((review) => review.star === rating).length;
                      const percentage = (count / reviews.length) * 100;
                      return (
                        <div key={rating} className="flex items-center">
                          <span className="text-sm text-gray-600 w-12">{rating} star</span>
                          <div className="flex-1 h-4 mx-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-12">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review list */}
                <div className="divide-y divide-gray-200">
                  {reviews.map((review) => (
                    <div key={review._id} className="py-6">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{review.userId.name}</h4>
                              <div className="mt-1 flex items-center">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, index) => (
                                    <Star
                                      key={index}
                                      className={`h-4 w-4 ${
                                        index < review.star ? 'text-yellow-400' : 'text-gray-300'
                                      } fill-current`}
                                    />
                                  ))}
                                </div>
                                <span className="ml-2 text-sm text-gray-500">
                                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>
                            {user && user.id === review.userId._id && (
                              <div className="flex items-center space-x-4">
                                <button
                                  onClick={() => handleEditReview(review)}
                                  className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                                >
                                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(review._id)}
                                  className="text-sm text-red-600 hover:text-red-800 flex items-center"
                                >
                                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="mt-4 prose prose-sm max-w-none text-gray-500">
                            <p>{review.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteReviewId && (
              <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div 
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                    aria-hidden="true"
                    onClick={() => setDeleteReviewId(null)}
                  ></div>

                  <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                  <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                          Delete Review
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to delete this review? This action cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        disabled={isDeleting}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                        onClick={confirmDelete}
                      >
                        {isDeleting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Deleting...
                          </>
                        ) : (
                          'Delete Review'
                        )}
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={() => setDeleteReviewId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Review Modal */}
            {isReviewModalOpen && (
              <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  {/* Background overlay */}
                  <div 
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                    aria-hidden="true"
                    onClick={() => setIsReviewModalOpen(false)}
                  ></div>

                  {/* Modal panel */}
                  <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                    <div className="absolute top-0 right-0 pt-4 pr-4">
                      <button
                        type="button"
                        className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => setIsReviewModalOpen(false)}
                      >
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                          {editingReview ? 'Edit Review' : 'Write a Review'}
                        </h3>
                        <form onSubmit={handleSubmitReview} className="mt-6 space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Rating</label>
                            <div className="mt-2 flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                  key={rating}
                                  type="button"
                                  onClick={() => setNewReview(prev => ({ ...prev, star: rating }))}
                                  className={`${
                                    rating <= newReview.star ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                >
                                  <Star className="h-8 w-8 fill-current" />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Your Review</label>
                            <textarea
                              value={newReview.description}
                              onChange={(e) => setNewReview(prev => ({ ...prev, description: e.target.value }))}
                              rows={4}
                              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 p-2 sm:text-sm"
                              placeholder="Share your experience with this product..."
                              required
                            />
                          </div>
                          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                            <button
                              type="submit"
                              disabled={submittingReview}
                              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                            >
                              {submittingReview ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsReviewModalOpen(false)}
                              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
