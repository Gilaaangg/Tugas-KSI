import { ApiError } from '../utils/apiError.js';

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Autentikasi diperlukan.'));
  }

  if (req.user.role !== 'ADMIN') {
    return next(new ApiError(403, 'Akses ditolak: Halaman/fungsi ini hanya untuk Kurator / Admin JEJAK.'));
  }

  next();
};
