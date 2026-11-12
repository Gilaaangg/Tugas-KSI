import { Router } from 'express';
import { prisma } from '../../config/db.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const { type, category, region } = req.query;

  const where = {
    status: 'PUBLISHED',
    coordinates: { not: null },
  };

  if (type) where.type = type;
  if (region) {
    where.OR = [
      { region: { contains: region } },
      { location: { contains: region } },
    ];
  }

  const sites = await prisma.content.findMany({
    where,
    select: {
      id: true,
      slug: true,
      type: true,
      title: true,
      subtitle: true,
      period: true,
      location: true,
      region: true,
      coordinates: true,
      description: true,
      image: true,
      verifiedBy: true,
    },
  });

  res.json({ data: sites });
}));

export default router;
