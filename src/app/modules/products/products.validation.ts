import { z } from 'zod';

const createProductsZodSchema = z.object({
  title: z.string({
    required_error: 'title is required',
  }),
  description: z.string({
    required_error: 'description is required',
  }),
  image: z.array(z.string()),
  details: z.string(),
  price: z.string(),
  discountedPrice: z.string(),
  stockAmount: z.string(),
  category: z.string({
    required_error: 'category is required',
  }),
});

const updateProductsZodSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.array(z.string()).optional(),
  details: z.string().optional(),
  price: z.string().optional(),
  discountedPrice: z.string().optional(),
  stockAmount: z.string().optional(),
  category: z.string().optional(),
});

export const ProductsValidation = {
  createProductsZodSchema,
  updateProductsZodSchema,
};
