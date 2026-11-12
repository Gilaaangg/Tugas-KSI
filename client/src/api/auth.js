import api from './client.js';

export async function loginWithPassword(identifier, password) {
  return api.post('/auth/login', { identifier, password });
}

export async function registerUser(userData) {
  return api.post('/auth/register', userData);
}

export async function loginWithGoogle(credential) {
  return api.post('/auth/google', { credential });
}

export async function devLogin(role = 'USER', email = null) {
  const payload = email ? { role, email } : { role };
  return api.post('/auth/dev-login', payload);
}

export async function getMe() {
  return api.get('/auth/me');
}

export async function logout() {
  return api.post('/auth/logout');
}