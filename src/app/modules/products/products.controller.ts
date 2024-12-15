import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { ProductsService } from './products.service';

const createProducts = catchAsync(async (req: Request, res: Response) => {
  let image: Array<string> = [];
  if (req.files && 'image' in req.files && req.files.image[0]) {
    req.files.image.forEach((file: any) => {
      image.push('/images/' + file.filename);
    });
  }
  const data = {
    ...req.body,
    image,
  };
  const result = await ProductsService.createProducts(data);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Products created successfully',
    data: result,
  });
});

const getAllProductss = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await ProductsService.getAllProductss(query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Productss fetched successfully',
    pagination: {
      //@ts-ignore
      page: query.page || 1,
      //@ts-ignore
      limit: query.limit || 10,
      totalPage: result.totalPages,
      total: result.totalProducts,
    },
    data: result.products,
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
  let image: Array<string> = [];
  if (req.files && 'image' in req.files && req.files.image[0]) {
    req.files.image.forEach((file: any) => {
      image.push('/images/' + file.filename);
    });
  }
  const data = {
    ...req.body,
    ...(image.length > 0 && { image }),
  };
  const result = await ProductsService.updateProducts(req.params.id, data);
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
