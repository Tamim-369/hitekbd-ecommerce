import { z } from 'zod';
      
const createBannersZodSchema = z.object({
  body: z.object({
    image: z.string({ required_error:"image is required", invalid_type_error:"image should be type string" })
  }),
});

const updateBannersZodSchema = z.object({
  body: z.object({
    image: z.string({ invalid_type_error:"image should be type string" }).optional()
  }),
});

export const BannersValidation = {
  createBannersZodSchema,
  updateBannersZodSchema
};
