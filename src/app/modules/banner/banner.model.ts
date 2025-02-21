import { Schema, model } from 'mongoose';
  import { IBanner, BannerModel } from './banner.interface';
  
  const bannerSchema = new Schema<IBanner, BannerModel>({
    image: { type: String, required: true }
  }, { timestamps: true });
  
  export const Banner = model<IBanner, BannerModel>('Banner', bannerSchema);
