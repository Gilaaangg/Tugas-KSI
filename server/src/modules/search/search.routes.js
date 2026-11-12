import { Router } from 'express';
import { prisma } from '../../config/db.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const { q, type } = req.query;

  if (!q || !q.trim()) {
    return res.json({ data: [], total: 0 });
  }

  const term = q.trim();

  const where = {
    status: 'PUBLISHED',
    OR: [
      { title: { contains: term } },
      { description: { contains: term } },
      { content: { contains: term } },
      { location: { contains: term } },
      { period: { contains: term } },
      { region: { contains: term } },
    ],
  };

  if (type) {
    where.type = type;
  }

  const results = await prisma.content.findMany({
    where,
    take: 30,
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });

  res.json({ data: results, total: results.length });
}));

export default router;
