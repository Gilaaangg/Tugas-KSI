import { verifyToken } from '../utils/jwt.js';
import { prisma } from '../config/db.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const requireAuth = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Autentikasi diperlukan. Silakan login terlebih dahulu.');
  }

  const decoded = verifyToken(token);
  if (!decoded || !decoded.id) {
    throw new ApiError(401, 'Sesi tidak valid atau telah kadaluarsa. Silakan login kembali.');
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, email: true, name: true, role: true, picture: true },
  });

  if (!user) {
    throw new ApiError(401, 'Pengguna tidak ditemukan dalam sistem.');
  }

  req.user = user;
  next();
});

export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    const decoded = verifyToken(token);
    if (decoded && decoded.id) {
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, role: true, picture: true },
      });
      if (user) req.user = user;
    }
  }

  next();
});
