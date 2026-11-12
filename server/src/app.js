import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { env } from './config/env.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

// Module Routes
import contentsRouter from './modules/contents/contents.routes.js';
import categoriesRouter from './modules/categories/categories.routes.js';
import timelineRouter from './modules/timeline/timeline.routes.js';
import mapRouter from './modules/map/map.routes.js';
import searchRouter from './modules/search/search.routes.js';
import contributionsRouter from './modules/contributions/contributions.routes.js';
import authRouter from './modules/auth/auth.routes.js';
import adminRouter from './modules/admin/admin.routes.js';
import favoritesRouter from './modules/favorites/favorites.routes.js';
import uploadsRouter from './modules/uploads/uploads.routes.js';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
if (env.NODE_ENV !== 'test') app.use(morgan('dev'));

app.use('/uploads', express.static(path.resolve('uploads')));

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'JEJAK API', version: '1.0' }));

// Registered API endpoints
app.use('/api/contents', contentsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/timeline', timelineRouter);
app.use('/api/map', mapRouter);
app.use('/api/search', searchRouter);
app.use('/api/contributions', contributionsRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/uploads', uploadsRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
