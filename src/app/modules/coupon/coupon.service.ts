import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Coupon } from './coupon.model';
import { ICoupon } from './coupon.interface';

const createCoupon = async (payload: ICoupon): Promise<ICoupon> => {
  const result = await Coupon.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create coupon!');
  }
  return result;
};

const getAllCoupons = async (
  queryFields: Record<string, any>
): Promise<ICoupon[]> => {
  const { search, page, limit } = queryFields;
  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      }
    : {};
  let queryBuilder = Coupon.find(query);

  if (page && limit) {
    queryBuilder = queryBuilder.skip((page - 1) * limit).limit(limit);
  } else {
    queryBuilder = queryBuilder.skip(0).limit(10);
  }
  delete queryFields.search;
  delete queryFields.page;
  delete queryFields.limit;
  queryBuilder.find(queryFields);
  return await queryBuilder;
};

const getCouponById = async (id: string): Promise<ICoupon | null> => {
  const result = await Coupon.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Coupon not found!');
  }
  return result;
};

const updateCoupon = async (
  id: string,
  payload: ICoupon
): Promise<ICoupon | null> => {
  const isExistCoupon = await getCouponById(id);
  if (!isExistCoupon) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Coupon not found!');
  }

  const result = await Coupon.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update coupon!');
  }
  return result;
};

const deleteCoupon = async (id: string): Promise<ICoupon | null> => {
  const isExistCoupon = await getCouponById(id);
  if (!isExistCoupon) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Coupon not found!');
  }

  const result = await Coupon.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete coupon!');
  }
  return result;
};

export const CouponService = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
};
