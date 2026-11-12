import api from './client.js';

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
