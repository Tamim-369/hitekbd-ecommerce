import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Banners } from './banners.model';
import { IBanners } from './banners.interface';

const createBanners = async (payload: IBanners): Promise<IBanners> => {
  const result = await Banners.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create banners!');
  }
  return result;
};

const getAllBannerss = async (
  search: string,
  page: number | null,
  limit: number | null
): Promise<IBanners[]> => {
  const query = search
    ? { $or: [{ image: { $regex: search, $options: 'i' } }] }
    : {};
  let queryBuilder = Banners.find(query);

  if (page && limit) {
    queryBuilder = queryBuilder.skip((page - 1) * limit).limit(limit);
  }

  return await queryBuilder;
};

const getBannersById = async (id: string): Promise<IBanners | null> => {
  const result = await Banners.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Banners not found!');
  }
  return result;
};

const updateBanners = async (
  id: string,
  payload: IBanners
): Promise<IBanners | null> => {
  const isExistBanners = await getBannersById(id);
  if (!isExistBanners) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Banners not found!');
  }
  const result = await Banners.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update banners!');
  }
  return result;
};

const deleteBanners = async (id: string): Promise<IBanners | null> => {
  const isExistBanners = await getBannersById(id);
  if (!isExistBanners) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Banners not found!');
  }
  const result = await Banners.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete banners!');
  }
  return result;
};

export const BannersService = {
  createBanners,
  getAllBannerss,
  getBannersById,
  updateBanners,
  deleteBanners,
};
