import { z } from 'zod';

const otpSchema = z.union([
  z.number({ message: 'OTP is required' }),
  z
    .string({ message: 'OTP is required' })
    .regex(/^\d+$/, 'OTP must be a numeric code')
    .transform(val => Number(val)),
]);

const createVerifyEmailZodSchema = z.object({
  body: z.object({
    email: z
      .string({ message: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    otp: otpSchema,
  }),
});

const resendVerifyEmailZodSchema = z.object({
  body: z.object({
    email: z
      .string({ message: 'Email is required' })
      .email({ message: 'Invalid email address' }),
  }),
});

const sendVerificationOtpZodSchema = z.object({
  body: z.object({
    email: z
      .string({ message: 'Email is required' })
      .email({ message: 'Invalid email address' }),
  }),
});

const verifyAccountZodSchema = z.object({
  body: z.object({
    email: z
      .string({ message: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    otp: otpSchema,
  }),
});

const createLoginZodSchema = z.object({
  body: z.object({
    email: z
      .string({ message: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    password: z.string({ message: 'Password is required' }),
  }),
});

const createForgetPasswordZodSchema = z.object({
  body: z.object({
    email: z
      .string({ message: 'Email is required' })
      .email({ message: 'Invalid email address' }),
  }),
});

const createResetPasswordZodSchema = z.object({
  body: z.object({
    newPassword: z.string({ message: 'Password is required' }),
    confirmPassword: z.string({
      message: 'Confirm Password is required',
    }),
  }),
});

const createChangePasswordZodSchema = z.object({
  body: z.object({
    currentPassword: z.string({
      message: 'Current Password is required',
    }),
    newPassword: z.string({ message: 'New Password is required' }),
    confirmPassword: z.string({
      message: 'Confirm Password is required',
    }),
  }),
});

export const AuthValidation = {
  createVerifyEmailZodSchema,
  resendVerifyEmailZodSchema,
  sendVerificationOtpZodSchema,
  verifyAccountZodSchema,
  createForgetPasswordZodSchema,
  createLoginZodSchema,
  createResetPasswordZodSchema,
  createChangePasswordZodSchema,
};

