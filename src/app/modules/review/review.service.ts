import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Review } from './review.model';
import { IReview } from './review.interface';
import { Types } from 'mongoose';
import { Products } from '../products/products.model';

const createReview = async (payload: IReview): Promise<IReview> => {
  const result = await Review.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create review!');
  }
  return result;
};

const getAllReviews = async (
  queryFields: Record<string, any>
): Promise<IReview[]> => {
  const { search, page, limit, product } = queryFields;
  const query: Record<string, any> = {};
  
  if (search) {
    query.$or = [{ description: { $regex: search, $options: 'i' } }];
  }
  
  if (product) {
    query.product = new Types.ObjectId(product);
  }
  
  let queryBuilder = Review.find(query)
    .populate('userId', 'name email')
    .populate({
      path: 'product',
      model: Products,
      select: 'title price image'
    })
    .sort({ createdAt: -1 });

  if (page && limit) {
    const skip = (Number(page) - 1) * Number(limit);
    queryBuilder = queryBuilder.skip(skip).limit(Number(limit));
  }

  return await queryBuilder;
};

const getAllReviewsByProductId = async (
  productId: string
): Promise<IReview[]> => {
  const result = await Review.find({ product: new Types.ObjectId(productId) })
    .populate('userId', 'name email')
    .populate({
      path: 'product',
      model: Products,
      select: 'title price image'
    })
    .sort({ createdAt: -1 });
  return result;
};

const getReviewById = async (id: string): Promise<IReview | null> => {
  const result = await Review.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Review not found!');
  }
  return result;
};

const updateReview = async (
  id: string,
  payload: IReview
): Promise<IReview | null> => {
  const isExistReview = await getReviewById(id);
  if (!isExistReview) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Review not found!');
  }

  const result = await Review.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update review!');
  }
  return result;
};

const deleteReview = async (id: string): Promise<IReview | null> => {
  const isExistReview = await getReviewById(id);
  if (!isExistReview) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Review not found!');
  }

  const result = await Review.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete review!');
  }
  return result;
};

export const ReviewService = {
  createReview,
  getAllReviews,
  getAllReviewsByProductId,
  getReviewById,
  updateReview,
  deleteReview,
};
