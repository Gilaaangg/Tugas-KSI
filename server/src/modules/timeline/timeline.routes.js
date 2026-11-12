import { Router } from 'express';
import { prisma } from '../../config/db.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';
import { ApiError } from '../../utils/apiError.js';

const router = Router();

router.get('/', asyncHandler(async (_req, res) => {
  const events = await prisma.timelineEvent.findMany({
    orderBy: { order: 'asc' },
    include: {
      content: {
        select: { id: true, slug: true, title: true, type: true, image: true },
      },
    },
  });
  res.json({ data: events });
}));

router.post('/', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const { year, epoch, title, subtitle, location, category, summary, details, keyFigure, image, order, contentId } = req.body;
  if (!year || !epoch || !title || !summary) {
    throw new ApiError(400, 'Tahun, era/epoch, judul, dan ringkasan wajib diisi');
  }

  const event = await prisma.timelineEvent.create({
    data: {
      year,
      epoch,
      title,
      subtitle,
      location,
      category,
      summary,
      details,
      keyFigure,
      image,
      order: order || 0,
      contentId: contentId || null,
    },
  });
  res.status(201).json({ message: 'Peristiwa sejarah berhasil ditambahkan', data: event });
}));

router.put('/:id', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await prisma.timelineEvent.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, 'Peristiwa sejarah tidak ditemukan');

  const { year, epoch, title, subtitle, location, category, summary, details, keyFigure, image, order, contentId } = req.body;
  const updated = await prisma.timelineEvent.update({
    where: { id },
    data: {
      year: year ?? existing.year,
      epoch: epoch ?? existing.epoch,
      title: title ?? existing.title,
      subtitle: subtitle ?? existing.subtitle,
      location: location ?? existing.location,
      category: category ?? existing.category,
      summary: summary ?? existing.summary,
      details: details ?? existing.details,
      keyFigure: keyFigure ?? existing.keyFigure,
      image: image ?? existing.image,
      order: order !== undefined ? Number(order) : existing.order,
      contentId: contentId !== undefined ? (contentId || null) : existing.contentId,
    },
  });
  res.json({ message: 'Peristiwa sejarah berhasil diperbarui', data: updated });
}));

router.delete('/:id', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await prisma.timelineEvent.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, 'Peristiwa sejarah tidak ditemukan');

  await prisma.timelineEvent.delete({ where: { id } });
  res.json({ message: 'Peristiwa sejarah berhasil dihapus' });
}));

export default router;
