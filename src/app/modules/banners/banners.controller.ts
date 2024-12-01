import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { BannersService } from './banners.service';

const createBanners = catchAsync(async (req: Request, res: Response) => {
  const result = await BannersService.createBanners(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Banners created successfully',
    data: result,
  });
});

const getAllBannerss = catchAsync(async (req: Request, res: Response) => {
  const search: any = req.query.search || '';
  const page = req.query.page || null;
  const limit = req.query.limit || null;

  const result = await BannersService.getAllBannerss(search as string, page as number | null, limit as number | null);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Bannerss fetched successfully',
    data: result,
  });
});

const getBannersById = catchAsync(async (req: Request, res: Response) => {
  const result = await BannersService.getBannersById(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Banners fetched successfully',
    data: result,
  });
});

const updateBanners = catchAsync(async (req: Request, res: Response) => {
  const result = await BannersService.updateBanners(req.params.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Banners updated successfully',
    data: result,
  });
});

const deleteBanners = catchAsync(async (req: Request, res: Response) => {
  const result = await BannersService.deleteBanners(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Banners deleted successfully',
    data: result,
  });
});

export const BannersController = {
  createBanners,
  getAllBannerss,
  getBannersById,
  updateBanners,
  deleteBanners,
};
