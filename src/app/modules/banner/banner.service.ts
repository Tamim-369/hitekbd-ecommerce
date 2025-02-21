import { StatusCodes } from 'http-status-codes';
  import ApiError from '../../../errors/ApiError';
  import { Banner } from './banner.model';
  import { IBanner } from './banner.interface';
  
    import unlinkFile from '../../../shared/unlinkFile';
    
  const createBanner = async (payload: IBanner): Promise<IBanner> => {
  
    const result = await Banner.create(payload);
    if (!result) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create banner!');
    }
    return result;
  };
  
 const getAllBanners = async (queryFields: Record<string, any>): Promise<IBanner[]> => {
  const { search, page, limit } = queryFields;
    const query = search ? { $or: [{ image: { $regex: search, $options: 'i' } }] } : {};
    let queryBuilder = Banner.find(query);
  
    if (page && limit) {
      queryBuilder = queryBuilder.skip((page - 1) * limit).limit(limit);
    }else{
      queryBuilder = queryBuilder.skip(0).limit(10);
    
    }
    delete queryFields.search;
    delete queryFields.page;
    delete queryFields.limit;
    queryBuilder.find(queryFields);
    return await queryBuilder;
  };
  
  
  const getBannerById = async (id: string): Promise<IBanner | null> => {
    const result = await Banner.findById(id);
    if (!result) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Banner not found!');
    }
    return result;
  };
  
  const updateBanner = async (id: string, payload: IBanner): Promise<IBanner | null> => {
   
    const isExistBanner = await getBannerById(id);
    if (!isExistBanner) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Banner not found!');
    }
    if (typeof isExistBanner.image === 'string' && typeof payload.image === 'string') {
          await unlinkFile(isExistBanner.image);
        }
    const result = await Banner.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update banner!');
    }
    return result;
  };
  
  const deleteBanner = async (id: string): Promise<IBanner | null> => {
    const isExistBanner = await getBannerById(id);
    if (!isExistBanner) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Banner not found!');
    }
        
          if (typeof isExistBanner.image === 'string') {
           await unlinkFile(isExistBanner.image);
         }
         
    const result = await Banner.findByIdAndDelete(id);
    if (!result) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete banner!');
    }
    return result;
  };
  
  export const BannerService = {
    createBanner,
    getAllBanners,
    getBannerById,
    updateBanner,
    deleteBanner,
  };
