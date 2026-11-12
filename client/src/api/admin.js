import api from './client.js';

export async function getAdminStats() {
  return api.get('/admin/stats');
}

export async function getAdminQueue(params = {}) {
  return api.get('/admin/contributions', { params });
}

export async function getAdminContributionDetail(id) {
  return api.get(`/admin/contributions/${id}`);
}

export async function reviewContribution(id, { status, adminNotes, rejectionReason }) {
  return api.patch(`/admin/contributions/${id}/review`, {
    status,
    adminNotes,
    rejectionReason,
  });
}

export async function getAdminUsers() {
  return api.get('/admin/users');
}

export async function updateUserRole(id, role) {
  return api.patch(`/admin/users/${id}/role`, { role });
}

// Content CRUD for Admin
export async function getAdminContents(params = {}) {
  return api.get('/contents', { params });
}

export async function createAdminContent(data) {
  return api.post('/contents', data);
}

export async function updateAdminContent(id, data) {
  return api.put(`/contents/${id}`, data);
}

export async function deleteAdminContent(id) {
  return api.delete(`/contents/${id}`);
}

// Category CRUD
export async function getAdminCategories() {
  return api.get('/categories');
}

export async function createAdminCategory(data) {
  return api.post('/categories', data);
}

export async function updateAdminCategory(id, data) {
  return api.put(`/categories/${id}`, data);
}

export async function deleteAdminCategory(id) {
  return api.delete(`/categories/${id}`);
}

// Timeline CRUD
export async function getAdminTimelines() {
  return api.get('/timeline');
}

export async function createAdminTimeline(data) {
  return api.post('/timeline', data);
}

export async function updateAdminTimeline(id, data) {
  return api.put(`/timeline/${id}`, data);
}

export async function deleteAdminTimeline(id) {
  return api.delete(`/timeline/${id}`);
}
