import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // Crucial for HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Terjadi kesalahan pada jaringan';
    const err = new Error(message);
    err.status = error.response?.status;
    err.details = error.response?.data?.errors;
    return Promise.reject(err);
  }
);

export default api;
