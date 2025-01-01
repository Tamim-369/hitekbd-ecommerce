import { z } from 'zod';

const createReviewZodSchema = z.object({
  body: z.object({
    description: z
      .string({ invalid_type_error: 'description should be type string' })
      .optional(),
    star: z.number({
      required_error: 'star is required',
      invalid_type_error: 'star should be type number',
    }),
    product: z.string({
      required_error: 'product is required',
      invalid_type_error: 'product should be type objectID or string',
    }),
  }),
});

const updateReviewZodSchema = z.object({
  body: z.object({
    description: z
      .string({ invalid_type_error: 'description should be type string' })
      .optional(),
    star: z
      .number({ invalid_type_error: 'star should be type number' })
      .optional(),
    product: z
      .string({ invalid_type_error: 'product should be type string' })
      .optional(),
  }),
});

const create = z.object({
  body: z.object({
    description: z.string({
      required_error: 'Review description is required',
    }),
    star: z.number({
      required_error: 'Star rating is required',
    }).min(1).max(5),
    product: z.string({
      required_error: 'Product ID is required',
    }),
  }),
});

export const ReviewValidation = {
  createReviewZodSchema,
  updateReviewZodSchema,
  create,
};
