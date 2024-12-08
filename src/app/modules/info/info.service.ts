import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Info } from './info.model';
import { IInfo } from './info.interface';

const createInfo = async (payload: IInfo): Promise<IInfo> => {
  const result = await Info.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create info!');
  }
  return result;
};

const getAllInfos = async (
  search: string,
  page: number | null,
  limit: number | null
): Promise<IInfo[]> => {
  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ],
      }
    : {};
  let queryBuilder = Info.find(query);

  if (page && limit) {
    queryBuilder = queryBuilder.skip((page - 1) * limit).limit(limit);
  }

  return await queryBuilder;
};

const getInfoById = async (id: string): Promise<IInfo | null> => {
  const result = await Info.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Info not found!');
  }
  return result;
};

const updateInfo = async (
  id: string,
  payload: IInfo
): Promise<IInfo | null> => {
  const isExistInfo = await getInfoById(id);
  if (!isExistInfo) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Info not found!');
  }
  const result = await Info.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update info!');
  }
  return result;
};

const deleteInfo = async (id: string): Promise<IInfo | null> => {
  const isExistInfo = await getInfoById(id);
  if (!isExistInfo) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Info not found!');
  }
  const result = await Info.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete info!');
  }
  return result;
};

export const InfoService = {
  createInfo,
  getAllInfos,
  getInfoById,
  updateInfo,
  deleteInfo,
};
