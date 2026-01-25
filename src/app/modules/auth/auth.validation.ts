import { z } from 'zod';

const createVerifyEmailZodSchema = z.object({
    email: z.string({ message: 'Email is required' }),
    oneTimeCode: z.number({ message: 'One time code is required' }),
});

const createLoginZodSchema = z.object({
    email: z.string({ message: 'Email is required' }),
    password: z.string({ message: 'Password is required' }),
});

const createForgetPasswordZodSchema = z.object({
    email: z.string({ message: 'Email is required' }),
});

const createResetPasswordZodSchema = z.object({
    newPassword: z.string({ message: 'Password is required' }),
    confirmPassword: z.string({
      message: 'Confirm Password is required',
    }),
});

const createChangePasswordZodSchema = z.object({
    currentPassword: z.string({
      message: 'Current Password is required',
    }),
    newPassword: z.string({ message: 'New Password is required' }),
    confirmPassword: z.string({
      message: 'Confirm Password is required',
    }),
});

export const AuthValidation = {
  createVerifyEmailZodSchema,
  createForgetPasswordZodSchema,
  createLoginZodSchema,
  createResetPasswordZodSchema,
  createChangePasswordZodSchema,
};
