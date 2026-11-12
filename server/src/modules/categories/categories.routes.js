import { Router } from 'express';
import { prisma } from '../../config/db.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { slugify } from '../../utils/slugify.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';
import { ApiError } from '../../utils/apiError.js';

const router = Router();

router.get('/', asyncHandler(async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { contents: true } },
    },
  });
  res.json({ data: categories });
}));

router.post('/', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name) throw new ApiError(400, 'Nama kategori wajib diisi');

  const slug = slugify(name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) throw new ApiError(400, 'Kategori sudah ada');

  const category = await prisma.category.create({
    data: { name, slug, description },
  });
  res.status(201).json({ message: 'Kategori berhasil dibuat', data: category });
}));

router.put('/:id', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (!name) throw new ApiError(400, 'Nama kategori wajib diisi');

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, 'Kategori tidak ditemukan');

  const slug = slugify(name);
  const updated = await prisma.category.update({
    where: { id },
    data: { name, slug, description },
  });
  res.json({ message: 'Kategori berhasil diperbarui', data: updated });
}));

router.delete('/:id', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, 'Kategori tidak ditemukan');

  await prisma.category.delete({ where: { id } });
  res.json({ message: 'Kategori berhasil dihapus' });
}));

export default router;
