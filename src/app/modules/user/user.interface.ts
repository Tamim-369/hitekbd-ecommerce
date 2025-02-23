import { Model, Types } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

export type IUser = {
  name: string;
  role: USER_ROLES;
  phone: string;
  email: string;
  password: string;
  address: string;
  profile?: string;
  status: 'active' | 'delete';
  verified: boolean;
  district?: string;
  subDistrict?: string;
  wishlist: Types.ObjectId[];
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
