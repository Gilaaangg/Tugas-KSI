import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 30, // max 30 per IP
  message: { message: 'Terlalu banyak percobaan login. Silakan coba lagi nanti.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 20, // max 20 kontribusi per jam
  message: { message: 'Batas pengiriman kontribusi tercapai. Silakan coba beberapa saat lagi.' },
  standardHeaders: true,
  legacyHeaders: false,
});
