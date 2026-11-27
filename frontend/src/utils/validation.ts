import { z } from 'zod';

export const NAME_MIN = 20;
export const NAME_MAX = 60;
export const ADDRESS_MAX = 400;
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

export const EMAIL_ERROR = 'Invalid email address';
export const NAME_ERROR = `Name must be between ${NAME_MIN} and ${NAME_MAX} characters`;
export const ADDRESS_ERROR = `Address must not exceed ${ADDRESS_MAX} characters`;
export const PASSWORD_ERROR =
  'Password must be 8-16 characters with at least one uppercase letter and one special character';
export const RATING_ERROR = 'Rating must be an integer between 1 and 5';

export const loginSchema = z.object({
  email: z.string().email(EMAIL_ERROR),
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z.object({
  name: z
    .string()
    .min(NAME_MIN, NAME_ERROR)
    .max(NAME_MAX, NAME_ERROR),
  email: z.string().email(EMAIL_ERROR),
  address: z.string().max(ADDRESS_MAX, ADDRESS_ERROR).optional(),
  password: z
    .string()
    .min(8, PASSWORD_ERROR)
    .max(16, PASSWORD_ERROR)
    .regex(PASSWORD_REGEX, PASSWORD_ERROR),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z
    .string()
    .min(8, PASSWORD_ERROR)
    .max(16, PASSWORD_ERROR)
    .regex(PASSWORD_REGEX, PASSWORD_ERROR),
});

export const addUserSchema = z.object({
  name: z.string().min(NAME_MIN, NAME_ERROR).max(NAME_MAX, NAME_ERROR),
  email: z.string().email(EMAIL_ERROR),
  address: z.string().max(ADDRESS_MAX, ADDRESS_ERROR),
  password: z
    .string()
    .min(8, PASSWORD_ERROR)
    .max(16, PASSWORD_ERROR)
    .regex(PASSWORD_REGEX, PASSWORD_ERROR),
  role: z.enum(['SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER']),
});

export const addStoreSchema = z.object({
  name: z.string().min(NAME_MIN, NAME_ERROR).max(NAME_MAX, NAME_ERROR),
  email: z.string().email(EMAIL_ERROR),
  address: z.string().max(ADDRESS_MAX, ADDRESS_ERROR),
  owner_id: z.string().min(1, 'Owner is required'),
});

export const ratingSchema = z.object({
  rating: z.number().int().min(1, RATING_ERROR).max(5, RATING_ERROR),
});