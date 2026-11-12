export function getPaginationParams(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || 12));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function formatPaginatedResponse(data, total, page, limit) {
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}
