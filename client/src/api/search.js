import api from './client.js';

export async function searchContents(query, type = null) {
  return api.get('/search', {
    params: { q: query, type },
  });
}
