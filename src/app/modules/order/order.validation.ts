import { z } from 'zod';
      
const createOrderZodSchema = z.object({
  body: z.object({
    customer: z.string({ required_error:"customer is required", invalid_type_error:"customer should be type objectID or string" }),
      product: z.string({ required_error:"product is required", invalid_type_error:"product should be type objectID or string" }),
      amountPaid: z.number({ required_error:"amountPaid is required", invalid_type_error:"amountPaid should be type number" })
  }),
});

const updateOrderZodSchema = z.object({
  body: z.object({
    customer: z.string({ invalid_type_error:"customer should be type string" }).optional(),
      product: z.string({ invalid_type_error:"product should be type string" }).optional(),
      amountPaid: z.number({ invalid_type_error:"amountPaid should be type number" }).optional()
  }),
});

export const OrderValidation = {
  createOrderZodSchema,
  updateOrderZodSchema
};
