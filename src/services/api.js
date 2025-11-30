import axios from 'axios';

const API_BASE_URL = 'https://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (category) => api.post('/categories', category),
  update: (id, category) => api.put(`/categories/${id}`, category),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const cakesAPI = {
  getAll: () => api.get('/cakes'),
  getById: (id) => api.get(`/cakes/${id}`),
  create: (cake) => api.post('/cakes', cake),
  update: (id, cake) => api.put(`/cakes/${id}`, cake),
  delete: (id) => api.delete(`/cakes/${id}`),
};

export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (user) => api.post('/users', user),
  update: (id, user) => api.put(`/users/${id}`, user),
  delete: (id) => api.delete(`/users/${id}`),
};

export const cartsAPI = {
  getAll: () => api.get('/carts'),
  getById: (id) => api.get(`/carts/${id}`),
  create: (cart) => api.post('/carts', cart),
  update: (id, cart) => api.put(`/carts/${id}`, cart),
  delete: (id) => api.delete(`/carts/${id}`),
};

export const cartItemsAPI = {
  getAll: () => api.get('/cartitems'),
  getById: (id) => api.get(`/cartitems/${id}`),
  create: (cartItem) => api.post('/cartitems', cartItem),
  update: (id, cartItem) => api.put(`/cartitems/${id}`, cartItem),
  delete: (id) => api.delete(`/cartitems/${id}`),
};

export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (order) => api.post('/orders', order),
  update: (id, order) => api.put(`/orders/${id}`, order),
  delete: (id) => api.delete(`/orders/${id}`),
};

export default api;