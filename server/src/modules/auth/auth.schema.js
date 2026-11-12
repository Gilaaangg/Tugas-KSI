import { z } from 'zod';

export const googleAuthSchema = z.object({
  credential: z.string().min(1, 'Token Google credential wajib diisi'),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Username atau email wajib diisi'),
  password: z.string().min(4, 'Password wajib diisi'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  username: z.string().min(3, 'Username minimal 3 karakter').regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh huruf, angka, dan underscore'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const devLoginSchema = z.object({
  role: z.enum(['USER', 'ADMIN']).optional().default('USER'),
  email: z.string().email().optional(),
});
