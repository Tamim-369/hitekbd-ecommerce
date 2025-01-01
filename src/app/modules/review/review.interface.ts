import { Model, Types } from 'mongoose';

export type IReview = {
  description: string;
  star: number;
  userId: Types.ObjectId;
  product: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ReviewModel = Model<IReview, Record<string, unknown>>;

export type IReviewFilters = {
  searchTerm?: string;
  product?: string;
};
