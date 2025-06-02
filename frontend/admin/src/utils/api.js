import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8090/api/v1',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
};

export const appointments = {
  list: (params) => api.get('/appointments', { params }),
  get: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  cancel: (id) => api.delete(`/appointments/${id}`),
};

export const tokens = {
  list: (params) => api.get('/tokens', { params }),
  get: (id) => api.get(`/tokens/${id}`),
  issue: (data) => api.post('/tokens', data),
  callNext: (branchId) => api.put(`/tokens/${branchId}/next`),
  complete: (id) => api.put(`/tokens/${id}/complete`),
  getQueueStatus: (branchId) => api.get('/tokens/queue', { params: { branch_id: branchId } }),
};

export const timeSlots = {
  list: (params) => api.get('/slots', { params }),
  get: (id) => api.get(`/slots/${id}`),
  create: (data) => api.post('/slots', data),
  update: (id, data) => api.put(`/slots/${id}`, data),
  delete: (id) => api.delete(`/slots/${id}`),
}; 