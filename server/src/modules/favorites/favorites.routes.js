import { Router } from 'express';
import { prisma } from '../../config/db.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { ApiError } from '../../utils/apiError.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(async (req, res) => {
  const favorites = await prisma.favorite.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      content: {
        include: { category: true },
      },
    },
  });
  res.json({ data: favorites.map((f) => f.content) });
}));

router.post('/', asyncHandler(async (req, res) => {
  const { contentId } = req.body;
  if (!contentId) throw new ApiError(400, 'contentId wajib diisi');

  const content = await prisma.content.findFirst({
    where: { id: contentId, status: 'PUBLISHED' },
  });
  if (!content) throw new ApiError(404, 'Konten publik tidak ditemukan');

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_contentId: { userId: req.user.id, contentId },
    },
  });

  if (existing) {
    return res.json({ message: 'Konten sudah di dalam favorit', isFavorite: true });
  }

  await prisma.favorite.create({
    data: {
      userId: req.user.id,
      contentId,
    },
  });

  res.status(201).json({ message: 'Berhasil ditambahkan ke favorit', isFavorite: true });
}));

router.delete('/:contentId', asyncHandler(async (req, res) => {
  const { contentId } = req.params;

  try {
    await prisma.favorite.delete({
      where: {
        userId_contentId: { userId: req.user.id, contentId },
      },
    });
  } catch (e) {
    // Ignore if not found
  }

  res.json({ message: 'Berhasil dihapus dari favorit', isFavorite: false });
}));

router.get('/check/:contentId', asyncHandler(async (req, res) => {
  const { contentId } = req.params;
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_contentId: { userId: req.user.id, contentId },
    },
  });
  res.json({ isFavorite: Boolean(existing) });
}));

export default router;
