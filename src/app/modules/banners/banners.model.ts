import { Schema, model } from 'mongoose';
import { IBanners, BannersModel } from './banners.interface';

const bannersSchema = new Schema<IBanners, BannersModel>({
  image: { type: String, required: true }
}, { timestamps: true });

export const Banners = model<IBanners, BannersModel>('Banners', bannersSchema);
