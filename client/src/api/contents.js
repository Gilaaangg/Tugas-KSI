import api from './client.js';

export async function getContents(params = {}) {
  return api.get('/contents', { params });
}

export async function getContentBySlug(slugOrId) {
  return api.get(`/contents/${slugOrId}`);
}
