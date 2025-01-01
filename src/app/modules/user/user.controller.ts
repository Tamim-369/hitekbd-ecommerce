import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...userData } = req.body;
    const result = await UserService.createUserToDB(userData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User created successfully',
      data: result,
    });
  }
);

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getUserProfileFromDB(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

//update profile
const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    let profile;
    if (req.files && 'image' in req.files && req.files.image[0]) {
      profile = `/images/${req.files.image[0].filename}`;
    }

    const data = {
      profile,
      ...req.body,
    };
    const result = await UserService.updateProfileToDB(user, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: result,
    });
  }
);

const getWishlist = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getWishlistFromDB(user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Wishlist data retrieved successfully',
    data: result,
  });
});

const addWishlist = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!req.query.id) throw new Error('Product id is required');

  const result = await UserService.addWishlistToDB(
    user,
    req.query.id.toString()
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product added to wishlist successfully',
    data: result,
  });
});

const deleteWishlist = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!req.query.id) throw new Error('Product id is required');
  const result = await UserService.deleteWishlistFromDB(
    user,
    req.query.id.toString()
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product deleted from wishlist successfully',
    data: result,
  });
});

export const UserController = {
  createUser,
  getUserProfile,
  updateProfile,
  getWishlist,
  addWishlist,
  deleteWishlist,
};
