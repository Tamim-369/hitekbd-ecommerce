import { z } from 'zod';

const productDetailSchema = z.object({
  name: z.string(),
  value: z.string(),
});

const createProductsZodSchema = z.object({
  title: z.string({
    required_error: 'title is required',
  }),
  description: z.string({
    required_error: 'description is required',
  }),
  image: z.array(z.string()),
  details: z.array(productDetailSchema),
  price: z.number(),
  discountedPrice: z.number(),
  stockAmount: z.number(),
  category: z.string({
    required_error: 'category is required',
  }),
  colors: z.array(z.string()).optional(),
});

const updateProductsZodSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.array(z.string()).optional(),
  details: z.array(productDetailSchema).optional(),
  price: z.number().optional(),
  discountedPrice: z.number().optional(),
  stockAmount: z.number().optional(),
  category: z.string().optional(),
  colors: z.array(z.string()).optional(),
});

export const ProductsValidation = {
  createProductsZodSchema,
  updateProductsZodSchema,
};
