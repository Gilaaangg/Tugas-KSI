import { ApiError } from '../utils/apiError.js';

export const notFound = (req, _res, next) =>
  next(new ApiError(404, `Rute ${req.method} ${req.originalUrl} tidak ditemukan`));
