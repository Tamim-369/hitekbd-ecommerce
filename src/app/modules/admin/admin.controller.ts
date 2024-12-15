import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AdminService } from './admin.service';

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await AdminService.getDashboardStats();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Dashboard statistics retrieved successfully',
    data: stats,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await AdminService.getAllUsers();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: users,
  });
});

const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = await AdminService.getUser(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User retrieved successfully',
    data: user,
  });
});

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await AdminService.createUser(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'User created successfully',
    data: user,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await AdminService.updateUser(req.params.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User updated successfully',
    data: user,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await AdminService.deleteUser(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User deleted successfully',
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const user = await AdminService.updateUserStatus(req.params.id, req.body.status);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User status updated successfully',
    data: user,
  });
});

export const AdminController = {
  getDashboardStats,
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
}; 