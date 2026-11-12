import api from './client.js';

export async function getTimelineEvents() {
  return api.get('/timeline');
}
