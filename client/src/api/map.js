import api from './client.js';

export async function getMapSites(params = {}) {
  return api.get('/map', { params });
}
