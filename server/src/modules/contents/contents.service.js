import { prisma } from '../../config/db.js';
import { slugify } from '../../utils/slugify.js';
import { getPaginationParams, formatPaginatedResponse } from '../../utils/pagination.js';
import { ApiError } from '../../utils/apiError.js';

export function formatContentOutput(item) {
  if (!item) return item;
  let parsedReferences = [];
  if (item.references) {
    if (Array.isArray(item.references)) {
      parsedReferences = item.references;
    } else if (typeof item.references === 'string') {
      try {
        const parsed = JSON.parse(item.references);
        parsedReferences = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        parsedReferences = [item.references];
      }
    }
  }

  let parsedImages = [];
  if (item.images) {
    if (Array.isArray(item.images)) {
      parsedImages = item.images;
    } else if (typeof item.images === 'string') {
      try {
        const parsed = JSON.parse(item.images);
        parsedImages = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        parsedImages = [item.images];
      }
    }
  }

  return {
    ...item,
    references: parsedReferences,
    images: parsedImages,
    isVerified: Boolean(item.verifiedBy),
  };
}

export async function findContents(query = {}) {
  const { page, limit, skip } = getPaginationParams(query);
  const { type, category, region, period, search, sort = 'newest' } = query;

  const where = {};
  if (query.status) {
    where.status = query.status;
  } else {
    where.status = 'PUBLISHED';
  }

  if (type) {
    where.type = type.toLowerCase();
  }

  if (category) {
    where.category = {
      OR: [
        { slug: category },
        { id: category },
        { name: { contains: category } },
      ],
    };
  }

  if (region) {
    where.OR = [
      { region: { contains: region } },
      { location: { contains: region } },
    ];
  }

  if (period) {
    where.period = { contains: period };
  }

  if (search && search.trim()) {
    const term = search.trim();
    where.OR = [
      { title: { contains: term } },
      { description: { contains: term } },
      { content: { contains: term } },
      { location: { contains: term } },
      { period: { contains: term } },
    ];
  }

  let orderBy = { createdAt: 'desc' };
  if (sort === 'oldest') orderBy = { createdAt: 'asc' };
  if (sort === 'title') orderBy = { title: 'asc' };

  const [data, total] = await Promise.all([
    prisma.content.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        category: true,
        author: {
          select: { id: true, name: true, picture: true },
        },
      },
    }),
    prisma.content.count({ where }),
  ]);

  return formatPaginatedResponse(data.map(formatContentOutput), total, page, limit);
}

export async function findContentBySlugOrId(slugOrId) {
  const content = await prisma.content.findFirst({
    where: {
      OR: [
        { id: slugOrId },
        { slug: slugOrId },
      ],
    },
    include: {
      category: true,
      author: {
        select: { id: true, name: true, picture: true },
      },
      timeline: true,
      contribution: true,
    },
  });

  if (!content) return null;

  // Fetch related contents (same category or same type, excluding current)
  const related = await prisma.content.findMany({
    where: {
      status: 'PUBLISHED',
      id: { not: content.id },
      OR: [
        { type: content.type },
        content.categoryId ? { categoryId: content.categoryId } : {},
      ],
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });

  return { 
    ...formatContentOutput(content), 
    related: related.map(formatContentOutput),
  };
}

export async function createContent(data, authorId = null) {
  let slug = slugify(data.title);
  
  // Ensure unique slug
  const count = await prisma.content.count({ where: { slug: { startsWith: slug } } });
  if (count > 0) {
    slug = `${slug}-${count + 1}`;
  }

  return prisma.content.create({
    data: {
      ...data,
      slug,
      authorId,
    },
    include: { category: true, author: true },
  });
}

export async function updateContent(id, data) {
  const existing = await prisma.content.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError(404, 'Konten tidak ditemukan');
  }

  return prisma.content.update({
    where: { id },
    data,
    include: { category: true },
  });
}

export async function deleteContent(id) {
  const existing = await prisma.content.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError(404, 'Konten tidak ditemukan');
  }

  return prisma.content.delete({ where: { id } });
}
