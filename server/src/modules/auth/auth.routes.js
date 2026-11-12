import { Router } from 'express';
import { googleLogin, devLogin, passwordLogin, registerUser, getMe, logout } from './auth.controller.js';
import { googleAuthSchema, devLoginSchema, loginSchema, registerSchema } from './auth.schema.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { authLimiter } from '../../middleware/rateLimit.js';

const router = Router();

router.post('/login', authLimiter, validate(loginSchema), passwordLogin);
router.post('/register', authLimiter, validate(registerSchema), registerUser);
router.post('/google', authLimiter, validate(googleAuthSchema), googleLogin);
router.post('/dev-login', authLimiter, validate(devLoginSchema), devLogin);
router.get('/me', requireAuth, getMe);
router.post('/logout', logout);

export default router;
