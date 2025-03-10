import { Schema, model } from 'mongoose';
import { ICoupon, CouponModel } from './coupon.interface';

const couponSchema = new Schema<ICoupon, CouponModel>(
  {
    name: { type: String, required: true },
    discountPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Coupon = model<ICoupon, CouponModel>('Coupon', couponSchema);
