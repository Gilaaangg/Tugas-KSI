import { Router } from 'express';
import { prisma } from '../../config/db.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';
import { validate } from '../../middleware/validate.js';
import { reviewContributionSchema, updateUserRoleSchema } from './admin.schema.js';
import { slugify } from '../../utils/slugify.js';
import { ApiError } from '../../utils/apiError.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

// Protect ALL admin routes
router.use(requireAuth, requireAdmin);

// 1. Dashboard Stats
router.get('/stats', asyncHandler(async (_req, res) => {
  const [
    totalContents,
    totalSejarah,
    totalBudaya,
    totalArtefak,
    totalTokoh,
    totalTempat,
    totalArtikel,
    totalUsers,
    totalContributions,
    pendingReview,
    revisionCount,
    approvedCount,
    rejectedCount,
  ] = await Promise.all([
    prisma.content.count(),
    prisma.content.count({ where: { type: 'sejarah' } }),
    prisma.content.count({ where: { type: 'budaya' } }),
    prisma.content.count({ where: { type: 'artefak' } }),
    prisma.content.count({ where: { type: 'tokoh' } }),
    prisma.content.count({ where: { type: 'tempat' } }),
    prisma.content.count({ where: { type: 'artikel' } }),
    prisma.user.count(),
    prisma.contribution.count(),
    prisma.contribution.count({ where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } } }),
    prisma.contribution.count({ where: { status: 'REVISION' } }),
    prisma.contribution.count({ where: { status: 'APPROVED' } }),
    prisma.contribution.count({ where: { status: 'REJECTED' } }),
  ]);

  res.json({
    data: {
      totalContents,
      totalSejarah,
      totalBudaya,
      totalArtefak,
      totalTokoh,
      totalTempat,
      totalArtikel,
      totalUsers,
      totalContributions,
      pendingReview,
      revisionCount,
      approvedCount,
      rejectedCount,
    },
  });
}));

// 2. Curation Queue
router.get('/contributions', asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const where = {};
  if (status && status !== 'ALL') {
    where.status = status;
  }

  const p = Math.max(1, Number.parseInt(page, 10) || 1);
  const l = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 20));

  const [queue, total] = await Promise.all([
    prisma.contribution.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (p - 1) * l,
      take: l,
      include: {
        user: { select: { id: true, name: true, email: true, picture: true } },
        publishedContent: { select: { id: true, slug: true, title: true } },
      },
    }),
    prisma.contribution.count({ where }),
  ]);

  res.json({
    data: queue,
    meta: {
      total,
      page: p,
      limit: l,
      totalPages: Math.ceil(total / l) || 1,
    },
  });
}));

// Single Contribution for Admin
router.get('/contributions/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await prisma.contribution.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, picture: true } },
      publishedContent: true,
    },
  });
  if (!item) throw new ApiError(404, 'Kontribusi tidak ditemukan');
  res.json({ data: item });
}));

// 3. Review Contribution (Approve / Revision / Reject)
router.patch('/contributions/:id/review', validate(reviewContributionSchema), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes, rejectionReason } = req.body;

  const contribution = await prisma.contribution.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!contribution) {
    throw new ApiError(404, 'Kontribusi tidak ditemukan');
  }

  let publishedContentId = contribution.publishedContentId;

  // IF APPROVED: auto-create or update Content
  if (status === 'APPROVED') {
    let categoryObj = null;
    if (contribution.category) {
      categoryObj = await prisma.category.findFirst({
        where: {
          OR: [
            { name: { contains: contribution.category } },
            { slug: slugify(contribution.category) },
          ],
        },
      });
    }

    let slugBase = slugify(contribution.title);
    const existingCount = await prisma.content.count({ where: { slug: { startsWith: slugBase } } });
    const uniqueSlug = existingCount > 0 ? `${slugBase}-${Date.now()}` : slugBase;

    let contentRecord;
    if (publishedContentId) {
      contentRecord = await prisma.content.update({
        where: { id: publishedContentId },
        data: {
          title: contribution.title,
          description: contribution.content.slice(0, 200),
          content: contribution.content,
          period: contribution.period,
          location: contribution.location,
          region: contribution.region,
          verifiedBy: 'Dewan Kurator JEJAK',
          status: 'PUBLISHED',
        },
      });
    } else {
      contentRecord = await prisma.content.create({
        data: {
          slug: uniqueSlug,
          type: 'budaya', // default type
          title: contribution.title,
          description: contribution.content.slice(0, 200),
          content: contribution.content,
          period: contribution.period,
          location: contribution.location,
          region: contribution.region,
          image: contribution.attachment || null,
          references: contribution.sourceRef ? JSON.stringify([{ title: contribution.sourceRef, narasumber: contribution.interviewee }]) : null,
          verifiedBy: 'Dewan Kurator JEJAK',
          status: 'PUBLISHED',
          categoryId: categoryObj?.id || null,
          authorId: contribution.userId,
        },
      });
    }
    publishedContentId = contentRecord.id;
  }

  const updatedContribution = await prisma.contribution.update({
    where: { id },
    data: {
      status,
      adminNotes: status === 'REVISION' ? adminNotes : contribution.adminNotes,
      rejectionReason: status === 'REJECTED' ? rejectionReason : contribution.rejectionReason,
      publishedContentId,
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      publishedContent: true,
    },
  });

  res.json({
    message: `Kontribusi berhasil diubah status menjadi ${status}`,
    data: updatedContribution,
  });
}));

// 4. User Management
router.get('/users', asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      picture: true,
      createdAt: true,
      _count: { select: { contributions: true, contents: true } },
    },
  });
  res.json({ data: users });
}));

router.patch('/users/:id/role', validate(updateUserRoleSchema), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const targetUser = await prisma.user.findUnique({ where: { id } });
  if (!targetUser) throw new ApiError(404, 'User tidak ditemukan');

  const updated = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, email: true, name: true, role: true },
  });

  res.json({ message: `Role user ${updated.name} berhasil diubah menjadi ${role}`, data: updated });
}));

export default router;
