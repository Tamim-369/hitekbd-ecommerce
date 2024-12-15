import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
    password: z.string(),
    role: z.enum(['USER', 'ADMIN']),
    status: z.enum(['active', 'blocked']),
  }),
});

const updateUserZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    role: z.enum(['USER', 'ADMIN']).optional(),
    status: z.enum(['active', 'blocked']).optional(),
  }),
});

const updateUserStatusZodSchema = z.object({
  body: z.object({
    status: z.enum(['active', 'blocked']),
  }),
});

export const AdminValidation = {
  createUserZodSchema,
  updateUserZodSchema,
  updateUserStatusZodSchema,
}; 