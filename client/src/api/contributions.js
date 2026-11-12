import api from './client.js';

export async function createContribution(data) {
  return api.post('/contributions', data);
}

export async function getMyContributions() {
  return api.get('/contributions/me');
}

export async function getContributionDetail(id) {
  return api.get(`/contributions/${id}`);
}

export async function updateContribution(id, data) {
  return api.put(`/contributions/${id}`, data);
}
