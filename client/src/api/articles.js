import api from './client.js';

export const getArticles = (params) => api.get('/articles', { params });
export const getArticle = (id) => api.get(`/articles/${id}`);
