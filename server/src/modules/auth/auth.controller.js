import { processGoogleAuth, processDevLogin, processPasswordLogin, processRegister } from './auth.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/apiError.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
};

const CLEAR_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
};

export const passwordLogin = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  const { user, token } = await processPasswordLogin(identifier, password);

  res.cookie('token', token, COOKIE_OPTIONS);
  res.json({
    message: 'Login berhasil',
    data: { user },
  });
});

export const registerUser = asyncHandler(async (req, res) => {
  const { user, token } = await processRegister(req.body);

  res.cookie('token', token, COOKIE_OPTIONS);
  res.status(201).json({
    message: 'Registrasi akun berhasil',
    data: { user },
  });
});

export const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  const { user, token } = await processGoogleAuth(credential);

  res.cookie('token', token, COOKIE_OPTIONS);
  res.json({
    message: 'Login Google berhasil',
    data: { user },
  });
});

export const devLogin = asyncHandler(async (req, res) => {
  if (env.NODE_ENV === 'production') {
    throw new ApiError(404, 'Endpoint dev-login tidak tersedia di production');
  }

  const { role, email } = req.body;
  const { user, token } = await processDevLogin(role, email);

  res.cookie('token', token, COOKIE_OPTIONS);
  res.json({
    message: `Dev login berhasil sebagai ${user.role}`,
    data: { user },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    data: { user: req.user },
  });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie('token', CLEAR_COOKIE_OPTIONS);
  res.json({
    message: 'Logout berhasil',
  });
});
