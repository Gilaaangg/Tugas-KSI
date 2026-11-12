import { prisma } from '../../config/db.js';
import { ApiError } from '../../utils/apiError.js';

export async function createContribution(userId, data) {
  const status = data.status === 'DRAFT' ? 'DRAFT' : 'SUBMITTED';

  return prisma.contribution.create({
    data: {
      ...data,
      status,
      userId,
      urgencyScore: 80,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, picture: true },
      },
    },
  });
}

export async function getUserContributions(userId) {
  return prisma.contribution.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: {
      publishedContent: {
        select: { id: true, slug: true, title: true, status: true },
      },
    },
  });
}

export async function getContributionById(id, userId, userRole) {
  const contribution = await prisma.contribution.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true, picture: true },
      },
      publishedContent: true,
    },
  });

  if (!contribution) {
    throw new ApiError(404, 'Kontribusi tidak ditemukan');
  }

  // Ownership / Admin Authorization check
  if (userRole !== 'ADMIN' && contribution.userId !== userId) {
    throw new ApiError(403, 'Akses ditolak: Anda tidak memiliki akses ke kontribusi ini.');
  }

  return contribution;
}

export async function updateContribution(id, userId, data) {
  const existing = await prisma.contribution.findUnique({ where: { id } });

  if (!existing) {
    throw new ApiError(404, 'Kontribusi tidak ditemukan');
  }

  if (existing.userId !== userId) {
    throw new ApiError(403, 'Akses ditolak: Anda hanya dapat mengedit kontribusi milik sendiri.');
  }

  // User can only edit if DRAFT or REVISION
  if (!['DRAFT', 'REVISION'].includes(existing.status)) {
    throw new ApiError(400, `Kontribusi dengan status ${existing.status} tidak dapat diubah.`);
  }

  let nextStatus = data.status || existing.status;

  // If status was REVISION and user updates/submits, automatically change status to SUBMITTED for re-review
  if (existing.status === 'REVISION' && (data.status === 'SUBMITTED' || !data.status)) {
    nextStatus = 'SUBMITTED';
  }

  return prisma.contribution.update({
    where: { id },
    data: {
      ...data,
      status: nextStatus,
    },
    include: {
      publishedContent: true,
    },
  });
}
