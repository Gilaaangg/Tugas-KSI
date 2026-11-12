import { z } from 'zod';

export const contentQuerySchema = z.object({
  type: z.string().optional(),
  category: z.string().optional(),
  region: z.string().optional(),
  period: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(12),
  sort: z.enum(['newest', 'oldest', 'title']).optional().default('newest'),
});

export const createContentSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  subtitle: z.string().optional(),
  type: z.enum(['sejarah', 'budaya', 'artefak', 'tokoh', 'tempat', 'artikel']),
  period: z.string().optional(),
  location: z.string().optional(),
  region: z.string().optional(),
  coordinates: z.string().optional(),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  content: z.string().min(20, 'Isi cerita minimal 20 karakter'),
  image: z.string().optional(),
  images: z.string().optional(),
  references: z.string().optional(),
  verifiedBy: z.string().optional().default('Dewan Kurator JEJAK'),
  categoryId: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional().default('PUBLISHED'),
});

export const updateContentSchema = createContentSchema.partial();
