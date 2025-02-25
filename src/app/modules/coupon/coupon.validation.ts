import { z } from 'zod';

const createCouponZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'name is required',
      invalid_type_error: 'name should be type string',
    }),
    discountPrice: z.string({
      required_error: 'discountPrice is required',
      invalid_type_error: 'discountPrice should be type string',
    }),
  }),
});

const updateCouponZodSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'name should be type string',
      })
      .optional(),
    discountPrice: z
      .string({
        invalid_type_error: 'discountPrice should be type string',
      })
      .optional(),
  }),
});

export const CouponValidation = {
  createCouponZodSchema,
  updateCouponZodSchema,
};
