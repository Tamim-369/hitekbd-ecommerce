import { z } from 'zod';
        
const createCouponZodSchema = z.object({
  body: z.object({
    name: z.string({
    required_error: "name is required",
    invalid_type_error: "name should be type string"
  }),
      description: z.string({
    required_error: "description is required",
    invalid_type_error: "description should be type string"
  })
  }),
});

const updateCouponZodSchema = z.object({
  body: z.object({
    name: z.string({
    invalid_type_error: "name should be type string"
  }).optional(),
      description: z.string({
    invalid_type_error: "description should be type string"
  }).optional()
  }),
});

export const CouponValidation = {
  createCouponZodSchema,
  updateCouponZodSchema
};
