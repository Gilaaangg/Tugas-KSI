import api from './client.js';

export async function getCategories() {
  return api.get('/categories');
}
