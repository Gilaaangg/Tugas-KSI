import { ZodError } from 'zod';
import { env } from '../config/env.js';

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: 'Data tidak valid', errors: err.flatten().fieldErrors });
  }
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    message: status >= 500 && env.NODE_ENV === 'production' ? 'Terjadi kesalahan server' : err.message,
    ...(err.details && { errors: err.details }),
  });
};
