import { z } from 'zod';

const createProductsZodSchema = z.object({
  title: z.string({
    required_error: 'title is required',
    invalid_type_error: 'title should be type string',
  }),
  description: z.string({
    required_error: 'description is required',
    invalid_type_error: 'description should be type string',
  }),
  image: z.array(
    z.string({
      required_error: 'image is required',
      invalid_type_error: 'image array item should have type string',
    })
  ),
  details: z.string({
    required_error: 'details is required',
  }),
  price: z.string({
    required_error: 'price is required',
    invalid_type_error: 'price should be type string',
  }),
  discountedPrice: z.string({
    required_error: 'discountedPrice is required',
    invalid_type_error: 'discountedPrice should be type string',
  }),
  stockAmount: z.string({
    required_error: 'stockAmount is required',
    invalid_type_error: 'stockAmount should be type string',
  }),
});

const updateProductsZodSchema = z.object({
  title: z
    .string({ invalid_type_error: 'title should be type string' })
    .optional(),
  description: z
    .string({ invalid_type_error: 'description should be type string' })
    .optional(),
  image: z
    .string(
      z.string({
        invalid_type_error: 'image array item should have type string',
      })
    )
    .optional(),
  details: z.string({
    required_error: 'details is required',
  }),
  price: z
    .string({ invalid_type_error: 'price should be type string' })
    .optional(),
  discountedPrice: z
    .string({ invalid_type_error: 'discountedPrice should be type string' })
    .optional(),
  stockAmount: z
    .string({ invalid_type_error: 'stockAmount should be type string' })
    .optional(),
});

export const ProductsValidation = {
  createProductsZodSchema,
  updateProductsZodSchema,
};
