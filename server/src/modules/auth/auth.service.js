import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcryptjs';
import { prisma } from '../../config/db.js';
import { env } from '../../config/env.js';
import { generateToken } from '../../utils/jwt.js';
import { ApiError } from '../../utils/apiError.js';

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export async function processPasswordLogin(identifier, password) {
  const cleanId = identifier.trim().toLowerCase();
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: cleanId },
        { username: cleanId },
      ],
    },
  });

  if (!user || !user.password) {
    throw new ApiError(401, 'Username/email atau password tidak sesuai');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Username/email atau password tidak sesuai');
  }

  const { password: _, ...safeUser } = user;
  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return { user: safeUser, token };
}

export async function processRegister(data) {
  const email = data.email.trim().toLowerCase();
  const username = data.username.trim().toLowerCase();

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    throw new ApiError(400, 'Email sudah terdaftar. Silakan gunakan email lain atau masuk.');
  }

  const existingUsername = await prisma.user.findUnique({ where: { username } });
  if (existingUsername) {
    throw new ApiError(400, 'Username sudah digunakan. Silakan pilih username lain.');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const isAdminByEnv = env.ADMIN_EMAILS.includes(email);

  const newUser = await prisma.user.create({
    data: {
      name: data.name.trim(),
      username,
      email,
      password: hashedPassword,
      role: isAdminByEnv ? 'ADMIN' : 'USER',
    },
  });

  const { password: _, ...safeUser } = newUser;
  const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });
  return { user: safeUser, token };
}

export async function processGoogleAuth(credential) {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new ApiError(503, 'Login Google belum dikonfigurasi di server');
  }

  let email, name, picture;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    email = payload.email?.toLowerCase();
    name = payload.name || email.split('@')[0];
    picture = payload.picture;
  } catch (_err) {
    // Never decode an unverified JWT as an authenticated Google identity.
    throw new ApiError(401, 'Kredensial Google tidak valid atau telah kedaluwarsa');
  }

  if (!email) {
    throw new ApiError(400, 'Kredensial Google tidak valid atau email tidak ditemukan');
  }

  // Determine role: ADMIN ONLY if email in env.ADMIN_EMAILS or already registered as ADMIN in DB
  let existingUser = await prisma.user.findUnique({ where: { email } });

  const isAdminByEnv = env.ADMIN_EMAILS.includes(email);
  const userRole = existingUser ? existingUser.role : (isAdminByEnv ? 'ADMIN' : 'USER');

  let user;
  if (existingUser) {
    user = await prisma.user.update({
      where: { email },
      data: {
        name: name || existingUser.name,
        picture: picture || existingUser.picture,
        ...(isAdminByEnv ? { role: 'ADMIN' } : {}),
      },
    });
  } else {
    user = await prisma.user.create({
      data: {
        email,
        name: name || 'Pengguna JEJAK',
        picture,
        role: userRole,
      },
    });
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return { user, token };
}

export async function processDevLogin(requestedRole = 'USER', customEmail = null) {
  const email = customEmail ? customEmail.toLowerCase() : (requestedRole === 'ADMIN' ? 'kurator@museum-lampung.id' : 'warga@lampung.id');
  const name = requestedRole === 'ADMIN' ? 'Dewan Kurator JEJAK' : 'Warga Contributor';

  const isAdminByEnv = env.ADMIN_EMAILS.includes(email) || requestedRole === 'ADMIN';

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name,
        role: isAdminByEnv ? 'ADMIN' : 'USER',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      },
    });
  } else if (isAdminByEnv && user.role !== 'ADMIN') {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' },
    });
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return { user, token };
}
