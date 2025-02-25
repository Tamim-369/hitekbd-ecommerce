import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { CouponService } from './coupon.service';

const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.createCoupon(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Coupon created successfully',
    data: result,
  });
});

const getAllCoupons = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await CouponService.getAllCoupons(query);
  sendResponse(res, {
    pagination: {
      limit: Number(query.limit) || 10,
      page: Number(query.page) || 1,
      total: result.length,
      totalPage: Math.ceil(result.length / (Number(query.limit) || 10)),
    },

    statusCode: StatusCodes.OK,
    success: true,
    message: 'Coupons fetched successfully',
    data: result,
  });
});

const getCouponById = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.getCouponById(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Coupon fetched successfully',
    data: result,
  });
});

const updateCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.updateCoupon(req.params.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Coupon updated successfully',
    data: result,
  });
});

const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.deleteCoupon(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Coupon deleted successfully',
    data: result,
  });
});

export const CouponController = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
};
