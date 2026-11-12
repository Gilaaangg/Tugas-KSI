import api from './client.js';

export async function getFavorites() {
  return api.get('/favorites');
}

export async function addFavorite(contentId) {
  return api.post('/favorites', { contentId });
}

export async function removeFavorite(contentId) {
  return api.delete(`/favorites/${contentId}`);
}

export async function checkFavorite(contentId) {
  return api.get(`/favorites/check/${contentId}`);
}
