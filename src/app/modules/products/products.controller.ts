import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { ProductsService } from './products.service';

const createProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductsService.createProducts(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Products created successfully',
    data: result,
  });
});

const getAllProductss = catchAsync(async (req: Request, res: Response) => {
  const search: any = req.query.search || '';
  const page = req.query.page || null;
  const limit = req.query.limit || null;

  const result = await ProductsService.getAllProductss(search as string, page as number | null, limit as number | null);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Productss fetched successfully',
    data: result,
  });
});

const getProductsById = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductsService.getProductsById(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Products fetched successfully',
    data: result,
  });
});

const updateProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductsService.updateProducts(req.params.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Products updated successfully',
    data: result,
  });
});

const deleteProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductsService.deleteProducts(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Products deleted successfully',
    data: result,
  });
});

export const ProductsController = {
  createProducts,
  getAllProductss,
  getProductsById,
  updateProducts,
  deleteProducts,
};