import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    phone: z.string({ required_error: 'Phone is required' }),
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }),

    address: z.string({ required_error: 'Address is required' }),
    profile: z.string().optional(),
  }),
});

export const UserValidation = {
  createUserZodSchema,
};
