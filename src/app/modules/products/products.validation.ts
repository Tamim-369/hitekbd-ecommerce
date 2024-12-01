import { z } from 'zod';
      
const createProductsZodSchema = z.object({
  body: z.object({
    images: z.string({ required_error:"images is required", invalid_type_error:"images should be type string" }),
      title: z.string({ required_error:"title is required", invalid_type_error:"title should be type string" }),
      description: z.string({ required_error:"description is required", invalid_type_error:"description should be type string" }),
      price: z.number({ required_error:"price is required", invalid_type_error:"price should be type number" }),
      discountedPrice: z.number({ required_error:"discountedPrice is required", invalid_type_error:"discountedPrice should be type number" }),
      features: z.array(z.string({ required_error:"features is required", invalid_type_error:"features array item should have type string" }))
  }),
});

const updateProductsZodSchema = z.object({
  body: z.object({
    images: z.string({ invalid_type_error:"images should be type string" }).optional(),
      title: z.string({ invalid_type_error:"title should be type string" }).optional(),
      description: z.string({ invalid_type_error:"description should be type string" }).optional(),
      price: z.number({ invalid_type_error:"price should be type number" }).optional(),
      discountedPrice: z.number({ invalid_type_error:"discountedPrice should be type number" }).optional(),
      features: z.array(z.string({ invalid_type_error:"features array item should have type string" })).optional()
  }),
});

export const ProductsValidation = {
  createProductsZodSchema,
  updateProductsZodSchema
};
