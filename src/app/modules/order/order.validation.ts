import { z } from 'zod';

const createOrderZodSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        productId: z.string({
          required_error: 'productId is required',
          invalid_type_error: 'productId should be type string',
        }),
        title: z.string({
          required_error: 'title is required',
          invalid_type_error: 'title should be type string',
        }),
        price: z.number({
          required_error: 'price is required',
          invalid_type_error: 'price should be type number',
        }),
        quantity: z.number({
          required_error: 'quantity is required',
          invalid_type_error: 'quantity should be type number',
        }),
        image: z.string({
          required_error: 'image is required',
          invalid_type_error: 'image should be type string',
        }),
        color: z
          .string({
            required_error: 'color is required',
            invalid_type_error: 'color should be type string',
          })
          .optional(),
      })
    ),
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
    color: z
      .string({
        invalid_type_error: 'color should be type string',
      })
      .optional(),
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
    items: z
      .array(
        z.object({
          productId: z
            .string({
              invalid_type_error: 'productId should be type string',
            })
            .optional(),
          title: z
            .string({ invalid_type_error: 'title should be type string' })
            .optional(),
          price: z
            .number({ invalid_type_error: 'price should be type number' })
            .optional(),
          quantity: z
            .number({ invalid_type_error: 'quantity should be type number' })
            .optional(),
          image: z
            .string({ invalid_type_error: 'image should be type string' })
            .optional(),
          color: z
            .string({ invalid_type_error: 'color should be type string' })
            .optional(),
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
    color: z
      .string({ invalid_type_error: 'color should be type string' })
      .optional(),
  }),
});

export const OrderValidation = {
  createOrderZodSchema,
  updateOrderZodSchema,
};
