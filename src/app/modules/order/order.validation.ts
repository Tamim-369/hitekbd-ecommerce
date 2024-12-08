import { z } from 'zod';

const createOrderZodSchema = z.object({
  body: z.object({
    user: z.string({
      required_error: 'user is required',
      invalid_type_error: 'user should be type objectID or string',
    }),
    product: z.array(
      z.string({
        required_error: 'product is required',
        invalid_type_error: 'product array item should have type string',
      })
    ),
    amountPaid: z.number({
      required_error: 'amountPaid is required',
      invalid_type_error: 'amountPaid should be type number',
    }),
    phoneNumber: z.string({
      required_error: 'phoneNumber is required',
      invalid_type_error: 'phoneNumber should be type string',
    }),
    address: z.string({
      required_error: 'address is required',
      invalid_type_error: 'address should be type string',
    }),
    transactionID: z.string({
      required_error: 'transactionID is required',
      invalid_type_error: 'transactionID should be type string',
    }),
  }),
});

const updateOrderZodSchema = z.object({
  body: z.object({
    user: z
      .string({ invalid_type_error: 'user should be type string' })
      .optional(),
    product: z
      .array(
        z.string({
          invalid_type_error: 'product array item should have type string',
        })
      )
      .optional(),
    amountPaid: z
      .number({ invalid_type_error: 'amountPaid should be type number' })
      .optional(),
    phoneNumber: z
      .string({ invalid_type_error: 'phoneNumber should be type string' })
      .optional(),
    address: z
      .string({ invalid_type_error: 'address should be type string' })
      .optional(),
    transactionID: z
      .string({ invalid_type_error: 'transactionID should be type string' })
      .optional(),
    status: z
      .string({ invalid_type_error: 'status should be type string' })
      .optional(),
  }),
});

export const OrderValidation = {
  createOrderZodSchema,
  updateOrderZodSchema,
};
