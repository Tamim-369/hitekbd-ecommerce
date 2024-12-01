import { Model, Types } from 'mongoose';

export type IBanners = {
  image: string
};

export type BannersModel = Model<IBanners>;
