import { z } from 'zod';

export const createContributionSchema = z.object({
  title: z.string().min(5, 'Judul kontribusi minimal 5 karakter'),
  category: z.string().min(2, 'Kategori wajib dipilih/diisi'),
  region: z.string().min(2, 'Wilayah kabupaten/kota wajib diisi'),
  period: z.string().optional(),
  location: z.string().optional(),
  content: z.string().min(20, 'Isi cerita/kontribusi minimal 20 karakter'),
  interviewee: z.string().optional(),
  sourceRef: z.string().optional(),
  attachment: z.string().optional(),
  status: z.enum(['DRAFT', 'SUBMITTED']).optional().default('SUBMITTED'),
});

export const updateContributionSchema = z.object({
  title: z.string().min(5, 'Judul kontribusi minimal 5 karakter').optional(),
  category: z.string().optional(),
  region: z.string().optional(),
  period: z.string().optional(),
  location: z.string().optional(),
  content: z.string().min(20, 'Isi cerita/kontribusi minimal 20 karakter').optional(),
  interviewee: z.string().optional(),
  sourceRef: z.string().optional(),
  attachment: z.string().optional(),
  status: z.enum(['DRAFT', 'SUBMITTED']).optional(),
});
