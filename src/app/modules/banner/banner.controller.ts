import { Request, Response } from 'express';
    import catchAsync from '../../../shared/catchAsync';
    import sendResponse from '../../../shared/sendResponse';
    import { StatusCodes } from 'http-status-codes';
    import { BannerService } from './banner.service';

    const createBanner = catchAsync(async (req: Request, res: Response) => {
      
      if (req.files && 'image' in req.files && req.files.image[0]) {
        req.body.image = '/images/' + req.files.image[0].filename;
      }
    
      const result = await BannerService.createBanner(req.body);
      sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: 'Banner created successfully',
        data: result,
      });
    });

    const getAllBanners = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
      const result = await BannerService.getAllBanners(query);
      sendResponse(res, {
        
        pagination: {
          limit: Number(query.limit) || 10,
          page: Number(query.page) || 1,
          total: result.length,
          totalPage: Math.ceil(result.length / (Number(query.limit) || 10)),
        },
        
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Banners fetched successfully',
        data: result,
      });
    });

    const getBannerById = catchAsync(async (req: Request, res: Response) => {
      const result = await BannerService.getBannerById(req.params.id);
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Banner fetched successfully',
        data: result,
      });
    });

    const updateBanner = catchAsync(async (req: Request, res: Response) => {
    
      if (req.files && 'image' in req.files && req.files.image[0]) {
        req.body.image = '/images/' + req.files.image[0].filename;
      }
    
      const result = await BannerService.updateBanner(req.params.id, req.body);
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Banner updated successfully',
        data: result,
      });
    });

    const deleteBanner = catchAsync(async (req: Request, res: Response) => {
      const result = await BannerService.deleteBanner(req.params.id);
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Banner deleted successfully',
        data: result,
      });
    });

    export const BannerController = {
      createBanner,
      getAllBanners,
      getBannerById,
      updateBanner,
      deleteBanner,
    };
